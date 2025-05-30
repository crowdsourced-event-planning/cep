import { ObjectId } from "mongodb";
import { getDb } from "../config/mongodb";
import { validateObjectId, toObjectId } from "../utils/validateObjectId";

export interface IEvent {
  _id?: ObjectId;
  title: string;
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
  creator: string;
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
    const events = await db
      .collection<IEvent>(this.COLLECTION_NAME)
      .find({})
      .toArray();
    return events;
  }
  static async getEventsByCreator(creatorId: string): Promise<IEvent[]> {
    validateObjectId(creatorId, "Creator ID");
    const db = await getDb();
    const events = await db
      .collection<IEvent>(this.COLLECTION_NAME)
      .find({ creator: creatorId })
      .toArray();
    return events;
  }

  static async create(data: Partial<IEvent>): Promise<IEvent> {
    const db = await getDb();
    const now = new Date();
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
    validateObjectId(id, "Event ID");
    const db = await getDb();
    const event = await db
      .collection<IEvent>(this.COLLECTION_NAME)
      .findOne({ _id: toObjectId(id) });
    return event;
  }

  static async update(
    id: string,
    data: Partial<IEvent>
  ): Promise<IEvent | null> {
    validateObjectId(id, "Event ID");
    const db = await getDb();

    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    const result = await db
      .collection<IEvent>(this.COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: toObjectId(id) },
        { $set: updateData },
        { returnDocument: "after" }
      );

    return result || null;
  }

  static async delete(id: string): Promise<string> {
    validateObjectId(id, "Event ID");
    const db = await getDb();

    await db
      .collection<IEvent>(this.COLLECTION_NAME)
      .deleteOne({ _id: toObjectId(id) });

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
}
