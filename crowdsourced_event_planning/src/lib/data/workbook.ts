import { WorkbookModel, IWorkbook } from "@/db/models/WorkbookModel";
import { getDb } from "@/lib/mongodb";
import type { ITask } from "@/db/models/TaskModel";
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
}

export async function getTasksByWorkbook(workbookId: string): Promise<ITask[]> {
  const db = await getDb();
  try {
    return await db
      .collection<ITask>("tasks")
      .find({ workbookId: new ObjectId(workbookId) })
      .toArray();
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}

export async function getWorkbookBySlug(
  slug: string
): Promise<IWorkbook | null> {
  return await WorkbookModel.getWorkbookBySlug(slug);
}

export async function getWorkbookByEventAndSlug(eventId: string, slug: string) {
  const db = await getDb();
  return db.collection("workbooks").findOne({
    eventId: new ObjectId(eventId),
    slug,
  });
}
