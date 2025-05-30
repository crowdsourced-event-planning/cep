import { WorkbookModel } from "@/db/models/WorkbookModel";
import { IWorkbook } from "@/db/schemas/workbook.schema";

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
