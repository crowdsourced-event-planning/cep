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
  budget: object[];
  gallery: string[];
  documents: string[];
  cancelReason: string;
  createdAt: Date;
}

export interface EventCard {
  _id: string;
  title: string;
  description: string;
  gallery: string[];
  targetFunding: number;
  currentFunding: number;
  status: string;
  createdAt: Date;
}
