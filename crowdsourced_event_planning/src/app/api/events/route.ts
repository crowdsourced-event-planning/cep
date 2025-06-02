import { NextRequest, NextResponse } from "next/server";
import EventModel from "@/db/models/EventModel";
import { slugify } from "@/lib/utils/slugify";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = formData.get("title")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const location = formData.get("location")?.toString() || "";
    const startDate = formData.get("startDate")?.toString() || "";
    const endDate = formData.get("endDate")?.toString() || "";

    if (!title || !description || !location || !startDate || !endDate) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Generate slug dari title
    const slug = slugify(title);

    // Simpan ke database dengan slug
    const newEvent = await EventModel.create({
      title,
      slug, // simpan slug di database
      description,
      location,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const events = await EventModel.getAll();
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
