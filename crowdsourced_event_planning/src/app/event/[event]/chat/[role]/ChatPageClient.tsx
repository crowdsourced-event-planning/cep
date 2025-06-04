"use client";

import { useEffect, useRef, useState } from "react";
import { onValue, push, ref, set } from "firebase/database";
import { database } from "@/lib/firebase";
import { Send } from "lucide-react";

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
    currentUser: User;
    eventId: string;
    role: string;
}

export default function ChatPageClient({ currentUser, eventId, role }: ChatPageClientProps) {
    console.log(eventId, "<<<< ini event")
    console.log(role, "<<<< ini role");

    const [messages, setMessages] = useState<Message[]>([]);
    const [members, setMembers] = useState<Record<string, User>>({});
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Setup Firebase listeners
    useEffect(() => {
        if (!eventId) return;

        // Save current user as a member using their _id as key
        const memberRef = ref(database, `events/${eventId}/members/${currentUser._id}`);
        set(memberRef, currentUser);

        // Listen for chat updates
        const chatRef = ref(database, `events/${eventId}/chat${role}`);
        const unsubscribeChat = onValue(chatRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) return setMessages([]);

            const loaded: Message[] = Object.entries(data).map(([id, val]: [string, unknown]) => ({
                id,
                ...(val as Omit<Message, "id">),
            }));

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

    return (
        <div className="flex flex-col h-screen">
            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f7faff]">
                {messages.map((msg) => {
                    const fromMe = msg.senderId === currentUser._id;
                    const sender = members[msg.senderId] ?? {
                        name: "Unknown",
                        avatar: "https://ui-avatars.com/api/?name=Unknown",
                    };

                    return (
                        <div
                            key={msg.id}
                            className={`flex items-end ${fromMe ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-xs px-4 py-3 rounded-2xl shadow ${fromMe
                                    ? "bg-white text-gray-800 rounded-br-none"
                                    : "bg-[#10182f] text-white rounded-bl-none"
                                    }`}
                            >
                                <div className="text-xs font-semibold mb-1">{sender.name}</div>
                                <div>{msg.text}</div>
                                <div className="text-[10px] text-right text-gray-400 mt-1">
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

            {/* Input */}
            <div className="p-4 border-t bg-white flex items-center">
                <input
                    type="text"
                    placeholder="Tulis pesan..."
                    className="flex-1 border rounded-full px-4 py-2 mr-2 bg-[#f7faff]"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                    onClick={sendMessage}
                    className="bg-[#10182f] text-white rounded-full w-10 h-10 flex items-center justify-center"
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
}
