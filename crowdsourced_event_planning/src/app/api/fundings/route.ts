import { NextRequest, NextResponse } from "next/server";
import { getEventById } from "@/lib/data/event";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json(
        { error: "Missing eventId parameter" },
        { status: 400 }
      );
    }

    // Ambil event dari DB
    const event = await getEventById(eventId);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Return hanya currentFunding
    return NextResponse.json({ currentFunding: event.currentFunding || 0 });
  } catch (error) {
    console.error("Error fetching funding:", error);
    return NextResponse.json(
      { error: "Failed to fetch funding" },
      { status: 500 }
    );
  }
}
