import TransactionModel from "@/db/models/TransactionModel";
import UserModel, { IUser } from "@/db/models/UserModel";
import { verifyToken } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";
import { Invoice as InvoiceClient, XenditSdkError } from "xendit-node";
import { Invoice } from "xendit-node/invoice/models";

export async function POST(req: NextRequest) {
  try {
    const secretKey = process.env.XENDIT_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { message: "Xendit secret key no found" },
        { status: 500 }
      );
    }

    const token = req.cookies.get("access_token")?.value;
    if (!token) {
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
    const invoiceId = body.invoiceId;
    if (!invoiceId) {
      return NextResponse.json(
        { message: "Invoice ID is required" },
        { status: 400 }
      );
    }

    const xenditInvoiceClient = new InvoiceClient({ secretKey });

    const response: Invoice = await xenditInvoiceClient.getInvoiceById({
      invoiceId,
    });

    if (!response.id || !response.status) {
      return NextResponse.json(
        { message: "No response from xendit" },
        { status: 500 }
      );
    }

    if (response.status !== "PENDING") {
      await TransactionModel.update({
        status: response.status,
        xenditId: response.id,
      });

      return NextResponse.json(
        { message: "Update transaction successful" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { invoiceUrl: response.invoiceUrl },
        { status: 200 }
      );
    }
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
