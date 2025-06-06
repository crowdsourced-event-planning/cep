"use client";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

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

  const eventCommitteeRequests = requests.filter((r) => !r.workbookId);
  const workbookCommitteeRequests = requests.filter((r) => !!r.workbookId);

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
      <h1 className="text-3xl font-bold mb-8 text-black-700">
        Request for Committee Members
      </h1>
      {loading ? (
        <div className="text-gray-500 text-center py-12">Loading...</div>
      ) : (
        <Tabs>
          <TabList className="flex gap-4 mb-6">
            <Tab
              className="px-4 py-2 rounded-lg font-semibold transition-all flex-1 text-center bg-blue-100 text-blue-700 cursor-pointer"
              selectedClassName="bg-blue-600 text-white shadow-md"
            >
              Event Committee
            </Tab>
            <Tab
              className="px-4 py-2 rounded-lg font-semibold transition-all flex-1 text-center bg-blue-100 text-blue-700 cursor-pointer"
              selectedClassName="bg-blue-600 text-white shadow-md"
            >
              Workbook Committee
            </Tab>
          </TabList>
          <TabPanel>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {eventCommitteeRequests.length === 0 && (
                <div className="text-gray-400 text-center py-12 col-span-3">
                  There are no committee requests for your event
                </div>
              )}
              {eventCommitteeRequests.map((req) => (
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
                            Without Name
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: <span className="font-mono">{req.userId}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <span className="text-gray-500">Event:</span>
                    <span className="font-medium text-blue-700">
                      {req.eventTitle}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        req.status === "pending"
                          ? "bg-yellow-100 text-yellow-600 border border-yellow-200"
                          : req.status === "approved"
                          ? "bg-green-100 text-green-600 border border-green-200"
                          : "bg-red-100 text-red-600 border border-red-200"
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
                        className="flex-1 px-4 py-2 rounded-lg bg-green-700 hover:bg-green-800 text-white font-semibold shadow transition cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(req._id, "reject")}
                        className="flex-1 px-4 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white font-semibold shadow transition cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {req.status === "approved" && (
                    <Link
                      href={`/event/${req.eventSlug}`}
                      className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition text-center mt-4"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open Event
                    </Link>
                  )}
                  {/* Jika rejected, tidak ada aksi */}
                </div>
              ))}
            </div>
          </TabPanel>
          <TabPanel>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {workbookCommitteeRequests.length === 0 && (
                <div className="text-gray-400 text-center py-12 col-span-3">
                  There are no committee requests for your workbooks
                </div>
              )}
              {workbookCommitteeRequests.map((req) => (
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
                            Without Name
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: <span className="font-mono">{req.userId}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <span className="text-gray-500">Event:</span>
                    <span className="font-medium text-blue-700">
                      {req.eventTitle}
                    </span>
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
                          ? "bg-yellow-100 text-yellow-600 border border-yellow-200"
                          : req.status === "approved"
                          ? "bg-green-100 text-green-600 border border-green-200"
                          : "bg-red-100 text-red-600 border border-red-200"
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
                        className="flex-1 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold shadow transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(req._id, "reject")}
                        className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow transition"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {req.status === "approved" && (
                    <Link
                      href={`/event/${req.eventSlug}`}
                      className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition text-center mt-4"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open Event
                    </Link>
                  )}
                  {/* Jika rejected, tidak ada aksi */}
                </div>
              ))}
            </div>
          </TabPanel>
        </Tabs>
      )}
    </div>
  );
}
