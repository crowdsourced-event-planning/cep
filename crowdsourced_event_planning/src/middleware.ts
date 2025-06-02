import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";

// Daftar path yang wajib login
const protectedPaths = ["/transaksi", "/chat", "/komentar"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;
  console.log(token, "<<<< ini token")

  // Cek jika path butuh login
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next();
  if (token) {
    try {
      const payload = decodeJwt(token);
      console.log(payload, "<<<< ini payload");
      response.headers.set("x-jwt-payload", encodeURIComponent(JSON.stringify(payload)));
    } catch (err) {
      console.error("❌ Gagal mendekode token:", err);
    }
  }
  return response;
}

// Aktifkan middleware hanya untuk path tertentu
export const config = {
  matcher: [
    "/transaksi/:path*",
    "/chat/:path*",
    "/komentar/:path*",
    "/event/:event",
    "/event/:event/chat/:path*"],
};