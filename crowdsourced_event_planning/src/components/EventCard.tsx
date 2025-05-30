import React from "react";
import Image from "next/image";
import Link from "next/link";
import Card from "./ui/Card";
import Button from "./ui/Button";
import { formatDate, formatCurrency } from "@/lib/utils/formatDate";
import { Event } from "../../types/event";

interface EventCardProps {
  event: Event;
  showJoinButton?: boolean;
  onJoinEvent?: (eventId: string) => void;
  isJoined?: boolean;
}

export default function EventCard({
  event,
  showJoinButton = true,
  onJoinEvent,
  isJoined = false,
}: EventCardProps) {
  const fundingPercentage =
    event.targetFunding > 0
      ? Math.min((event.currentFunding / event.targetFunding) * 100, 100)
      : 0;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <div className="space-y-4">
        {" "}
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
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
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
              {formatDate(event.createdAt)}
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

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">
                {formatCurrency(event.currentFunding)} raised
              </span>
              <span className="text-gray-600">
                of {formatCurrency(event.targetFunding)}
              </span>
            </div>
          </div>
        </div>{" "}
        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Link href={`/event/${event._id}`} className="flex-1">
            <Button variant="primary" className="w-full">
              View Details
            </Button>
          </Link>

          {showJoinButton && event.status === "open" && (
            <Button
              onClick={() => onJoinEvent?.(event._id)}
              variant={isJoined ? "secondary" : "success"}
              disabled={isJoined}
            >
              {isJoined ? "Joined" : "Join Event"}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
