import Anthropic from "@anthropic-ai/sdk";
import { courses } from "@/data/courses";
import { NextRequest, NextResponse } from "next/server";

const courseList = courses
  .map(
    (c) =>
      `ID: ${c.id} | Category: ${c.category} | Ages: ${c.ageMin}-${c.ageMax} | Level: ${c.level} | Title Key: ${c.titleKey}`
  )
  .join("\n");

export async function POST(req: NextRequest) {
  const { message, locale } = await req.json();

  if (!message || typeof message !== "string" || message.length > 1000) {
    return NextResponse.json(
      { error: "Invalid message" },
      { status: 400 }
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  const client = new Anthropic({ apiKey });

  const systemPrompt = `You are a friendly course advisor for ProCoder, a children's learning platform (ages 6–18) offering courses in Programming, Robotics, Algorithms, Arabic, and Quran.

Available courses:
${courseList}

Your task: Based on the parent's or child's message, recommend the most suitable course IDs. Consider the child's age, interests, and skill level mentioned in the message.

RULES:
- Return ONLY a JSON object: {"ids": ["course-id-1", "course-id-2"], "message": "your friendly explanation"}
- Recommend 1-4 courses maximum
- The "message" should be a short, friendly explanation (2-3 sentences) in ${locale === "ar" ? "Arabic" : "English"}
- If the message is unclear, still try your best to recommend and ask for more details in the message
- Never recommend courses outside the available list
- Return valid JSON only, no markdown`;

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      messages: [{ role: "user", content: message }],
      system: systemPrompt,
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({
        ids: [],
        message: text,
      });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const validIds = (parsed.ids || []).filter((id: string) =>
      courses.some((c) => c.id === id)
    );

    return NextResponse.json({
      ids: validIds,
      message: parsed.message || "",
    });
  } catch (error) {
    console.error("LLM error:", error);
    return NextResponse.json(
      { error: "Failed to get recommendation" },
      { status: 500 }
    );
  }
}
