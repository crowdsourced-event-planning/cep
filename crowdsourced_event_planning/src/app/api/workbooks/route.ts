// import { getDb } from "@/lib/mongodb";
// import { NextResponse } from "next/server";
// import { ObjectId } from "mongodb";
// import { Workbook } from "@/types/workbook";

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const eventId = searchParams.get("eventId");

//   const db = await getDb();

//   try {
//     if (!eventId) {
//       return NextResponse.json(
//         { error: "eventId diperlukan" },
import { NextRequest, NextResponse } from "next/server";
import { WorkbookModel } from "@/db/models/WorkbookModel";
import { toObjectId } from "@/db/utils/validateObjectId";
import EventModel from "@/db/models/EventModel";

export async function POST(req: NextRequest) {
  try {
    const { name, description, eventId } = await req.json();
    const createdBy = req.headers.get("x-user-id"); // Get x-user-id from header

    // Input validation
    if (!name || !description || !eventId || !createdBy) {
      console.error("Missing required fields:", {
        name,
        description,
        eventId,
        createdBy,
      });
      return NextResponse.json(
        { error: "Name, description, event ID, and user ID are required" },
        { status: 400 }
      );
    }

    //     const workbooks = await db
    //       .collection<Workbook>("workbooks")
    //       .find({ eventId: new ObjectId(eventId) })
    //       .toArray();
    //     return NextResponse.json(
    //       workbooks.map((workbook) => ({
    //         ...workbook,
    //         _id: workbook._id.toString(),
    //         eventId: workbook.eventId.toString(),
    //       }))
    //     );
    //   } catch (error) {
    //     console.error("Error fetching workbooks:", error);
    //     return NextResponse.json(
    //       { error: "Gagal mengambil workbook" },
    //       { status: 500 }
    //     );
    //   }
    // }

    // export async function POST(request: Request) {
    //   const userId = request.headers.get("x-user-id");
    //   if (!userId) {
    //     return NextResponse.json(
    //       { error: "Autentikasi diperlukan" },
    //       { status: 401 }
    //     );
    //   }

    //   const data = await request.json();
    //   const { name, description, eventId } = data;

    //   if (!name || !eventId) {
    //     return NextResponse.json(
    //       { error: "Name dan eventId diperlukan" },
    //       { status: 400 }
    //     );
    //   }

    //   const db = await getDb();
    //   const event = await db
    //     .collection("events")
    //     .findOne({ _id: new ObjectId(eventId) });
    //   if (!event || event.creator !== userId) {
    //     return NextResponse.json(
    //       { error: "Anda tidak berwenang untuk membuat workbook di event ini" },
    //       { status: 403 }
    //     );
    //   }

    //   const newWorkbook: Partial<Workbook> = {
    //     name,
    //     description: description || "",
    //     eventId: new ObjectId(eventId),
    //     createdAt: new Date(),
    //   };

    //   try {
    //     const result = await db
    //       .collection<Workbook>("workbooks")
    //       .insertOne(newWorkbook as Workbook);
    //     return NextResponse.json(
    //       { id: result.insertedId.toString() },
    //       { status: 201 }
    //     );
    //   } catch (error) {
    //     console.error("Error creating workbook:", error);
    //     return NextResponse.json(
    //       { error: "Gagal membuat workbook" },
    // Convert eventId and createdBy to ObjectId
    const newWorkbook = await WorkbookModel.createWorkbook({
      name,
      description,
      eventId: toObjectId(eventId),
      createdBy: toObjectId(createdBy),
    });

    return NextResponse.json(newWorkbook, { status: 201 });
  } catch (error) {
    console.error("Error creating workbook:", error);
    return NextResponse.json(
      { error: "Failed to create workbook" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { workbookId: string } }
) {
  try {
    const { name, description } = await request.json();
    const { workbookId } = params;

    // Input validation
    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      );
    }

    const workbook = await WorkbookModel.getWorkbookById(workbookId);
    if (!workbook) {
      return NextResponse.json(
        { error: "Workbook not found" },
        { status: 404 }
      );
    }

    // Event creator validation
    const event = await EventModel.getById(workbook.eventId.toString());
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const userId = request.cookies.get("x-user-id")?.value;
    if (!userId || event.createdBy !== userId) {
      return NextResponse.json(
        { error: "You are not authorized to update this workbook" },
        { status: 403 }
      );
    }

    const updatedWorkbook = await WorkbookModel.updateWorkbook(workbookId, {
      name,
      description,
    });

    return NextResponse.json(updatedWorkbook);
  } catch (error) {
    console.error("Error updating workbook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
