import { NextResponse } from "next/server";
import { getDb } from "@/db/config/mongodb";
import { ObjectId } from "mongodb";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const db = await getDb();
  await db
    .collection("panitia_requests")
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: "approved", approvedAt: new Date() } }
    );
  // Tambahkan logic untuk assign user ke task/panitia jika perlu
  return NextResponse.json({ success: true });
}
