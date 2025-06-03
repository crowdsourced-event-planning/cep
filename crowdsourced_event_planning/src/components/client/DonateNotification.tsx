'use client';

import { useEffect, useRef } from "react";
import { ref, onChildAdded, get } from "firebase/database";
import { database } from "@/lib/firebase";
import toast, { Toaster } from "react-hot-toast";

interface Props {
  eventId: string;
}

export default function DonateNotificationListener({ eventId }: Props) {
  const shownRef = useRef<Set<string>>(new Set());
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!eventId) return;

    const notifRef = ref(database, `event_notifications/${eventId}`);

    get(notifRef).then(snapshot => {
      if (snapshot.exists()) {
        Object.keys(snapshot.val() || {}).forEach(key => {
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
        toast(`${notif.name || "Seseorang"} baru saja berdonasi!`, {
          icon: '💸',
        });
      }
    });

    return () => unsub();
  }, [eventId]);

  return <Toaster position="top-center" />;
}