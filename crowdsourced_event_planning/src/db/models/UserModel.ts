import { ObjectId } from "mongodb";
import { hashPassword, comparePassword } from "@/lib/bcrypt";
import CustomError from "@/db/exceptions/CustomError";
import { signToken } from "@/lib/jwt";
import { z } from "zod";
import { getDb } from "../config/mongodb";

export interface IUser {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  role?: string;
  badge?: string;
  balance?: number;
  totalRating?: number;
  totalUserRating?: number;
  createdEvents?: string[];
  joinedEvents?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

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
  private static readonly COLLECTION_NAME = "users";

  static async getById(id: string): Promise<IUser | null> {
    const db = await getDb();
    const user = await db
      .collection<IUser>(this.COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });
    return user;
  }

  static async getByEmail(email: string): Promise<IUser | null> {
    const db = await getDb();
    const user = await db
      .collection<IUser>(this.COLLECTION_NAME)
      .findOne({ email });
    return user;
  }

  static async create(userData: Partial<IUser>): Promise<IUser> {
    const db = await getDb();
    const now = new Date();
    const userToInsert: IUser = {
      _id: new ObjectId(),
      name: userData.name!,
      email: userData.email!,
      password: userData.password!,
      role: userData.role || "user",
      badge: userData.badge || "",
      balance: userData.balance || 0,
      totalRating: userData.totalRating || 0,
      totalUserRating: userData.totalUserRating || 0,
      createdEvents: userData.createdEvents || [],
      joinedEvents: userData.joinedEvents || [],
      createdAt: now,
      updatedAt: now,
    };
    await db.collection<IUser>(this.COLLECTION_NAME).insertOne(userToInsert);
    return userToInsert;
  }

  static async register(payload: z.infer<typeof userSchema>): Promise<string> {
    userSchema.parse(payload);
    const db = await getDb();

    const isExist = await db
      .collection<IUser>(this.COLLECTION_NAME)
      .findOne({ email: payload.email });
    if (isExist) throw new CustomError("Email already registered", 400);
    const now = new Date();
    const user: IUser = {
      _id: new ObjectId(),
      name: payload.name,
      email: payload.email,
      password: await hashPassword(payload.password),
      role: "user",
      badge: "",
      balance: 0,
      totalRating: 0,
      totalUserRating: 0,
      createdEvents: [],
      joinedEvents: [],
      createdAt: now,
      updatedAt: now,
    };

    await db.collection<IUser>(this.COLLECTION_NAME).insertOne(user);
    return "Registration successful";
  }

  static async login(payload: ILoginInput): Promise<ILoginResponse> {
    loginSchema.parse(payload);
    const db = await getDb();

    const user = await db
      .collection<IUser>(this.COLLECTION_NAME)
      .findOne({ email: payload.email });
    if (!user) throw new CustomError("Invalid email/password", 401);

    const isValid = await comparePassword(payload.password, user.password);
    if (!isValid) throw new CustomError("Invalid email/password", 401);

    const token = await signToken({
      _id: user._id!.toString(),
      name: user.name,
    });

    return { access_token: token };
  }

  static async update(id: string, data: Partial<IUser>): Promise<IUser | null> {
    const db = await getDb();

    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    const result = await db
      .collection<IUser>(this.COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: "after" }
      );

    return result || null;
  }

  static async delete(id: string): Promise<string> {
    const db = await getDb();

    await db
      .collection<IUser>(this.COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(id) });
    return "User deleted";
  }

  static async deleteMany(
    filter: Record<string, unknown> = {}
  ): Promise<boolean> {
    const db = await getDb();
    const result = await db
      .collection<IUser>(this.COLLECTION_NAME)
      .deleteMany(filter);
    return result.acknowledged;
  }
}
