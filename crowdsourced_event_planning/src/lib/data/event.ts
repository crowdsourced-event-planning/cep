import { getDb } from "@/lib/mongodb";
import { Filter, ObjectId } from "mongodb";
import { Event } from "@/types/event";
import { Workbook } from "@/types/workbook";

export async function getEventById(eventId: string): Promise<Event | null> {
  const db = await getDb();
  try {
    const query: Filter<Event> = {
      _id: new ObjectId(eventId) as unknown as string,
    };
    return await db.collection<Event>("events").findOne(query);
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}

export async function getWorkbooksByEvent(
  eventId: string
): Promise<Workbook[]> {
  const db = await getDb();
  try {
    return await db
      .collection<Workbook>("workbooks")
      .find({ eventId })
      .toArray();
  } catch (error) {
    console.error("Error fetching workbooks:", error);
    return [];
  }
}
