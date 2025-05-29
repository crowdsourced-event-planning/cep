import { NextResponse } from "next/server";
import { getDb } from "../../../lib/mongodb";

export async function GET() {
  try {
    const db = await getDb();
    const collections = await db.listCollections().toArray();
    return NextResponse.json({
      message: "Koneksi database berhasil",
      database: db.databaseName,
      collections: collections.map((c) => c.name),
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Koneksi database gagal", error: String(error) },
      { status: 500 }
    );
  }
}
