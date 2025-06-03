"use client";
import { useState } from "react";
import TaskBoard from "@/components/TaskBoard";
import TaskForm from "./TaskForm";
import type { SerializedTask } from "@/types/serializedtask";

interface TaskBoardWrapperProps {
  initialTasks: SerializedTask[];
  eventId: string;
  workbookId: string;
  isCreator: boolean;
  userId: string;
}

export default function TaskBoardWrapper({
  initialTasks,
  eventId,
  workbookId,
  isCreator,
  userId,
  isApprovedPanitia, // tambahkan jika belum ada
}: TaskBoardWrapperProps & { isApprovedPanitia?: boolean }) {
  const [tasks, setTasks] = useState(initialTasks);

  // Untuk refresh setelah tambah/edit task
  const refreshTasks = async () => {
    const res = await fetch(`/api/tasks?workbookId=${workbookId}`);
    const data = await res.json();
    setTasks(data);
  };

  // Hanya creator yang bisa assign
  const canAssign = isCreator;

  return (
    <>
      <TaskBoard
        tasks={tasks}
        eventId={eventId}
        workbookId={workbookId}
        refreshTasks={refreshTasks}
        isCreator={isCreator}
        userId={userId}
        canAssign={canAssign}
      />
      {(isCreator || isApprovedPanitia) && (
        <section className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4 text-green-700">
            Tambah Task Baru
          </h2>
          <TaskForm
            workbookId={workbookId}
            refreshTasks={refreshTasks}
            isCreator={isCreator}
            isApprovedPanitia={isApprovedPanitia}
            userId={userId}
          />
        </section>
      )}
    </>
  );
}
