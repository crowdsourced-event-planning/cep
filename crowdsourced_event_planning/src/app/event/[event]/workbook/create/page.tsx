"use client";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function CreateWorkbookPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params?.event as string;

  const [eventTitle, setEventTitle] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Ambil judul event untuk breadcrumb
  useEffect(() => {
    async function fetchEvent() {
      if (!eventId) return;
      try {
        const res = await fetch(`/api/events/${eventId}`);
        if (res.ok) {
          const data = await res.json();
          setEventTitle(data.title || "Event");
        }
      } catch {
        setEventTitle("Event");
      }
    }
    fetchEvent();
  }, [eventId]);

  // Handle submit
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    // Ambil userId dari localStorage
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Anda harus login terlebih dahulu.");
      setLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title");
    const description = formData.get("description");

    const res = await fetch("/api/workbooks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: title,
        description,
        eventId,
        createdBy: userId, // Kirim _id user sebagai createdBy
      }),
    });

    setLoading(false);

    if (res.ok) {
      router.push(`/event/${eventId}`);
    } else {
      alert("Gagal membuat workbook");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <span>/</span>
            <Link href={`/event/${eventId}`} className="hover:text-blue-600">
              {eventTitle || "Event"}
            </Link>
            <span>/</span>
            <span className="text-gray-900">Create Workbook</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Workbook
          </h1>
          <p className="mt-2 text-gray-600">Buat workbook untuk event ini.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <Card>
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Workbook Information
                    </h2>
                  </div>
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Workbook Title *
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
                      Description *
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
                </div>
              </Card>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
