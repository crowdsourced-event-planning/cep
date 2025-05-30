"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import { getCurrentUser, isAuthenticated } from "@/lib/auth-client";

interface JoinEventButtonWrapperProps {
  eventId: string;
  eventStatus: string;
  className?: string;
}

export default function JoinEventButtonWrapper({
  eventId,
  eventStatus,
  className = "",
}: JoinEventButtonWrapperProps) {
  const [isJoined, setIsJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const router = useRouter();
  const checkJoinStatus = useCallback(async () => {
    if (!isAuthenticated()) {
      setCheckingStatus(false);
      return;
    }

    try {
      const user = getCurrentUser();
      if (!user) return;

      const response = await fetch(
        `/api/events/${eventId}/join?userId=${user._id}`
      );
      if (response.ok) {
        const data = await response.json();
        setIsJoined(data.isJoined);
      }
    } catch (error) {
      console.error("Error checking join status:", error);
    } finally {
      setCheckingStatus(false);
    }
  }, [eventId]);

  // Check join status on component mount
  useEffect(() => {
    checkJoinStatus();
  }, [checkJoinStatus]);

  const handleJoinEvent = async () => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const user = getCurrentUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const response = await fetch(`/api/events/${eventId}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          role: "viewer",
        }),
      });

      if (response.ok) {
        setIsJoined(true);
        // You can add success notification here
      } else {
        const error = await response.json();
        console.error("Failed to join event:", error.error);
        // You can add error notification here
      }
    } catch (error) {
      console.error("Error joining event:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveEvent = async () => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const user = getCurrentUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const response = await fetch(`/api/events/${eventId}/join`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
        }),
      });

      if (response.ok) {
        setIsJoined(false);
        // You can add success notification here
      } else {
        const error = await response.json();
        console.error("Failed to leave event:", error.error);
        // You can add error notification here
      }
    } catch (error) {
      console.error("Error leaving event:", error);
    } finally {
      setLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <Button variant="primary" disabled className={className}>
        Loading...
      </Button>
    );
  }

  if (eventStatus !== "open") {
    return (
      <Button variant="secondary" disabled className={className}>
        Event Closed
      </Button>
    );
  }

  if (!isAuthenticated()) {
    return (
      <Button
        onClick={() => router.push("/login")}
        variant="success"
        className={className}
      >
        Login to Join
      </Button>
    );
  }

  return (
    <Button
      onClick={isJoined ? handleLeaveEvent : handleJoinEvent}
      variant={isJoined ? "secondary" : "success"}
      disabled={loading}
      loading={loading}
      className={className}
    >
      {isJoined ? "Leave Event" : "Join Event"}
    </Button>
  );
}
