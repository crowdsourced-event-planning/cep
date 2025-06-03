import { NextResponse } from "next/server";
import { getDb } from "@/db/config/mongodb";
import { ObjectId } from "mongodb";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = await getDb();
  await db.collection("panitia_requests").deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ success: true });
}
