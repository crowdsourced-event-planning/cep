import { getDb } from "@/lib/mongodb";
import { Filter, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { Event } from "@/types/event";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const db = await getDb();

  try {
    const query: Filter<Event> = {
      _id: new ObjectId(params.id) as unknown as string,
    };
    const event = await db.collection<Event>("events").findOne(query);
    if (!event) {
      return NextResponse.json(
        { error: "Event tidak ditemukan" },
        { status: 404 }
      );
    }
    return NextResponse.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Gagal mengambil event" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const data = await request.json();
  const {
    title,
    description,
    location,
    startDate,
    endDate,
    startTime,
    endTime,
    typeEvent,
    status,
    targetFunding,
    currentFunding,
  } = data;

  if (!title) {
    return NextResponse.json({ error: "Title diperlukan" }, { status: 400 });
  }

  const db = await getDb();
  const updateData: Partial<Event> = {
    title,
    description: description || "",
    location: location || "",
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate ? new Date(endDate) : undefined,
    startTime: startTime || "",
    endTime: endTime || "",
    typeEvent: typeEvent || "",
    status: status || undefined,
    targetFunding: targetFunding || undefined,
    currentFunding: currentFunding || undefined,
  };

  try {
    const query: Filter<Event> = {
      _id: new ObjectId(params.id) as unknown as string,
    };
    const result = await db
      .collection<Event>("events")
      .updateOne(query, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Event tidak ditemukan" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Event berhasil diperbarui" });
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui event" },
      { status: 500 }
    );
  }
}
