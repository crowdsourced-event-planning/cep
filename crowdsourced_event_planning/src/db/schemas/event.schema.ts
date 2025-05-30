import { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  _id: string;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  typeEvent: string;
  status: string;
  targetFunding: number;
  currentFunding: number;
  creator: string;
  budget: object[];
  gallery: string[];
  documents: string[];
  cancelReason: string;
  createdAt: Date;
}

export const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },

    // ENUM untuk type event
    typeEvent: {
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

    targetFunding: { type: Number, default: 0 },
    currentFunding: { type: Number, default: 0 },
    creator: { type: String, required: true },
    budget: [{ type: Schema.Types.Mixed }],
    gallery: [{ type: String }],
    documents: [{ type: String }],
    cancelReason: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);
