import { NextRequest, NextResponse } from "next/server";
import EventModel from "@/db/models/EventModel";

interface Context {
  params: { eventId: string };
}

export async function POST(request: NextRequest, { params }: Context) {
  try {
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    const { eventId } = params;

    const event = await EventModel.getById(eventId);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
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

export async function DELETE(request: NextRequest, { params }: Context) {
  try {
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    const { eventId } = params;

    const event = await EventModel.getById(eventId);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
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
