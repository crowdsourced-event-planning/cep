"use server";
import { headers } from "next/headers";

export async function getUserAction() {
    const hdrs = await headers();
    const payload = hdrs.get("x-jwt-payload");
    if (!payload) return null;
    try {
        return JSON.parse(decodeURIComponent(payload));
    } catch {
        return null;
    }
}