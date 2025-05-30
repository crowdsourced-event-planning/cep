import { ObjectId } from "mongodb";
import { getDb } from "../config/mongodb";
import {
  validateObjectId,
  toObjectId,
  createObjectId,
} from "../utils/validateObjectId";

export interface ITask {
  _id?: ObjectId;
  name: string;
  title?: string; // Keep both for backward compatibility
  description: string;
  workbookId: string;
  assignedTo?: string[];
  status: string;
  priority?: string;
  dueDate?: Date;
  parentTask?: string;
  customColumn?: object[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class TaskModel {
  private static readonly COLLECTION_NAME = "tasks";

  static async getTasksByWorkbookId(workbookId: string): Promise<ITask[]> {
    const db = await getDb();
    const tasks = await db
      .collection<ITask>(this.COLLECTION_NAME)
      .find({ workbookId })
      .sort({ createdAt: -1 })
      .toArray();
    return tasks;
  }

  static async getTaskById(taskId: string): Promise<ITask | null> {
    validateObjectId(taskId, "Task ID");
    const db = await getDb();
    const task = await db
      .collection<ITask>(this.COLLECTION_NAME)
      .findOne({ _id: toObjectId(taskId) });
    return task;
  }

  static async getSubtasks(parentTaskId: string): Promise<ITask[]> {
    const db = await getDb();
    const tasks = await db
      .collection<ITask>(this.COLLECTION_NAME)
      .find({ parentTask: parentTaskId })
      .sort({ createdAt: -1 })
      .toArray();
    return tasks;
  }
  static async createTask(data: Partial<ITask>): Promise<ITask> {
    const db = await getDb();
    const now = new Date();
    const taskToInsert: ITask = {
      _id: createObjectId(),
      name: data.name || data.title!,
      title: data.title || data.name,
      description: data.description!,
      workbookId: data.workbookId!,
      assignedTo: data.assignedTo || [],
      status: data.status || "pending",
      priority: data.priority || "medium",
      dueDate: data.dueDate,
      parentTask: data.parentTask,
      customColumn: data.customColumn || [],
      createdAt: now,
      updatedAt: now,
    };
    await db.collection<ITask>(this.COLLECTION_NAME).insertOne(taskToInsert);
    return taskToInsert;
  }

  static async updateTask(
    taskId: string,
    data: Partial<ITask>
  ): Promise<ITask | null> {
    validateObjectId(taskId, "Task ID");
    const db = await getDb();

    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    const result = await db
      .collection<ITask>(this.COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: toObjectId(taskId) },
        { $set: updateData },
        { returnDocument: "after" }
      );

    return result || null;
  }

  static async deleteTask(taskId: string): Promise<boolean> {
    validateObjectId(taskId, "Task ID");
    const db = await getDb();

    const result = await db
      .collection<ITask>(this.COLLECTION_NAME)
      .deleteOne({ _id: toObjectId(taskId) });
    return result.deletedCount > 0;
  }

  static async assignUserToTask(
    taskId: string,
    userId: string
  ): Promise<ITask | null> {
    validateObjectId(taskId, "Task ID");
    const db = await getDb();

    const result = await db
      .collection<ITask>(this.COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: toObjectId(taskId) },
        {
          $addToSet: { assignedTo: userId },
          $set: { updatedAt: new Date() },
        },
        { returnDocument: "after" }
      );

    return result || null;
  }

  static async removeUserFromTask(
    taskId: string,
    userId: string
  ): Promise<ITask | null> {
    validateObjectId(taskId, "Task ID");
    const db = await getDb();

    const result = await db
      .collection<ITask>(this.COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: toObjectId(taskId) },
        {
          $pull: { assignedTo: userId },
          $set: { updatedAt: new Date() },
        },
        { returnDocument: "after" }
      );

    return result || null;
  }
}
