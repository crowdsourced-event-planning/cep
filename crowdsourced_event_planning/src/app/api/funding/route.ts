import { NextRequest, NextResponse } from "next/server";
import {
  createFunding,
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, userId, eventId, message, isAnonymous } = body;

    if (!amount || !userId || !eventId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0" },
        { status: 400 }
      );
    }
    const fundingData = {
      amount: Number(amount),
      userId,
      eventId,
      message: message || "",
      isAnonymous: Boolean(isAnonymous),
      status: "pending",
      createdAt: new Date(),
    };

    const newFunding = await createFunding(fundingData);
    return NextResponse.json(newFunding, { status: 201 });
  } catch (error) {
    console.error("Error creating funding:", error);
    return NextResponse.json(
      { error: "Failed to create funding" },
      { status: 500 }
    );
  }
}
