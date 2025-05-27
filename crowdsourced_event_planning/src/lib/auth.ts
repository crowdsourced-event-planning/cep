import { cookies } from "next/headers";
import { verifyToken } from "./jwt";

export async function getUserFromToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");
  if (!token) return null;

  try {
    const user: Promise<{ _id: string; name: string }> = verifyToken(
      token.value
    );
    return user;
  } catch (error: unknown) {
    console.error("Token verification failed:", error);
    return null;
  }
}
