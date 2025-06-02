import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getEventById } from "@/lib/data/event";
import { getWorkbooksByEventId } from "@/lib/data/workbook";
import {
  getRatingsByEventId,
  getAverageRatingByEventId,
} from "@/lib/data/rating";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import { formatDateTime, formatCurrency } from "@/lib/utils/formatDate";
import JoinEventButtonWrapper from "@/components/client/JoinEventButtonWrapper";
import FundingTracker from "@/components/client/FundingTracker";
import CreateWorkbookButton from "@/components/client/CreateWorkbookButton";
import WorkbookListClient from "@/components/client/WorkbookListClient";

interface EventPageProps {
  params: Promise<{
    event: string;
  }>;
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { event: eventParam } = await params;
  const event = await getEventById(eventParam);

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
    const [event, workbooks, ratings, averageRating] = await Promise.all([
      getEventById(eventParam),
      getWorkbooksByEventId(eventParam),
      getRatingsByEventId(eventParam),
      getAverageRatingByEventId(eventParam),
    ]);
    if (!event) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Event Header */}
          <div className="mb-8">
            {" "}
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
              <Link href="/" className="hover:text-blue-600">
                Home
              </Link>
              <span>/</span>
              <span>Events</span>
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
                        <strong>Start:</strong>{" "}
                        {formatDateTime(event.startDate)} - {event.startTime}
                      </div>
                      <div>
                        <strong>End:</strong> {formatDateTime(event.endDate)} -{" "}
                        {event.endTime}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Description
                      </h3>
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
                            (
                              item: { name?: string; amount?: number },
                              index
                            ) => (
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
                </Card>{" "}
                {/* Workbooks */}
                <Card>
                  <div className="space-y-4">
                    {" "}
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Workbooks
                      </h2>
                      <CreateWorkbookButton eventId={eventParam} size="sm">
                        Create Workbook
                      </CreateWorkbookButton>
                    </div>
                    {workbooks.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">
                          No workbooks created yet.
                        </p>
                        <CreateWorkbookButton
                          eventId={eventParam}
                          className="mt-4"
                        >
                          Create First Workbook
                        </CreateWorkbookButton>
                      </div>
                    ) : (
                      <WorkbookListClient
                        eventId={eventParam}
                        workbooks={workbooks.map((workbook) => ({
                          ...workbook,
                          _id: workbook._id?.toString() || "",
                          createdAt: workbook.createdAt || new Date(),
                          updatedAt: workbook.updatedAt || new Date(),
                        }))}
                      />
                    )}
                  </div>
                </Card>
              </div>{" "}
              {/* Sidebar */}
              <div className="space-y-6">
                {/* Funding Progress */}{" "}
                <FundingTracker
                  eventId={eventParam}
                  targetAmount={event.targetFunding}
                />
                {/* Event Actions */}
                <Card>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Actions</h3>
                    <JoinEventButtonWrapper
                      eventId={eventParam}
                      eventStatus={event.status}
                      className="w-full"
                    />

                    <Button variant="secondary" className="w-full">
                      Share Event
                    </Button>

                    <Button variant="secondary" className="w-full">
                      Follow Updates
                    </Button>
                  </div>
                </Card>
                {/* Event Chat */}
                <Card>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Event Discussion</h3>
                    <div className="text-sm text-gray-600 mb-4">
                      Join the event to participate in discussions!
                    </div>
                  </div>
                </Card>
                {/* Ratings */}
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
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading event:", error);
    notFound();
  }
  // app/event/[event]/page.tsx
  // import { getEventById, getWorkbooksByEvent } from "@/lib/data/event";
  // import Link from "next/link";
  // import { Button } from "@/components/ui/button";
  // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  // import { Badge } from "@/components/ui/badge";
  // import { Calendar, Clock, MapPin, DollarSign, List } from "lucide-react";
  // import { Event } from "@/types/event";
  // import { Workbook } from "@/types/workbook";

  // const formatRupiah = (number: number): string => {
  //   return new Intl.NumberFormat("id-ID", {
  //     style: "currency",
  //     currency: "IDR",
  //     minimumFractionDigits: 0,
  //   }).format(number);
  // };

  // interface EventPageProps {
  //   params: Promise<{ event: string }>;
  // }

  // export default async function EventDetail({ params }: EventPageProps) {
  //   const { event: eventId } = await params;

  //   if (!eventId) {
  //     return (
  //       <div className="container mx-auto p-4">
  //         <p className="text-red-500">ID event tidak ditemukan</p>
  //       </div>
  //     );
  //   }

  //   let event: Event | null = null;
  //   let workbooks: Workbook[] = [];
  //   try {
  //     event = await getEventById(eventId);
  //     if (!event) {
  //       return (
  //         <div className="container mx-auto p-4">
  //           <p className="text-red-500">Event tidak ditemukan</p>
  //         </div>
  //       );
  //     }
  //     workbooks = await getWorkbooksByEvent(eventId);
  //   } catch (error) {
  //     console.error("🚀 ~ EventDetail ~ error:", error);
  //     return (
  //       <div className="container mx-auto p-4">
  //         <p className="text-red-500">Gagal memuat data event</p>
  //       </div>
  //     );
  //   }

  //   return (
  //     <div className="container mx-auto p-4 space-y-6">
  //       <Card className="shadow-lg">
  //         <CardHeader>
  //           <div className="flex justify-between items-center">
  //             <CardTitle className="text-3xl font-bold">{event.title}</CardTitle>
  //             <Badge
  //               variant={event.status === "active" ? "default" : "secondary"}
  //             >
  //               {event.status}
  //             </Badge>
  //           </div>
  //         </CardHeader>
  //         <CardContent className="space-y-4">
  //           <p className="text-muted-foreground">{event.description}</p>

  //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //             <div className="flex items-center gap-2">
  //               <MapPin className="h-5 w-5 text-muted-foreground" />
  //               <span>{event.location}</span>
  //             </div>

  //             <div className="flex items-center gap-2">
  //               <Calendar className="h-5 w-5 text-muted-foreground" />
  //               <span>
  //                 {new Date(event.startDate).toLocaleDateString()} -{" "}
  //                 {new Date(event.endDate).toLocaleDateString()}
  //               </span>
  //             </div>

  //             <div className="flex items-center gap-2">
  //               <Clock className="h-5 w-5 text-muted-foreground" />
  //               <span>
  //                 {event.startTime} - {event.endTime}
  //               </span>
  //             </div>

  //             <div className="flex items-center gap-2">
  //               <List className="h-5 w-5 text-muted-foreground" />
  //               <span>Tipe: {event.typeEvent}</span>
  //             </div>

  //             <div className="flex items-center gap-2">
  //               <DollarSign className="h-5 w-5 text-muted-foreground" />
  //               <span>Dana Target: {formatRupiah(event.targetFunding)}</span>
  //             </div>

  //             <div className="flex items-center gap-2">
  //               <DollarSign className="h-5 w-5 text-muted-foreground" />
  //               <span>Dana Terkumpul: {formatRupiah(event.currentFunding)}</span>
  //             </div>
  //           </div>
  //         </CardContent>
  //       </Card>

  //       <Card className="shadow-lg">
  //         <CardHeader>
  //           <CardTitle className="text-2xl">Workbooks</CardTitle>
  //         </CardHeader>
  //         <CardContent>
  //           {workbooks.length > 0 ? (
  //             <ul className="space-y-2">
  //               {workbooks.map((workbook) => (
  //                 <li
  //                   key={workbook._id.toString()}
  //                   className="flex items-center gap-2"
  //                 >
  //                   <Link
  //                     href={`/event/${event._id}/workbook/${workbook._id}`}
  //                     className="text-primary hover:underline"
  //                   >
  //                     {workbook.name}
  //                   </Link>
  //                 </li>
  //               ))}
  //             </ul>
  //           ) : (
  //             <p className="text-muted-foreground">
  //               Tidak ada workbook untuk event ini.
  //             </p>
  //           )}
  //         </CardContent>
  //       </Card>

  //       <div className="flex justify-end gap-4">
  //         <Button asChild>
  //           <Link href={`/event/${event._id}/donation?slug=${event._id}`}>
  //             Donasi
  //           </Link>
  //         </Button>
  //         <Button asChild>
  //           <Link href={`/event/${event._id}/workbook/new`}>
  //             Tambah Workbook Baru
  //           </Link>
  //         </Button>
  //       </div>
  //     </div>
  //   );
}
