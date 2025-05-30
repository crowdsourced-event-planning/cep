import { Schema, Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  badge: string;
  balance: number;
  totalRating: number;
  totalUserRating: number;
  createdEvents: string[];
  joinedEvents: string[];
  createdAt: Date;
}

export const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    badge: { type: String, default: "" },
    balance: { type: Number, default: 0 },
    totalRating: { type: Number, default: 0 },
    totalUserRating: { type: Number, default: 0 },
    createdEvents: [{ type: String }],
    joinedEvents: [{ type: String }],
  },
  {
    timestamps: true,
  }
);
