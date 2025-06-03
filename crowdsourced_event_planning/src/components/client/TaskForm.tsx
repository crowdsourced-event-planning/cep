"use client";

import { useState } from "react";
import { getCurrentUser } from "@/lib/auth-client"; // Tambahkan ini

interface TaskFormProps {
  workbookId: string;
  refreshTasks?: () => void;
}

// Extend Window interface to include our refreshTasks function
declare global {
  interface Window {
    refreshTasks?: () => void;
  }
}

export default function TaskForm({ workbookId, refreshTasks }: TaskFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const addTask = async () => {
    if (!name.trim()) {
      setError("Nama task tidak boleh kosong");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const user = getCurrentUser();
      if (!user || !user._id) {
        setError("User tidak ditemukan atau belum login.");
        setIsSubmitting(false);
        return;
      }
      const userId = user._id;

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({
          workbookId,
          name,
          description,
          status: "pending",
          // assignedTo: [userId], // Hapus jika tidak perlu
          dueDate: new Date().toISOString(),
          customColumn: [],
        }),
      });
      if (response.ok) {
        setName("");
        setDescription("");

        // Call the global refresh function to update the task list immediately
        if (window.refreshTasks) {
          window.refreshTasks();
        }

        // Also call the callback if provided
        if (refreshTasks) {
          refreshTasks();
        }
      } else {
        const errorData = await response.json();
        console.error("Error adding task:", errorData);
        setError(`Gagal menambah task: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error in task creation:", error);
      setError("Terjadi kesalahan saat menambahkan task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={`border p-2 ${
          error && !name.trim() ? "border-red-500" : ""
        }`}
        placeholder="Nama Task"
        disabled={isSubmitting}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2"
        placeholder="Deskripsi Task"
        disabled={isSubmitting}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        onClick={addTask}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300 cursor-pointer"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Menambahkan..." : "Tambah Task"}
      </button>
    </div>
  );
}
