import { ObjectId } from "mongodb";
import { getDb } from "../config/mongodb";
import { createObjectId } from "../utils/validateObjectId";

export interface IFunding {
  _id?: ObjectId;
  eventId: string;
  userId: string;
  amount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class FundingModel {
  static async getFundingsByEventId(eventId: string): Promise<IFunding[]> {
    const db = await getDb();
    const collection = db.collection<IFunding>("fundings");

    return await collection.find({ eventId }).sort({ createdAt: -1 }).toArray();
  }

  static async getFundingsByUserId(userId: string): Promise<IFunding[]> {
    const db = await getDb();
    const collection = db.collection<IFunding>("fundings");

    return await collection.find({ userId }).sort({ createdAt: -1 }).toArray();
  }

  static async createFunding(data: Partial<IFunding>): Promise<IFunding> {
    const db = await getDb();
    const collection = db.collection<IFunding>("fundings");

    const now = new Date();
    const fundingData: IFunding = {
      _id: createObjectId(),
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
    const collection = db.collection<IFunding>("fundings");

    const result = await collection
      .aggregate([
        { $match: { eventId } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ])
      .toArray();

    return result.length > 0 ? result[0].total : 0;
  }
}
