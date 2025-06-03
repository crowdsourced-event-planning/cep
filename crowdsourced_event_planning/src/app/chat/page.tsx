'use client';

import { useEffect, useState } from "react";
import { database } from "@/lib/firebase";
import { ref, push, onValue, query, orderByChild } from "firebase/database";

type ChatMessage = {
    userId: string;
    username: string;
    text: string;
    createdAt: number;
};

const currentUser = {
    userId: "user123",
    username: "Saya",
};

export default function ChatPage() {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState<ChatMessage[]>([]);

    useEffect(() => {
        const chatRef = query(ref(database, "chats/global"), orderByChild("createdAt"));

        const unsubscribe = onValue(chatRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const parsedMessages: ChatMessage[] = Object.values(data);
                setChat(parsedMessages);
            } else {
                setChat([]);
            }
        });

        return () => {
            unsubscribe()
            // Firebase SDK tidak punya built-in `off` untuk `onValue` dalam versi modular
            // tapi ini aman untuk sekarang karena halaman di-refresh penuh
        };
    }, []);

    const sendMessage = async () => {
        if (message.trim()) {
            const newMessage: ChatMessage = {
                userId: currentUser.userId,
                username: currentUser.username,
                text: message,
                createdAt: Date.now(),
            };

            const chatRef = ref(database, "chats/global");

            try {
                await push(chatRef, newMessage);
                setMessage("");
            } catch (error) {
                console.error("❌ Gagal mengirim pesan:", error);
            }
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">💬 Chat Real-time</h1>

            <div className="border p-2 h-64 overflow-y-scroll mb-2 bg-white flex flex-col gap-1">
                {chat.map((msg, i) => {
                    const isOwnMessage = msg.userId === currentUser.userId;
                    return (
                        <div
                            key={i}
                            className={`max-w-[70%] p-2 rounded-lg ${isOwnMessage ? "bg-blue-500 text-white self-end" : "bg-gray-200 text-black self-start"
                                }`}
                        >
                            {!isOwnMessage && (
                                <div className="text-xs font-semibold text-gray-600 mb-1">{msg.username}</div>
                            )}
                            <div>{msg.text}</div>
                            <div className="text-[10px] mt-1 text-right text-gray-300">
                                {new Date(msg.createdAt).toLocaleTimeString()}
                            </div>
                        </div>
                    );
                })}
            </div>

            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="border p-2 w-full"
                placeholder="Ketik pesan..."
            />
            <button onClick={sendMessage} className="mt-2 bg-blue-500 text-white p-2 rounded w-full">
                Kirim
            </button>
        </div>
    );
}
