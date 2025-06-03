import EventModel, { IEvent } from "@/db/models/EventModel";

type SerializedEvent = Omit<IEvent, "_id" | "creator"> & {
  _id: string;
  creator: string;
};

// Utility function to serialize MongoDB documents
function serializeEvent(event: IEvent): SerializedEvent {
  return {
    ...event,
    _id: event._id?.toString() || "",
    creator: event.creator?.toString() || "",
    createdAt: event.createdAt || new Date(),
    updatedAt: event.updatedAt || new Date(),
  };
}

export async function getAllEvents(): Promise<SerializedEvent[]> {
  const events = await EventModel.getAll();
  return events.map(serializeEvent);
}

export async function getEventById(
  eventId: string
): Promise<SerializedEvent | null> {
  const event = await EventModel.getById(eventId);
  return event ? serializeEvent(event) : null;
}

export async function getEventsByUserId(userId: string): Promise<IEvent[]> {
  return await EventModel.getEventsByCreator(userId);
}

export async function createEvent(eventData: Partial<IEvent>): Promise<IEvent> {
  return await EventModel.create(eventData);
}

export async function updateEvent(
  eventId: string,
  eventData: Partial<IEvent>
): Promise<IEvent | null> {
  return await EventModel.update(eventId, eventData);
}

export async function deleteEvent(eventId: string): Promise<string> {
  return await EventModel.delete(eventId);
}

export async function updateEventFunding(
  eventId: string,
  amount: number
): Promise<IEvent | null> {
  const event = await EventModel.getById(eventId);
  if (!event) return null;

  const newCurrentFunding = event.currentFunding + amount;
  return await EventModel.update(eventId, {
    currentFunding: newCurrentFunding,
  });

  // import { getDb } from "@/lib/mongodb";
  // import { ObjectId } from "mongodb";
  // import { Event } from "@/types/event";
  // import { Workbook } from "@/types/workbook";

  // export async function getEventById(eventId: string): Promise<Event | null> {
  //   const db = await getDb();
  //   try {
  //     return await db
  //       .collection<Event>("events")
  //       .findOne({ _id: new ObjectId(eventId) });
  //   } catch (error) {
  //     console.error("Error fetching event:", error);
  //     return null;
  //   }
  // }

  // export async function getWorkbooksByEvent(
  //   eventId: string
  // ): Promise<Workbook[]> {
  //   const db = await getDb();
  //   try {
  //     return await db
  //       .collection<Workbook>("workbooks")
  //       .find({ eventId: new ObjectId(eventId) })
  //       .toArray();
  //   } catch (error) {
  //     console.error("Error fetching workbooks:", error);
  //     return [];
  //   }
}
