import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";

// Daftar path yang memerlukan role creator
const creatorPaths = [
  "/event/create",
  "/api/events/create",
  "/api/events/[id]/update",
  "/api/events/[id]/delete",
  "/api/workbooks/create",
  "/event/[slug]/workbook/[workbook]/task/new",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;
  const userId = request.cookies.get("x-user-id")?.value;
  const role = request.cookies.get("user-role")?.value;

  // Cek jika path butuh login
  const needsAuth = creatorPaths.some(
    (path) =>
      pathname.includes(path) ||
      pathname.startsWith("/api/workbooks") ||
      pathname.includes("/edit")
  );

  if (needsAuth) {
    if (!token || !userId) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Cek role untuk path yang membutuhkan role creator
    if (
      creatorPaths.some((path) => pathname.includes(path)) &&
      role !== "creator"
    ) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
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

export const config = {
  matcher: [
    "/transaksi/:path*",
    "/chat/:path*",
    "/komentar/:path*",
    "/event/:event",
    "/event/:event/chat/:path*",
    "/event/create/:path*",
    "/api/events/:path*",
    "/api/workbooks/:path*",
    "/event/:path*/workbook/:path*/task/:path*",
  ],
};
