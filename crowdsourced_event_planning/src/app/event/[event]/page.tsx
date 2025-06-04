import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEventBySlugOrId } from "@/lib/data/event";
import { getWorkbooksByEventId } from "@/lib/data/workbook";
import {
  getRatingsByEventId,
  getAverageRatingByEventId,
} from "@/lib/data/rating";
import Card from "@/components/ui/Card";
import { formatDateTime, formatCurrency } from "@/lib/utils/formatDate";
import FundingTracker from "@/components/client/FundingTracker";
import CreateWorkbookButton from "@/components/client/CreateWorkbookButton";
import WorkbookListClient from "@/components/client/WorkbookListClient";
import { cookies } from "next/headers";
import { UserEventModel } from "@/db/models/UserEventModel";
import ShareEventButton from "@/components/client/ShareEventButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import EventGalleryWithModal from "@/components/client/EventGalleryWithModal";
import EventActions from "@/components/client/EventActions"; // Buat komponen ini
import Link from "next/link";
import Button from "@/components/ui/Button";

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

    const eventId = event._id?.toString() || "";
    const [workbooks] = await Promise.all([
      getWorkbooksByEventId(eventId),
      getRatingsByEventId(eventId),
      getAverageRatingByEventId(eventId),
    ]);

    const userId = (await cookies()).get("x-user-id")?.value || "";
    const isCreator = event.creator?.toString() === userId;
    const cekRole = await UserEventModel.getUserRoleInEvent(userId, eventId);
    const isAdmin = cekRole === "admin";
    const isJoined = userId
      ? await UserEventModel.isUserJoinedEvent(userId, eventId)
      : false;

    return (
      <div className="min-h-screen bg-gray-50 py-8">
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
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {event.description}
                    </p>
                  </div>

                  {event.budget && event.budget.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Budget Breakdown
                      </h3>
                      <div className="space-y-2">
                        {event.budget.map(
                          (item: { name?: string; amount?: number }, index) => (
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
                          )
                        )}
                      </div>
                    </div>
                  )}
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
              {" "}
              {/* Funding Progress */}{" "}
              <FundingTracker
                eventId={eventParam}
                targetAmount={event.targetFunding}
                currentFunding={event.currentFunding}
              />
              {/* Event Actions */}
              <Card>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Actions</h3>
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
                  <p className="text-sm text-gray-600 mb-4">
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
                  </div>
                </div>
              </Card>
              {/* Ratings
              <Card>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Community Rating</h3>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-500 mb-1">
                      {averageRating.toFixed(1)}
                    </div>
                    <div className="flex justify-center space-x-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-5 h-5 ${
                            star <= averageRating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      {ratings.length} reviews
                    </p>
                  </div>

                  <Button variant="secondary" className="w-full">
                    Write Review
                  </Button>
                </div>
              </Card> */}
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
