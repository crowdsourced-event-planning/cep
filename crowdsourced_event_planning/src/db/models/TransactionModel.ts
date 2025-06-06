import { ObjectId } from "mongodb";
import { dbConnect, getDb } from "../config/mongodb";
import {
  createObjectId,
  toObjectId,
  validateObjectId,
} from "../utils/validateObjectId";
import UserModel, { IUser } from "./UserModel";
import EventModel from "./EventModel";

export interface ITransaction {
  _id?: ObjectId;
  userId: ObjectId;
  amount: number;
  status: string;
  type: string;
  eventId?: string;
  xenditId: string;
  invoiceId: string;
  invoiceUrl: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default class TransactionModel {
  private static readonly COLLECTION_NAME = "transactions";

  static async getPendingTransaction(
    userId: string
  ): Promise<ITransaction[] | null> {
    validateObjectId(userId, "User ID");
    const db = await getDb();
    const transactions = await db
      .collection<ITransaction>(this.COLLECTION_NAME)
      .find({ userId: toObjectId(userId), status: "PENDING" })
      .toArray();
    return transactions;
  }

  static async getHistoryTransaction(
    userId: string
  ): Promise<ITransaction[] | null> {
    validateObjectId(userId, "User ID");
    const db = await getDb();
    const transactions = await db
      .collection<ITransaction>(this.COLLECTION_NAME)
      .find({ userId: toObjectId(userId), status: { $ne: "PENDING" } })
      .toArray();
    return transactions;
  }

  static async create(data: Partial<ITransaction>): Promise<ITransaction> {
    const db = await getDb();
    const now = new Date();
    const transactionData = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db
      .collection<ITransaction>(this.COLLECTION_NAME)
      .insertOne(transactionData as ITransaction);

    const createdTransaction = await db
      .collection<ITransaction>(this.COLLECTION_NAME)
      .findOne({ _id: result.insertedId });

    if (!createdTransaction) {
      throw new Error("Failed to create transaction");
    }
    return createdTransaction;
  }

  static async update({
    status,
    xenditId,
  }: {
    status: string;
    xenditId: string;
  }): Promise<string> {
    const { client, db } = await dbConnect();
    const session = client.startSession();

    try {
      await session.withTransaction(async () => {
        const topup = await db
          .collection<ITransaction>(this.COLLECTION_NAME)
          .findOne({ xenditId }, { session });

        if (!topup) {
          throw new Error("Topup not found");
        }

        if (status === "PAID" || status === "SETTLED") {
          await db
            .collection<ITransaction>(this.COLLECTION_NAME)
            .updateOne({ xenditId }, { $set: { status } }, { session });

          const user = await db
            .collection<IUser>("users")
            .findOne({ _id: topup.userId }, { session });

          if (!user) {
            throw new Error("User not found");
          }

          await db.collection<IUser>("users").updateOne(
            { _id: topup.userId },
            {
              $set: {
                balance: (user.balance || 0) + topup.amount,
              },
            },
            { session }
          );
        } else {
          await db
            .collection<ITransaction>(this.COLLECTION_NAME)
            .updateOne({ xenditId }, { $set: { status } }, { session });
        }
      });

      return "Update transaction successful";
    } catch (err) {
      console.error("Transaction failed:", err);
      throw new Error("Failed to update transaction");
    } finally {
      await session.endSession();
    }
  }

  static async getTransactionsByUserId(
    userId: string
  ): Promise<ITransaction[]> {
    validateObjectId(userId, "User ID");
    const db = await getDb();
    const transactions = await db
      .collection<ITransaction>(this.COLLECTION_NAME)
      .find({ userId: toObjectId(userId) })
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
          userId: toObjectId(userId),
          amount,
          status: "COMPLETED",
          type: "donation",
          eventId,
          description: message || "",
          xenditId: "", // Provide appropriate value if available
          invoiceId: "", // Provide appropriate value if available
          invoiceUrl: "", // Provide appropriate value if available
          createdAt: now,
          updatedAt: now,
        };
        await db
          .collection<ITransaction>(this.COLLECTION_NAME)
          .insertOne(transactionToInsert, { session });
        newTransaction = transactionToInsert;

        // Insert ke fundings
        await db.collection("fundings").insertOne(
          {
            eventId: new ObjectId(eventId),
            userId: new ObjectId(userId),
            amount,
            createdAt: now,
            updatedAt: now,
          },
          { session }
        );

        await db
          .collection("users")
          .updateOne(
            { _id: toObjectId(userId) },
            { $inc: { balance: -amount } },
            { session }
          );

        await db
          .collection("events")
          .updateOne(
            { _id: new ObjectId(eventId) },
            { $inc: { currentFunding: amount } },
            { session }
          );

        // Ambil event terbaru setelah update
        const updatedEvent = await db
          .collection("events")
          .findOne({ _id: new ObjectId(eventId) }, { session });

        if (
          updatedEvent &&
          updatedEvent.currentFunding >= updatedEvent.targetFunding &&
          updatedEvent.status !== "closed"
        ) {
          await db
            .collection("events")
            .updateOne(
              { _id: new ObjectId(eventId) },
              { $set: { status: "closed" } },
              { session }
            );
        }
      });
      if (!newTransaction) throw new Error("Transaction failed");
      return newTransaction;
    } catch (err) {
      // Jika error, simpan transaksi gagal
      const now = new Date();
      const failedTransaction: ITransaction = {
        _id: createObjectId(),
        userId: toObjectId(userId),
        amount,
        status: "FAILED",
        type: "donation",
        eventId,
        description: message || "",
        xenditId: "",
        invoiceId: "",
        invoiceUrl: "",
        createdAt: now,
        updatedAt: now,
      };
      await db
        .collection<ITransaction>(this.COLLECTION_NAME)
        .insertOne(failedTransaction);
      throw err;
    } finally {
      await session.endSession();
    }
  }
}
