import { NextRequest, NextResponse } from "next/server";
import { getEventBySlug } from "@/lib/data/event";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  // Pastikan _id dikirim sebagai string
  return NextResponse.json({
    ...event,
    _id: event._id?.toString?.() || "",
  });
}
