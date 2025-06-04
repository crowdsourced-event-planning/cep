import { getUserAction } from "./action";
import ChatPageClient from "./ChatPageClient";
import { notFound } from "next/navigation";
import { UserEventModel } from "@/db/models/UserEventModel";
import { getEventBySlug } from "@/lib/data/event";
import { IEvent } from "@/db/models/EventModel";
// import { getUserRoleInEvent } from "@/lib/data/userevent";

interface Props {
  params: Promise<{
    slug: string;
    role: string;
  }>;
}

export default async function ChatPage({ params }: Props) {
  const { slug, role } = await params;
  const currentUser = await getUserAction();
  if (!currentUser) return notFound();

  const event: IEvent | null = await getEventBySlug(slug);
  if (!event) {
    console.log("event tidak ada <<<<");
    return notFound();
  }

  const roleUser = await UserEventModel.getUserRoleInEvent(
    currentUser._id,
    event._id!.toString()
  );

  if (!roleUser) return notFound();
  // const userEvent = await UserEventModel.getUserEventsByUserId(currentUser._id);
  // const thisEvent = userEvent.find(
  //   (ue) => ue.eventId === event._id?.toString()
  // );

  // if (!thisEvent) {
  //   console.log("this event tidak ada <<<<");
  //   return notFound();
  // }

  // const isAdmin = thisEvent.role === "admin";
  const isAdmin = roleUser === "admin";
  const isTryingToAccessAdminRoom = role === "admin";

  // Member tidak boleh akses room admin
  if (!isAdmin && isTryingToAccessAdminRoom) return notFound();

  return (
    <ChatPageClient
      currentUser={currentUser}
      eventId={event._id?.toString() || ""}
      role={role}
    />
  );
}
