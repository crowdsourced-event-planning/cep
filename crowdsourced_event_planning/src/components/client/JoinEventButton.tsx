"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";

interface JoinEventButtonProps {
  eventId: string;
  isJoined: boolean;
  onJoinEvent: (eventId: string) => Promise<void>;
  onLeaveEvent: (eventId: string) => Promise<void>;
  disabled?: boolean;
}

export default function JoinEventButton({
  eventId,
  isJoined,
  onJoinEvent,
  onLeaveEvent,
  disabled = false,
}: JoinEventButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      if (isJoined) {
        await onLeaveEvent(eventId);
      } else {
        await onJoinEvent(eventId);
      }
    } catch (error) {
      console.error("Error joining/leaving event:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant={isJoined ? "secondary" : "success"}
      disabled={disabled || loading}
      loading={loading}
    >
      {isJoined ? "Leave Event" : "Join Event"}
    </Button>
  );
}
