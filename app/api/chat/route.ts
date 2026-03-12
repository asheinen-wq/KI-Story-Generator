import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { name, held, thema } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Du bist ein liebevoller Kinderbuchautor. Deine Geschichten sind magisch, spannend, aber immer mit einem guten Ende. Nutze eine einfache, bildhafte Sprache."
        },
        {
          role: "user",
          content: `Schreibe eine kurze Gute-Nacht-Geschichte für das Kind ${name}. Der Held oder Begleiter ist ${held}. Das Thema der Geschichte ist ${thema}. Die Geschichte sollte etwa 3-4 Absätze lang sein.`
        }
      ],
      temperature: 0.7,
    });

    return NextResponse.json({ text: response.choices[0].message.content });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Fehler bei der Geschichten-Zauberei' }, { status: 500 });
  }
}
