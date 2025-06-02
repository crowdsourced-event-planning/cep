
import { getUserAction } from "./action";
import ChatPageClient from "./ChatPageClient";
import { notFound } from "next/navigation";
import { UserEventModel } from "@/db/models/UserEventModel";

interface Props {
  params: {
    event: string;
    role: string;
  };
}

export default async function ChatPage({ params }: Props) {
  const { event, role } = params;
  const currentUser = await getUserAction();
  if (!currentUser) return notFound();

  const userEvent = await UserEventModel.getUserEventsByUserId(currentUser._id);
  const thisEvent = userEvent.find((ue) => ue.eventId === event);

  if (!thisEvent) return notFound();

  const isAdmin = thisEvent.role === "admin";
  const isTryingToAccessAdminRoom = role === "admin";

  // Member tidak boleh akses room admin
  if (!isAdmin && isTryingToAccessAdminRoom) return notFound();

  return (
    <ChatPageClient
      currentUser={currentUser}
      eventId={event}
      role={role}
    />
  );
}
