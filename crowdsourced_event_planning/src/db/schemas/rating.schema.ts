import { Schema, Document } from "mongoose";

export interface IRating extends Document {
  _id: string;
  eventId: string;
  userId: string;
  score: number;
  comment: string;
  createdAt: Date;
}

export const RatingSchema = new Schema<IRating>(
  {
    eventId: { type: String, required: true },
    userId: { type: String, required: true },
    score: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
