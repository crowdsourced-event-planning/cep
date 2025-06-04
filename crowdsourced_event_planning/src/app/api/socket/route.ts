import { NextResponse } from "next/server";

export async function GET() {
  // Implementasi socket server (atau return kosong jika hanya untuk inisialisasi)
  return NextResponse.json({ ok: true });
}
