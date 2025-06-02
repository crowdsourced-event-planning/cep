import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Daftar path yang memerlukan login (bukan role creator)
const protectedPaths = [
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

  // Cek jika path butuh login
  const needsAuth = protectedPaths.some(
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
    // HAPUS pengecekan role creator di sini!
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/event/create/:path*",
    "/api/events/:path*",
    "/api/workbooks/:path*",
    "/event/:path*/workbook/:path*/task/:path*",
  ],
};
