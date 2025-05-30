export interface UserEvent {
  _id: string;
  userId: string;
  eventId: string;
  joinedAt: Date;
  role: string;
  status: string;
  createdAt: Date;
}
