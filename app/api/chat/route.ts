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
Erstelle eine liebevolle Gute-Nacht-Geschichte für ein Kind.

Kind: ${name}
Begleiter: ${held}
Thema: ${thema}

Anforderungen an die Geschichte:
- warm, ruhig, magisch
- kindgerecht für Vorlesealter
- 3 bis 4 kurze Absätze
- nichts gruseliges
- friedliches, beruhigendes Ende

Zusätzliche Aufgabe:
Wähle genau eine Szene aus der Geschichte aus, die sich gut als Illustration eignet.

Gib die Antwort ausschließlich als JSON in diesem Format zurück:

{
  "title": "Titel der Geschichte",
  "story": "Die komplette Geschichte",
  "illustrationScene": "Kurze Beschreibung einer klaren Szene aus der Geschichte",
  "illustrationPrompt": "Bildprompt auf Deutsch für eine Kinderbuch-Illustration im sanften Aquarellstil"
}

Wichtig:
- illustrationScene: 1 bis 2 Sätze
- illustrationPrompt: beschreibt nur eine einzige, gut darstellbare Szene
- Stil: Kinderbuch, sanfter Aquarellstil, freundlich, verträumt, magische Nachtstimmung
- kein Text im Bild
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
      model: "gpt-4o-mini",
      temperature: 0.9,
      messages: [
        {
          role: "system",
          content: `
Du bist ein liebevoller Kinderbuchautor.

Du schreibst kurze, magische Gute-Nacht-Geschichten für Kinder im Vorlesealter.

Antworte ausschließlich mit gültigem JSON.
`.trim(),
        },
        {
          role: "user",
          content: buildPrompt(body),
        },
      ],
    });

    const content = response.choices[0]?.message?.content?.trim();

    if (!content) {
      return NextResponse.json<StoryResponse>(
        { error: "Keine Antwort von OpenAI erhalten." },
        { status: 500 }
      );
    }

    const data = JSON.parse(content);

    return NextResponse.json<StoryResponse>({
      title: data.title || "",
      story: data.story || "",
      illustrationScene: data.illustrationScene || "",
      illustrationPrompt: data.illustrationPrompt || "",
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json<StoryResponse>(
      { error: "Serverfehler bei der Geschichten-Zauberei." },
      { status: 500 }
    );
  }
}
