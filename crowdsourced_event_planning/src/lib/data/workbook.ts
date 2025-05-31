import { WorkbookModel, IWorkbook } from "@/db/models/WorkbookModel";
import { getDb } from "@/lib/mongodb";
import { Task } from "@/types/task";
import { ObjectId } from "mongodb";

export async function getWorkbooksByEventId(
  eventId: string
): Promise<IWorkbook[]> {
  return await WorkbookModel.getWorkbooksByEventId(eventId);
}

export async function getWorkbookById(
  workbookId: string
): Promise<IWorkbook | null> {
  return await WorkbookModel.getWorkbookById(workbookId);
}

export async function createWorkbook(
  workbookData: Partial<IWorkbook>
): Promise<IWorkbook> {
  return await WorkbookModel.createWorkbook(workbookData);
}

export async function updateWorkbook(
  workbookId: string,
  workbookData: Partial<IWorkbook>
): Promise<IWorkbook | null> {
  return await WorkbookModel.updateWorkbook(workbookId, workbookData);
}

export async function deleteWorkbook(workbookId: string): Promise<boolean> {
  return await WorkbookModel.deleteWorkbook(workbookId);
  // import { getDb } from "@/lib/mongodb";
  // import { ObjectId } from "mongodb";
  // import { Workbook } from "@/types/workbook";
  // import { Task } from "@/types/task";

  // export async function getWorkbookById(
  //   workbookId: string
  // ): Promise<Workbook | null> {
  //   const db = await getDb();
  //   try {
  //     return await db
  //       .collection<Workbook>("workbooks")
  //       .findOne({ _id: new ObjectId(workbookId) });
  //   } catch (error) {
  //     console.error("Error fetching workbook:", error);
  //     return null;
  //   }
  // }
}

export async function getTasksByWorkbook(workbookId: string): Promise<Task[]> {
  const db = await getDb();
  try {
    return await db
      .collection<Task>("tasks")
      .find({ workbookId: new ObjectId(workbookId) })
      .toArray();
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}
