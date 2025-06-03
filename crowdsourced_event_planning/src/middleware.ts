import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Daftar path yang wajib login
const protectedPaths = [
  "/transaksi",
  "/chat",
  "/komentar",
  "/create",
  "/api/events",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;

  // Proteksi API events (workbooks/join) dan tasks
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
  }

  // Untuk halaman biasa
  if (
    protectedPaths.some((path) => pathname.startsWith(path)) &&
    !pathname.startsWith("/api/")
  ) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Aktifkan middleware hanya untuk path tertentu
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
