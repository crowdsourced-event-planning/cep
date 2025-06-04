import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEventBySlugOrId } from "@/lib/data/event";
import { getWorkbooksByEventId } from "@/lib/data/workbook";
import Card from "@/components/ui/Card";
import { formatDateTime, formatCurrency } from "@/lib/utils/format";
import FundingTracker from "@/components/client/FundingTracker";
import CreateWorkbookButton from "@/components/client/CreateWorkbookButton";
import WorkbookListClient from "@/components/client/WorkbookListClient";
import { cookies } from "next/headers";
import { isPanitiaApproved } from "@/lib/data/panitiaRequest";
import { UserEventModel } from "@/db/models/UserEventModel";
import ShareEventButton from "@/components/client/ShareEventButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import EventGalleryWithModal from "@/components/client/EventGalleryWithModal";
import EventActions from "@/components/client/EventActions";
import Link from "next/link";
import Button from "@/components/ui/Button";
import DonateNotification from "@/components/client/DonateNotification";
import DonationButtonWithModal from "@/components/client/DonationButtonWithModal";

interface EventPageProps {
  params: Promise<{
    event: string;
  }>;
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { event: eventParam } = await params;
  const event = await getEventBySlugOrId(eventParam);

  if (!event) {
    return {
      title: "Event Not Found - Collabora",
    };
  }

  return {
    title: `${event.title} - Collabora`,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      type: "article",
      images:
        event.gallery && event.gallery.length > 0 ? [event.gallery[0]] : [],
    },
  };
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const { event: eventParam } = await params;
  try {
    const event = await getEventBySlugOrId(eventParam);
    if (!event) {
      notFound();
    }

    const userId = (await cookies()).get("x-user-id")?.value || "";
    const eventId = event._id?.toString() || "";

    // Fetch workbooks for the event
    const workbooks = await getWorkbooksByEventId(eventId);

    // Cek apakah user panitia approved
    const isPanitia = userId ? await isPanitiaApproved(eventId, userId) : false;
    // Cek apakah user sudah join event (member)
    // const isCreator = event.creator?.toString() === userId;
    // const cekRole = await UserEventModel.getUserRoleInEvent(userId, eventId);
    // const isAdmin = cekRole === "admin";
    const isJoined = userId
      ? await UserEventModel.isUserJoinedEvent(userId, eventId)
      : false;
    // Cek apakah user adalah creator
    const isCreator = event.creator?.toString() === userId;

    // Define the type for budget items
    type BudgetItem = {
      name?: string;
      amount?: number;
    };

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <DonateNotification eventId={eventId} />
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Events", href: "/events" },
              { label: event.title },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6 cursor-pointer">
              {/* Event Gallery & Documents */}
              {(event.gallery?.length > 0 || event.documents?.length > 0) && (
                <Card>
                  <div className="p-4 cursor-pointer">
                    <EventGalleryWithModal
                      images={event.gallery}
                      documents={event.documents}
                    />
                  </div>
                </Card>
              )}

              {/* Event Details */}
              <Card>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {event.title}
                    </h1>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        event.status === "open"
                          ? "bg-green-100 text-green-800"
                          : event.status === "closed"
                          ? "bg-red-100 text-red-800"
                          : event.status === "draft"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {event.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <strong>Location:</strong> {event.location}
                    </div>
                    <div>
                      <strong>Type:</strong> {event.typeEvent}
                    </div>
                    <div>
                      <strong>Start:</strong> {formatDateTime(event.startDate)}{" "}
                      - {event.startTime}
                    </div>
                    <div>
                      <strong>End:</strong> {formatDateTime(event.endDate)} -{" "}
                      {event.endTime}
                    </div>
                  </div>

                  <div>
                    {event.budget && event.budget.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Budget Breakdown
                        </h3>
                        <div className="space-y-2">
                          {(event.budget as BudgetItem[]).map((item, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center bg-gray-50 p-3 rounded"
                            >
                              <span>
                                {item.name || `Budget Item ${index + 1}`}
                              </span>
                              <span className="font-medium">
                                {formatCurrency(item.amount || 0)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Workbooks */}
              {isCreator || isJoined ? (
                <Card>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Workbooks
                      </h2>
                      {isCreator && (
                        <>
                          <CreateWorkbookButton
                            eventId={event.slug}
                            size="sm"
                            className="cursor-pointer"
                          >
                            Create Workbook
                          </CreateWorkbookButton>
                        </>
                      )}
                    </div>
                    {workbooks.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">
                          No workbooks created yet.
                        </p>
                        {/* {isCreator && (
                          <CreateWorkbookButton
                            eventId={event.slug}
                            size="sm"
                            className="mt-4"
                          >
                            Create First Workbook
                          </CreateWorkbookButton>
                        )} */}
                      </div>
                    ) : (
                      <WorkbookListClient
                        eventSlug={event.slug}
                        workbooks={workbooks.map((w) => ({
                          ...w,
                          _id: w._id.toString(),
                          eventId: w.eventId.toString(),
                          createdAt:
                            w.createdAt instanceof Date
                              ? w.createdAt.toISOString()
                              : w.createdAt,
                          updatedAt:
                            w.updatedAt instanceof Date
                              ? w.updatedAt.toISOString()
                              : w.updatedAt,
                        }))}
                        isCreator={isCreator}
                      />
                    )}
                  </div>
                </Card>
              ) : (
                // Jika bukan creator dan belum join, tampilkan info
                <Card>
                  <div className="text-center py-8 text-gray-500">
                    Join this event to view workbooks.
                  </div>
                </Card>
              )}
            </div>{" "}
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Funding Progress */}{" "}
              <FundingTracker
                eventId={eventId}
                targetAmount={event.targetFunding}
              />
              {/* Event Actions */}
              <Card>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Actions</h3>
                  {/* Hanya tampilkan tombol donasi jika event masih open */}
                  {event.status === "open" && (
                    <DonationButtonWithModal
                      eventSlug={event.slug}
                      userId={userId}
                    />
                  )}
                  <EventActions
                    isCreator={isCreator}
                    event={{
                      ...event,
                      _id: event._id?.toString() || "",
                      creator:
                        event.creator?.toString?.() || event.creator || "",
                      // tambahkan field lain jika perlu
                      // hindari passing object MongoDB/Buffer
                    }}
                    isJoined={isJoined}
                  />
                  <ShareEventButton
                    url={`${process.env.NEXT_PUBLIC_BASE_URL}/event/${event.slug}`}
                  />
                </div>
              </Card>
              {/* Event Chat */}
              <Card>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Event Discussion</h3>
                  <p className="text-sm text-gray-600">
                    Join the event to participate in discussions!
                  </p>

                  {(isPanitia || isCreator) && (
                    <div className="w-full">
                      <Link href={`/event/${event.slug}/chat/admin`}>
                        <Button className="w-full">Group Chat Panitia</Button>
                      </Link>
                    </div>
                  )}
                  {(isJoined || isPanitia || isCreator) && (
                    <Link href={`/event/${event.slug}/chat/member`}>
                      <Button className="w-full">Group Chat Member</Button>
                    </Link>
                  )}
                  {/* <p className="text-sm text-gray-600 mb-4">
                    Join the event to participate in discussions!
                  </p>
                  <div className="flex space-x-2">
                    {(isCreator || isAdmin) && (
                      <Link href={`/event/${eventParam}/chat/admin`} passHref>
                        <Button className="w-full">Group Chat Admin</Button>
                      </Link>
                    )}
                    {(isCreator || isJoined) && (
                      <Link href={`/event/${eventParam}/chat/member`} passHref>
                        <Button className="w-full">Group Chat Member</Button>
                      </Link>
                    )}
                  </div> */}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading event:", error);
    notFound();
  }
}
