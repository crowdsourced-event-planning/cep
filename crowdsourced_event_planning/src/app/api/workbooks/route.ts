import { NextRequest, NextResponse } from "next/server";
import { WorkbookModel } from "@/db/models/WorkbookModel";
import { toObjectId } from "@/db/utils/validateObjectId";
import EventModel from "@/db/models/EventModel";

export async function POST(req: NextRequest) {
  try {
    const { name, description, eventId } = await req.json();
    const createdBy = req.headers.get("x-user-id"); // Get x-user-id from header

    // Input validation
    if (!name || !description || !eventId || !createdBy) {
      console.error("Missing required fields:", {
        name,
        description,
        eventId,
        createdBy,
      });
      return NextResponse.json(
        { error: "Name, description, event ID, and user ID are required" },
        { status: 400 }
      );
    }

    // Convert eventId and createdBy to ObjectId
    const newWorkbook = await WorkbookModel.createWorkbook({
      name,
      description,
      eventId: toObjectId(eventId),
      createdBy: toObjectId(createdBy),
    });

    return NextResponse.json(newWorkbook, { status: 201 });
  } catch (error) {
    console.error("Error creating workbook:", error);
    return NextResponse.json(
      { error: "Failed to create workbook" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { workbookId: string } }
) {
  try {
    const { name, description } = await request.json();
    const { workbookId } = params;

    // Input validation
    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      );
    }

    const workbook = await WorkbookModel.getWorkbookById(workbookId);
    if (!workbook) {
      return NextResponse.json(
        { error: "Workbook not found" },
        { status: 404 }
      );
    }

    // Event creator validation
    const event = await EventModel.getById(workbook.eventId.toString());
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const userId = request.cookies.get("x-user-id")?.value;
    if (!userId || event.createdBy !== userId) {
      return NextResponse.json(
        { error: "You are not authorized to update this workbook" },
        { status: 403 }
      );
    }

    const updatedWorkbook = await WorkbookModel.updateWorkbook(workbookId, {
      name,
      description,
    });

    return NextResponse.json(updatedWorkbook);
  } catch (error) {
    console.error("Error updating workbook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
