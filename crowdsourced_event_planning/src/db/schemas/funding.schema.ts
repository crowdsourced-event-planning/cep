import { Schema, Document } from "mongoose";

export interface IFunding extends Document {
  _id: string;
  eventId: string;
  userId: string;
  amount: number;
  createdAt: Date;
}

export const FundingSchema = new Schema<IFunding>(
  {
    eventId: { type: String, required: true },
    userId: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
  },
  {
    timestamps: true,
  }
);
