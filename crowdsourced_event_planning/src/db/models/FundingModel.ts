import { ObjectId } from "mongodb";
import { getDb } from "../config/mongodb";

export interface IFunding {
  _id?: ObjectId;
  eventId: string;
  userId: string;
  amount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class FundingModel {
  private static readonly COLLECTION_NAME = "fundings";

  static async getFundingsByEventId(eventId: string): Promise<IFunding[]> {
    const db = await getDb();
    const collection = db.collection<IFunding>(this.COLLECTION_NAME);

    return await collection.find({ eventId }).sort({ createdAt: -1 }).toArray();
  }

  static async getFundingsByUserId(userId: string): Promise<IFunding[]> {
    const db = await getDb();
    const collection = db.collection<IFunding>(this.COLLECTION_NAME);

    return await collection.find({ userId }).sort({ createdAt: -1 }).toArray();
  }

  static async createFunding(data: Partial<IFunding>): Promise<IFunding> {
    const db = await getDb();
    const collection = db.collection<IFunding>(this.COLLECTION_NAME);

    const now = new Date();
    const fundingData: IFunding = {
      _id: new ObjectId(),
      eventId: data.eventId!,
      userId: data.userId!,
      amount: data.amount!,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(fundingData);
    return { ...fundingData, _id: result.insertedId };
  }

  static async getTotalFundingByEventId(eventId: string): Promise<number> {
    const db = await getDb();
    const collection = db.collection<IFunding>(this.COLLECTION_NAME);

    const result = await collection
      .aggregate([
        { $match: { eventId } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ])
      .toArray();

    return result.length > 0 ? result[0].total : 0;
  }
}
