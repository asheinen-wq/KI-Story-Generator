import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = String(body?.prompt || "").trim();

    if (!prompt) {
      return NextResponse.json(
        { error: "Kein Illustrations-Prompt erhalten." },
        { status: 400 }
      );
    }

    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
    });

    const imageBase64 = result.data?.[0]?.b64_json;

    if (!imageBase64) {
      return NextResponse.json(
        { error: "Kein Bild von der API erhalten." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      imageUrl: `data:image/png;base64,${imageBase64}`,
    });

  } catch (error) {
    console.error("Illustration generation failed:", error);

    return NextResponse.json(
      { error: "Illustration konnte nicht erzeugt werden." },
      { status: 500 }
    );
  }
}
