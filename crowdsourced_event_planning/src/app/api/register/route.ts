import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/db/models/UserModel";
import { ZodError } from "zod";
import CustomError from "@/db/exceptions/CustomError";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const message = await UserModel.register(body);

    return NextResponse.json({ message: message }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      const err = error.errors[0];
      return NextResponse.json(
        { message: `${err.path[0]} - ${err.message}` },
        { status: 400 }
      );
    } else if (error instanceof CustomError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.statusCode }
      );
    } else {
      console.log(error);
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}
