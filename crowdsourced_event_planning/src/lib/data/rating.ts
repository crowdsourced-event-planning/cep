import { RatingModel, IRating } from "@/db/models/RatingModel";

export async function getRatingsByEventId(eventId: string): Promise<IRating[]> {
  return await RatingModel.getRatingsByEventId(eventId);
}

export async function createRating(
  ratingData: Partial<IRating>
): Promise<IRating> {
  return await RatingModel.createRating(ratingData);
}

export async function getAverageRatingByEventId(
  eventId: string
): Promise<number> {
  return await RatingModel.getAverageRatingByEventId(eventId);
}

export async function hasUserRatedEvent(
  userId: string,
  eventId: string
): Promise<boolean> {
  return await RatingModel.hasUserRatedEvent(userId, eventId);
}
