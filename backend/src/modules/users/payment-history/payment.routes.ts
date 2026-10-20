import { Router, Request, Response } from "express";
import * as controller from "./payment.controller.js";
import { prisma } from "../../../lib/prisma.js";
import { memberAuthMiddleware } from "../../../middlewares/memberAuth.js";
import { randomUUID } from "crypto";
import dotenv from "dotenv";
dotenv.config();

const router = Router();

type CheckoutType = "NEW" | "RENEWAL" | "UPGRADE";

type MemberRequest = Request & {
  memberUser?: {
    memberId: number | null;
    user_id: number;
    username: string;
    role: string;
  };
};

type MembershipPlan = {
  price: number;
  name: string;
};

router.get("/:member_id", controller.getMemberPaymentHistoryController);

async function getMembershipPrice(
  planId: string,
): Promise<MembershipPlan> {
  const id = Number(planId);

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("Invalid membership plan ID.");
  }

  const plan = await prisma.membership_plans.findUnique({
    where: { id },
    select: {
      price: true,
      plan_name: true,
    },
  });

  if (!plan) {
    throw new Error("Membership plan not found.");
  }

  return {
    price: Number(plan.price),
    name: plan.plan_name,
  };
}

router.post(
  "/paymongo/checkout",
  memberAuthMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    const requestId = `checkout-${randomUUID()}`;
    let paymentAttemptId: number | undefined;

    try {
      const { planId, fullname, email, phone, type, membershipId } = req.body ?? {};

      const memberId = (req as MemberRequest).memberUser?.memberId;

      const validTypes: CheckoutType[] = [
        "NEW",
        "RENEWAL",
        "UPGRADE",
      ];

      if (
        typeof planId !== "string" ||
        !planId.trim() ||
        !Number.isSafeInteger(Number(planId)) ||
        Number(planId) <= 0 ||
        typeof fullname !== "string" ||
        !fullname.trim() ||
        typeof email !== "string" ||
        !email.trim() ||
        typeof phone !== "string" ||
        !phone.trim() ||
        !Number.isSafeInteger(memberId) ||
        !memberId ||
        memberId <= 0
      ) {
        res.status(400).json({
          message:
            "Valid member, plan, fullname, email, and phone are required.",
          requestId,
        });
        return;
      }

      if (
        typeof type !== "string" ||
        !validTypes.includes(type as CheckoutType)
      ) {
        res.status(400).json({
          message: "Invalid membership checkout type.",
          requestId,
        });
        return;
      }

      let parsedMembershipId: number | null = null;

      if (membershipId !== undefined && membershipId !== null) {
        parsedMembershipId = Number(membershipId);

        if (
          !Number.isSafeInteger(parsedMembershipId) ||
          parsedMembershipId <= 0
        ) {
          res.status(400).json({
            message: "Invalid membership ID.",
            requestId,
          });
          return;
        }
      }
      
      const checkoutType = type as CheckoutType;
      const secretKey = process.env.PAYMONGO_SECRET;

      if (!secretKey) {
        console.error(`[${requestId}] PAYMONGO_SECRET_KEY is missing`);

        res.status(500).json({
          message: "Payment gateway is not configured.",
          requestId,
        });
        return;
      }

      const plan = await getMembershipPrice(planId);
      const amountInPesos = plan.price;

      if (
        !Number.isFinite(amountInPesos) ||
        amountInPesos <= 0
      ) {
        res.status(400).json({
          message: "Invalid membership price.",
          requestId,
        });
        return;
      }

      const amount = Math.round(amountInPesos * 100);
      const referenceNumber = `GYM-${planId}-${randomUUID()}`;

      const attempt = await prisma.payment_attempts.create({
        data: {
          reference_number: referenceNumber,
          member_id: memberId,
          plan_id: Number(planId),
          amount: amountInPesos,
          status: "PENDING",
          type: checkoutType,
          membership_id: membershipId
        },
      });

      paymentAttemptId = attempt.id;

      console.log(`[${requestId}] Payment attempt created`, {
        paymentAttemptId: attempt.id,
        memberId,
        planId,
        type: checkoutType,
        amountInPesos,
        referenceNumber,
      });

      const itemName =
        checkoutType === "RENEWAL"
          ? "Gym Membership Renewal"
          : checkoutType === "UPGRADE"
            ? "Gym Membership Upgrade"
            : "New Gym Membership";

      const description =
        checkoutType === "RENEWAL"
          ? `Renewal of membership plan ${plan.name}`
          : checkoutType === "UPGRADE"
            ? `Upgrade to membership plan ${plan.name}`
            : `Purchase of membership plan ${plan.name}`;

      const response = await fetch(
        "https://api.paymongo.com/v2/checkout_sessions",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Basic ${Buffer.from(
              `${secretKey}:`,
            ).toString("base64")}`,
          },
          body: JSON.stringify({
            data: {
              attributes: {
                billing: {
                  name: fullname.trim(),
                  email: email.trim(),
                  phone: phone.trim(),
                },
                customer_email: email.trim(),
                line_items: [
                  {
                    amount,
                    currency: "PHP",
                    name: itemName,
                    description,
                    quantity: 1,
                  },
                ],
                payment_method_types: ["gcash"],
                success_url: "jfitness://",
                cancel_url: "jfitness://membership-checkout",
                reference_number: referenceNumber,
              },
            },
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        await prisma.payment_attempts.update({
          where: { id: attempt.id },
          data: { status: "FAILED" },
        });

        console.error(`[${requestId}] PayMongo rejected checkout`, {
          status: response.status,
          errors: result?.errors,
        });

        res.status(502).json({
          message: "Unable to create checkout session.",
          requestId,
        });
        return;
      }

      const checkoutSessionId = result?.data?.id;
      const checkoutUrl = result?.data?.attributes?.checkout_url;

      if (
        typeof checkoutSessionId !== "string" ||
        typeof checkoutUrl !== "string" ||
        !checkoutUrl
      ) {
        console.error(`[${requestId}] Invalid PayMongo response`, {
          paymentAttemptId: attempt.id,
        });

        res.status(502).json({
          message: "PayMongo returned an invalid checkout response.",
          requestId,
        });
        return;
      }

      await prisma.payment_attempts.update({
        where: { id: attempt.id },
        data: {
          checkout_session_id: checkoutSessionId,
        },
      });

      console.log(`[${requestId}] Checkout session linked`, {
        paymentAttemptId: attempt.id,
        checkoutSessionId,
        referenceNumber,
        type: checkoutType,
      });

      res.status(201).json({
        checkoutSessionId,
        checkoutUrl,
        amount,
        currency: "PHP",
        status: "PENDING",
        requestId,
      });
    } catch (error) {
      console.error(`[${requestId}] Checkout initialization failed`, {
        paymentAttemptId,
        error: error instanceof Error ? error.message : error,
      });

      res.status(500).json({
        message: "An error occurred while initializing checkout.",
        requestId,
      });
    }
  },
);

export default router;