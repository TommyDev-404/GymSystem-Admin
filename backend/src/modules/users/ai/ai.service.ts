import { openai } from "../../../lib/open-ai";
import { JFITNESS_COACH_PROMPT } from "./ai.prompt";

export async function generateCoachResponse(
  message: string,
  context: any,
) {
  const response = await openai.responses.create({
    model: "gpt-5.6-luna",
    instructions: JFITNESS_COACH_PROMPT,
    input: `
      MEMBER CONTEXT:

      ${JSON.stringify(context, null, 2)}

      MEMBER MESSAGE:

      ${message}
      `,
  });

  return response.output_text;
}