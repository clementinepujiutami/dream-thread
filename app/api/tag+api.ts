import Anthropic from "@anthropic-ai/sdk";
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
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "Missing ANTHROPIC_API_KEY" }, { status: 500 });
    }

    const body = (await request.json()) as { transcript?: string };
    if (!body?.transcript?.trim()) {
      return Response.json({ error: "Missing transcript" }, { status: 400 });
    }

    const anthropic = new Anthropic({ apiKey });
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: body.transcript }],
    });

    const text = response.content
      .filter((chunk) => chunk.type === "text")
      .map((chunk) => chunk.text)
      .join("\n")
      .trim();

    const parsed = JSON.parse(extractJson(text)) as Partial<DreamTags>;
    return Response.json({ tags: normalizeTags(parsed) });
  } catch (error) {
    return Response.json(
      { error: "Unexpected tag extraction error", details: String(error) },
      { status: 500 }
    );
  }
}
