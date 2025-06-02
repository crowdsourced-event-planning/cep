import { NextRequest, NextResponse } from "next/server";
import {
  getTransactionById,
  updateTransactionStatus,
  processCompletedTransaction,
} from "@/lib/data/transaction";

// This endpoint would receive webhooks from payment gateways like Midtrans
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Extract data from webhook payload
    // The actual implementation would depend on the payment gateway's webhook format
    // This is just a simplified example

    const transactionId = data.order_id || data.transactionId;
    const transactionStatus = data.transaction_status || data.status;

    if (!transactionId) {
      return NextResponse.json(
        { error: "Transaction ID not found in webhook payload" },
        { status: 400 }
      );
    }

    // Verify the transaction exists in our system
    const transaction = await getTransactionById(transactionId);

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Map payment gateway status to our system status
    let systemStatus: string;

    switch (transactionStatus) {
      case "settlement":
      case "capture":
      case "success":
        systemStatus = "completed";
        break;
      case "pending":
        systemStatus = "pending";
        break;
      case "deny":
      case "cancel":
      case "expire":
      case "failure":
        systemStatus = "failed";
        break;
      default:
        systemStatus = "pending";
    }

    // If transaction is completed, process it
    if (systemStatus === "completed") {
      await processCompletedTransaction(transactionId);
    } else {
      // Otherwise just update the status
      await updateTransactionStatus(transactionId, systemStatus);
    }

    // Return success response to the payment gateway
    return NextResponse.json({
      success: true,
      message: "Webhook processed successfully",
    });
  } catch (error) {
    console.error("Error processing payment webhook:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}
