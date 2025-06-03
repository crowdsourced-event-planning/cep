import { getDb } from "../config/mongodb";
import slugify from "slugify";
import { ObjectId } from "mongodb";

export interface IWorkbook {
  _id: ObjectId;
  name: string;
  slug: string;
  description: string;
  eventId: ObjectId;
  createdAt: Date;
  updatedAt?: Date;
}

export class WorkbookModel {
  private static readonly COLLECTION_NAME = "workbooks";

  static async getWorkbooksByEventId(eventId: string): Promise<IWorkbook[]> {
    const db = await getDb();
    const workbooks = await db
      .collection<IWorkbook>(this.COLLECTION_NAME)
      .find({ eventId: new ObjectId(eventId) })
      .sort({ createdAt: -1 })
      .toArray();
    return workbooks;
  }

  static async getWorkbookById(workbookId: string): Promise<IWorkbook | null> {
    const db = await getDb();
    const workbook = await db
      .collection<IWorkbook>(this.COLLECTION_NAME)
      .findOne({ _id: new ObjectId(workbookId) });
    return workbook;
  }

  static async getWorkbookBySlug(slug: string): Promise<IWorkbook | null> {
    const db = await getDb();
    return db.collection<IWorkbook>("workbooks").findOne({ slug });
  }

  static async createWorkbook(data: Partial<IWorkbook>): Promise<IWorkbook> {
    const db = await getDb();
    const now = new Date();
    const slug =
      data.slug ||
      slugify(data.name || "", { lower: true, strict: true }) ||
      new ObjectId().toString();

    const workbookToInsert: IWorkbook = {
      _id: new ObjectId(),
      name: data.name!,
      slug,
      description: data.description!,
      eventId:
        typeof data.eventId === "string"
          ? new ObjectId(data.eventId)
          : data.eventId!,
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
    const db = await getDb();

    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    const result = await db
      .collection<IWorkbook>(this.COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(workbookId) },
        { $set: updateData },
        { returnDocument: "after" }
      );

    return result || null;
  }

  static async deleteWorkbook(workbookId: string): Promise<boolean> {
    const db = await getDb();

    const result = await db
      .collection<IWorkbook>(this.COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(workbookId) });
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
