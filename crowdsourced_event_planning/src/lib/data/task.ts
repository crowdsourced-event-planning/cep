import { TaskModel, ITask } from "@/db/models/TaskModel";

export async function getTasksByWorkbookId(
  workbookId: string
): Promise<ITask[]> {
  return await TaskModel.getTasksByWorkbookId(workbookId);
}

export async function getTaskById(taskId: string): Promise<ITask | null> {
  return await TaskModel.getTaskById(taskId);
}

export async function getSubtasks(parentTaskId: string): Promise<ITask[]> {
  return await TaskModel.getSubtasks(parentTaskId);
}

export async function createTask(taskData: Partial<ITask>): Promise<ITask> {
  return await TaskModel.createTask(taskData);
}

export async function updateTask(
  taskId: string,
  taskData: Partial<ITask>
): Promise<ITask | null> {
  return await TaskModel.updateTask(taskId, taskData);
}

export async function deleteTask(taskId: string): Promise<boolean> {
  return await TaskModel.deleteTask(taskId);
}

export async function assignUserToTask(
  taskId: string,
  userId: string
): Promise<ITask | null> {
  return await TaskModel.assignUserToTask(taskId, userId);
}

export async function removeUserFromTask(
  taskId: string,
  userId: string
): Promise<ITask | null> {
  return await TaskModel.removeUserFromTask(taskId, userId);

  // import { getDb } from "@/lib/mongodb";
  // import { ObjectId } from "mongodb";
  // import { Task } from "@/types/task";

  // export async function getTaskById(taskId: string): Promise<Task | null> {
  //   const db = await getDb();
  //   try {
  //     return await db
  //       .collection<Task>("tasks")
  //       .findOne({ _id: new ObjectId(taskId) });
  //   } catch (error) {
  //     console.error("Error fetching task:", error);
  //     return null;
  //   }
  // }

  // export async function getSubtasks(taskId: string): Promise<Task[]> {
  //   const db = await getDb();
  //   try {
  //     return await db
  //       .collection<Task>("tasks")
  //       .find({ parentTask: new ObjectId(taskId) })
  //       .toArray();
  //   } catch (error) {
  //     console.error("Error fetching subtasks:", error);
  //     return [];
  //   }
}
