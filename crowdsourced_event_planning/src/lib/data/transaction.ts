import { TransactionModel, ITransaction } from "@/db/models/TransactionModel";
import { updateUserBalance } from "./user";
import { updateEventFunding } from "./event";

export async function getTransactionsByUserId(
  userId: string
): Promise<ITransaction[]> {
  return TransactionModel.getTransactionsByUserId(userId);
}

export async function getTransactionById(
  transactionId: string
): Promise<ITransaction | null> {
  return TransactionModel.getTransactionById(transactionId);
}

export async function getTransactionsByEventId(
  eventId: string
): Promise<ITransaction[]> {
  return TransactionModel.getTransactionsByEventId(eventId);
}

export async function createTransaction(
  transactionData: Partial<ITransaction>
): Promise<ITransaction> {
  return TransactionModel.createTransaction(transactionData);
}

export async function updateTransaction(
  transactionId: string,
  transactionData: Partial<ITransaction>
): Promise<ITransaction | null> {
  return TransactionModel.updateTransaction(transactionId, transactionData);
}

export async function updateTransactionStatus(
  transactionId: string,
  status: string
): Promise<ITransaction | null> {
  return TransactionModel.updateTransactionStatus(transactionId, status);
}

// Process a completed transaction - update user balance and event funding if needed
export async function processCompletedTransaction(
  transactionId: string
): Promise<boolean> {
  const transaction = await TransactionModel.getTransactionById(transactionId);

  if (!transaction || transaction.status === "completed") {
    return false;
  }

  // Update transaction status to completed
  await TransactionModel.updateTransactionStatus(transactionId, "completed");

  // Handle different transaction types
  if (transaction.type === "topup") {
    // Add amount to user balance
    await updateUserBalance(transaction.userId, transaction.amount);
    return true;
  } else if (transaction.type === "funding" && transaction.eventId) {
    // Add funding to event and deduct from user balance
    await updateEventFunding(transaction.eventId, transaction.amount);
    await updateUserBalance(transaction.userId, -transaction.amount);
    return true;
  }

  return false;
}

export async function deleteTransaction(
  transactionId: string
): Promise<boolean> {
  return TransactionModel.deleteTransaction(transactionId);
}

export async function getTotalTransactionsByType(
  type: string
): Promise<number> {
  return TransactionModel.getTotalTransactionsByType(type);
}
