import { ObjectId } from "mongodb";
import { getDb } from "@/db/config/mongodb";

export async function getPanitiaRequestsByEventId(eventId: string) {
  const db = await getDb();
  return db
    .collection("panitia_requests")
    .find({ eventId })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getPanitiaRequestByUserAndWorkbook(
  eventId: string,
  userId: string,
  workbookId: string
) {
  const db = await getDb();
  return db.collection("panitia_requests").findOne({
    eventId: new ObjectId(eventId),
    userId: new ObjectId(userId),
    workbookId: new ObjectId(workbookId),
  });
}

export async function isPanitiaApproved(eventId: string, userId: string) {
  const db = await getDb();
  const found = await db.collection("panitia_requests").findOne({
    eventId: new ObjectId(eventId),
    userId: new ObjectId(userId),
    status: "approved",
  });
  return !!found;
}
