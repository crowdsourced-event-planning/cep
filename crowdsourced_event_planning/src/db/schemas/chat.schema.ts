import { Schema, Document } from "mongoose";

export interface IChat extends Document {
  _id: string;
  eventId: string;
  roleEvent: string;
  userId: string;
  messages: string;
  createdAt: Date;
}

export const ChatSchema = new Schema<IChat>(
  {
    eventId: { type: String, required: true },
    roleEvent: { type: String, required: true },
    userId: { type: String, required: true },
    messages: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
