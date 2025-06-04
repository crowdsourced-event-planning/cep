import { ObjectId } from "mongodb";
import { dbConnect, getDb } from "../config/mongodb";
import { toObjectId, validateObjectId } from "../utils/validateObjectId";
import { IUser } from "./UserModel";

export interface ITransaction {
  _id?: ObjectId;
  userId: ObjectId;
  amount: number;
  status: string;
  type: string;
  xenditId: string;
  invoiceId: string;
  invoiceUrl: string;
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
}
