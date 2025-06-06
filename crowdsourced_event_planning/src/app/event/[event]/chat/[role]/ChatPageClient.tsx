"use client";

import { useEffect, useRef, useState } from "react";
import { onValue, push, ref, set } from "firebase/database";
import { database } from "@/lib/firebase";
import { Send } from "lucide-react";
import Image from "next/image";
import multiavatar from "@multiavatar/multiavatar/esm";

// Message type
interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}

// User type
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

interface ChatPageClientProps {
  currentUser: User; // Tipe currentUser harus User
  eventId: string;
  role: string;
  onClose: () => void;
}

export default function ChatPageClient({
  currentUser,
  eventId,
  role,
}: ChatPageClientProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [members, setMembers] = useState<Record<string, User>>({});
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Setup Firebase listeners
  useEffect(() => {
    if (!eventId) return;

    // Save current user as a member using their _id as key
    const memberRef = ref(
      database,
      `events/${eventId}/members/${currentUser._id}`
    );
    set(memberRef, currentUser);
    console.log("Current User:", currentUser);

    // Listen for chat updates
    const chatRef = ref(database, `events/${eventId}/chat${role}`);
    const unsubscribeChat = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return setMessages([]);

      const loaded: Message[] = Object.entries(data).map(
        ([id, val]: [string, unknown]) => ({
          id,
          ...(val as Omit<Message, "id">),
        })
      );

      setMessages(loaded.sort((a, b) => a.timestamp - b.timestamp));
    });

    // Listen for members (as object map)
    const membersRef = ref(database, `events/${eventId}/members`);
    const unsubscribeMembers = onValue(membersRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return setMembers({});
      setMembers(data as Record<string, User>);
    });

    return () => {
      unsubscribeChat();
      unsubscribeMembers();
    };
  }, [eventId, currentUser, role]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const newMsg = {
      senderId: currentUser._id,
      text: newMessage.trim(),
      timestamp: Date.now(),
    };

    await push(ref(database, `events/${eventId}/chat${role}`), newMsg);
    setNewMessage("");
  };

  const activeMembers = Object.values(members).filter(
    (member) => member._id !== currentUser._id
  );

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-white">
      {/* Active Members List */}
      <div className="px-6 py-3 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-2 ">
          <span className="text-sm font-medium text-gray-600">Chat with:</span>
          <div className="flex -space-x-2 rounded-full">
            {activeMembers.map((member) => (
              <div
                key={member._id}
                className="relative group"
                title={member.name}
              >
                <div className="w-8 h-8 overflow-hidden border-white rounded-full bg-white flex items-center justify-center">
                  {member.avatar ? (
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      fill
                      sizes="24px"
                      className="object-cover rounded-full"
                    />
                  ) : (
                    <span
                      className="w-8 h-8 block"
                      dangerouslySetInnerHTML={{
                        __html: multiavatar(member.name),
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
            {activeMembers.length === 0 && (
              <span className="text-sm text-gray-400">
                No other participants yet
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Chat messages */}
      <div
        className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#CBD5E1 transparent",
        }}
      >
        {messages.map((msg) => {
          const fromMe = msg.senderId === currentUser._id;
          const sender = members[msg.senderId] ?? {
            name: "Unknown",
            avatar: "https://ui-avatars.com/api/?name=Unknown",
          };

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${
                fromMe ? "justify-end" : "justify-start"
              }`}
            >
              {!fromMe && (
                <div className="flex flex-col items-center gap-1">
                  <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 relative bg-white flex items-center justify-center">
                    {sender.avatar ? (
                      <Image
                        src={sender.avatar}
                        alt={sender.name}
                        fill
                        sizes="24px"
                        className="object-cover"
                      />
                    ) : (
                      <span
                        className="w-6 h-6 block"
                        dangerouslySetInnerHTML={{
                          __html: multiavatar(sender.name),
                        }}
                      />
                    )}
                  </div>
                </div>
              )}

              <div
                className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                  fromMe
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                {/* Nama pengirim di atas pesan */}
                <div
                  className="text-xs font-medium mb-1"
                  style={{ color: fromMe ? "#bfdbfe" : "#64748b" }}
                >
                  {fromMe ? "You" : sender.name}
                </div>
                <div className="text-sm">{msg.text}</div>
                <div
                  className={`text-[10px] text-right mt-1 ${
                    fromMe ? "text-blue-100" : "text-gray-400"
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-blue-400 transition-colors bg-gray-50"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button
            onClick={sendMessage}
            className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
