import { Schema, Document, ObjectId } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  location: string;
  dateEvent: Date;
  timeEvent: string;
  type: string; // bisa disesuaikan ke enum
  status: string; // bisa disesuaikan ke enum
  visibility: string; // bisa disesuaikan ke enum
  targetFunding: number;
  currentFunding: number;
  creator: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    dateEvent: { type: Date, required: true },
    timeEvent: { type: String, required: true }, // misal: '14:00'

    // ENUM untuk type event
    type: {
      type: String,
      enum: [
        "workshop",
        "seminar",
        "webinar",
        "gathering",
        "conference",
        "competition",
        "concert",
        "others",
      ],
      default: "others",
    },

    // ENUM untuk status event
    status: {
      type: String,
      enum: ["draft", "open", "closed", "cancelled"],
      default: "draft",
    },

    // ENUM untuk visibilitas
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },

    targetFunding: { type: Number, default: 0 },
    currentFunding: { type: Number, default: 0 },

    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);
