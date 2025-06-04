import { ObjectId } from "mongodb";
import { getDb } from "../config/mongodb";
import { generateUniqueSlug, isValidObjectId } from "../../lib/utils/slug";

export interface IEvent {
  _id?: ObjectId;
  title: string;
  slug: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  typeEvent: string;
  status: string;
  targetFunding: number;
  currentFunding: number;
  creator: ObjectId;
  participants: string[];
  budget: object[];
  gallery: string[];
  documents: string[];
  cancelReason: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default class EventModel {
  private static readonly COLLECTION_NAME = "events";

  static async getAll(): Promise<IEvent[]> {
    const db = await getDb();
    return db.collection<IEvent>(this.COLLECTION_NAME).find({}).toArray();
  }

  static async getEventsByCreator(creatorId: string): Promise<IEvent[]> {
    const db = await getDb();
    return db
      .collection<IEvent>(this.COLLECTION_NAME)
      .find({ creator: new ObjectId(creatorId) })
      .toArray();
  }

  static async create(data: Partial<IEvent>): Promise<IEvent> {
    const db = await getDb();
    const now = new Date();

    // Generate unique slug if not provided
    if (!data.slug && data.title) {
      const existingSlugs = await this.getAllSlugs();
      data.slug = generateUniqueSlug(data.title, existingSlugs);
    }

    // Pastikan creator adalah ObjectId
    if (data.creator && typeof data.creator === "string") {
      data.creator = new ObjectId(data.creator);
    }

    const eventData = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db
      .collection<IEvent>(this.COLLECTION_NAME)
      .insertOne(eventData as IEvent);

    const createdEvent = await db
      .collection<IEvent>(this.COLLECTION_NAME)
      .findOne({ _id: result.insertedId });

    if (!createdEvent) {
      throw new Error("Failed to create event");
    }

    return createdEvent;
  }

  static async getById(id: string): Promise<IEvent | null> {
    const db = await getDb();
    return db
      .collection<IEvent>(this.COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });
  }

  static async update(
    id: string,
    data: Partial<IEvent>
  ): Promise<IEvent | null> {
    const db = await getDb();

    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    const result = await db
      .collection<IEvent>(this.COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: "after" }
      );

    return result || null;
  }

  static async delete(id: string): Promise<string> {
    const db = await getDb();
    await db
      .collection<IEvent>(this.COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(id) });

    return "Event deleted";
  }

  static async deleteMany(
    filter: Record<string, unknown> = {}
  ): Promise<boolean> {
    const db = await getDb();
    const result = await db
      .collection<IEvent>(this.COLLECTION_NAME)
      .deleteMany(filter);
    return result.acknowledged;
  }

  // Slug-related methods
  static async getBySlug(slug: string): Promise<IEvent | null> {
    const db = await getDb();
    return db.collection<IEvent>(this.COLLECTION_NAME).findOne({ slug });
  }

  static async getBySlugOrId(slugOrId: string): Promise<IEvent | null> {
    // If it looks like an ObjectId, try to get by ID first
    if (isValidObjectId(slugOrId)) {
      const event = await this.getById(slugOrId);
      if (event) return event;
    }
    // Try to get by slug
    return await this.getBySlug(slugOrId);
  }

  static async getAllSlugs(): Promise<string[]> {
    const db = await getDb();
    const events = await db
      .collection<IEvent>(this.COLLECTION_NAME)
      .find({}, { projection: { slug: 1 } })
      .toArray();
    return events.map((event) => event.slug).filter(Boolean);
  }

  static async isSlugExists(slug: string): Promise<boolean> {
    const db = await getDb();
    const count = await db
      .collection<IEvent>(this.COLLECTION_NAME)
      .countDocuments({ slug });
    return count > 0;
  }
}
