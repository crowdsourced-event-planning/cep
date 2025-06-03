'use server';

import { cookies } from "next/headers";
import { database } from "@/lib/firebase";
import { ref, push } from "firebase/database";

export default async function doDonation(formData: FormData) {
    const amount = Number(formData.get("amount"));
    const message = formData.get("message") as string;
    const eventSlug = formData.get("eventSlug") as string;

    const eventRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/event/${eventSlug}`);
    const eventData = await eventRes.json();
    if (!eventRes.ok || !eventData.data?._id) {
        throw new Error("Event tidak ditemukan");
    }
    const eventId = eventData.data._id;

    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/transactions/donation`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `access_token=${token}`,
        },
        body: JSON.stringify({ amount, message, eventId }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Donasi gagal");

    await push(ref(database, `event_notifications/${eventId}`), {
        message: `Donasi baru untuk event ini!`,
        // name: userName,
        createdAt: Date.now(),
    });

    return data;
}