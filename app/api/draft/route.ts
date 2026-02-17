import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY_DRAFTER;

    if (!apiKey) {
      console.error("OPENROUTER_API_KEY_DRAFTER is not configured");
      return NextResponse.json(
        { error: "Drafter API key not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { mode, clientEmail, instructions, tone, language, length } = body;

    if (!instructions || typeof instructions !== "string") {
      return NextResponse.json(
        { error: "Instructions are required" },
        { status: 400 }
      );
    }

    if (mode === "reply" && (!clientEmail || !clientEmail.trim())) {
      return NextResponse.json(
        { error: "Client email is required for reply mode" },
        { status: 400 }
      );
    }

    const prompt = `
Output Language(Very Crucial): ${language}
Tone of Output Message: ${tone}
Length of Output Message: ${length}

Client message:
${mode === "reply" ? clientEmail : "(New email)"}

Instructions:
${instructions}

Write a clear, professional, and client-ready email. Keep the language natural and concise, avoiding jargon unless necessary. Do not sound defensive or overly casual.`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.4,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenRouter API error:", errorData);
      return NextResponse.json(
        { error: "Email drafting service error" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const draft = data.choices?.[0]?.message?.content?.trim();

    if (!draft) {
      return NextResponse.json(
        { error: "No email draft received" },
        { status: 500 }
      );
    }

    return NextResponse.json({ draft });
  } catch (error) {
    console.error("Email drafting error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
