import { NextRequest, NextResponse } from "next/server";
import { createWorkbook, getWorkbooksByEventId } from "@/lib/data/workbook";
import { getEventBySlug } from "@/lib/data/event";
import slugify from "slugify";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const body = await request.json();
  const { name, description } = body;

  // Validate required fields
  if (!name || !name.trim()) {
    return NextResponse.json(
      { error: "Workbook Name: Nama tidak boleh kosong." },
      { status: 400 }
    );
  }

  // Check if event exists by slug
  const event = await getEventBySlug(slug);
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  // Generate slug dari nama workbook
  const workbookSlug = slugify(name.trim(), { lower: true, strict: true });

  // Ambil semua workbook di event ini
  const allWorkbooks = await getWorkbooksByEventId(event._id?.toString() || "");

  // Validasi slug (hasil slugify nama) tidak boleh sama dalam satu event
  const isSlugExist = allWorkbooks.some(
    (w) =>
      slugify(w.name.trim(), { lower: true, strict: true }) === workbookSlug
  );
  if (isSlugExist) {
    return NextResponse.json(
      {
        error:
          "Workbook Name: Nama sudah dipakai, silakan gunakan nama yang lain.",
      },
      { status: 409 }
    );
  }

  // Create workbook data
  const workbookData = {
    name: name.trim(),
    description: description?.trim() || "",
    eventId: event._id,
    slug: workbookSlug,
  };

  // Create the workbook
  const newWorkbook = await createWorkbook(workbookData);

  return NextResponse.json(
    {
      success: true,
      workbook: {
        _id: newWorkbook._id?.toString(),
        slug: newWorkbook.slug,
        name: newWorkbook.name,
        description: newWorkbook.description,
        eventId: newWorkbook.eventId,
        createdAt: newWorkbook.createdAt,
        updatedAt: newWorkbook.updatedAt,
      },
      message: "Workbook created successfully",
    },
    { status: 201 }
  );
}
