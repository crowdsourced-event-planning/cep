export interface Workbook {
  _id: string;
  name: string;
  description: string;
  eventId: string;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
}
