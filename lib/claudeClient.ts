import Anthropic from "@anthropic-ai/sdk";
import { ANALYSIS_SYSTEM_PROMPT } from "./constants";
import { AnalysisResult } from "@/types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function analyseRelationship(
  answers: string[]
): Promise<AnalysisResult> {
  const userMessage = answers
    .map((answer, i) => `Q${i + 1}: ${answer}`)
    .join("\n\n");

  const response = await client.messages.create({
    model: "claude-sonnet-4-5-20250514",
    max_tokens: 1024,
    system: ANALYSIS_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  // Extract JSON from the response (handle markdown code blocks)
  let jsonStr = textBlock.text.trim();
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }

  const result: AnalysisResult = JSON.parse(jsonStr);
  return result;
}
