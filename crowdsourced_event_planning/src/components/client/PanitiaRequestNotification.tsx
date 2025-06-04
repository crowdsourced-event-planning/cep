"use client";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface PanitiaRequest {
  _id: string;
  eventTitle: string;
  userName: string;
  status: "pending" | "approved" | "rejected";
}

export default function PanitiaRequestNotification({
  userId,
}: {
  userId: string;
}) {
  const [open, setOpen] = useState(false);
  const [requests, setRequests] = useState<PanitiaRequest[]>([]);
  const [loading, setLoading] = useState(false);

  // Bungkus dengan useCallback
  const fetchRequests = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/request-panitia?creatorId=${userId}`);
    if (!res.ok) {
      setRequests([]);
      setLoading(false);
      return;
    }
    try {
      const data = await res.json();
      setRequests(data.requests || []);
    } catch {
      setRequests([]);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    fetchRequests();
  }, [userId, fetchRequests]);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    const res = await fetch(`/api/request-panitia/${id}/${action}`, {
      method: "POST",
    });
    if (res.ok) {
      toast.success(
        action === "approve"
          ? "Berhasil approve permintaan panitia!"
          : "Berhasil reject permintaan panitia!"
      );
      fetchRequests();
    } else {
      toast.error("Gagal memproses permintaan.");
    }
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const pendingCount = pendingRequests.length;

  return (
    <div className="relative ">
      <button
        className={`relative rounded transition-colors cursor-pointer text-gray-700 hover:bg-blue-50 hover:text-blue-700 p-1`}
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifikasi Permintaan Panitia"
      >
        <svg
          className="w-6 h-6 mt-1"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {pendingCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
            {pendingCount}
          </span>
        )}
      </button>
      {open && (
        <div
          className={`
      absolute right-0 mt-2 bg-white rounded-xl shadow-lg z-50 max-h-[60vh] overflow-y-auto
      w-[90vw] left-1/2 -translate-x-1/2
      sm:w-[420px] sm:left-auto sm:right-0 sm:translate-x-0
      p-2
    `}
          style={{ minWidth: "260px" }}
        >
          <div className="p-4 border-b border-gray-300 font-bold text-black-700">
            Request for Committee & Members
          </div>
          {loading ? (
            <div className="p-4 text-gray-500">Loading...</div>
          ) : pendingRequests.length === 0 ? (
            <div className="p-4 text-gray-500">
              There are no committee & member requests for your event
            </div>
          ) : (
            <table className="min-w-full text-sm p-2">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-gray-300">
                  <th className="py-2 px-2">Event Name</th>
                  <th className="py-2 px-2">User</th>
                  <th className="py-2 px-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map((req) => (
                  <tr key={req._id} className="border-b last:border-b-0">
                    <td className="py-2 px-2 max-w-[120px] truncate whitespace-nowrap overflow-hidden">
                      {req.eventTitle}
                    </td>
                    <td className="py-2 px-2 max-w-[120px] truncate whitespace-nowrap overflow-hidden">
                      {req.userName}
                    </td>
                    <td className="py-2 px-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(req._id, "approve")}
                          className="px-3 py-1 rounded bg-green-700 hover:bg-green-800 text-white text-xs cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(req._id, "reject")}
                          className="px-3 py-1 rounded bg-red-700 hover:bg-red-800 text-white text-xs cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="p-3 border-t border-gray-300 text-right">
            <a
              href="/panitia-requests"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              See All
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
