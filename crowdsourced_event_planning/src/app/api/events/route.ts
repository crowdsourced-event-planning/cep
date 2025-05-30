import { NextResponse } from "next/server";
import { getEventById } from "@/lib/data/event";
import { getDb } from "@/lib/mongodb";
import { Event } from "@/types/event";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get("id");

  try {
    if (eventId) {
      const event = await getEventById(eventId);
      if (!event) {
        return NextResponse.json(
          { error: "Event tidak ditemukan" },
          { status: 404 }
        );
      }
      return NextResponse.json({ ...event, _id: event._id.toString() });
    } else {
      const db = await getDb();
      const events = await db.collection<Event>("events").find().toArray();
      return NextResponse.json(
        events.map((event) => ({ ...event, _id: event._id.toString() }))
      );
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Gagal mengambil event" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const userId = request.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json(
      { error: "Autentikasi diperlukan" },
      { status: 401 }
    );
  }

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
    creator,
  } = data;

  if (!title || !creator) {
    return NextResponse.json(
      { error: "Title dan creator diperlukan" },
      { status: 400 }
    );
  }

  const db = await getDb();
  const newEvent: Partial<Event> = {
    title,
    description: description || "",
    location: location || "",
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    startTime: startTime || "",
    endTime: endTime || "",
    typeEvent: typeEvent || "",
    status: status || "active",
    targetFunding: targetFunding || 0,
    currentFunding: 0,
    creator,
    budget: [],
    gallery: [],
    documents: [],
    createdAt: new Date(),
  };

  try {
    const result = await db
      .collection<Event>("events")
      .insertOne(newEvent as Event);
    return NextResponse.json(
      { id: result.insertedId.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ error: "Gagal membuat event" }, { status: 500 });
  }
}
