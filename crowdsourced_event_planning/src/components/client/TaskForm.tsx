"use client";

import { useState } from "react";

export default function TaskForm({ workbookId }: { workbookId: string }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const addTask = async () => {
    const userId = "6838676f883ee5cb0dac53eb";

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
        assignedTo: userId,
        dueDate: new Date().toISOString(),
        customColumn: [],
      }),
    });

    if (response.ok) {
      setName("");
      setDescription("");
      alert("Task berhasil ditambahkan! Refresh halaman untuk melihat.");
    } else {
      const errorData = await response.json();
      alert(`Gagal menambah task: ${errorData.error}`);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2"
        placeholder="Nama Task"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2"
        placeholder="Deskripsi Task"
      />
      <button onClick={addTask} className="bg-blue-500 text-white p-2 rounded">
        Tambah Task
      </button>
    </div>
  );
}
