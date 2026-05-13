import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { rateLimit } from "@/lib/rateLimit";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const COUPLE_SYSTEM_PROMPT = `You are a relationship pattern analyst trained in attachment theory, Gottman's Four Horsemen framework, and systemic family therapy.
You are NOT a therapist. You are a mirror for BOTH partners.

Two partners have independently answered the same 5 questions about their relationship.
Their answers are labelled Partner 1 (P1) and Partner 2 (P2), each with Q1-Q5.

Your job: identify the shared pattern they are stuck in, show each partner their specific role, where they collide, and give one concrete thing EACH can do differently.

RESPOND IN THIS EXACT JSON FORMAT:
{
  "patternName": "The X ↔ The Y",
  "previewLine": "One sentence teaser using both partners' words",
  "sections": {
    "heard": "2-3 sentences validating BOTH partners' pain, quoting exact words from each",
    "pattern": "3-4 sentences explaining the dynamic loop between them",
    "entryPoint": "3-4 sentences — Partner 1's entry point, then Partner 2's entry point, using their Q2/Q3 words",
    "partnerExperience": "2-3 sentences showing each partner how the other probably feels — bridging the gap",
    "action": "TWO specific scripted actions — one sentence each partner can say to the other",
    "closing": "One warm human closing line for both"
  }
}

STRICT RULES — NEVER BREAK:
1. Never use: narcissist, toxic, BPD, sociopath, manipulative, gaslighter, abuser
2. Never say either partner is "the problem"
3. Name the PATTERN — always the pattern, never the person
4. Quote BOTH partners' exact words, at least 2 quotes from each
5. 40% of content must validate before pivoting to roles
6. Never suggest leaving the relationship
7. Be aware of Indian context: joint family pressure, arranged vs love marriage, parental disapproval, premarital secrecy
8. Actions must be specific sentences — not advice, not concepts
9. If anything suggests physical danger from either partner: return { "safetyFlag": true }
10. Be balanced — do not take sides`;

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const limit = rateLimit(`couple:${ip}`, 3, 60_000);
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many requests. Please wait." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { partner1Answers, partner2Answers } = body;

    if (
      !partner1Answers?.length ||
      !partner2Answers?.length ||
      partner1Answers.length !== 5 ||
      partner2Answers.length !== 5
    ) {
      return NextResponse.json(
        { error: "Both partners must answer all 5 questions" },
        { status: 400 }
      );
    }

    const userMessage = [
      "PARTNER 1:",
      ...partner1Answers.map((a: string, i: number) => `P1-Q${i + 1}: ${a}`),
      "",
      "PARTNER 2:",
      ...partner2Answers.map((a: string, i: number) => `P2-Q${i + 1}: ${a}`),
    ].join("\n");

    const response = await client.messages.create({
      model: "claude-sonnet-4-5-20250514",
      max_tokens: 1500,
      system: COUPLE_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text response");
    }

    let jsonStr = textBlock.text.trim();
    const match = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) jsonStr = match[1].trim();

    const result = JSON.parse(jsonStr);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Couple analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed" },
      { status: 500 }
    );
  }
}
