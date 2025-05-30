import { NextResponse } from "next/server";
import EventModel from "@/db/models/EventModel";
import UserModel from "@/db/models/UserModel";
import { WorkbookModel } from "@/db/models/WorkbookModel";

export async function POST() {
  try {
    // Create sample user
    const sampleUser = await UserModel.create({
      name: "John Doe",
      email: "john@example.com",
      password: "password123", // Note: In production, this should be hashed
    }); // Create sample event
    const sampleEvent = await EventModel.create({
      title: "Tech Conference 2024",
      description: "A conference about the latest in technology",
      location: "San Francisco, CA",
      startDate: new Date("2024-12-15"),
      endDate: new Date("2024-12-15"),
      startTime: "09:00",
      endTime: "17:00",
      typeEvent: "conference",
      targetFunding: 10000,
      currentFunding: 0,
      status: "active",
      creator: sampleUser._id?.toString() || "",
      budget: [],
      gallery: ["https://via.placeholder.com/400x200?text=Tech+Conference"],
      documents: [],
      cancelReason: "",
    }); // Create sample workbooks
    const sampleWorkbook1 = await WorkbookModel.createWorkbook({
      name: "Event Planning",
      description: "Main workbook for planning the tech conference",
      eventId: sampleEvent._id?.toString() || "",
    });

    const sampleWorkbook2 = await WorkbookModel.createWorkbook({
      name: "Marketing Materials",
      description: "Workbook for managing marketing and promotional materials",
      eventId: sampleEvent._id?.toString() || "",
    });
    return NextResponse.json({
      success: true,
      message: "Sample data created successfully",
      data: {
        user: sampleUser._id,
        event: sampleEvent._id,
        workbook1: sampleWorkbook1._id,
        workbook2: sampleWorkbook2._id,
      },
    });
  } catch (error) {
    console.error("Error creating sample data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create sample data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    // Clear all sample data
    await Promise.all([
      EventModel.deleteMany(),
      UserModel.deleteMany(),
      WorkbookModel.deleteMany(),
    ]);

    return NextResponse.json({
      success: true,
      message: "All sample data cleared",
    });
  } catch (error) {
    console.error("Error clearing sample data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to clear sample data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
