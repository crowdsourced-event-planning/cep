import mongoose, { model } from "mongoose";
import { hashPassword, comparePassword } from "@/lib/bcrypt";
import CustomError from "@/db/exceptions/CustomError";
import { signToken } from "@/lib/jwt";
import { z } from "zod";
import { dbConnect } from "../config/mongoose";
import { IUser, UserSchema } from "../schemas/user.schema";
import { validateObjectId } from "../utils/validateObjectId";

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

const User = mongoose.models.User || model<IUser>("User", UserSchema);

export default class UserModel {
  static async getById(id: string): Promise<IUser | null> {
    await dbConnect();

    validateObjectId(id, "User ID");

    const user = await User.findById<IUser>(id).lean<IUser>();

    return user;
  }

  static async getByEmail(email: string): Promise<IUser | null> {
    await dbConnect();

    const user = await User.findOne<IUser>({ email }).lean<IUser>();

    return user;
  }

  static async create(userData: Partial<IUser>): Promise<IUser> {
    await dbConnect();

    const user = new User(userData);
    const savedUser = await user.save();
    return savedUser.toObject();
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

    validateObjectId(id, "User ID");

    return await User.findByIdAndUpdate<IUser>(id, data, {
      new: true,
    }).lean<IUser>();
  }
  static async delete(id: string): Promise<string> {
    await dbConnect();

    validateObjectId(id, "User ID");

    await User.findByIdAndDelete(id);
    return "User deleted";
  }

  static async deleteMany(
    filter: Record<string, unknown> = {}
  ): Promise<boolean> {
    await dbConnect();
    const result = await User.deleteMany(filter);
    return result.acknowledged;
  }
}
