import EventModel, { IEvent } from "@/db/models/EventModel";

export async function getAllEvents(): Promise<IEvent[]> {
  return await EventModel.getAll();
}

export async function getEventById(eventId: string): Promise<IEvent | null> {
  return await EventModel.getById(eventId);
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
}
