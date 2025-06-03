import { ObjectId } from "mongodb";
import { getDb } from "../config/mongodb";

export interface IRating {
  _id?: ObjectId;
  eventId: string;
  userId: string;
  score: number;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class RatingModel {
  private static readonly COLLECTION_NAME = "ratings";

  static async getRatingsByEventId(eventId: string): Promise<IRating[]> {
    const db = await getDb();
    const collection = db.collection<IRating>(this.COLLECTION_NAME);

    return await collection.find({ eventId }).sort({ createdAt: -1 }).toArray();
  }

  static async createRating(data: Partial<IRating>): Promise<IRating> {
    const db = await getDb();
    const collection = db.collection<IRating>(this.COLLECTION_NAME);

    const now = new Date();
    const ratingData: IRating = {
      _id: new ObjectId(),
      eventId: data.eventId!,
      userId: data.userId!,
      score: data.score!,
      comment: data.comment!,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(ratingData);
    return { ...ratingData, _id: result.insertedId };
  }

  static async getAverageRatingByEventId(eventId: string): Promise<number> {
    const db = await getDb();
    const collection = db.collection<IRating>(this.COLLECTION_NAME);

    const result = await collection
      .aggregate([
        { $match: { eventId } },
        { $group: { _id: null, average: { $avg: "$score" } } },
      ])
      .toArray();

    return result.length > 0 ? Number(result[0].average.toFixed(1)) : 0;
  }

  static async hasUserRatedEvent(
    userId: string,
    eventId: string
  ): Promise<boolean> {
    const db = await getDb();
    const collection = db.collection<IRating>(this.COLLECTION_NAME);

    const rating = await collection.findOne({ userId, eventId });
    return !!rating;
  }
}
