import { Router, Request, Response } from "express";
import express from "express";
import crypto from "crypto";
import { prisma } from "../../../lib/prisma.js";
import { renewMembershipServiceService, upgradeMembershipPlanService } from "../../admin/members/members.service.js";
import dotenv from "dotenv";
dotenv.config();


const router = Router();

router.post(
  "/webhooks/paymongo",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response): Promise<void> => {

    console.log("[PAYMONGO WEBHOOK] Request received", {
      method: req.method,
      path: req.originalUrl,
      contentType: req.headers["content-type"],
    });

    const webhookSecret = process.env.PAYMONGO_WEHBOOK_SECRET;

    if (!webhookSecret) {
      console.error("PAYMONGO_WEBHOOK_SECRET is missing");
      res.sendStatus(500);
      return;
    }

    if (!Buffer.isBuffer(req.body)) {
      res.status(400).json({ message: "Expected raw request body." });
      return;
    }

    const signatureHeader = req.headers["paymongo-signature"];

    if (typeof signatureHeader !== "string") {
      res.sendStatus(400);
      return;
    }

    const signatureParts = Object.fromEntries(
      signatureHeader.split(",").map((part) => {
        const separator = part.indexOf("=");
        if (separator === -1) return ["", ""];
        return [
          part.slice(0, separator).trim(),
          part.slice(separator + 1).trim(),
        ];
      }),
    );

    const timestamp = signatureParts.t;
    const testSignature = signatureParts.te;

    if (!timestamp || !testSignature) {
      res.status(400).json({
        message: "Missing test webhook signature.",
      });
      return;
    }

    const signedPayload = `${timestamp}.${req.body.toString("utf8")}`;

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(signedPayload)
      .digest("hex");

    if (!/^[a-f0-9]+$/i.test(testSignature)) {
      res.sendStatus(401);
      return;
    }

    const received = Buffer.from(testSignature, "hex");
    const expected = Buffer.from(expectedSignature, "hex");

    if (
      received.length !== expected.length ||
      !crypto.timingSafeEqual(received, expected)
    ) {
      console.error("PayMongo webhook signature verification failed");
      res.sendStatus(401);
      return;
    }

    let event: any;

    try {
      event = JSON.parse(req.body.toString("utf8"));
    } catch {
      res.status(400).json({ message: "Invalid JSON payload." });
      return;
    }

    const attributes = event?.data?.attributes;

    // This handler is intentionally restricted to PayMongo test mode.
    if (attributes?.livemode !== false) {
      res.status(400).json({
        message: "Unexpected PayMongo live-mode event.",
      });
      return;
    }

    if (attributes?.type !== "checkout_session.payment.paid") {
      res.status(200).json({ received: true });
      return;
    }

    const session = attributes.data;
    const checkoutSessionId = session?.id;
    const sessionAttributes = session?.attributes;
    const referenceNumber = sessionAttributes?.reference_number;

    if (!checkoutSessionId || !referenceNumber) {
      res.status(400).json({
        message: "Missing checkout session ID or reference number.",
      });
      return;
    }

    let renewalCompleted = false;
    let attemptId: number | undefined;

    try {
      const attempt = await prisma.payment_attempts.findUnique({
        where: {
          checkout_session_id: checkoutSessionId,
        },
      });

      if (!attempt) {
        console.error("Payment attempt not found", {
          checkoutSessionId,
          referenceNumber,
        });

        res.status(404).json({
          message: "Payment attempt not found.",
        });
        return;
      }

      attemptId = attempt.id;

      if (attempt.reference_number !== referenceNumber) {
        res.status(400).json({
          message: "Payment reference does not match.",
        });
        return;
      }

      if (attempt.status === "PAID") {
        res.status(200).json({
          received: true,
          message: "Payment already processed.",
        });
        return;
      }

      if (attempt.status !== "PENDING") {
        res.status(200).json({
          received: true,
          message: "Payment attempt is already being processed.",
        });
        return;
      }

      // Verify the paid amount and currency against the stored attempt.
      // PayMongo amounts are expressed in the smallest currency unit.
      const lineItems = sessionAttributes?.line_items;

      if (!Array.isArray(lineItems) || lineItems.length === 0) {
        res.status(400).json({
          message: "Checkout session has no verifiable line items.",
        });
        return;
      }

      const paidCurrency = lineItems[0]?.currency;
      const paidAmount = lineItems.reduce(
        (total: number, item: any) =>
          total + Number(item.amount) * Number(item.quantity ?? 1),
        0,
      );

      const expectedAmount = Math.round(Number(attempt.amount) * 100);

      if (
        paidCurrency !== "PHP" ||
        !Number.isFinite(paidAmount) ||
        paidAmount !== expectedAmount ||
        lineItems.some(
          (item: any) =>
            item.currency !== "PHP" ||
            !Number.isFinite(Number(item.amount)) ||
            Number(item.amount) <= 0,
        )
      ) {
        console.error("PayMongo payment details do not match", {
          attemptId: attempt.id,
          paidCurrency,
          paidAmount,
          expectedAmount,
        });

        res.status(400).json({
          message: "Payment amount or currency mismatch.",
        });
        return;
      }

      // Atomically claim the pending attempt so concurrent webhook
      // deliveries cannot renew the same membership simultaneously.
      const claim = await prisma.payment_attempts.updateMany({
        where: {
          id: attempt.id,
          status: "PENDING",
        },
        data: {
          status: "PROCESSING",
        },
      });

      if (claim.count !== 1) {
        res.status(200).json({
          received: true,
          message: "Payment attempt is already being processed.",
        });
        return;
      }

      console.log("PayMongo payment confirmed", {
        eventId: event?.data?.id,
        checkoutSessionId,
        referenceNumber,
        memberId: attempt.member_id,
        planId: attempt.plan_id,
      });

      switch (attempt.type) {
        case "RENEWAL":
          await renewMembershipServiceService({
            member_id: attempt.member_id,
            plan_id: attempt.plan_id,
            payment_method: "GCash",
          });
          break;
      
        case "UPGRADE":
          if (!attempt.membership_id) {
            throw new Error(
              "Membership ID is required for an upgrade payment.",
            );
          }
            
          await upgradeMembershipPlanService(attempt.member_id, {
            plan_id: attempt.plan_id,
            membership_id: attempt.membership_id,
            payment_method: "GCash",
            amount: Number(attempt.amount),
          });

          break;
      
        default:
          throw new Error(`Unsupported payment type: ${attempt.type}`);
      }
      
      renewalCompleted = true;

      await prisma.payment_attempts.update({
        where: { id: attempt.id },
        data: {
          status: "PAID",
          paid_at: new Date(),
        },
      });

      res.status(200).json({
        received: true,
        message: "Payment confirmed and membership renewed.",
      });
    } catch (error) {
      console.error("PayMongo webhook processing failed", {
        attemptId,
        error,
      });

      // Only return the attempt to PENDING if the renewal service failed.
      // If renewal succeeded but updating the attempt failed, leave it
      // PROCESSING to prevent a retry from renewing the member twice.
      if (attemptId !== undefined && !renewalCompleted) {
        try {
          await prisma.payment_attempts.updateMany({
            where: {
              id: attemptId,
              status: "PROCESSING",
            },
            data: {
              status: "PENDING",
            },
          });
        } catch (resetError) {
          console.error(
            "Could not reset payment attempt; manual reconciliation is required",
            { attemptId, resetError },
          );
        }
      }

      res.status(500).json({
        message: "Webhook processing failed.",
      });
    }
  },
);

export default router;
