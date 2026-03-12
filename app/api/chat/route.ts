import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const THEMEN = [
  "Freundschaft",
  "Mut & Tapferkeit",
  "Weltraum-Abenteuer",
  "Unterwasserwelt",
  "Einhorn-Magie",
] as const;

type Thema = (typeof THEMEN)[number];

type StoryRequest = {
  name: string;
  held: string;
  thema: Thema;
};

type StoryResponse = {
  text?: string;
  error?: string;
};

const MAX_NAME_LENGTH = 40;
const MAX_HELD_LENGTH = 80;

function isValidThema(value: string): value is Thema {
  return THEMEN.includes(value as Thema);
}

function buildPrompt({ name, held, thema }: StoryRequest): string {
  return `
Schreibe eine liebevolle, kindgerechte Gute-Nacht-Geschichte.

Vorgaben:
- Name des Kindes: ${name}
- Held oder Begleiter: ${held}
- Thema: ${thema}
- Länge: 3 bis 4 kurze Absätze
- Stil: warm, magisch, bildhaft, leicht verständlich
- Zielgruppe: Kinder im Vorlesealter
- Ende: beruhigend, freundlich und schön

Wichtig:
- Verwende eine einfache Sprache.
- Die Geschichte soll positiv und kreativ sein.
- Die Geschichte darf nicht gruselig oder überfordernd sein.
- Gib nur die Geschichte aus, ohne Einleitung oder Erklärungen.
  `.trim();
}

function validateInput(body: Partial<StoryRequest>) {
  const name = body.name?.trim() ?? "";
  const held = body.held?.trim() ?? "";
  const thema = body.thema?.trim() ?? "";

  if (!name || !held || !thema) {
    return {
      ok: false as const,
      error: "Bitte fülle alle Felder vollständig aus.",
      status: 400,
    };
  }

  if (name.length > MAX_NAME_LENGTH) {
    return {
      ok: false as const,
      error: `Der Name darf maximal ${MAX_NAME_LENGTH} Zeichen lang sein.`,
      status: 400,
    };
  }

  if (held.length > MAX_HELD_LENGTH) {
    return {
      ok: false as const,
      error: `Der Held oder Begleiter darf maximal ${MAX_HELD_LENGTH} Zeichen lang sein.`,
      status: 400,
    };
  }

  if (!isValidThema(thema)) {
    return {
      ok: false as const,
      error: "Das gewählte Thema ist ungültig.",
      status: 400,
    };
  }

  return {
    ok: true as const,
    data: {
      name,
      held,
      thema,
    },
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<StoryRequest>;
    const validated = validateInput(body);

    if (!validated.ok) {
      return NextResponse.json<StoryResponse>(
        { error: validated.error },
        { status: validated.status }
      );
    }

    const prompt = buildPrompt(validated.data);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0.8,
      max_tokens: 500,
      messages: [
        {
          role: "system",
          content:
            "Du bist ein liebevoller Kinderbuchautor. Du schreibst magische, ruhige, kindgerechte Gute-Nacht-Geschichten mit einem positiven Ende.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const text = response.choices[0]?.message?.content?.trim();

    if (!text) {
      return NextResponse.json<StoryResponse>(
        { error: "Es konnte keine Geschichte erzeugt werden." },
        { status: 500 }
      );
    }

    return NextResponse.json<StoryResponse>({ text });
  } catch (error) {
    console.error("API Error:", error);

    return NextResponse.json<StoryResponse>(
      { error: "Fehler bei der Geschichten-Zauberei." },
      { status: 500 }
    );
  }
}
