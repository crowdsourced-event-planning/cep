import { NextResponse } from "next/server";
import { updateTask, deleteTask } from "@/lib/data/task";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const resolvedParams = await params;
  const data = await req.json();
  const updated = await updateTask(resolvedParams.taskId, data);
  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const resolvedParams = await params;
  await deleteTask(resolvedParams.taskId);
  return NextResponse.json({ success: true });
}
