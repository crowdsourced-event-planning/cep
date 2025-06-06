"use server";
import { headers } from "next/headers";

export async function getUserAction() {
  const hdrs = await headers();
  const payload = hdrs.get("x-jwt-payload");
  console.log("JWT Payload:", payload); // Debugging
  if (!payload) return null;
  try {
    const user = JSON.parse(decodeURIComponent(payload));
    console.log("Parsed User:", user); // Debugging
    return user;
  } catch {
    return null;
  }
}
