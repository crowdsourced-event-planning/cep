import { getDb } from "@/db/config/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const { eventId, userId, workbookId } = await req.json();

    if (!eventId || !userId) {
      return NextResponse.json(
        { error: "eventId dan userId wajib diisi" },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Cek apakah sudah pernah request
    const existing = await db.collection("panitia_requests").findOne({
      eventId: new ObjectId(eventId),
      userId: new ObjectId(userId),
      workbookId: new ObjectId(workbookId),
    });

    if (existing) {
      return NextResponse.json(
        { error: "Kamu sudah pernah request untuk event ini." },
        { status: 409 }
      );
    }

    // Simpan request baru dengan ObjectId
    await db.collection("panitia_requests").insertOne({
      eventId: new ObjectId(eventId),
      userId: new ObjectId(userId),
      workbookId: new ObjectId(workbookId),
      status: "pending",
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.log("🚀 ~ POST ~ err:", err);
    return NextResponse.json(
      { error: "Gagal menyimpan request panitia." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const creatorId = searchParams.get("creatorId");

  const db = await getDb();

  if (creatorId) {
    // Ambil semua event yang creator-nya user ini
    const events = await db
      .collection("events")
      .find({
        $or: [{ creator: creatorId }, { creator: new ObjectId(creatorId) }],
      })
      .toArray();
    const eventIds = events.map((e) => e._id); // array of ObjectId
    const requests = await db
      .collection("panitia_requests")
      .find({ eventId: { $in: eventIds } }) // eventId harus ObjectId
      .sort({ createdAt: -1 })
      .toArray();

    // Ambil semua user yang request
    const userIds = [...new Set(requests.map((r) => r.userId))];
    const users = await db
      .collection("users")
      .find({ _id: { $in: userIds.map((id) => new ObjectId(id)) } })
      .toArray();
    const userMap = Object.fromEntries(
      users.map((u) => [u._id.toString(), u.name])
    );

    // Optionally join event title
    // Ambil eventSlug dan workbookSlug dari event dan workbook
    const eventMap = Object.fromEntries(
      events.map((e) => [e._id.toString(), { title: e.title, slug: e.slug }])
    );
    const workbookIds = [...new Set(requests.map((r) => r.workbookId))];
    const workbooks = await db
      .collection("workbooks")
      .find({ _id: { $in: workbookIds.map((id) => new ObjectId(id)) } })
      .toArray();
    const workbookMap = Object.fromEntries(
      workbooks.map((w) => [w._id.toString(), { name: w.name, slug: w.slug }])
    );

    return NextResponse.json({
      // mapping di API GET
      requests: requests.map((r) => ({
        ...r,
        _id: r._id.toString(),
        eventId: r.eventId.toString(),
        userId: r.userId.toString(),
        workbookId: r.workbookId.toString(),
        eventTitle: eventMap[r.eventId.toString()]?.title || "",
        eventSlug: eventMap[r.eventId.toString()]?.slug || "",
        userName: userMap[r.userId.toString()] || r.userId.toString(),
        workbookTitle:
          workbookMap[r.workbookId.toString()]?.name || r.workbookId.toString(),
        workbookSlug: workbookMap[r.workbookId.toString()]?.slug || "",
      })),
    });
  }

  return NextResponse.json({ requests: [] });
}
