import { TaskModel } from "@/db/models/TaskModel";
import { ITask } from "@/db/schemas/task.schema";

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
}
