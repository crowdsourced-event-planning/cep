"use server";

import { cookies } from "next/headers";
import { database } from "@/lib/firebase";
import { ref, push } from "firebase/database";

export default async function doDonation(formData: FormData) {
  const amount = Number(formData.get("amount"));
  const message = formData.get("message") as string;
  const eventSlug = formData.get("eventSlug") as string;

  // Ganti endpoint di sini:
  const eventRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${eventSlug}`
  );
  const eventData = await eventRes.json();
  if (!eventRes.ok || !eventData._id) {
    throw new Error("Event tidak ditemukan");
  }
  const eventId = eventData._id;

  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/transaction/donation`, // ubah dari transactions ke transaction
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": `access_token=${token}`,
      },
      body: JSON.stringify({ amount, message, eventId }),
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Donasi gagal");

  const userId = cookieStore.get("x-user-id")?.value || "";
  const userName = ""; // Ambil nama user jika ada, atau kosong

  await push(ref(database, `event_notifications/${eventId}`), {
    userId, // id user yang donasi
    userName, // nama user
    amount, // nominal donasi
    createdAt: Date.now(),
  });

  return data;
}
