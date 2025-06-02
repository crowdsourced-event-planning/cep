import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import {
  createTransaction,
  getTransactionsByUserId,
  updateTransactionStatus,
  processCompletedTransaction,
} from "@/lib/data/transaction";

// Get transactions for the current user
export async function GET() {
  try {
    const user = await getUserFromToken();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user._id;
    const transactions = await getTransactionsByUserId(userId);

    return NextResponse.json({
      success: true,
      data: transactions.map((transaction) => ({
        ...transaction,
        _id: transaction._id?.toString(),
      })),
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

// Create a new transaction
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user._id;
    const data = await request.json();

    // Validate required fields
    if (!data.amount || !data.type) {
      return NextResponse.json(
        { error: "Amount and type are required" },
        { status: 400 }
      );
    }

    // Create transaction with user ID from session
    const transaction = await createTransaction({
      userId,
      amount: Number(data.amount),
      type: data.type,
      eventId: data.eventId,
      description: data.description,
      status: "pending",
      // For now, we're not integrating with Midtrans
      // In a production app, we would create a Midtrans token and URL here
    });

    // For demo purposes, you might want to automatically complete the transaction
    // In a real app, this would be handled by a webhook from Midtrans
    if (data.autoComplete) {
      await processCompletedTransaction(transaction._id!.toString());
    }

    return NextResponse.json({
      success: true,
      message: "Transaction created successfully",
      data: {
        ...transaction,
        _id: transaction._id?.toString(),
      },
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}

// Update transaction status (e.g. for webhook handling)
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.transactionId || !data.status) {
      return NextResponse.json(
        { error: "Transaction ID and status are required" },
        { status: 400 }
      );
    }

    const transactionId = data.transactionId;
    const status = data.status;

    if (status === "completed") {
      const success = await processCompletedTransaction(transactionId);

      if (!success) {
        return NextResponse.json(
          { error: "Failed to process transaction" },
          { status: 400 }
        );
      }
    } else {
      await updateTransactionStatus(transactionId, status);
    }

    return NextResponse.json({
      success: true,
      message: "Transaction status updated successfully",
    });
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}
