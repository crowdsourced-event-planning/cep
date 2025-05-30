import { NextRequest, NextResponse } from "next/server";
import {
  createChat,
  getChatsByWorkbookId,
  getChatsByTaskId,
} from "@/lib/data/chat";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workbookId = searchParams.get("workbookId");
    const taskId = searchParams.get("taskId");

    if (workbookId) {
      const chats = await getChatsByWorkbookId(workbookId);
      return NextResponse.json(chats);
    }

    if (taskId) {
      const chats = await getChatsByTaskId(taskId);
      return NextResponse.json(chats);
    }

    return NextResponse.json(
      { error: "Missing workbookId or taskId parameter" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json(
      { error: "Failed to fetch chats" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, userId, workbookId, taskId } = body;

    if (!message || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!workbookId && !taskId) {
      return NextResponse.json(
        { error: "Must specify either workbookId or taskId" },
        { status: 400 }
      );
    }

    const chatData = {
      message,
      userId,
      workbookId: workbookId || undefined,
      taskId: taskId || undefined,
      createdAt: new Date(),
    };

    const newChat = await createChat(chatData);
    return NextResponse.json(newChat, { status: 201 });
  } catch (error) {
    console.error("Error creating chat:", error);
    return NextResponse.json(
      { error: "Failed to create chat" },
      { status: 500 }
    );
  }
}
