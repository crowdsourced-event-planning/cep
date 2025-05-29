import { getDb } from "@/lib/mongodb";
import { Filter, ObjectId } from "mongodb";
import { Task } from "@/types/task";

export async function getTaskById(taskId: string): Promise<Task | null> {
  const db = await getDb();
  try {
    const query: Filter<Task> = {
      _id: new ObjectId(taskId) as unknown as string,
    };
    return await db.collection<Task>("tasks").findOne(query);
  } catch (error) {
    console.error("Error fetching task:", error);
    return null;
  }
}

export async function getSubtasks(taskId: string): Promise<Task[]> {
  const db = await getDb();
  try {
    return await db
      .collection<Task>("tasks")
      .find({ parentTask: taskId })
      .toArray();
  } catch (error) {
    console.error("Error fetching subtasks:", error);
    return [];
  }
}
