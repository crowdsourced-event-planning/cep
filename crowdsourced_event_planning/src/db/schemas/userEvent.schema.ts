import { Schema, Document } from "mongoose";

export interface IUserEvent extends Document {
  _id: string;
  userId: string;
  eventId: string;
  joinedAt: Date;
  role: string;
  status: string;
  createdAt: Date;
}

export const UserEventSchema = new Schema<IUserEvent>(
  {
    userId: { type: String, required: true },
    eventId: { type: String, required: true },
    joinedAt: { type: Date, default: Date.now },
    role: {
      type: String,
      enum: ["creator", "volunteer", "viewer"],
      default: "viewer",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

UserEventSchema.index({ userId: 1, eventId: 1 }, { unique: true });
