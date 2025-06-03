"use client";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface PanitiaRequest {
  _id: string;
  eventId: string;
  eventTitle?: string;
  userId: string;
  userName?: string;
  workbookId: string;
  workbookTitle?: string;
  status: "pending" | "approved" | "rejected";
  eventSlug?: string;
  workbookSlug?: string;
}

export default function AllPanitiaRequestsPage() {
  const { user } = useAuth();
  const creatorId = user?._id;

  const [requests, setRequests] = useState<PanitiaRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Bungkus dengan useCallback
  const fetchRequests = useCallback(async () => {
    if (!creatorId) return;
    setLoading(true);
    const res = await fetch(`/api/request-panitia?creatorId=${creatorId}`, {
      cache: "no-store",
    });
    const data = await res.json();
    setRequests(data.requests || []);
    setLoading(false);
  }, [creatorId]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Group by eventId
  const grouped: Record<
    string,
    { eventTitle: string; requests: PanitiaRequest[] }
  > = {};
  for (const req of requests) {
    if (!grouped[req.eventId]) {
      grouped[req.eventId] = {
        eventTitle: req.eventTitle || req.eventId,
        requests: [],
      };
    }
    grouped[req.eventId].requests.push(req);
  }

  const handleAction = async (id: string, action: "approve" | "reject") => {
    const res = await fetch(`/api/request-panitia/${id}/${action}`, {
      method: "POST",
    });
    if (res.ok) {
      toast.success(
        action === "approve" ? "Permintaan disetujui!" : "Permintaan ditolak!"
      );
      fetchRequests();
    } else {
      toast.error("Gagal memproses permintaan.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-[60vh]">
      <Toaster />
      <h1 className="text-3xl font-bold mb-8 text-blue-700 text-center">
        Permintaan Jadi Panitia
      </h1>
      {loading ? (
        <div className="text-gray-500 text-center py-12">Loading...</div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="text-gray-400 text-center py-12">
          Tidak ada permintaan panitia untuk event Anda.
        </div>
      ) : (
        Object.entries(grouped).map(([eventId, group]) => (
          <div
            key={eventId}
            className="mb-12 bg-white rounded-2xl shadow-lg border border-blue-100 p-6"
          >
            <h2 className="text-xl font-semibold mb-6 text-blue-600 flex items-center gap-2">
              <svg
                className="w-6 h-6 text-blue-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 17v-2a4 4 0 014-4h3a4 4 0 014 4v2M9 17a4 4 0 01-4-4V7a4 4 0 014-4h6a4 4 0 014 4v6a4 4 0 01-4 4M9 17h6"
                />
              </svg>
              {group.eventTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {group.requests.map((req) => (
                <div
                  key={req._id}
                  className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow p-5 flex flex-col gap-3 border border-blue-100 hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-xl shadow">
                      {req.userName
                        ? req.userName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()
                        : req.userId?.slice(-2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 text-base">
                        {req.userName || (
                          <span className="italic text-gray-400">
                            Tanpa Nama
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: <span className="font-mono">{req.userId}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <span className="text-gray-500">Workbook:</span>
                    <span className="font-medium text-blue-700">
                      {req.workbookTitle || req.workbookId}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        req.status === "pending"
                          ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                          : req.status === "approved"
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-red-100 text-red-700 border border-red-200"
                      }`}
                    >
                      {req.status === "pending"
                        ? "Awaiting Approval"
                        : req.status === "approved"
                        ? "Approved"
                        : "Rejected"}
                    </span>
                  </div>
                  {req.status === "pending" && (
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleAction(req._id, "approve")}
                        className="flex-1 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold shadow transition"
                      >
                        Terima
                      </button>
                      <button
                        onClick={() => handleAction(req._id, "reject")}
                        className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold shadow transition"
                      >
                        Tolak
                      </button>
                    </div>
                  )}
                  {req.status === "approved" && (
                    <Link
                      href={`/event/${req.eventSlug}/workbook/${req.workbookSlug}`}
                      className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition text-center mt-4"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Buka Task Board
                    </Link>
                  )}
                  {/* Jika rejected, tidak ada aksi */}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
