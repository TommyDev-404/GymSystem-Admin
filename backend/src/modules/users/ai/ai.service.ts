import { genai } from "../../../lib/ai.js";
import { JFITNESS_COACH_PROMPT } from "./ai.prompt.js";

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
  
  console.log("Gemini response:", response.text);
  return response.text ?? "";
}
