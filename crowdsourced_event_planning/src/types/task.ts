export interface Task {
  _id: string;
  name: string;
  description: string;
  workbookId: string;
  parentTask?: string;
  assignedTo: string[];
  status: string;
  dueDate?: Date;
  createdAt: Date;
  customColumn: { label: string; value: string }[];
}
