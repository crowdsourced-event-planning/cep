import TransactionModel from "@/db/models/TransactionModel";
import { NextRequest, NextResponse } from "next/server";
import { InvoiceCallback } from "xendit-node/invoice/models";

export async function POST(req: NextRequest) {
  try {
    const callbackToken = req.headers.get("x-callback-token")?.trim();
    const VALID_TOKEN = process.env.XENDIT_CALLBACK_TOKEN;

    if (callbackToken !== VALID_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = (await req.json()) as InvoiceCallback;

    if (!data?.id || !data?.status) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    console.log(
      `Received callback for invoice ${data.id}, status: ${data.status}`
    );

    await TransactionModel.update({ status: data.status, xenditId: data.id });

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
