import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import TransactionModel from "@/db/models/TransactionModel";

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, message, eventId } = await request.json();
    if (!amount || !eventId) {
      return NextResponse.json(
        { error: "amount & eventId required" },
        { status: 400 }
      );
    }

    const transaction = await TransactionModel.donate({
      userId: user._id!.toString(),
      eventId,
      amount,
      message,
    });

    return NextResponse.json({
      success: true,
      message: "Donation successful",
      data: transaction,
    });
  } catch (error: unknown) {
    let errorMessage = "Failed to process donation";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
