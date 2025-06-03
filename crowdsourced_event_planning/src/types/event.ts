import { ObjectId } from "mongodb";

export interface Event {
  _id: ObjectId;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  typeEvent: string;
  category: string; // Add this field
  status: string;
  targetFunding: number;
  currentFunding: number;
  creator: string;
  budget: {
    mainTask: string;
    subTasks: { name: string; cost: number }[];
    totalCost: number;
  }[];
  gallery: string[];
  documents: string[];
  cancelReason?: string;
  createdAt: Date;
}
