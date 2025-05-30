import mongoose, { model } from "mongoose";
// import { z } from "zod";
import { dbConnect } from "../config/mongoose";
import { EventSchema, IEvent } from "../schemas/event.schema";
import { validateObjectId } from "../utils/validateObjectId";

const Event = mongoose.models.Event || model<IEvent>("Event", EventSchema);

export default class EventModel {
  static async getAll(): Promise<IEvent[]> {
    await dbConnect();
    const events = await Event.find<IEvent>({}).lean<IEvent[]>();
    return events;
  }

  static async getEventsByCreator(creatorId: string): Promise<IEvent[]> {
    await dbConnect();
    validateObjectId(creatorId, "Creator ID");
    const events = await Event.find<IEvent>({ createdBy: creatorId }).lean<
      IEvent[]
    >();
    return events;
  }

  static async create(data: Partial<IEvent>): Promise<IEvent> {
    await dbConnect();
    const event = new Event(data);
    const savedEvent = await event.save();
    return savedEvent.toObject();
  }

  static async getById(id: string): Promise<IEvent | null> {
    await dbConnect();

    validateObjectId(id, "Event ID");
    const event = await Event.findById<IEvent>(id).lean<IEvent>();

    return event;
  }

  static async update(
    id: string,
    data: Partial<IEvent>
  ): Promise<IEvent | null> {
    await dbConnect();

    validateObjectId(id, "Event ID");

    return await Event.findByIdAndUpdate<IEvent>(id, data, {
      new: true,
    }).lean<IEvent>();
  }

  static async delete(id: string): Promise<string> {
    await dbConnect();

    validateObjectId(id, "Event ID");

    await Event.findByIdAndDelete(id);
    return "Event deleted";
  }
  static async deleteMany(
    filter: Record<string, unknown> = {}
  ): Promise<boolean> {
    await dbConnect();
    const result = await Event.deleteMany(filter);
    return result.acknowledged;
  }
}
