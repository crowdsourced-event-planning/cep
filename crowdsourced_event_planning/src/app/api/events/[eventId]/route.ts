import { NextRequest, NextResponse } from "next/server";
import EventModel from "@/db/models/EventModel";
import { UserEventModel } from "@/db/models/UserEventModel";

// GET single event
export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const event = await EventModel.getById(eventId);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

// PUT to update event
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const event = await EventModel.getById(eventId);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Check if user is the event creator
    if (event.creator.toString() !== userId) {
      return NextResponse.json(
        { error: "Not authorized to edit this event" },
        { status: 403 }
      );
    }

    const data = await request.json();

    // Validate required fields
    if (!data.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Update event
    const updatedEvent = await EventModel.update(eventId, {
      ...data,
      updatedAt: new Date(),
    });

    if (!updatedEvent) {
      return NextResponse.json(
        { error: "Failed to update event" },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

// DELETE event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const event = await EventModel.getById(eventId);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Check if user is the event creator
    if (event.creator.toString() !== userId) {
      return NextResponse.json(
        { error: "Not authorized to delete this event" },
        { status: 403 }
      );
    }

    // Delete user-event associations first
    const userEvents = await UserEventModel.getUserEventsByEventId(eventId);
    for (const userEvent of userEvents) {
      await UserEventModel.leaveEvent(userEvent.userId, eventId);
    }

    // Delete the event
    await EventModel.delete(eventId);

    return NextResponse.json({
      message: "Event deleted successfully",
      id: eventId,
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
