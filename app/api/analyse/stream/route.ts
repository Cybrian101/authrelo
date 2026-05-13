import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { ANALYSIS_SYSTEM_PROMPT } from "@/lib/constants";
import { rateLimit } from "@/lib/rateLimit";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  // Rate limit by IP
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const limit = rateLimit(`analyse:${ip}`, 5, 60_000);
  if (!limit.success) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please wait a minute." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await request.json();
    const { answers } = body;

    if (!answers || !Array.isArray(answers) || answers.length !== 5) {
      return new Response(
        JSON.stringify({ error: "Exactly 5 answers are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const userMessage = answers
      .map((answer: string, i: number) => `Q${i + 1}: ${answer}`)
      .join("\n\n");

    const stream = await client.messages.stream({
      model: "claude-sonnet-4-5-20250514",
      max_tokens: 1024,
      system: ANALYSIS_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Stream analysis error:", error);
    return new Response(
      JSON.stringify({ error: "Analysis failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
