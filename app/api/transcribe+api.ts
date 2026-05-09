export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
    }

    const incoming = await request.formData();
    const file = incoming.get("file");
    if (!(file instanceof File)) {
      return Response.json({ error: "Missing audio file" }, { status: 400 });
    }

    const formData = new FormData();
    formData.append("model", "whisper-1");
    formData.append("file", file);

    const result = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!result.ok) {
      const details = await result.text();
      return Response.json({ error: "Transcription failed", details }, { status: 502 });
    }

    const data = (await result.json()) as { text?: string };
    return Response.json({ transcript: data.text ?? "" });
  } catch (error) {
    return Response.json(
      { error: "Unexpected transcription error", details: String(error) },
      { status: 500 }
    );
  }
}
