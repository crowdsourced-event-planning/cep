// Tambahkan di file yang sesuai, misal di TaskBoardWrapper.tsx atau buat file types.ts
export type SerializedTask = {
  _id: string;
  workbookId: string;
  parentTask: string | null;
  assignedTo: string[];
  dueDate: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  name: string;
  description: string;
  status: string;
  slug: string;
  customColumn?: object[];
  // tambahkan field lain sesuai kebutuhan
};
