import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";

// Daftar path yang memerlukan login (bukan role creator)
const protectedPaths = [
  "/event/create",
  "/api/events/create",
  "/api/events/[id]/update",
  "/api/events/[id]/delete",
  "/api/workbooks/create",
  "/event/[slug]/workbook/[workbook]/task/new",
  "/create",
  "/api/events",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;
  const userId = request.cookies.get("x-user-id")?.value;

  // Check if path needs authentication
  // (removed unused needsAuth variable)

  // Protect API events (workbooks/join) and tasks
  if (
    (pathname.startsWith("/api/events") &&
      (pathname.includes("/workbooks") || pathname.includes("/join"))) ||
    pathname.startsWith("/api/tasks")
  ) {
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // For regular pages
    if (
      protectedPaths.some((path) => pathname.startsWith(path)) &&
      !pathname.startsWith("/api/")
    ) {
      if (!token || !userId) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    const response = NextResponse.next();
    if (token) {
      try {
        const payload = decodeJwt(token);
        // console.log(payload, "<<<< ini payload");
        response.headers.set(
          "x-jwt-payload",
          encodeURIComponent(JSON.stringify(payload))
        );
      } catch (err) {
        console.error("❌ Failed to decode token:", err);
      }
    }
    return response;
  }
}
export const config = {
  matcher: [
    "/transaksi/:path*",
    "/chat/:path*",
    "/komentar/:path*",
    "/create",
    "/api/events/:slug/workbooks",
    "/api/events/:slug/join",
    "/api/tasks",
  ],
};
