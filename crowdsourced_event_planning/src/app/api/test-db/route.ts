import { NextResponse } from "next/server";
import { dbConnect } from "@/db/config/mongodb";

export async function GET() {
  try {
    // Test database connection
    const { client, db } = await dbConnect();

    // Check if connection is ready
    const adminDb = client.db().admin();
    const status = await adminDb.ping();

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      timestamp: new Date().toISOString(),
      databaseName: db.databaseName,
      pingResult: status,
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Database connection failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
