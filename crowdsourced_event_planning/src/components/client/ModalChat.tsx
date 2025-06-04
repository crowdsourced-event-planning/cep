import ChatPageClient from "@/app/event/[event]/chat/[role]/ChatPageClient";
import { X } from "lucide-react";
import { useEffect } from "react";

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

export default function ModalChat({
  open,
  onClose,
  currentUser,
  eventId,
  role,
}: {
  open: boolean;
  onClose: () => void;
  currentUser: User;
  eventId: string;
  role: string;
}) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  console.log("Current User in ModalChat:", currentUser);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm "
      onClick={handleBackdropClick}
    >
      <div className="w-[90%] h-[85vh] max-w-2xl relative mx-auto animate-fadeIn rounded-4xl">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden h-full d">
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white via-white to-transparent z-40 rounded-4xl" />

          {/* Header with blur effect */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-50 ">
            <h2 className="text-xl font-semibold text-gray-800">
              {role === "admin" ? "Committee Chat" : "Member Chat"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-all"
              aria-label="Close chat"
            >
              <X size={20} className="text-gray-600 cursor-pointer" />
            </button>
          </div>

          {/* Main chat content */}
          <div className="h-full pt-16">
            <ChatPageClient
              currentUser={currentUser}
              eventId={eventId}
              role={role}
              onClose={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
