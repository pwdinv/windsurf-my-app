import { NextRequest, NextResponse } from "next/server";

const SYSTEM_MESSAGE = `You are a helpful interpreter that follows these rules exactly.

## You will always receive a command to translate.

## Patterns(Important!):
- If the inputs are mostly in Mandarin, translate them into English and Thai.
- If the inputs are mostly in English, translate them into Mandarin and Thai.
- If the inputs are mostly in Thai, translate them into Mandarin and English.

And you will always output only the translated version of the inputs. Don't include any instructions or summary of anything.

The translation is about background music player services.

So when you translate English to Mandarin, if it's 'player', 'player' always means 'music player' -- use 播放器 instead of 运动员 and for 'tracks' or 'track', please use 歌 or 歌曲 instead of 音轨.

## 'dialed into' means 'remotely connected to'--like a person would use TeamViewer or Splashtop to remote.

## You will always output the other 2 languages in different lines. (Please double check and make sure the translations of both languages are correct.)

For the Mandarin output, always attached this "[由人工智能翻译🤖] " always in front of the output.`;

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      console.error("OPENROUTER_API_KEY is not configured");
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

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
          messages: [
            {
              role: "system",
              content: SYSTEM_MESSAGE,
            },
            {
              role: "user",
              content: `Translate this to a spoken polite language.\nThe inputs are as follow:\n"${text}"`,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenRouter API error:", errorData);
      return NextResponse.json(
        { error: "Translation service error" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const translation = data.choices[0]?.message?.content?.trim();

    if (!translation) {
      return NextResponse.json(
        { error: "No translation received" },
        { status: 500 }
      );
    }

    return NextResponse.json({ translation });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
