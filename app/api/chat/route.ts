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

function buildPrompt({ name, held, thema }: StoryRequest): string {
  return `
Schreibe eine liebevolle Gute-Nacht-Geschichte für ein Kind.

Kind: ${name}
Begleiter: ${held}
Thema: ${thema}

Struktur:
1. Das Kind begegnet dem Begleiter.
2. Sie erleben ein kleines magisches Abenteuer.
3. Baue eine kleine, freundliche Herausforderung oder Überraschung ein.
4. Am Ende wird alles ruhig und das Kind schläft glücklich ein.

Schreibstil:
- warme, ruhige Sprache
- kurze, gut verständliche Sätze
- bildhafte Beschreibungen
- eine kleine freundliche Überraschung
- beruhigendes Ende

Regeln:
- 3 bis 4 kurze Absätze
- keine Einleitung außerhalb der Geschichte
- nichts gruseliges
- kindgerecht für Vorlesealter

Beende die Geschichte sanft und beruhigend.
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
      temperature: 0.9,
messages: [
  {
    role: "system",
    content: `
Du bist ein liebevoller Kinderbuchautor.

Du schreibst kurze, magische Gute-Nacht-Geschichten für Kinder im Vorlesealter.

Dein Schreibstil ist:
- warm
- bildhaft
- ruhig
- leicht verständlich

Die Geschichten enthalten Freundschaft, Mut oder kleine Abenteuer und enden immer friedlich, damit Kinder entspannt einschlafen können.
`.trim(),
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
