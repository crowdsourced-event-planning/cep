export interface Rating {
  _id: string;
  eventId: string;
  userId: string;
  score: number;
  comment: string;
  createdAt: Date;
}
