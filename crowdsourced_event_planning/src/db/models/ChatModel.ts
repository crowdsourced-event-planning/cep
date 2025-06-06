import { ObjectId } from "mongodb";
import { getDb } from "../config/mongodb";

export interface IChat {
  _id?: ObjectId;
  eventId?: string;
  workbookId?: string;
  taskId?: string;
  message: string;
  sender: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ChatModel {
  private static readonly COLLECTION_NAME = "chats";

  static async getChatsByEventId(eventId: string): Promise<IChat[]> {
    const db = await getDb();
    const chats = await db
      .collection<IChat>(this.COLLECTION_NAME)
      .find({ eventId })
      .sort({ createdAt: 1 })
      .toArray();
    return chats;
  }

  static async getChatsByWorkbookId(workbookId: string): Promise<IChat[]> {
    const db = await getDb();
    const chats = await db
      .collection<IChat>(this.COLLECTION_NAME)
      .find({ workbookId })
      .sort({ createdAt: 1 })
      .toArray();
    return chats;
  }

  static async getChatsByTaskId(taskId: string): Promise<IChat[]> {
    const db = await getDb();
    const chats = await db
      .collection<IChat>(this.COLLECTION_NAME)
      .find({ taskId })
      .sort({ createdAt: 1 })
      .toArray();
    return chats;
  }

  static async createMessage(data: Partial<IChat>): Promise<IChat> {
    const db = await getDb();
    const now = new Date();
    const messageToInsert: IChat = {
      _id: new ObjectId(),
      eventId: data.eventId,
      workbookId: data.workbookId,
      taskId: data.taskId,
      message: data.message!,
      sender: data.sender!,
      createdAt: now,
      updatedAt: now,
    };
    await db.collection<IChat>(this.COLLECTION_NAME).insertOne(messageToInsert);
    return messageToInsert;
  }

  static async deleteMessage(messageId: string): Promise<boolean> {
    const db = await getDb();
    const result = await db
      .collection<IChat>(this.COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(messageId) });
    return result.deletedCount > 0;
  }
}
