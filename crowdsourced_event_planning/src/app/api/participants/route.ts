// src/app/api/participants/route.ts
import { NextResponse } from "next/server";
import { getParticipantsByEventId } from "@/lib/data/participant";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");
  if (!eventId)
    return NextResponse.json({ error: "eventId required" }, { status: 400 });
  const participants = await getParticipantsByEventId(eventId);
  return NextResponse.json(participants);
}
