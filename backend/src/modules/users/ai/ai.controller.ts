import { Request, Response } from "express";
import { buildCoachContext } from "./ai.context";
import { generateCoachResponse } from "./ai.service";

export async function chatWithCoach(
  req: Request,
  res: Response,
) {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        message: "A message is required.",
      });
    }

    const memberId = Number(req.params.member_id);

    const context = await buildCoachContext(memberId);

    const reply = await generateCoachResponse(
      message,
      context,
    );

    return res.json({
      reply,
    });
  } catch (error) {
    console.error("AI Coach error:", error);

    return res.status(500).json({
      message: "Unable to contact the AI coach.",
    });
  }
}