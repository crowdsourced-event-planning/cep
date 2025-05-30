"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Button from "@/components/ui/Button";
import { formatDateTime } from "@/lib/utils/formatDate";

interface Chat {
  _id: string;
  message: string;
  userId: string;
  workbookId?: string;
  taskId?: string;
  createdAt: string;
}

interface ChatComponentProps {
  workbookId?: string;
  taskId?: string;
  currentUserId: string;
  maxHeight?: string;
}

export default function ChatComponent({
  workbookId,
  taskId,
  currentUserId,
  maxHeight = "h-64",
}: ChatComponentProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);
  const fetchChats = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (workbookId) params.append("workbookId", workbookId);
      if (taskId) params.append("taskId", taskId);

      const response = await fetch(`/api/chats?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch chats");
      }

      const data = await response.json();
      setChats(data);
    } catch (err) {
      console.error("Error fetching chats:", err);
      setError("Failed to load messages");
    }
  }, [workbookId, taskId]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: newMessage.trim(),
          userId: currentUserId,
          workbookId,
          taskId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const newChat = await response.json();
      setChats((prev) => [...prev, newChat]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div
        className={`flex-1 overflow-y-auto ${maxHeight} space-y-3 p-3 border border-gray-200 rounded-t-lg bg-gray-50`}
      >
        {chats.length === 0 ? (
          <div className="text-center py-4">
            <div className="text-gray-400 mb-2">
              <svg
                className="mx-auto h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat._id}
              className={`flex ${
                chat.userId === currentUserId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                  chat.userId === currentUserId
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-200"
                }`}
              >
                {chat.userId !== currentUserId && (
                  <div className="text-xs font-medium mb-1 text-gray-600">
                    {chat.userId}
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{chat.message}</p>
                <div
                  className={`text-xs mt-1 ${
                    chat.userId === currentUserId
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {formatDateTime(chat.createdAt)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className="border-t border-gray-200 bg-white rounded-b-lg"
      >
        <div className="p-3">
          {error && <div className="mb-2 text-sm text-red-600">{error}</div>}
          <div className="flex space-x-2">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 p-2 border border-gray-300 rounded-md text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              disabled={loading}
            />
            <Button
              type="submit"
              size="sm"
              disabled={loading || !newMessage.trim()}
              className="self-end"
            >
              {loading ? (
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Send"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
