import { NextRequest, NextResponse } from "next/server";
import CustomError from "@/db/exceptions/CustomError";
import UserModel from "@/db/models/UserModel";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = await UserModel.login(body);

    return NextResponse.json(token, { status: 200 });
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
        { status: err.status }
      );
    } else {
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}
