import { NextRequest, NextResponse } from "next/server";
import { UserEventModel } from "@/db/models/UserEventModel";
import EventModel from "@/db/models/EventModel";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { userId, role = "viewer" } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const { eventId } = await params;

    // Check if event exists
    const event = await EventModel.getById(eventId);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Check if event is open for joining
    if (event.status !== "open") {
      return NextResponse.json(
        { error: "Event is not open for joining" },
        { status: 400 }
      );
    }

    // Check if user is already joined
    const isAlreadyJoined = await UserEventModel.isUserJoinedEvent(
      userId,
      eventId
    );
    if (isAlreadyJoined) {
      return NextResponse.json(
        { error: "User is already joined to this event" },
        { status: 400 }
      );
    }

    // Join the event
    const userEvent = await UserEventModel.joinEvent(userId, eventId, role);

    return NextResponse.json({
      message: "Successfully joined the event",
      userEvent,
    });
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
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const { eventId } = await params;

    // Check if user is joined to the event
    const isJoined = await UserEventModel.isUserJoinedEvent(userId, eventId);
    if (!isJoined) {
      return NextResponse.json(
        { error: "User is not joined to this event" },
        { status: 400 }
      );
    }

    // Leave the event
    const success = await UserEventModel.leaveEvent(userId, eventId);

    if (success) {
      return NextResponse.json({
        message: "Successfully left the event",
      });
    } else {
      return NextResponse.json(
        { error: "Failed to leave the event" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error leaving event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const { eventId } = await params;

    // Check if user is joined to the event
    const isJoined = await UserEventModel.isUserJoinedEvent(userId, eventId);
    const userRole = isJoined
      ? await UserEventModel.getUserRoleInEvent(userId, eventId)
      : null;

    return NextResponse.json({
      isJoined,
      role: userRole,
    });
  } catch (error) {
    console.error("Error checking join status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
