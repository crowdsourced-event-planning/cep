"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import Button from "../ui/Button";

interface Props {
  eventId: string;
  userId: string;
  workbookId?: string;
  requestStatus?: "pending" | "approved" | "rejected";
  buttonLabel?: string; // Tambahkan ini
}

export default function RequestPanitiaButton({
  eventId,
  userId,
  workbookId,
  requestStatus,
  buttonLabel,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    const res = await fetch("/api/request-panitia", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, userId, workbookId }),
    });
    setLoading(false);
    if (res.ok) {
      setSuccess(true);
      toast.success("Permintaan berhasil dikirim!");
    } else {
      const data = await res.json();
      toast.error(data.error || "Gagal mengirim permintaan.");
    }
  };

  if (requestStatus === "pending") {
    return (
      <Button
        className="w-full px-4 py-2 mt-1 mb-4 rounded bg-yellow-200 text-yellow-800 font-semibold cursor-not-allowed"
        disabled
      >
        Awaiting Approval
      </Button>
    );
  }

  if (requestStatus === "approved") {
    return (
      <span className="px-4 py-2 rounded bg-green-100 text-green-700 font-semibold">
        Sudah Disetujui
      </span>
    );
  }

  // Jika rejected, boleh request lagi
  // Jika belum pernah request, juga boleh request
  return (
    <form onSubmit={handleRequest}>
      <Button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
        disabled={loading || success}
      >
        {loading
          ? "Sending..."
          : success
          ? "Request Sent"
          : requestStatus === "rejected"
          ? buttonLabel || "Request Again"
          : buttonLabel || "Request Committee"}
      </Button>
    </form>
  );
}
