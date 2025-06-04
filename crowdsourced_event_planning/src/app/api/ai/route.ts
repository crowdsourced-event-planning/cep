import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { title } = await req.json();

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_AI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Buatkan deskripsi acara yang menarik, informatif, dan mendorong kolaborasi untuk event dengan judul: "${title}". Tampilkan manfaat acara, ajak pembaca untuk berpartisipasi, dan pastikan deskripsi mudah dipahami. Jawab dengan bahasa yang sama seperti judul event, tanpa format Markdown, bullet point, atau kode.`,
                },
              ],
            },
          ],
        }),
      }
    );
    const data = await response.json();
    // Hilangkan karakter Markdown umum jika masih ada
    let description = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    description = description
      .replace(/^#+\s?/gm, "") // Hilangkan heading markdown
      .replace(/^\*\s+/gm, "") // Hilangkan bullet markdown
      .replace(/^- /gm, "") // Hilangkan bullet markdown
      .replace(/```[\s\S]*?```/gm, "") // Hilangkan code block
      .trim();
    return NextResponse.json({ description });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate description" },
      { status: 500 }
    );
  }
}
