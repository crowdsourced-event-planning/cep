// import TransactionModel, { ITransaction } from "@/db/models/TransactionModel";
// import { updateUserBalance } from "./user";
// import { updateEventFunding } from "./event";

// /**
//  * Ambil semua transaksi berdasarkan userId
//  */
// export async function getTransactionsByUserId(
//   userId: string
// ): Promise<ITransaction[]> {
//   return TransactionModel.getTransactionsByUserId(userId);
// }

// /**
//  * Ambil transaksi berdasarkan transactionId
//  */
// export async function getTransactionById(
//   transactionId: string
// ): Promise<ITransaction | null> {
//   return TransactionModel.getTransactionById(transactionId);
// }

// /**
//  * Ambil semua transaksi berdasarkan eventId
//  */
// export async function getTransactionsByEventId(
//   eventId: string
// ): Promise<ITransaction[]> {
//   return TransactionModel.getTransactionsByEventId(eventId);
// }

// /**
//  * Membuat transaksi baru (umum)
//  */
// export async function createTransaction(
//   transactionData: Partial<ITransaction>
// ): Promise<ITransaction> {
//   return TransactionModel.create(transactionData);
// }

// /**
//  * Update transaksi
//  */
// export async function updateTransaction(
//   transactionId: string,
//   transactionData: Partial<ITransaction>
// ): Promise<ITransaction | null> {
//   return TransactionModel.updateTransaction(transactionId, transactionData);
// }

// /**
//  * Update status transaksi
//  */
// export async function updateTransactionStatus(
//   transactionId: string,
//   status: string
// ): Promise<ITransaction | null> {
//   return TransactionModel.updateTransactionStatus(transactionId, status);
// }

// /**
//  * Proses transaksi donasi (langsung update funding dan balance)
//  */
// export async function donateTransaction(
//   userId: string,
//   eventId: string,
//   amount: number,
//   message?: string
// ): Promise<ITransaction> {
//   return TransactionModel.donate({ userId, eventId, amount, message });
// }

// /**
//  * Proses transaksi selesai (topup/funding)
//  */
// export async function processCompletedTransaction(
//   transactionId: string
// ): Promise<boolean> {
//   const transaction = await TransactionModel.getTransactionById(transactionId);

//   if (!transaction || transaction.status === "completed") {
//     return false;
//   }

//   // Update transaction status to completed
//   await TransactionModel.updateTransactionStatus(transactionId, "completed");

//   // Handle different transaction types
//   if (transaction.type === "topup") {
//     // Add amount to user balance
//     await updateUserBalance(transaction.userId.toString(), transaction.amount);
//     return true;
//   } else if (transaction.type === "funding" && transaction.eventId) {
//     // Add funding to event and deduct from user balance
//     await updateEventFunding(transaction.eventId, transaction.amount);
//     await updateUserBalance(transaction.userId.toString(), -transaction.amount);
//     return true;
//   }

//   return false;
// }

// /**
//  * Hapus transaksi
//  */
// export async function deleteTransaction(
//   transactionId: string
// ): Promise<boolean> {
//   return TransactionModel.deleteTransaction(transactionId);
// }

// /**
//  * Hitung total transaksi berdasarkan tipe
//  */
// export async function getTotalTransactionsByType(
//   type: string
// ): Promise<number> {
//   return TransactionModel.getTotalTransactionsByType(type);
// }
