import { getDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { Workbook } from "@/types/workbook";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get("eventId");

  const db = await getDb();

  try {
    if (!eventId) {
      return NextResponse.json(
        { error: "eventId diperlukan" },
        { status: 400 }
      );
    }

    const workbooks = await db
      .collection<Workbook>("workbooks")
      .find({ eventId: new ObjectId(eventId) })
      .toArray();
    return NextResponse.json(
      workbooks.map((workbook) => ({
        ...workbook,
        _id: workbook._id.toString(),
        eventId: workbook.eventId.toString(),
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

  const db = await getDb();
  const event = await db
    .collection("events")
    .findOne({ _id: new ObjectId(eventId) });
  if (!event || event.creator !== userId) {
    return NextResponse.json(
      { error: "Anda tidak berwenang untuk membuat workbook di event ini" },
      { status: 403 }
    );
  }

  const newWorkbook: Partial<Workbook> = {
    name,
    description: description || "",
    eventId: new ObjectId(eventId),
    createdAt: new Date(),
  };

  try {
    const result = await db
      .collection<Workbook>("workbooks")
      .insertOne(newWorkbook as Workbook);
    return NextResponse.json(
      { id: result.insertedId.toString() },
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
