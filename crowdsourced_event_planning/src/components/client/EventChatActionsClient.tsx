"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import ModalChat from "./ModalChat";

interface User {
  _id: string;
  name: string;
  role: string;
  email: string;
  balance: number;
  iat: number;
  exp: number;
  avatar?: string;
}

export default function EventChatActionsClient({
  currentUser,
  eventId,
  isPanitia,
  isCreator,
  isJoined,
}: {
  currentUser: User;
  eventId: string;
  isPanitia: boolean;
  isCreator: boolean;
  isJoined: boolean;
  eventSlug: string;
}) {
  const [open, setOpen] = useState<null | "admin" | "member">(null);

  return (
    <>
      {(isPanitia || isCreator) && (
        <Button
          className="w-full cursor-pointer"
          onClick={() => setOpen("admin")}
        >
          Chat With Creator
        </Button>
      )}
      {(isJoined || isPanitia || isCreator) && (
        <Button
          className="w-full mt-2 cursor-pointer"
          onClick={() => setOpen("member")}
        >
          Group Chat Member
        </Button>
      )}
      <ModalChat
        open={!!open}
        onClose={() => setOpen(null)}
        currentUser={currentUser}
        eventId={eventId}
        role={open || "member"}
      />
    </>
  );
}
