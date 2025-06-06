"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { isAuthenticated, getCurrentUser } from "@/lib/auth-client";

interface JoinEventButtonWrapperProps {
  eventId: string;
  eventStatus: string;
  className?: string;
  initialIsJoined?: boolean;
}

export default function JoinEventButtonWrapper({
  eventId,
  eventStatus,
  className = "",
  initialIsJoined = false,
  stopPropagation = true, // default true
}: JoinEventButtonWrapperProps & { stopPropagation?: boolean }) {
  const [isJoined, setIsJoined] = useState(initialIsJoined);
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
          role: "viewer", // Default role for joining events
        }),
      });

      if (response.ok) {
        // Setelah join berhasil, refresh status join
        await checkJoinStatus();
        router.refresh();
      } else {
        const error = await response.json();
        if (error.error === "User is already joined to this event") {
          // Jika sudah join, set isJoined ke true
          setIsJoined(true);
        }
        console.error("Failed to join event:", error.error);
      }
    } catch (error) {
      console.error("Error joining event:", error);
      alert("Error joining event. Please try again.");
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
        // Setelah leave berhasil, refresh status join
        await checkJoinStatus();
        router.refresh();
      } else {
        const error = await response.json();
        console.error("Failed to leave event:", error.error);
      }
    } catch (error) {
      console.error("Error leaving event:", error);
      alert("Error leaving event. Please try again.");
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
    <div
      className={className}
      {...(stopPropagation && {
        onClick: (e) => e.stopPropagation(),
      })}
    >
      <Button
        onClick={(e) => {
          e.preventDefault(); // <-- ini penting!
          if (isJoined) {
            handleLeaveEvent();
          } else {
            handleJoinEvent();
          }
        }}
        variant={isJoined ? "secondary" : "success"}
        disabled={loading}
        loading={loading}
        className={className}
      >
        {isJoined ? "Leave Event" : "Join Event"}
      </Button>
    </div>
  );
}
