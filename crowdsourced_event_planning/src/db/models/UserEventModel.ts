import { ObjectId } from "mongodb";
import { getDb } from "../config/mongodb";

export interface IUserEvent {
  _id?: ObjectId;
  userId: string;
  eventId: string;
  role: string;
  status: string;
  joinedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserEventModel {
  private static readonly COLLECTION_NAME = "userevents";

  static async getUserEventsByUserId(userId: string): Promise<IUserEvent[]> {
    const db = await getDb();
    const userEvents = await db
      .collection<IUserEvent>(this.COLLECTION_NAME)
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
    return userEvents;
  }

  static async getUserEventsByEventId(eventId: string): Promise<IUserEvent[]> {
    const db = await getDb();
    const userEvents = await db
      .collection<IUserEvent>(this.COLLECTION_NAME)
      .find({ eventId })
      .sort({ createdAt: -1 })
      .toArray();
    return userEvents;
  }

  static async joinEvent(
    userId: string,
    eventId: string,
    role: string = "viewer"
  ): Promise<IUserEvent> {
    const db = await getDb();

    const now = new Date();
    const userEventToInsert: IUserEvent = {
      _id: new ObjectId(),
      userId,
      eventId,
      role,
      status: "pending",
      joinedAt: now,
      createdAt: now,
      updatedAt: now,
    };

    await db
      .collection<IUserEvent>(this.COLLECTION_NAME)
      .insertOne(userEventToInsert);
    return userEventToInsert;
  }

  static async updateUserEventStatus(
    userId: string,
    eventId: string,
    status: string
  ): Promise<IUserEvent | null> {
    const db = await getDb();

    const result = await db
      .collection<IUserEvent>(this.COLLECTION_NAME)
      .findOneAndUpdate(
        { userId, eventId },
        {
          $set: {
            status,
            updatedAt: new Date(),
          },
        },
        { returnDocument: "after" }
      );

    return result || null;
  }

  static async isUserJoinedEvent(
    userId: string,
    eventId: string
  ): Promise<boolean> {
    const db = await getDb();

    const userEvent = await db
      .collection<IUserEvent>(this.COLLECTION_NAME)
      .findOne({ userId, eventId });
    return !!userEvent;
  }

  static async getUserRoleInEvent(
    userId: string,
    eventId: string
  ): Promise<string | null> {
    const db = await getDb();

    const userEvent = await db
      .collection<IUserEvent>(this.COLLECTION_NAME)
      .findOne({ userId, eventId });
    return userEvent ? userEvent.role : null;
  }

  static async leaveEvent(userId: string, eventId: string): Promise<string> {
    const db = await getDb();

    await db
      .collection<IUserEvent>(this.COLLECTION_NAME)
      .deleteOne({ userId, eventId });
    return "UserEvent deleted";
  }

  static async isJoined(userId: string, eventId: string): Promise<boolean> {
    const db = await getDb();

    const isJoined = await db
      .collection<IUserEvent>(this.COLLECTION_NAME)
      .findOne({ userId, eventId });
    return !!isJoined;
  }

  static async getParticipant(eventId: string): Promise<IUserEvent[] | null> {
    const db = await getDb();

    const participants = await db
      .collection<IUserEvent>(this.COLLECTION_NAME)
      .find({ eventId })
      .toArray();
    return participants;
  }

  static async getParticipantsByEventId(eventId: string) {
    const db = await getDb();
    // Ambil user-event yang join event ini
    const userEvents = await this.getUserEventsByEventId(eventId);
    const userIds = userEvents.map((ue) => new ObjectId(ue.userId));
    if (userIds.length === 0) return [];

    // Ambil data user dari collection users
    const users = await db
      .collection("users")
      .find({ _id: { $in: userIds } })
      .toArray();

    return users;
  }
}
