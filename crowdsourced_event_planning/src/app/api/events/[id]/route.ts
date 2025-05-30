import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { Event } from "@/types/event";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const db = await getDb();

  try {
    const event = await db
      .collection<Event>("events")
      .findOne({ _id: new ObjectId(id) });
    if (!event) {
      return NextResponse.json(
        { error: "Event tidak ditemukan" },
        { status: 404 }
      );
    }
    // Konversi _id ke string untuk response
    return NextResponse.json({ ...event, _id: event._id.toString() });
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
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

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
    const result = await db
      .collection<Event>("events")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });
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
