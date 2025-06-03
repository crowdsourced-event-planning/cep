import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { isValidObjectId } from "@/lib/utils/slug";
import { getEventBySlugOrId } from "@/lib/data/event";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const event = await getEventBySlugOrId(slug);

    if (!event) {
      return NextResponse.json(
        { error: "Event tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...event,
      _id: event._id?.toString(),
      creator: event.creator?.toString?.() || event.creator || "",
    });
  } catch (error) {
    console.error("Error getting event:", error);
    return NextResponse.json(
      { error: "Gagal mengambil event" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const db = await getDb();
    const filter: Record<string, unknown> = {};
    if (isValidObjectId(slug)) {
      filter._id = new ObjectId(slug);
    } else {
      filter.slug = slug;
    }

    const result = await db.collection("events").deleteOne(filter);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Event tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Gagal menghapus event" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const db = await getDb();
  const data = await request.json();

  const filter: Record<string, unknown> = {};
  if (/^[0-9a-fA-F]{24}$/.test(slug)) {
    filter._id = new ObjectId(slug);
  } else {
    filter.slug = slug;
  }

  const result = await db
    .collection("events")
    .updateOne(filter, { $set: data });
  if (result.matchedCount === 0) {
    return NextResponse.json(
      { error: "Event tidak ditemukan" },
      { status: 404 }
    );
  }
  return NextResponse.json({ success: true });
}
