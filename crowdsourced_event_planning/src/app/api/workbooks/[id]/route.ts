import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { name, description } = await request.json();
  if (!id || !name) {
    return NextResponse.json(
      { error: "Workbook ID and name required" },
      { status: 400 }
    );
  }
  const db = await getDb();
  const result = await db
    .collection("workbooks")
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { name, description, updatedAt: new Date() } },
      { returnDocument: "after" }
    );
  if (result) {
    return NextResponse.json({ success: true, workbook: result });
  }
  return NextResponse.json({ error: "Workbook not found" }, { status: 404 });
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  if (!id) {
    return NextResponse.json(
      { error: "Workbook ID required" },
      { status: 400 }
    );
  }
  const db = await getDb();
  const result = await db
    .collection("workbooks")
    .deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 1) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: "Workbook not found" }, { status: 404 });
}
