import { ObjectId } from "mongodb";
import { getDb } from "../config/mongodb";

export interface ITask {
  _id?: ObjectId;
  name: string;
  title?: string;
  slug: string;
  description: string;
  workbookId: ObjectId;
  assignedTo?: ObjectId[];
  status: string;
  priority?: string;
  dueDate?: Date;
  parentTask?: ObjectId;
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
      .find({ workbookId: new ObjectId(workbookId) })
      .sort({ createdAt: -1 })
      .toArray();
    return tasks;
  }

  static async getTaskById(taskId: string): Promise<ITask | null> {
    const db = await getDb();
    const task = await db
      .collection<ITask>(this.COLLECTION_NAME)
      .findOne({ _id: new ObjectId(taskId) });
    return task;
  }

  static async getSubtasks(parentTaskId: string): Promise<ITask[]> {
    const db = await getDb();
    const tasks = await db
      .collection<ITask>(this.COLLECTION_NAME)
      .find({ parentTask: new ObjectId(parentTaskId) })
      .sort({ createdAt: -1 })
      .toArray();
    return tasks;
  }

  static async createTask(data: Partial<ITask>): Promise<ITask> {
    const db = await getDb();
    const now = new Date();
    const taskToInsert: ITask = {
      _id: new ObjectId(),
      name: data.name || data.title!,
      title: data.title || data.name,
      slug: data.slug!,
      description: data.description!,
      workbookId:
        typeof data.workbookId === "string"
          ? new ObjectId(data.workbookId)
          : data.workbookId!,
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
    const db = await getDb();

    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    const result = await db
      .collection<ITask>(this.COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(taskId) },
        { $set: updateData },
        { returnDocument: "after" }
      );

    return result || null;
  }

  static async deleteTask(taskId: string): Promise<boolean> {
    const db = await getDb();

    const result = await db
      .collection<ITask>(this.COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(taskId) });
    return result.deletedCount > 0;
  }

  static async assignUserToTask(
    taskId: string,
    userId: string
  ): Promise<ITask | null> {
    const db = await getDb();

    const result = await db
      .collection<ITask>(this.COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(taskId) },
        {
          $addToSet: { assignedTo: new ObjectId(userId) },
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
    const db = await getDb();

    const result = await db
      .collection<ITask>(this.COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(taskId) },
        {
          $pull: { assignedTo: new ObjectId(userId) },
          $set: { updatedAt: new Date() },
        },
        { returnDocument: "after" }
      );

    return result || null;
  }

  static async getTaskBySlug(workbookId: string, slug: string) {
    const db = await getDb();
    return db
      .collection<ITask>(this.COLLECTION_NAME)
      .findOne({ workbookId: new ObjectId(workbookId), slug });
  }
}
