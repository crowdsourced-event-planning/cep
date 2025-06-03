import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getEventBySlug } from "@/lib/data/event";
import {
  getRatingsByEventId,
  getAverageRatingByEventId,
} from "@/lib/data/rating";
import { getWorkbooksByEventId } from "@/lib/data/workbook";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatDateTime, formatCurrency } from "@/lib/utils/formatDate";
import JoinEventButtonWrapper from "@/components/client/JoinEventButtonWrapper";
import FundingTracker from "@/components/client/FundingTracker";
import { toPlain } from "@/db/utils/toPlain";
import ButtonCreateWorkbook from "@/components/client/ButtonCreateWorkbook";
import ClientWorkbookListWrapper from "@/components/client/ClientWorkbookListWrapper";
import { headers } from "next/headers";
import { UserEventModel } from "@/db/models/UserEventModel";

export interface IJwtPayload {
  _id: string;
  name: string;
  role: string;
  email: string;
  balance: number;
  iat: number;
  exp: number;
}

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  props: EventPageProps
): Promise<Metadata> {
  const { slug } = await props.params;
  const event = await getEventBySlug(slug);

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
      images: event.gallery?.length
        ? [event.gallery[0]]
        : ["/default-hero.jpg"],
    },
  };
}

export default async function EventDetailPage(props: EventPageProps) {
  const { slug } = await props.params;
  const eventRaw = await getEventBySlug(slug);

  if (!eventRaw) {
    notFound();
  }

  // Konversi event dan data lain ke plain object
  const event = toPlain(eventRaw) as import("../../../../types/event").Event;
  const workbooks = toPlain(
    await getWorkbooksByEventId(event._id || "")
  ) as import("../../../../types/workbook").Workbook[];

  const requestHeaders = await headers();
  const jwtPayloadEncoded = requestHeaders.get("x-jwt-payload");

  if (!jwtPayloadEncoded) {
    throw new Error("JWT payload header is missing");
  }
  const jwtPayload: IJwtPayload = JSON.parse(
    decodeURIComponent(jwtPayloadEncoded)
  );

  const userId = (await cookies()).get("x-user-id")?.value || "";
  const isCreator = event.createdBy?.toString() === userId?.toString();
  const roleUser = await UserEventModel.getUserRoleInEvent(
    jwtPayload._id,
    event?._id!.toString()
  );

  const [ratings, averageRating] = await Promise.all([
    getRatingsByEventId(event._id?.toString() || ""),
    getAverageRatingByEventId(event._id?.toString() || ""),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Event Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <span>/</span>
            <Link href="/events" className="hover:text-blue-600">
              Events
            </Link>
            <span>/</span>
            <span className="text-gray-900">{event.title}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Event Image Gallery */}
              {event.gallery && event.gallery.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.gallery.slice(0, 4).map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      alt={`${event.title} - Image ${index + 1}`}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
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
                      {event.status?.toUpperCase() || "UNKNOWN"}
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
              {/* Workbooks & Tasks hanya untuk pembuat event */}
              {isCreator && (
                <Card>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Workbooks
                      </h2>
                      <ButtonCreateWorkbook eventSlug={slug} />
                    </div>
                    {workbooks.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">
                          No workbooks created yet.
                        </p>
                        <ButtonCreateWorkbook eventSlug={slug} mode="first" />
                      </div>
                    ) : (
                      <ClientWorkbookListWrapper
                        workbooks={workbooks.map((workbook) => ({
                          ...workbook,
                          _id: workbook._id?.toString() || "",
                          eventId: workbook.eventId?.toString?.() || "",
                          createdBy: workbook.createdBy?.toString?.() || "",
                          createdAt: workbook.createdAt
                            ? new Date(workbook.createdAt)
                            : new Date(),
                          updatedAt: workbook.updatedAt
                            ? new Date(workbook.updatedAt)
                            : new Date(),
                        }))}
                        eventSlug={slug}
                      />
                    )}
                  </div>
                </Card>
              )}
            </div>
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Funding Progress */}
              <FundingTracker
                eventId={event._id?.toString() || ""}
                targetAmount={event.targetFunding}
              />
              {/* Event Actions */}
              <Card>
                <div className="space-y-3">
                  {isCreator ? (
                    <div className="mb-4">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Kamu pembuat event ini
                      </span>
                    </div>
                  ) : (
                    <JoinEventButtonWrapper
                      eventId={event._id?.toString() || ""}
                      eventStatus={event.status}
                      className="w-full"
                    />
                  )}
                  <Button variant="secondary" className="w-full">
                    Share Event
                  </Button>
                </div>
              </Card>

              {/* Event Chat */}
              <Card>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Event Discussion</h3>
                  <p className="text-sm text-gray-600">
                    Join the event to participate in discussions!
                  </p>

                  {(roleUser === "admin" || isCreator) && (
                    <div className="flex space-x-2">
                      <Link href={`/event/${slug}/chat/admin`} passHref>
                        <Button className="w-full">Group Chat Admin</Button>
                      </Link>
                    </div>
                  )}
                  {(isCreator ||
                    roleUser === "admin" ||
                    roleUser === "member") && (
                    <Link href={`/event/${slug}/chat/member`} passHref>
                      <Button className="w-full">Group Chat Member</Button>
                    </Link>
                  )}
                </div>
              </Card>

              {/* Ratings */}
              <Card>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Community Rating</h3>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-500 mb-1">
                      {averageRating?.toFixed(1) ?? "0.0"}
                    </div>
                    <div className="flex justify-center space-x-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-5 h-5 ${
                            star <= Math.round(averageRating)
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
                      {ratings?.length ?? 0} reviews
                    </p>
                  </div>
                  <Button variant="secondary" className="w-full">
                    Write Review
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
