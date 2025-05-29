import { getDb } from "@/lib/mongodb";
import { Filter, ObjectId } from "mongodb";
import { Workbook } from "@/types/workbook";
import { Task } from "@/types/task";

export async function getWorkbookById(
  workbookId: string
): Promise<Workbook | null> {
  const db = await getDb();
  try {
    const query: Filter<Workbook> = {
      _id: new ObjectId(workbookId) as unknown as string,
    };
    return await db.collection<Workbook>("workbooks").findOne(query);
  } catch (error) {
    console.error("Error fetching workbook:", error);
    return null;
  }
}

export async function getTasksByWorkbook(workbookId: string): Promise<Task[]> {
  const db = await getDb();
  try {
    return await db.collection<Task>("tasks").find({ workbookId }).toArray();
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}
