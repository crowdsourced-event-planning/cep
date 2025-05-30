import { Schema, Document } from "mongoose";

export interface IWorkbook extends Document {
  _id: string;
  name: string;
  description: string;
  eventId: string;
  createdAt: Date;
}

export const WorkbookSchema = new Schema<IWorkbook>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    eventId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
