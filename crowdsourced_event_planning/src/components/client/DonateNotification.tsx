"use client";

import { useEffect, useRef } from "react";
import { ref, onChildAdded, get } from "firebase/database";
import { database } from "@/lib/firebase";
import toast, { Toaster } from "react-hot-toast";

interface Props {
  eventId: string;
}

function getCurrentUserId() {
  // Ambil dari cookie (Next.js client)
  if (typeof document !== "undefined") {
    const match = document.cookie.match(/x-user-id=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : "";
  }
  return "";
}

export default function DonateNotificationListener({ eventId }: Props) {
  const shownRef = useRef<Set<string>>(new Set());
  const initializedRef = useRef(false);
  const userId = getCurrentUserId();

  useEffect(() => {
    if (!eventId) return;

    const notifRef = ref(database, `event_notifications/${eventId}`);

    get(notifRef).then((snapshot) => {
      if (snapshot.exists()) {
        Object.keys(snapshot.val() || {}).forEach((key) => {
          shownRef.current.add(key);
        });
      }
      initializedRef.current = true;
    });

    const unsub = onChildAdded(notifRef, (snapshot) => {
      const notif = snapshot.val();
      const key = snapshot.key;

      if (initializedRef.current && key && !shownRef.current.has(key)) {
        shownRef.current.add(key);
        // Tampilkan toast jika:
        // - user tidak login
        // - atau notif.userId !== userId (bukan donatur sendiri)
        if (!userId || notif.userId !== userId) {
          toast(`${notif.name || "Seseorang"} baru saja berdonasi!`, {
            icon: "💸",
          });
        }
      }
    });

    return () => unsub();
  }, [eventId, userId]);

  return <Toaster position="top-center" />;
}
