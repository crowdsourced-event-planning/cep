"use client";

import { useState } from "react";

export default function TaskForm({ workbookId }: { workbookId: string }) {
  const [name, setName] = useState("");

  const addTask = async () => {
    const response = await fetch(`/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ workbookId, name, status: "pending" }),
    });
    if (response.ok) {
      setName("");
      alert("Task berhasil ditambahkan");
    } else {
      alert("Gagal menambahkan task");
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border border-gray-300 rounded p-2 flex-grow"
        placeholder="Masukkan nama task"
      />
      <button onClick={addTask} className="bg-blue-500 text-white rounded p-2">
        Tambah Task
      </button>
    </div>
  );
}
