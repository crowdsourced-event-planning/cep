"use client";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function CreateWorkbookPage() {
  const router = useRouter();
  const params = useParams();
  const eventSlug = params?.slug as string;

  const [eventTitle, setEventTitle] = useState<string>("");
  const [eventId, setEventId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchEvent() {
      if (!eventSlug) return;
      try {
        const res = await fetch(`/api/events/${eventSlug}`);
        if (res.ok) {
          const data = await res.json();
          console.log("Event data:", data); // Tambahkan ini
          setEventTitle(data.title || "Event");
          setEventId(data._id || "");
        }
      } catch {
        setEventTitle("Event");
        setEventId("");
      }
    }
    fetchEvent();
  }, [eventSlug]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title");
    const description = formData.get("description");

    // Ambil x-user-id dari cookie
    const getUserIdFromCookie = (): string | null => {
      const cookies = document.cookie.split("; ");
      const userIdCookie = cookies.find((cookie) =>
        cookie.startsWith("x-user-id=")
      );
      return userIdCookie ? userIdCookie.split("=")[1] : null;
    };

    const userId = getUserIdFromCookie();
    if (!userId) {
      Swal.fire(
        "User ID not found in cookies. Please log in again.",
        "",
        "error"
      );
      setLoading(false);
      return;
    }
    if (!eventId) {
      Swal.fire(
        "Event ID tidak ditemukan. Silakan refresh halaman.",
        "",
        "error"
      );
      setLoading(false);
      return;
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "x-user-id": userId,
    };

    try {
      const res = await fetch("/api/workbooks", {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: title,
          description,
          eventId,
          createdBy: userId,
        }),
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Workbook berhasil dibuat!",
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(() => {
          router.push(`/event/${eventSlug}`);
        }, 1500);
      } else {
        const errorData = await res.json();
        Swal.fire(
          errorData.message || "Failed to create workbook.",
          "",
          "error"
        );
      }
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error);
      Swal.fire("An unexpected error occurred.", "", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-blue-600 font-medium">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              {eventSlug ? (
                <Link
                  href={`/event/${eventSlug}`}
                  className="hover:text-blue-600 font-medium"
                >
                  {eventTitle || "Event"}
                </Link>
              ) : (
                <span className="text-gray-400">Event</span>
              )}
            </li>
            <li>/</li>
            <li>
              <span className="text-gray-900 font-semibold">
                Create Workbook
              </span>
            </li>
          </ol>
        </nav>

        <div className="max-w-2xl mx-auto">
          <Card>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Create New Workbook
                </h1>
                <p className="text-gray-600 mb-4">
                  Buat workbook untuk event{" "}
                  <span className="font-semibold">{eventTitle}</span>.
                </p>
              </div>
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Workbook Title <span className="text-red-500">*</span>
                </label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  required
                  placeholder="Judul workbook"
                  className="text-lg"
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  placeholder="Deskripsi singkat tentang workbook ini..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Create Workbook"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
