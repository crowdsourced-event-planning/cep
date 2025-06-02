import { NextRequest, NextResponse } from "next/server";
import { WorkbookModel } from "@/db/models/WorkbookModel";
import { toObjectId } from "@/db/utils/validateObjectId";

export async function POST(req: NextRequest) {
  try {
    const { name, description, eventId } = await req.json();
    const createdBy = req.headers.get("x-user-id"); // Ambil x-user-id dari header

    if (!createdBy || !eventId) {
      console.error("Missing required fields:", { createdBy, eventId });
      return NextResponse.json(
        { message: "User ID and Event ID are required" },
        { status: 400 }
      );
    }

    // Konversi eventId dan createdBy ke ObjectId
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
      { message: "Failed to create workbook" },
      { status: 500 }
    );
  }
}
