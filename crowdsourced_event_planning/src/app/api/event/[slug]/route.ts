import { NextRequest, NextResponse } from "next/server";
import EventModel from "@/db/models/EventModel";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const event = await EventModel.getBySlug(slug);

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...event,
        _id: event._id?.toString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}