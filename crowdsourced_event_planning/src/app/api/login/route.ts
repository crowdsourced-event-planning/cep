import { NextRequest, NextResponse } from "next/server";
import CustomError from "@/db/exceptions/CustomError";
import UserModel from "@/db/models/UserModel";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = await UserModel.login(body);

    // Ambil user dari database
    const user = await UserModel.getByEmail(body.email);

    // Kembalikan token dan user (minimal _id)
    return NextResponse.json(
      { access_token: token.access_token, user: { _id: user?._id } },
      { status: 200 }
    );
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      const error = err.errors[0];
      return NextResponse.json(
        { message: `${error.path[0]} - ${error.message}` },
        { status: 400 }
      );
    } else if (err instanceof CustomError) {
      return NextResponse.json(
        { message: err.message },
        { status: err.statusCode }
      );
    } else {
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}
