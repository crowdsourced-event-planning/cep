import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";

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

  const isApiRoute =
    (pathname.startsWith("/api/events") &&
      (pathname.includes("/workbooks") || pathname.includes("/join"))) ||
    pathname.startsWith("/api/tasks");

  const isProtectedPage = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  // If route is API and needs auth
  if (isApiRoute) {
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
  }

  // If protected UI page and no token
  if (isProtectedPage && !isApiRoute) {
    if (!token || !userId) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next();

  // Attach JWT payload to headers if available
  if (token) {
    try {
      const payload = decodeJwt(token);
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

export const config = {
  matcher: [
    "/transaksi/:path*",
    "/chat/:path*",
    "/komentar/:path*",
    "/create",
    "/event/:slug/workbook/:workbook/task/new",
    "/event/:slug/chat/:path*",
    "/event/create",
    "/api/events/create",
    "/api/events/:id/update",
    "/api/events/:id/delete",
    "/api/events/:slug/workbooks",
    "/api/events/:slug/join",
    "/api/tasks/:path*",
  ],
};
