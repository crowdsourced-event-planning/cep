import { cookies } from "next/headers";
import { getAllEvents } from "@/lib/data/event";
import EventCard from "@/components/EventCard";
export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await getAllEvents();

  const cookieStore = await cookies();
  const userId = cookieStore.get("x-user-id")?.value || "";

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">All Events</h1>
      {events.length === 0 ? (
        <div className="text-center text-gray-500 py-12">No events found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {events.map((event) => (
            <EventCard
              key={event._id?.toString() || ""}
              event={event}
              currentUserId={userId}
              showJoinButton={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
