import { ObjectId } from "mongodb";
import { getDb } from "../config/mongodb";
import {
  validateObjectId,
  toObjectId,
  createObjectId,
} from "../utils/validateObjectId";

export interface IWorkbook {
  _id?: ObjectId;
  name: string;
  description: string;
  eventId: ObjectId; // Pastikan eventId adalah ObjectId
  createdBy: ObjectId; // Tambahkan createdBy sebagai ObjectId
  createdAt?: Date;
  updatedAt?: Date;
}

export class WorkbookModel {
  private static readonly COLLECTION_NAME = "workbooks";

  static async getWorkbooksByEventId(eventId: string): Promise<IWorkbook[]> {
    const db = await getDb();
    const workbooks = await db
      .collection<IWorkbook>(this.COLLECTION_NAME)
      .find({ eventId: toObjectId(eventId) })
      .sort({ createdAt: -1 })
      .toArray();
    return workbooks;
  }

  static async getWorkbookById(workbookId: string): Promise<IWorkbook | null> {
    validateObjectId(workbookId, "Workbook ID");
    const db = await getDb();
    const workbook = await db
      .collection<IWorkbook>(this.COLLECTION_NAME)
      .findOne({ _id: toObjectId(workbookId) });
    return workbook;
  }

  static async createWorkbook(data: Partial<IWorkbook>): Promise<IWorkbook> {
    const db = await getDb();
    const now = new Date();

    // Konversi eventId dan createdBy ke ObjectId
    const workbookToInsert: IWorkbook = {
      _id: createObjectId(),
      name: data.name!,
      description: data.description!,
      eventId:
        typeof data.eventId === "string"
          ? toObjectId(data.eventId)
          : data.eventId!, // Konversi eventId ke ObjectId jika perlu
      createdBy:
        typeof data.createdBy === "string"
          ? toObjectId(data.createdBy)
          : data.createdBy!, // Konversi createdBy ke ObjectId jika perlu
      createdAt: now,
      updatedAt: now,
    };

    await db
      .collection<IWorkbook>(this.COLLECTION_NAME)
      .insertOne(workbookToInsert);

    return workbookToInsert;
  }

  static async updateWorkbook(
    workbookId: string,
    data: Partial<IWorkbook>
  ): Promise<IWorkbook | null> {
    validateObjectId(workbookId, "Workbook ID");
    const db = await getDb();

    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    const result = await db
      .collection<IWorkbook>(this.COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: toObjectId(workbookId) },
        { $set: updateData },
        { returnDocument: "after" }
      );

    return result || null;
  }

  static async deleteWorkbook(workbookId: string): Promise<boolean> {
    validateObjectId(workbookId, "Workbook ID");
    const db = await getDb();

    const result = await db
      .collection<IWorkbook>(this.COLLECTION_NAME)
      .deleteOne({ _id: toObjectId(workbookId) });
    return result.deletedCount > 0;
  }

  static async create(workbookData: Partial<IWorkbook>): Promise<IWorkbook> {
    return this.createWorkbook(workbookData);
  }

  static async deleteMany(
    filter: Record<string, unknown> = {}
  ): Promise<boolean> {
    const db = await getDb();
    const result = await db
      .collection<IWorkbook>(this.COLLECTION_NAME)
      .deleteMany(filter);
    return result.acknowledged;
  }
}
