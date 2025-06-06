import { NextResponse } from "next/server";
import { getWorkbooksByEventId, createWorkbook } from "@/lib/data/workbook";
import { getEventById } from "@/lib/data/event";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get("eventId");

  try {
    if (!eventId) {
      return NextResponse.json(
        { error: "eventId diperlukan" },
        { status: 400 }
      );
    }

    const workbooks = await getWorkbooksByEventId(eventId);
    return NextResponse.json(
      workbooks.map((workbook) => ({
        ...workbook,
        _id: workbook._id?.toString(),
      }))
    );
  } catch (error) {
    console.error("Error fetching workbooks:", error);
    return NextResponse.json(
      { error: "Gagal mengambil workbook" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const userId = request.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json(
      { error: "Autentikasi diperlukan" },
      { status: 401 }
    );
  }

  const data = await request.json();
  const { name, description, eventId } = data;

  if (!name || !eventId) {
    return NextResponse.json(
      { error: "Name dan eventId diperlukan" },
      { status: 400 }
    );
  }

  try {
    // Check if event exists and if user is the creator
    const event = await getEventById(eventId);
    if (!event || event.creator?.toString() !== userId) {
      return NextResponse.json(
        { error: "Anda tidak berwenang untuk membuat workbook di event ini" },
        { status: 403 }
      );
    }

    // Create the workbook using the model
    const newWorkbook = await createWorkbook({
      name,
      description: description || "",
      eventId,
    });

    return NextResponse.json(
      { id: newWorkbook._id?.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating workbook:", error);
    return NextResponse.json(
      { error: "Gagal membuat workbook" },
      { status: 500 }
    );
  }
}
