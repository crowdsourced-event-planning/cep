import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  badge: string;
  reputation: number;
  createdEvents: mongoose.Types.ObjectId[];
  joinedEvents: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    badge: { type: String, default: "" },
    reputation: { type: Number, default: 0 },
    createdEvents: [{ type: mongoose.Types.ObjectId, ref: "Event" }],
    joinedEvents: [{ type: mongoose.Types.ObjectId, ref: "Event" }],
  },
  {
    timestamps: true,
  }
);
