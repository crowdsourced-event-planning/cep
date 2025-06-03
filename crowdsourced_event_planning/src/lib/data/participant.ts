import { UserEventModel } from "@/db/models/UserEventModel";

export async function getParticipantsByEventId(eventId: string) {
  return UserEventModel.getParticipantsByEventId(eventId);
}
