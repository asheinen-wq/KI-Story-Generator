import { NextResponse } from "next/server";
import OpenAI from "openai";

import {
  isValidThema,
  MAX_HELD_LENGTH,
  MAX_NAME_LENGTH,
} from "../../lib/story-config";

import type { StoryRequest, StoryResponse } from "../../lib/story-config";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

function buildPrompt({ name, held, thema }: StoryRequest) {
  return `
Schreibe eine liebevolle Gute-Nacht-Geschichte für ein Kind.

Name: ${name}
Held: ${held}
Thema: ${thema}

3–4 kurze Absätze. Einfach, warm und positiv.
`.trim();
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as StoryRequest;

    if (!body.name || !body.held || !body.thema) {
      return NextResponse.json<StoryResponse>(
        { error: "Ungültige Eingabe." },
        { status: 400 }
      );
    }

    if (
      body.name.length > MAX_NAME_LENGTH ||
      body.held.length > MAX_HELD_LENGTH ||
      !isValidThema(body.thema)
    ) {
      return NextResponse.json<StoryResponse>(
        { error: "Ungültige Eingabedaten." },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0.8,
      messages: [
        {
          role: "system",
          content:
            "Du bist ein liebevoller Kinderbuchautor für Gute-Nacht-Geschichten.",
        },
        {
          role: "user",
          content: buildPrompt(body),
        },
      ],
    });

    const text = response.choices[0]?.message?.content?.trim();

    return NextResponse.json<StoryResponse>({
      text: text || "",
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json<StoryResponse>(
      { error: "Serverfehler bei der Geschichten-Zauberei." },
      { status: 500 }
    );
  }
}
