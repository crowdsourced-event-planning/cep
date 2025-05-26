import mongoose from "mongoose";
import User, { IUser } from "./User";
import { hashPassword, comparePassword } from "@/lib/bcrypt";
import CustomError from "@/db/exceptions/CustomError";
import { signToken } from "@/lib/jwt";
import { z } from "zod";
import { dbConnect } from "../config/mongoose";

const userSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8).max(64),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

interface ILoginInput {
  email: string;
  password: string;
}

interface ILoginResponse {
  access_token: string;
}

export default class UserModel {
  static async getById(id: string): Promise<IUser | null> {
    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const user = await User.findById<IUser>(id).lean<IUser>();

    return user;
  }

  static async register(payload: z.infer<typeof userSchema>): Promise<string> {
    await dbConnect();

    userSchema.parse(payload);
    const isExist = await User.findOne({ email: payload.email });
    if (isExist) throw new CustomError("Email already registered", 400);

    const user = new User({
      ...payload,
      password: await hashPassword(payload.password),
    });

    await user.save();
    return "Registration successful";
  }

  static async login(payload: ILoginInput): Promise<ILoginResponse> {
    await dbConnect();

    loginSchema.parse(payload);
    const user = await User.findOne({ email: payload.email });
    if (!user) throw new CustomError("Invalid email/password", 401);

    const isValid = await comparePassword(payload.password, user.password);
    if (!isValid) throw new CustomError("Invalid email/password", 401);

    const token = await signToken({
      _id: user._id.toString(),
      name: user.name,
    });

    return { access_token: token };
  }

  static async update(id: string, data: Partial<IUser>): Promise<IUser | null> {
    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await User.findByIdAndUpdate<IUser>(id, data, {
      new: true,
    }).lean<IUser>();
  }

  static async delete(id: string): Promise<string> {
    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(id))
      throw new CustomError("Invalid ID", 400);
    await User.findByIdAndDelete(id);
    return "User deleted";
  }
}
