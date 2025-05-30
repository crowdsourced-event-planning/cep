import { ObjectId } from "mongodb";

export interface Task {
  _id: ObjectId;
  name: string;
  description: string;
  workbookId: ObjectId;
  parentTask?: ObjectId;
  assignedTo: ObjectId[];
  status: string;
  dueDate?: Date;
  createdAt: Date;
  customColumn: { label: string; value: string }[];
}
