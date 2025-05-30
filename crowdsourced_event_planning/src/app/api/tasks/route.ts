import { NextRequest, NextResponse } from "next/server";
import {
  createTask,
  getTasksByWorkbookId,
  updateTask,
  deleteTask,
} from "@/lib/data/task";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workbookId = searchParams.get("workbookId");

    if (!workbookId) {
      return NextResponse.json(
        { error: "Missing workbookId parameter" },
        { status: 400 }
      );
    }

    const tasks = await getTasksByWorkbookId(workbookId);
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      workbookId,
      priority,
      status,
      assignedTo,
      dueDate,
      tags,
    } = body;

    if (!title || !workbookId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const taskData = {
      title,
      description: description || "",
      workbookId,
      priority: priority || "medium",
      status: status || "pending",
      assignedTo: assignedTo || "",
      dueDate: dueDate || "",
      tags: tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newTask = await createTask(taskData);
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ error: "Missing task ID" }, { status: 400 });
    }

    const updatedTask = await updateTask(_id, {
      ...updateData,
      updatedAt: new Date().toISOString(),
    });

    if (!updatedTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("id");

    if (!taskId) {
      return NextResponse.json({ error: "Missing task ID" }, { status: 400 });
    }

    const deleted = await deleteTask(taskId);

    if (!deleted) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
