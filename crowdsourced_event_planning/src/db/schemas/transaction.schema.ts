import { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  _id: string;
  user: string;
  amount: number;
  status: string;
  type: string;
  midtransToken: string;
  midtransURL: string;
  createdAt: Date;
}

export const TransactionSchema = new Schema<ITransaction>(
  {
    user: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled"],
      default: "pending",
    },
    type: {
      type: String,
      enum: ["topup", "funding", "withdrawal"],
      required: true,
    },
    midtransToken: { type: String, default: "" },
    midtransURL: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);
