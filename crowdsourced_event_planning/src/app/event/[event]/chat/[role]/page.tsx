import { getUserAction } from "./action";
import ChatPageClient from "./ChatPageClient";
import { notFound } from "next/navigation";
import { getEventBySlug } from "@/lib/data/event";
import { isPanitiaApproved } from "@/lib/data/panitiaRequest";
import { isUserJoinedEvent } from "@/lib/data/userevent";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ event: string; role: string }>;
}) {
  const { event, role } = await params;
  const currentUser = await getUserAction();
  if (!currentUser) return notFound();

  const eventData = await getEventBySlug(event);
  if (!eventData) return notFound();

  const eventId = eventData._id?.toString() || "";
  const isPanitia = await isPanitiaApproved(eventId, currentUser._id);

  // Tambahkan pengecekan join event di sini
  const isJoined = await isUserJoinedEvent(eventId, currentUser._id);

  // Panitia (approved) dan creator boleh akses room admin
  if (
    role === "admin" &&
    !(isPanitia || eventData.creator?.toString() === currentUser._id)
  ) {
    return notFound();
  }

  // Semua yang sudah join event, panitia, atau creator boleh akses member
  if (
    role === "member" &&
    !(
      isJoined ||
      isPanitia ||
      eventData.creator?.toString() === currentUser._id
    )
  ) {
    return notFound();
  }

  return (
    <ChatPageClient currentUser={currentUser} eventId={eventId} role={role} />
  );
}
