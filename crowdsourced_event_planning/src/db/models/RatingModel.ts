import mongoose, { model } from "mongoose";
import { dbConnect } from "../config/mongoose";
import { IRating, RatingSchema } from "../schemas/rating.schema";

export class RatingModel {
  static async getRatingsByEventId(eventId: string): Promise<IRating[]> {
    await dbConnect();
    const Rating =
      mongoose.models.Rating || model<IRating>("Rating", RatingSchema);

    return await Rating.find({ eventId }).sort({ createdAt: -1 });
  }

  static async createRating(data: Partial<IRating>): Promise<IRating> {
    await dbConnect();
    const Rating =
      mongoose.models.Rating || model<IRating>("Rating", RatingSchema);

    const rating = new Rating(data);
    return await rating.save();
  }

  static async getAverageRatingByEventId(eventId: string): Promise<number> {
    await dbConnect();
    const Rating =
      mongoose.models.Rating || model<IRating>("Rating", RatingSchema);

    const result = await Rating.aggregate([
      { $match: { eventId } },
      { $group: { _id: null, average: { $avg: "$score" } } },
    ]);

    return result.length > 0 ? Number(result[0].average.toFixed(1)) : 0;
  }

  static async hasUserRatedEvent(
    userId: string,
    eventId: string
  ): Promise<boolean> {
    await dbConnect();
    const Rating =
      mongoose.models.Rating || model<IRating>("Rating", RatingSchema);

    const rating = await Rating.findOne({ userId, eventId });
    return !!rating;
  }
}
