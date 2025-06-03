"use client";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import Swal from "sweetalert2";
import EventGalleryWithZoom from "./EventGalleryWithZoom";
// ...import lain...

interface EventDetailClientProps {
  event: {
    _id: string;
    slug: string;
    gallery: { url: string; alt?: string }[]; // Replace with actual gallery item type if available
    documents: { url: string; name?: string }[]; // Replace with actual document item type if available
    // Add other event fields as needed
  };
  userId: string;
  isCreator: boolean;
}

export default function EventDetailClient({
  event,
  userId,
  isCreator,
}: EventDetailClientProps) {
  const router = useRouter();

  async function handleDelete() {
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
      const res = await fetch(`/api/events/${event._id}`, {
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
  }

  return (
    <div>
      {/* ...tampilkan detail event, gallery, tombol edit/delete, dsb... */}
      <EventGalleryWithZoom
        images={event.gallery.map((item) => item.url)}
        documents={event.documents.map((doc) => doc.url)}
      />
      {/* ... */}
      {isCreator && (
        <div className="flex gap-2 mt-4 cursor-pointer">
          <Button onClick={() => router.push(`/event/${event.slug}/edit`)}>
            Edit Event
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Event
          </Button>
        </div>
      )}
    </div>
  );
}
