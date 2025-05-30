import { FundingModel, IFunding } from "@/db/models/FundingModel";

export async function getFundingsByEventId(
  eventId: string
): Promise<IFunding[]> {
  return await FundingModel.getFundingsByEventId(eventId);
}

export async function getFundingsByUserId(userId: string): Promise<IFunding[]> {
  return await FundingModel.getFundingsByUserId(userId);
}

export async function createFunding(
  fundingData: Partial<IFunding>
): Promise<IFunding> {
  return await FundingModel.createFunding(fundingData);
}

export async function getTotalFundingByEventId(
  eventId: string
): Promise<number> {
  return await FundingModel.getTotalFundingByEventId(eventId);
}
