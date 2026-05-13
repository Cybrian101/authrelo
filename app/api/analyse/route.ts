import { NextRequest, NextResponse } from "next/server";
import { analyseRelationship } from "@/lib/claudeClient";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  // Rate limit by IP
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const limit = rateLimit(`analyse:${ip}`, 5, 60_000);
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { answers } = body;

    if (!answers || !Array.isArray(answers) || answers.length !== 5) {
      return NextResponse.json(
        { error: "Exactly 5 answers are required" },
        { status: 400 }
      );
    }

    for (const answer of answers) {
      if (typeof answer !== "string" || answer.trim().length < 10) {
        return NextResponse.json(
          { error: "Each answer must be at least 10 characters" },
          { status: 400 }
        );
      }
    }

    const result = await analyseRelationship(answers);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyse responses" },
      { status: 500 }
    );
  }
}
