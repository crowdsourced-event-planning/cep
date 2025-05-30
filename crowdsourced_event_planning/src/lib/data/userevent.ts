import { UserEventModel, IUserEvent } from "@/db/models/UserEventModel";

export async function getUserEventsByUserId(
  userId: string
): Promise<IUserEvent[]> {
  return await UserEventModel.getUserEventsByUserId(userId);
}

export async function getUserEventsByEventId(
  eventId: string
): Promise<IUserEvent[]> {
  return await UserEventModel.getUserEventsByEventId(eventId);
}

export async function joinEvent(
  userId: string,
  eventId: string,
  role: string = "viewer"
): Promise<IUserEvent> {
  return await UserEventModel.joinEvent(userId, eventId, role);
}

export async function leaveEvent(
  userId: string,
  eventId: string
): Promise<string> {
  return await UserEventModel.leaveEvent(userId, eventId);
}

export async function updateUserEventStatus(
  userId: string,
  eventId: string,
  status: string
): Promise<IUserEvent | null> {
  return await UserEventModel.updateUserEventStatus(userId, eventId, status);
}

export async function isUserJoinedEvent(
  userId: string,
  eventId: string
): Promise<boolean> {
  return await UserEventModel.isUserJoinedEvent(userId, eventId);
}

export async function getUserRoleInEvent(
  userId: string,
  eventId: string
): Promise<string | null> {
  return await UserEventModel.getUserRoleInEvent(userId, eventId);
}
