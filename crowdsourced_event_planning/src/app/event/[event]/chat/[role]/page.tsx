import { getUserAction } from "./action";
import ChatPageClient from "./ChatPageClient";
import { notFound } from "next/navigation";
import { UserEventModel } from "@/db/models/UserEventModel";
import { getEventBySlugOrId } from "@/lib/data/event";

interface Props {
  params: Promise<{
    event: string;
    role: string;
  }>;
}

export default async function ChatPage({ params }: Props) {
  const { event: eventParam, role } = await params;

  const currentUser = await getUserAction();
  if (!currentUser) {
    return notFound();
  }

  const event = await getEventBySlugOrId(eventParam);
  if (!event) {
    return notFound();
  }

  const isCreator = currentUser._id === event.creator.toString();

  const roleUser = await UserEventModel.getUserRoleInEvent(
    currentUser._id,
    event._id!.toString()
  );

  if (isCreator === false && !roleUser) {
    return notFound();
  }

  const isAdmin = roleUser === "admin";
  const isTryingToAccessAdminRoom = role === "admin";

  // Member tidak boleh akses room admin
  if (isAdmin === false && isCreator === false && isTryingToAccessAdminRoom) {
    return notFound();
  }

  return (
    <ChatPageClient
      currentUser={currentUser}
      eventId={event._id!.toString()}
      role={role}
      onClose={() => {}}
    />
  );
}
