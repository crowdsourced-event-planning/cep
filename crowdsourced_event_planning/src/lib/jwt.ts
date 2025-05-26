import { SignJWT, jwtVerify, JWTPayload, errors } from "jose";

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const encoder = new TextEncoder();
const secretKey = encoder.encode(JWT_SECRET);

interface IPayload {
  _id: string;
  name: string;
  [key: string]: unknown;
}

export async function signToken(payload: IPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(secretKey);
}

export async function verifyToken<T = JWTPayload>(token: string): Promise<T> {
  try {
    const { payload } = await jwtVerify(token, secretKey);

    return payload as T;
  } catch (error) {
    if (error instanceof errors.JWTExpired) {
      console.warn("Token expired:", error);
    } else {
      console.error("Token invalid:", error);
    }
    throw error;
  }
}
