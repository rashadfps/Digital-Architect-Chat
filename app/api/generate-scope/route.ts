import { NextRequest, NextResponse } from "next/server";
import { DIGITAL_ARCH_SYSTEM_PROMPT } from "../../../lib/ai/systemPrompt";
import { ScopeSchema } from "../../../lib/validators/scope";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash";

export async function POST(req: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { messages, intake } = body as {
      messages: Array<{ role: "user" | "assistant"; content: string }>;
      intake?: Record<string, unknown>;
    };

    const userContext = JSON.stringify({ intake, messages });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: DIGITAL_ARCH_SYSTEM_PROMPT }],
          },
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Generate a scope document JSON for this project context:\n${userContext}\n\nReturn valid JSON only.`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            responseMimeType: "application/json",
          },
        }),
      },
    );

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ error: "Gemini API error", detail: errText }, { status: 500 });
    }

    const data = await response.json();
    const jsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";

    let modelJson: unknown;
    try {
      modelJson = JSON.parse(jsonText);
    } catch {
      return NextResponse.json({ error: "Invalid JSON returned by model", raw: jsonText }, { status: 502 });
    }

    const parsed = ScopeSchema.safeParse(modelJson);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Scope validation failed", issues: parsed.error.issues, raw: modelJson },
        { status: 422 },
      );
    }

    return NextResponse.json({ scope: parsed.data });
  } catch (error) {
    return NextResponse.json({ error: "Server error", detail: String(error) }, { status: 500 });
  }
}
