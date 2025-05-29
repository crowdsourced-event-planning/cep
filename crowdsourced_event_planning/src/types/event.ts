export interface Event {
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
