import { Schema, Document } from "mongoose";

export interface ITask extends Document {
  _id: string;
  name: string;
  description: string;
  workbookId: string;
  parentTask?: string;
  assignedTo: string[];
  status: string;
  dueDate?: Date;
  customColumn: object[];
  createdAt: Date;
}

export const TaskSchema = new Schema<ITask>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    workbookId: { type: String, required: true },
    parentTask: { type: String },
    assignedTo: [{ type: String }],
    status: {
      type: String,
      enum: ["todo", "in_progress", "review", "done"],
      default: "todo",
    },
    dueDate: { type: Date },
    customColumn: [{ type: Schema.Types.Mixed }],
  },
  {
    timestamps: true,
  }
);
