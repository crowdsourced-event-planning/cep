import { NextResponse } from "next/server";
import { dbConnect } from "@/db/config/mongoose";

export async function GET() {
  try {
    // Test database connection
    const connection = await dbConnect();

    // Check if connection is ready
    if (connection.readyState !== 1) {
      throw new Error("Database connection not ready");
    }

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      timestamp: new Date().toISOString(),
      connectionState: connection.readyState,
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
