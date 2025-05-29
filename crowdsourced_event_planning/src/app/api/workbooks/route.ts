import { getDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";
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
      .find({ eventId })
      .toArray();
    return NextResponse.json(workbooks);
  } catch (error) {
    console.error("Error fetching workbooks:", error);
    return NextResponse.json(
      { error: "Gagal mengambil workbook" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const data = await request.json();
  const { name, description, eventId } = data;

  if (!name || !eventId) {
    return NextResponse.json(
      { error: "Name dan eventId diperlukan" },
      { status: 400 }
    );
  }

  const db = await getDb();
  const newWorkbook: Partial<Workbook> = {
    name,
    description: description || "",
    eventId,
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
