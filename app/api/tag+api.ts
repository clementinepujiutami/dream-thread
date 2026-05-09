import { DreamTags } from "@/src/types/dream";

const SYSTEM_PROMPT =
  "Extract structured tags from this dream transcript. Return ONLY valid JSON with fields: symbols (string[]), emotions (string[]), figures (string[]), setting (string). No interpretation. No meaning. Tags only.";

function normalizeTags(input: Partial<DreamTags> | undefined): DreamTags {
  return {
    symbols: Array.isArray(input?.symbols) ? input.symbols.filter(Boolean) : [],
    emotions: Array.isArray(input?.emotions) ? input.emotions.filter(Boolean) : [],
    figures: Array.isArray(input?.figures) ? input.figures.filter(Boolean) : [],
    setting: typeof input?.setting === "string" ? input.setting : "",
  };
}

function extractJson(text: string): string {
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first === -1 || last === -1 || last <= first) return "{}";
  return text.slice(first, last + 1);
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL ?? "poolside/laguna-xs.2:free";
    if (!apiKey) {
      return Response.json({ error: "Missing OPENROUTER_API_KEY" }, { status: 500 });
    }

    const body = (await request.json()) as { transcript?: string };
    if (!body?.transcript?.trim()) {
      return Response.json({ error: "Missing transcript" }, { status: 400 });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: body.transcript },
          ],
          temperature: 0,
          max_tokens: 400,
        }),
      }
    );

    if (!response.ok) {
      const details = await response.text();
      return Response.json({ error: "Tag extraction failed", details }, { status: 502 });
    }

    const data = (await response.json()) as {
      choices?: {
        message?: {
          content?: string;
        };
      }[];
    };
    const text = data.choices?.[0]?.message?.content?.trim() ?? "";

    const parsed = JSON.parse(extractJson(text)) as Partial<DreamTags>;
    return Response.json({ tags: normalizeTags(parsed) });
  } catch (error) {
    return Response.json(
      { error: "Unexpected tag extraction error", details: String(error) },
      { status: 500 }
    );
  }
}
