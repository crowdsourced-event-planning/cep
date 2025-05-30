import UserModel from "@/db/models/UserModel";
import { IUser } from "@/db/schemas/user.schema";

export async function getUserById(userId: string): Promise<IUser | null> {
  return await UserModel.getById(userId);
}

export async function getUserByEmail(email: string): Promise<IUser | null> {
  return await UserModel.getByEmail(email);
}

export async function getUsersByIds(userIds: string[]): Promise<IUser[]> {
  const users: IUser[] = [];
  for (const userId of userIds) {
    const user = await UserModel.getById(userId);
    if (user) {
      users.push(user);
    }
  }
  return users;
}

export async function createUser(userData: Partial<IUser>): Promise<IUser> {
  return await UserModel.create(userData);
}

export async function updateUser(
  userId: string,
  userData: Partial<IUser>
): Promise<IUser | null> {
  return await UserModel.update(userId, userData);
}

export async function updateUserBalance(
  userId: string,
  amount: number
): Promise<IUser | null> {
  const user = await UserModel.getById(userId);
  if (!user) return null;

  const newBalance = user.balance + amount;
  return await UserModel.update(userId, { balance: newBalance });
}
