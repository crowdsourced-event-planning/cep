import { getDb } from "@/lib/mongodb";
import { Filter, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { Task } from "@/types/task";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workbookId = searchParams.get("workbookId");

  const db = await getDb();

  try {
    if (!workbookId) {
      return NextResponse.json(
        { error: "workbookId diperlukan" },
        { status: 400 }
      );
    }
    const tasks = await db
      .collection<Task>("tasks")
      .find({ workbookId })
      .toArray();
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Gagal mengambil task" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const data = await request.json();
  const {
    name,
    description,
    workbookId,
    parentTask,
    assignedTo,
    status,
    dueDate,
    customColumn,
  } = data;

  if (!name || !workbookId) {
    return NextResponse.json(
      { error: "Name dan workbookId diperlukan" },
      { status: 400 }
    );
  }

  const db = await getDb();
  const newTask: Partial<Task> = {
    name,
    description: description || "",
    workbookId,
    parentTask: parentTask || undefined,
    assignedTo: assignedTo || [],
    status: status || "pending",
    dueDate: dueDate ? new Date(dueDate) : undefined,
    customColumn: customColumn || [],
    createdAt: new Date(),
  };

  try {
    const result = await db
      .collection<Task>("tasks")
      .insertOne(newTask as Task);
    return NextResponse.json(
      { id: result.insertedId.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Gagal membuat task" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const data = await request.json();
  const { name, description, status, assignedTo, dueDate, customColumn } = data;

  if (!params.id || typeof params.id !== "string") {
    return NextResponse.json({ error: "ID task diperlukan" }, { status: 400 });
  }
  if (!ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: "ID task tidak valid" }, { status: 400 });
  }

  const db = await getDb();
  const updateData: Partial<Task> = {
    name: name || undefined,
    description: description || undefined,
    status: status || undefined,
    assignedTo: assignedTo || undefined,
    dueDate: dueDate ? new Date(dueDate) : undefined,
    customColumn: customColumn || undefined,
  };

  try {
    const query: Filter<Task> = {
      _id: new ObjectId(params.id) as unknown as string,
    };
    const result = await db
      .collection<Task>("tasks")
      .updateOne(query, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Task tidak ditemukan" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Task berhasil diperbarui" });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui task" },
      { status: 500 }
    );
  }
}
