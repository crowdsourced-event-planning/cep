import EventModel, { IEvent } from "@/db/models/EventModel";

// Tambahkan tipe serialisasi
export interface IEventSerialized {
  _id: string;
  title: string;
  description: string;
  category: string;
  typeEvent: string;
  location: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  targetFunding: number;
  currentFunding: number;
  status: string;
  creator: string;
  budget: { name: string; amount: number }[];
  gallery: string[];
  documents: string[];
  cancelReason: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

// Fungsi serialisasi
export function serializeEvent(event: IEvent): IEventSerialized {
  return {
    _id: event._id?.toString() ?? "",
    title: event.title ?? "",
    description: event.description ?? "",
    category: event.category ?? "",
    typeEvent: event.typeEvent ?? "",
    location: event.location ?? "",
    startDate:
      event.startDate instanceof Date
        ? event.startDate.toISOString()
        : event.startDate ?? "",
    startTime: event.startTime ?? "",
    endDate:
      event.endDate instanceof Date
        ? event.endDate.toISOString()
        : event.endDate ?? "",
    endTime: event.endTime ?? "",
    targetFunding: event.targetFunding ?? 0,
    currentFunding: event.currentFunding ?? 0,
    status: event.status ?? "",
    creator: event.creator?.toString?.() ?? "",
    budget: Array.isArray(event.budget)
      ? event.budget.map((b: { name?: string; amount?: number }) => ({
          name: b?.name ?? "",
          amount: typeof b?.amount === "number" ? b.amount : 0,
        }))
      : [],
    gallery: event.gallery ?? [],
    documents: event.documents ?? [],
    cancelReason: event.cancelReason ?? "",
    slug: event.slug ?? "",
    createdAt:
      event.createdAt instanceof Date
        ? event.createdAt.toISOString()
        : event.createdAt ?? "",
    updatedAt:
      event.updatedAt instanceof Date
        ? event.updatedAt.toISOString()
        : event.updatedAt ?? "",
  };
}

// Ubah getAllEvents agar langsung return hasil serialisasi
export async function getAllEvents(): Promise<IEventSerialized[]> {
  const events = await EventModel.getAll();
  return events.map(serializeEvent);
}

export async function getEventById(eventId: string): Promise<IEvent | null> {
  return await EventModel.getById(eventId);
}

export async function getEventBySlug(slug: string): Promise<IEvent | null> {
  return await EventModel.getBySlug(slug);
}

export async function getEventBySlugOrId(
  slugOrId: string
): Promise<IEvent | null> {
  return await EventModel.getBySlugOrId(slugOrId);
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
