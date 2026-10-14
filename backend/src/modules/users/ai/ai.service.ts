import { genai } from "../../../lib/ai";
import { JFITNESS_COACH_PROMPT } from "./ai.prompt";

export async function generateCoachResponse(
  message: string,
  context: any,
): Promise<string> {
  const response = await genai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    config: {
      systemInstruction: JFITNESS_COACH_PROMPT,
    },
    contents: `
      MEMBER CONTEXT:
      ${JSON.stringify(context, null, 2)}

      MEMBER MESSAGE:
      ${message}
    `,
  });

  return response.text ?? "";
}
