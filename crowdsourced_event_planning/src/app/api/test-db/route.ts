import { NextResponse } from "next/server";
import { dbConnect, COLLECTIONS, ensureCollections } from "@/db/config/mongodb";

export async function GET() {
  try {
    // Test database connection
    const { client, db } = await dbConnect();

    // Check if connection is ready
    const adminDb = client.db().admin();
    const status = await adminDb.ping();

    // Ensure all collections exist
    await ensureCollections();

    // Get counts for each collection
    const collectionStats: Record<string, { name: string; count: number }> = {};
    for (const [key, name] of Object.entries(COLLECTIONS)) {
      const count = await db.collection(name).countDocuments();
      collectionStats[key] = { name, count };
    }

    // Get list of all collections in the database
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      timestamp: new Date().toISOString(),
      databaseName: db.databaseName,
      pingResult: status,
      collections: collectionStats,
      allCollections: collectionNames,
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
