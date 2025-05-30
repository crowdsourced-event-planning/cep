import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { Workbook } from "@/types/workbook";
import { Task } from "@/types/task";

export async function getWorkbookById(
  workbookId: string
): Promise<Workbook | null> {
  const db = await getDb();
  try {
    return await db
      .collection<Workbook>("workbooks")
      .findOne({ _id: new ObjectId(workbookId) });
  } catch (error) {
    console.error("Error fetching workbook:", error);
    return null;
  }
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
