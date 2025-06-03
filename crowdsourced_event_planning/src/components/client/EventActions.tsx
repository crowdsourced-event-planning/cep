"use client";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import Swal from "sweetalert2";
import JoinEventButtonWrapper from "@/components/client/JoinEventButtonWrapper";

interface EventActionsProps {
  isCreator: boolean;
  event: {
    _id: string;
    slug: string;
    status: string;
    creator?: string | { toString(): string };
    // add other event fields as needed
  };
  isJoined: boolean;
}

export default function EventActions({
  isCreator,
  event,
  isJoined,
}: EventActionsProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: "Hapus Event?",
      text: "Event dan semua data terkait akan dihapus. Lanjutkan?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;
    try {
      const userId =
        typeof window !== "undefined"
          ? localStorage.getItem("x-user-id") ||
            localStorage.getItem("userId") ||
            ""
          : "";

      const eventIdentifier = event._id || event.slug;

      const res = await fetch(`/api/events/${eventIdentifier}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
      });
      if (res.ok) {
        await Swal.fire("Berhasil!", "Event berhasil dihapus.", "success");
        router.push("/events");
      } else {
        await Swal.fire("Gagal", "Gagal menghapus event.", "error");
      }
    } catch {
      await Swal.fire("Gagal", "Gagal menghapus event.", "error");
    }
  };

  if (isCreator) {
    return (
      <div className="flex flex-col gap-2">
        <Button
          variant="secondary"
          className="w-full cursor-pointer"
          onClick={() => router.push(`/event/${event.slug}/edit`)}
        >
          Edit Event
        </Button>
        <Button
          variant="danger"
          className="w-full cursor-pointer"
          onClick={handleDelete}
        >
          Delete Event
        </Button>
      </div>
    );
  }

  // Jika bukan creator, tampilkan tombol join/leave event
  return (
    <JoinEventButtonWrapper
      eventId={event.slug}
      eventStatus={event.status}
      initialIsJoined={!!isJoined}
      className="w-full"
    />
  );
}
