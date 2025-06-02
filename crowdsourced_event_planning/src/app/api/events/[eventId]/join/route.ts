import { NextRequest, NextResponse } from "next/server";
import EventModel from "@/db/models/EventModel";

export async function POST(
  request: NextRequest,
  context: { params: { eventId: string } }
) {
  try {
    const { eventId } = await context.params;
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const event = await EventModel.getById(eventId);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (!event.participants) {
      event.participants = [];
    }

    event.participants.push(userId);
    await EventModel.update(eventId, { participants: event.participants });

    return NextResponse.json({ message: "Successfully joined the event" });
  } catch (error) {
    console.error("Error joining event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { eventId: string } }
) {
  try {
    const { eventId } = await context.params;
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const event = await EventModel.getById(eventId);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (!event.participants) {
      event.participants = [];
    }

    event.participants = event.participants.filter((id) => id !== userId);
    await EventModel.update(eventId, { participants: event.participants });

    return NextResponse.json({ message: "Successfully left the event" });
  } catch (error) {
    console.error("Error leaving event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
