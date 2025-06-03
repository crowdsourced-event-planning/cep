import { NextResponse } from "next/server";
import { createEvent, getEventById } from "@/lib/data/event";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import Event from "@/db/models/EventModel";

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
      return NextResponse.json({ ...event, _id: event._id?.toString() });
    } else {
      const db = await getDb();
      const events = await db.collection<Event>("events").find().toArray();
      return NextResponse.json(
        events.map((event) => ({ ...event, _id: event._id?.toString() }))
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
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const data = await request.json();

    // Validate required fields
    if (
      !data.title ||
      !data.description ||
      !data.location ||
      !data.startDate ||
      !data.endDate
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate dates
    const startDateTime = new Date(`${data.startDate}T${data.startTime}`);
    const endDateTime = new Date(`${data.endDate}T${data.endTime}`);

    if (startDateTime >= endDateTime) {
      return NextResponse.json(
        { error: "End date/time must be after start date/time" },
        { status: 400 }
      );
    }

    if (startDateTime < new Date()) {
      return NextResponse.json(
        { error: "Start date/time cannot be in the past" },
        { status: 400 }
      );
    }

    // Prepare event data
    const eventData = {
      title: data.title,
      description: data.description,
      location: data.location,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      startTime: data.startTime,
      endTime: data.endTime,
      typeEvent: data.typeEvent,
      targetFunding: Number(data.targetFunding) || 0,
      currentFunding: 0,
      status: data.status || "open",
      creator: new ObjectId(userId),
      budget: data.budget || [],
      gallery: data.gallery || [],
      documents: data.documents || [],
      cancelReason: "",
    };

    const newEvent = await createEvent(eventData);

    return NextResponse.json(
      {
        success: true,
        message: "Event created successfully",
        eventId: newEvent._id?.toString(),
        event: {
          ...newEvent,
          _id: newEvent._id?.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
