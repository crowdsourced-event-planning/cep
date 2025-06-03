import { NextRequest, NextResponse } from "next/server";
import {
  getFundingsByEventId,
  getTotalFundingByEventId,
} from "@/lib/data/funding";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");
    const total = searchParams.get("total");

    if (!eventId) {
      return NextResponse.json(
        { error: "Missing eventId parameter" },
        { status: 400 }
      );
    }

    if (total === "true") {
      const totalFunding = await getTotalFundingByEventId(eventId);
      return NextResponse.json({ total: totalFunding });
    }

    const funding = await getFundingsByEventId(eventId);
    return NextResponse.json(funding);
  } catch (error) {
    console.error("Error fetching funding:", error);
    return NextResponse.json(
      { error: "Failed to fetch funding" },
      { status: 500 }
    );
  }
}
