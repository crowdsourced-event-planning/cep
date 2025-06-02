import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import {
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  processCompletedTransaction,
} from "@/lib/data/transaction";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ transactionId: string }> }
) {
  try {
    const user = await getUserFromToken();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const transactionId = resolvedParams.transactionId;

    const transaction = await getTransactionById(transactionId);
    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Check if the transaction belongs to the current user
    if (transaction.userId !== user._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...transaction,
        _id: transaction._id?.toString(),
      },
    });
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return NextResponse.json(
      { error: "Failed to fetch transaction" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ transactionId: string }> }
) {
  try {
    const user = await getUserFromToken();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const transactionId = resolvedParams.transactionId;

    const transaction = await getTransactionById(transactionId);

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Check if the transaction belongs to the current user
    if (transaction.userId !== user._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const data = await request.json(); // Only allow updating certain fields
    const allowedFields = ["description"];
    const updateData: Record<string, string> = {};

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    }

    // Special case for status update
    if (data.status === "completed" && transaction.status !== "completed") {
      await processCompletedTransaction(transactionId);
    } else if (data.status) {
      updateData.status = data.status;
    }

    const updatedTransaction = await updateTransaction(
      transactionId,
      updateData
    );

    return NextResponse.json({
      success: true,
      message: "Transaction updated successfully",
      data: {
        ...updatedTransaction,
        _id: updatedTransaction?._id?.toString(),
      },
    });
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ transactionId: string }> }
) {
  try {
    const user = await getUserFromToken();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const transactionId = resolvedParams.transactionId;

    const transaction = await getTransactionById(transactionId);

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Check if the transaction belongs to the current user
    if (transaction.userId !== user._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Only allow deleting pending transactions
    if (transaction.status !== "pending") {
      return NextResponse.json(
        { error: "Can only delete pending transactions" },
        { status: 400 }
      );
    }

    await deleteTransaction(transactionId);

    return NextResponse.json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}
