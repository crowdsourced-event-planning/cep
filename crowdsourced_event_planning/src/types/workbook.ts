import { ObjectId } from "mongodb";
export interface Workbook {
  _id: ObjectId;
  name: string;
  description: string;
  eventId: ObjectId;
  createdAt: Date;
}
