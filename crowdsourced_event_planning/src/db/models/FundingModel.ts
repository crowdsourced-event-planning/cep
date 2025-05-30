import mongoose, { model } from "mongoose";
import { dbConnect } from "../config/mongoose";
import { IFunding, FundingSchema } from "../schemas/funding.schema";

export class FundingModel {
  static async getFundingsByEventId(eventId: string): Promise<IFunding[]> {
    await dbConnect();
    const Funding =
      mongoose.models.Funding || model<IFunding>("Funding", FundingSchema);

    return await Funding.find({ eventId }).sort({ createdAt: -1 });
  }

  static async getFundingsByUserId(userId: string): Promise<IFunding[]> {
    await dbConnect();
    const Funding =
      mongoose.models.Funding || model<IFunding>("Funding", FundingSchema);

    return await Funding.find({ userId }).sort({ createdAt: -1 });
  }

  static async createFunding(data: Partial<IFunding>): Promise<IFunding> {
    await dbConnect();
    const Funding =
      mongoose.models.Funding || model<IFunding>("Funding", FundingSchema);

    const funding = new Funding(data);
    return await funding.save();
  }

  static async getTotalFundingByEventId(eventId: string): Promise<number> {
    await dbConnect();
    const Funding =
      mongoose.models.Funding || model<IFunding>("Funding", FundingSchema);

    const result = await Funding.aggregate([
      { $match: { eventId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    return result.length > 0 ? result[0].total : 0;
  }
}
