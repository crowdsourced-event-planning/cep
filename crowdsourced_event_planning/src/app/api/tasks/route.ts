import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
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
      .find({ workbookId: new ObjectId(workbookId) })
      .toArray();
    return NextResponse.json(
      tasks.map((task) => ({
        ...task,
        _id: task._id.toString(),
        workbookId: task.workbookId.toString(),
        parentTask: task.parentTask?.toString(),
        assignedTo: task.assignedTo.map((id) => id.toString()),
      }))
    );
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Gagal mengambil task" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const userId = request.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json(
      { error: "Autentikasi diperlukan" },
      { status: 401 }
    );
  }

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
  const workbook = await db
    .collection("workbooks")
    .findOne({ _id: new ObjectId(workbookId) });
  if (!workbook) {
    console.log(`Workbook tidak ditemukan untuk workbookId: ${workbookId}`);
    return NextResponse.json(
      { error: "Workbook tidak ditemukan" },
      { status: 404 }
    );
  }

  console.log(`Workbook ditemukan: ${JSON.stringify(workbook)}`);
  console.log(`Mencoba mencari event dengan eventId: ${workbook.eventId}`);

  // Convert workbook.eventId to ObjectId if it's a string
  const eventId =
    typeof workbook.eventId === "string"
      ? new ObjectId(workbook.eventId)
      : workbook.eventId;

  console.log(`Looking for event with ID: ${eventId}`);

  const event = await db.collection("events").findOne({ _id: eventId });

  if (!event) {
    console.log(`Event tidak ditemukan untuk eventId: ${eventId}`);
    return NextResponse.json(
      { error: "Event tidak ditemukan untuk workbook ini" },
      { status: 404 }
    );
  }

  console.log(`Event ditemukan: ${JSON.stringify(event)}`);
  console.log(
    `Membandingkan event.creator: ${event.creator} dengan userId: ${userId}`
  );

  const eventCreator = event.creator.trim();
  const normalizedUserId = userId.trim();
  if (eventCreator !== normalizedUserId) {
    console.log(
      `Otorisasi gagal: event.creator (${eventCreator}) tidak sama dengan userId (${normalizedUserId})`
    );
    return NextResponse.json(
      { error: "Anda tidak berwenang untuk menambah task di workbook ini" },
      { status: 403 }
    );
  }

  const newTask: Partial<Task> = {
    name,
    description: description || "",
    workbookId: new ObjectId(workbookId),
    parentTask: parentTask ? new ObjectId(parentTask) : undefined,
    assignedTo: assignedTo.map((id: string) => new ObjectId(id)),
    status: status || "pending",
    dueDate: dueDate ? new Date(dueDate) : undefined,
    customColumn: customColumn || [],
    createdAt: new Date(),
  };

  try {
    const result = await db
      .collection<Task>("tasks")
      .insertOne(newTask as Task);
    console.log(
      `Task created successfully with ID: ${result.insertedId.toString()}`
    );
    return NextResponse.json(
      { id: result.insertedId.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Gagal membuat task" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const userId = request.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json(
      { error: "Autentikasi diperlukan" },
      { status: 401 }
    );
  }

  const data = await request.json();
  const { id, name, description, status, assignedTo, dueDate, customColumn } =
    data;

  if (!id) {
    return NextResponse.json({ error: "ID task diperlukan" }, { status: 400 });
  }

  const db = await getDb();
  const task = await db
    .collection<Task>("tasks")
    .findOne({ _id: new ObjectId(id) });
  if (!task) {
    return NextResponse.json(
      { error: "Task tidak ditemukan" },
      { status: 404 }
    );
  }

  const workbook = await db
    .collection("workbooks")
    .findOne({ _id: task.workbookId });
  if (!workbook) {
    return NextResponse.json(
      { error: "Workbook tidak ditemukan" },
      { status: 404 }
    );
  }

  // Convert workbook.eventId to ObjectId if it's a string
  const eventId =
    typeof workbook.eventId === "string"
      ? new ObjectId(workbook.eventId)
      : workbook.eventId;

  const event = await db.collection("events").findOne({ _id: eventId });

  if (!event) {
    return NextResponse.json(
      { error: "Event tidak ditemukan untuk workbook ini" },
      { status: 404 }
    );
  }

  const eventCreator = event.creator.trim();
  const normalizedUserId = userId.trim();
  if (eventCreator !== normalizedUserId) {
    return NextResponse.json(
      { error: "Anda tidak berwenang untuk mengedit task ini" },
      { status: 403 }
    );
  }

  const updateData: Partial<Task> = {
    name: name || undefined,
    description: description || undefined,
    status: status || undefined,
    assignedTo: assignedTo
      ? assignedTo.map((id: string) => new ObjectId(id))
      : undefined,
    dueDate: dueDate ? new Date(dueDate) : undefined,
    customColumn: customColumn || undefined,
  };

  try {
    const result = await db
      .collection<Task>("tasks")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });
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

//
// import { NextRequest, NextResponse } from "next/server";
// import {
//   createTask,
//   getTasksByWorkbookId,
//   updateTask,
//   deleteTask,
// } from "@/lib/data/task";

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const workbookId = searchParams.get("workbookId");

//     if (!workbookId) {
//       return NextResponse.json(
//         { error: "Missing workbookId parameter" },
//         { status: 400 }
//       );
//     }

//     const tasks = await getTasksByWorkbookId(workbookId);
//     return NextResponse.json(tasks);
//   } catch (error) {
//     console.error("Error fetching tasks:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch tasks" },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const {
//       title,
//       description,
//       workbookId,
//       priority,
//       status,
//       assignedTo,
//       dueDate,
//       tags,
//     } = body;

//     if (!title || !workbookId) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     const taskData = {
//       title,
//       description: description || "",
//       workbookId,
//       priority: priority || "medium",
//       status: status || "pending",
//       assignedTo: assignedTo || "",
//       dueDate: dueDate || "",
//       tags: tags || [],
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     const newTask = await createTask(taskData);
//     return NextResponse.json(newTask, { status: 201 });
//   } catch (error) {
//     console.error("Error creating task:", error);
//     return NextResponse.json(
//       { error: "Failed to create task" },
//       { status: 500 }
//     );
//   }
// }

// export async function PUT(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const { _id, ...updateData } = body;

//     if (!_id) {
//       return NextResponse.json({ error: "Missing task ID" }, { status: 400 });
//     }

//     const updatedTask = await updateTask(_id, {
//       ...updateData,
//       updatedAt: new Date().toISOString(),
//     });

//     if (!updatedTask) {
//       return NextResponse.json({ error: "Task not found" }, { status: 404 });
//     }

//     return NextResponse.json(updatedTask);
//   } catch (error) {
//     console.error("Error updating task:", error);
//     return NextResponse.json(
//       { error: "Failed to update task" },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const taskId = searchParams.get("id");

//     if (!taskId) {
//       return NextResponse.json({ error: "Missing task ID" }, { status: 400 });
//     }

//     const deleted = await deleteTask(taskId);

//     if (!deleted) {
//       return NextResponse.json({ error: "Task not found" }, { status: 404 });
//     }

//     return NextResponse.json({ message: "Task deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting task:", error);
//     return NextResponse.json(
//       { error: "Failed to delete task" },
//       { status: 500 }
//     );
//   }
// }
