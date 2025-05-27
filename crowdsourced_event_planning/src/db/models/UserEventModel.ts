import mongoose, { model } from "mongoose";
// import { z } from "zod";
import { dbConnect } from "../config/mongoose";
import UserEventSchema, { IUserEvent } from "../schemas/userEvent.schema";
import { validateObjectId } from "../utils/validateObjectId";

const UserEvent =
  mongoose.models.UserEvent || model<IUserEvent>("UserEvent", UserEventSchema);

export default class UserEventModel {
  static async update(
    userId: string,
    eventId: string,
    data: Partial<IUserEvent>
  ): Promise<IUserEvent | null> {
    await dbConnect();

    validateObjectId(userId, "User ID");
    validateObjectId(eventId, "Event ID");

    return await UserEvent.findOneAndUpdate<IUserEvent>(
      { userId, eventId },
      data,
      {
        new: true,
      }
    ).lean<IUserEvent>();
  }

  static async delete(userId: string, eventId: string): Promise<string> {
    await dbConnect();

    validateObjectId(userId, "User ID");
    validateObjectId(eventId, "Event ID");

    await UserEvent.findOneAndDelete<IUserEvent>({ userId, eventId });
    return "UserEvent deleted";
  }

  static async isJoined(userId: string, eventId: string): Promise<boolean> {
    await dbConnect();

    validateObjectId(userId, "User ID");
    validateObjectId(eventId, "Event ID");

    const isJoined = await UserEvent.findOne<IUserEvent>({
      userId,
      eventId,
    });

    return !!isJoined;
  }

  static async getParticipant(eventId: string): Promise<IUserEvent[] | null> {
    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(eventId)) return null;

    const participants = await UserEvent.find({ eventId }).populate("userId");

    return participants;
  }
}
