import { NextRequest, NextResponse } from "next/server";
import { createWorkbook } from "@/lib/data/workbook";
import { getEventById } from "@/lib/data/event";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const body = await request.json();
    const { name, description } = body;

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Workbook name is required" },
        { status: 400 }
      );
    }

    // Check if event exists
    const event = await getEventById(eventId);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Create workbook data
    const workbookData = {
      name: name.trim(),
      description: description?.trim() || "",
      eventId: eventId,
    };

    // Create the workbook
    const newWorkbook = await createWorkbook(workbookData);

    return NextResponse.json(
      {
        success: true,
        workbook: {
          _id: newWorkbook._id?.toString(),
          name: newWorkbook.name,
          description: newWorkbook.description,
          eventId: newWorkbook.eventId,
          createdAt: newWorkbook.createdAt,
          updatedAt: newWorkbook.updatedAt,
        },
        message: "Workbook created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating workbook:", error);
    return NextResponse.json(
      {
        error: "Failed to create workbook",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
