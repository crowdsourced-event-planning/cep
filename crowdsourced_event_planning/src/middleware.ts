import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Daftar path yang wajib login
const protectedPaths = ["/transaksi", "/chat", "/komentar"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;

  // Cek jika path butuh login
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
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
  matcher: ["/transaksi/:path*", "/chat/:path*", "/komentar/:path*"],
};