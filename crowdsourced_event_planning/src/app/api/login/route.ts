import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/db/models/UserModel";
import CustomError from "@/db/exceptions/CustomError";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user, access_token } = await UserModel.login(body);

    return NextResponse.json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      access_token,
    });
  } catch (err: unknown) {
    if (err instanceof CustomError) {
      return NextResponse.json(
        { message: err.message },
        { status: err.statusCode }
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
