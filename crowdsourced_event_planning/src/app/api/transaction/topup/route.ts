import TransactionModel from "@/db/models/TransactionModel";
import UserModel, { IUser } from "@/db/models/UserModel";
import { verifyToken } from "@/lib/jwt";
// import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Invoice as InvoiceClient, XenditSdkError } from "xendit-node";
import { CreateInvoiceRequest, Invoice } from "xendit-node/invoice/models";

export async function POST(req: NextRequest) {
  let amount: number;
  try {
    const secretKey = process.env.XENDIT_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { message: "Xendit secret key no found" },
        { status: 400 }
      );
    }

    // const cookieStore = await cookies();
    // const token = cookieStore.get("access_token")?.value;
    const token = req.cookies.get("access_token")?.value;
    console.log(req.cookies, "<<< req cookies");
    if (!token) {
      console.log("tidak ada token <<<<<<<");
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const payload: { _id: string; name: string } = await verifyToken(token);
    if (!payload) {
      console.log("tidak ada payload <<<<<<<");
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const user: IUser | null = await UserModel.getById(payload._id);
    if (!user) {
      return NextResponse.json({ message: "Not Found" }, { status: 404 });
    }

    const body = await req.json();
    amount = Number(body.amount);
    console.log(typeof amount, "<<<<< amount");
    if (!amount || Number(amount) <= 0) {
      return NextResponse.json(
        { message: "Amount must be positive number" },
        { status: 400 }
      );
    }
    console.log("pass <<<<<");

    const xenditInvoiceClient = new InvoiceClient({ secretKey });

    const invoiceId = `invoice-${user._id}-${Date.now()}`;
    const INVOICE_DURATION = 60 * 60 * 24 * 2;

    const data: CreateInvoiceRequest = {
      amount: amount,
      invoiceDuration: INVOICE_DURATION,
      externalId: invoiceId,
      description: "Topup",
      currency: "IDR",
      reminderTime: 1,
    };

    console.log(secretKey, "secret key");
    console.log(data, "<<< data");

    const response: Invoice = await xenditInvoiceClient.createInvoice({
      data,
    });

    await TransactionModel.create({
      userId: user._id,
      amount,
      status: response.status,
      type: "topup",
      xenditId: response.id,
      invoiceId,
      invoiceUrl: response.invoiceUrl,
    });

    return NextResponse.json(
      { invoiceUrl: response.invoiceUrl },
      { status: 200 }
    );
  } catch (err) {
    console.log(err, "<<<< error");
    if (err instanceof XenditSdkError) {
      return NextResponse.json(
        { error: err.errorMessage },
        { status: Number(err.status) }
      );
    } else {
      return NextResponse.json(
        { error: "Gagal membuat invoice" },
        { status: 500 }
      );
    }
  }
}
