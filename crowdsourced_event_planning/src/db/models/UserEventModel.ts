import mongoose, { model } from "mongoose";
import { dbConnect } from "../config/mongoose";
import { IUserEvent, UserEventSchema } from "../schemas/userEvent.schema";

export class UserEventModel {
  static async getUserEventsByUserId(userId: string): Promise<IUserEvent[]> {
    await dbConnect();
    const UserEvent =
      mongoose.models.UserEvent ||
      model<IUserEvent>("UserEvent", UserEventSchema);

    return await UserEvent.find({ userId }).sort({ createdAt: -1 });
  }

  static async getUserEventsByEventId(eventId: string): Promise<IUserEvent[]> {
    await dbConnect();
    const UserEvent =
      mongoose.models.UserEvent ||
      model<IUserEvent>("UserEvent", UserEventSchema);

    return await UserEvent.find({ eventId }).sort({ createdAt: -1 });
  }

  static async joinEvent(
    userId: string,
    eventId: string,
    role: string = "viewer"
  ): Promise<IUserEvent> {
    await dbConnect();
    const UserEvent =
      mongoose.models.UserEvent ||
      model<IUserEvent>("UserEvent", UserEventSchema);

    const userEvent = new UserEvent({
      userId,
      eventId,
      role,
      status: "pending",
    });
    return await userEvent.save();
  }

  static async updateUserEventStatus(
    userId: string,
    eventId: string,
    status: string
  ): Promise<IUserEvent | null> {
    await dbConnect();
    const UserEvent =
      mongoose.models.UserEvent ||
      model<IUserEvent>("UserEvent", UserEventSchema);

    return await UserEvent.findOneAndUpdate(
      { userId, eventId },
      { status },
      { new: true }
    );
  }

  static async isUserJoinedEvent(
    userId: string,
    eventId: string
  ): Promise<boolean> {
    await dbConnect();
    const UserEvent =
      mongoose.models.UserEvent ||
      model<IUserEvent>("UserEvent", UserEventSchema);

    const userEvent = await UserEvent.findOne({ userId, eventId });
    return !!userEvent;
  }
  static async getUserRoleInEvent(
    userId: string,
    eventId: string
  ): Promise<string | null> {
    await dbConnect();
    const UserEvent =
      mongoose.models.UserEvent ||
      model<IUserEvent>("UserEvent", UserEventSchema);

    const userEvent = await UserEvent.findOne({ userId, eventId });
    return userEvent ? userEvent.role : null;
  }

  static async leaveEvent(userId: string, eventId: string): Promise<string> {
    await dbConnect();
    const UserEvent =
      mongoose.models.UserEvent ||
      model<IUserEvent>("UserEvent", UserEventSchema);

    const validateObjectId = (id: string, name: string) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid ${name}: ${id}`);
      }
    };

    validateObjectId(userId, "User ID");
    validateObjectId(eventId, "Event ID");

    await UserEvent.findOneAndDelete<IUserEvent>({ userId, eventId });
    return "UserEvent deleted";
  }
  static async isJoined(userId: string, eventId: string): Promise<boolean> {
    await dbConnect();
    const UserEvent =
      mongoose.models.UserEvent ||
      model<IUserEvent>("UserEvent", UserEventSchema);

    const validateObjectId = (id: string, name: string) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid ${name}: ${id}`);
      }
    };

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
    const UserEvent =
      mongoose.models.UserEvent ||
      model<IUserEvent>("UserEvent", UserEventSchema);

    if (!mongoose.Types.ObjectId.isValid(eventId)) return null;

    const participants = await UserEvent.find({ eventId }).populate("userId");

    return participants;
  }
}
