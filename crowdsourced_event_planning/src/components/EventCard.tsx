import React from "react";
import Image from "next/image";
import Link from "next/link";
import Card from "./ui/card";
import JoinEventButtonWrapper from "./client/JoinEventButtonWrapper";
import { formatDate, formatCurrency } from "@/lib/utils/formatDate";
import type { IEvent as Event } from "@/db/models/EventModel";

interface EventCardProps {
  event: Event;
  showJoinButton?: boolean;
  currentUserId?: string; // tambahkan ini
}

export default function EventCard({
  event,
  showJoinButton = true,
  currentUserId,
}: EventCardProps) {
  const isCreator =
    currentUserId && event.creator?.toString() === currentUserId;
  const fundingPercentage =
    event.targetFunding > 0
      ? Math.min((event.currentFunding / event.targetFunding) * 100, 100)
      : 0;

  return (
    <Link href={`/event/${event.slug}`} className="block group">
      <Card className="hover:shadow-lg transition-shadow duration-200 max-w-sm w-full mx-auto cursor-pointer group">
        <div className="space-y-4">
          {/* Event Image */}
          {event.gallery && event.gallery.length > 0 ? (
            <Image
              src={event.gallery[0]}
              alt={event.title}
              width={400}
              height={200}
              className="w-full h-48 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
          {/* Event Info */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 truncate">
              {event.title}
            </h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-3">
              {event.description}
            </p>
            {/* Event Status */}
            <div className="flex items-center space-x-2 mb-3">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
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
              <span className="text-sm text-gray-500">
                {event.createdAt ? formatDate(event.createdAt) : "-"}
              </span>
            </div>
            {/* Funding Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Funding Progress</span>
                <span className="font-medium">
                  {fundingPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${fundingPercentage}%` }}
                ></div>
              </div>
              <div className="flex flex-wrap justify-between items-center text-sm w-full">
                <span className="text-gray-600">
                  {formatCurrency(event.currentFunding)} raised
                </span>
                <span className="text-gray-600 text-right">
                  of {formatCurrency(event.targetFunding)}
                </span>
              </div>
            </div>
          </div>
          {/* Action Button */}
          {showJoinButton && event.status === "open" && !isCreator && (
            <JoinEventButtonWrapper
              eventId={event.slug}
              eventStatus={event.status}
              className="w-full cursor-pointer"
              stopPropagation
            />
          )}
        </div>
      </Card>
    </Link>
  );
}
