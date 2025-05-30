export interface Task {
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
