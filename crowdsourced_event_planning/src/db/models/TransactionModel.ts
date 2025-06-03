import { ObjectId } from "mongodb";
import { getDb } from "../config/mongodb";
import {
  validateObjectId,
  toObjectId,
  createObjectId,
} from "../utils/validateObjectId";
import UserModel from "./UserModel";
import EventModel from "./EventModel";
import { dbConnect } from "../config/mongodb";

export interface ITransaction {
  _id?: ObjectId;
  userId: string;
  amount: number;
  status: string;
  type: string;
  eventId?: string;
  midtransToken?: string;
  midtransURL?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class TransactionModel {
  private static readonly COLLECTION_NAME = "transactions";

  static async getTransactionsByUserId(
    userId: string
  ): Promise<ITransaction[]> {
    validateObjectId(userId, "User ID");
    const db = await getDb();
    const transactions = await db
      .collection<ITransaction>(this.COLLECTION_NAME)
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
    return transactions;
  }

  static async getTransactionById(
    transactionId: string
  ): Promise<ITransaction | null> {
    validateObjectId(transactionId, "Transaction ID");
    const db = await getDb();
    const transaction = await db
      .collection<ITransaction>(this.COLLECTION_NAME)
      .findOne({ _id: toObjectId(transactionId) });
    return transaction;
  }

  static async getTransactionsByEventId(
    eventId: string
  ): Promise<ITransaction[]> {
    validateObjectId(eventId, "Event ID");
    const db = await getDb();
    const transactions = await db
      .collection<ITransaction>(this.COLLECTION_NAME)
      .find({ eventId })
      .sort({ createdAt: -1 })
      .toArray();
    return transactions;
  }

  static async createTransaction(
    data: Partial<ITransaction>
  ): Promise<ITransaction> {
    const db = await getDb();
    const now = new Date();
    const transactionToInsert: ITransaction = {
      _id: createObjectId(),
      userId: data.userId!,
      amount: data.amount!,
      status: data.status || "pending",
      type: data.type!,
      eventId: data.eventId,
      midtransToken: data.midtransToken,
      midtransURL: data.midtransURL,
      description: data.description || "",
      createdAt: now,
      updatedAt: now,
    };

    await db
      .collection<ITransaction>(this.COLLECTION_NAME)
      .insertOne(transactionToInsert);
    return transactionToInsert;
  }

  static async updateTransaction(
    transactionId: string,
    data: Partial<ITransaction>
  ): Promise<ITransaction | null> {
    validateObjectId(transactionId, "Transaction ID");
    const db = await getDb();

    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    const result = await db
      .collection<ITransaction>(this.COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: toObjectId(transactionId) },
        { $set: updateData },
        { returnDocument: "after" }
      );

    return result || null;
  }

  static async updateTransactionStatus(
    transactionId: string,
    status: string
  ): Promise<ITransaction | null> {
    return this.updateTransaction(transactionId, { status });
  }

  static async deleteTransaction(transactionId: string): Promise<boolean> {
    validateObjectId(transactionId, "Transaction ID");
    const db = await getDb();

    const result = await db
      .collection<ITransaction>(this.COLLECTION_NAME)
      .deleteOne({ _id: toObjectId(transactionId) });
    return result.deletedCount > 0;
  }

  static async getTotalTransactionsByType(type: string): Promise<number> {
    const db = await getDb();
    const result = await db
      .collection<ITransaction>(this.COLLECTION_NAME)
      .aggregate([
        { $match: { type, status: "completed" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ])
      .toArray();

    return result.length > 0 ? result[0].total : 0;
  }

  static async deleteMany(
    filter: Record<string, unknown> = {}
  ): Promise<boolean> {
    const db = await getDb();
    const result = await db
      .collection<ITransaction>(this.COLLECTION_NAME)
      .deleteMany(filter);
    return result.acknowledged;
  }

  static async donate({
    userId,
    eventId,
    amount,
    message,
  }: {
    userId: string;
    eventId: string;
    amount: number;
    message?: string;
  }): Promise<ITransaction> {
    const { db, client } = await dbConnect();
    const session = client.startSession();

    let newTransaction: ITransaction | undefined;

    try {
      await session.withTransaction(async () => {
        const user = await UserModel.getById(userId);
        const event = await EventModel.getById(eventId);
        if (!user) throw new Error("User not found");
        if (!event) throw new Error("Event not found");
        if ((user.balance ?? 0) < amount) throw new Error("Saldo tidak cukup");

        const now = new Date();
        const transactionToInsert: ITransaction = {
          _id: createObjectId(),
          userId,
          amount,
          status: "completed",
          type: "donation",
          eventId,
          description: message || "",
          createdAt: now,
          updatedAt: now,
        };
        await db
          .collection<ITransaction>(this.COLLECTION_NAME)
          .insertOne(transactionToInsert, { session });
        newTransaction = transactionToInsert;

        await db.collection("users").updateOne(
          { _id: toObjectId(userId) },
          { $inc: { balance: -amount } },
          { session }
        );

        await db.collection("events").updateOne(
          { _id: toObjectId(eventId) },
          { $inc: { currentFunding: amount } },
          { session }
        );
      });
      if (!newTransaction) throw new Error("Transaction failed");
      return newTransaction;
    } finally {
      await session.endSession();
    }
  }

}
