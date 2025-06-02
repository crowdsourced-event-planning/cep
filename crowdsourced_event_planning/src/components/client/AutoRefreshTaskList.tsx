"use client";

import { useState, useEffect, useCallback } from "react";
import { Task } from "@/types/task";
import Link from "next/link";

// Add refreshTasks to the Window interface
declare global {
  interface Window {
    refreshTasks?: () => void;
  }
}

interface AutoRefreshTaskListProps {
  workbookId: string;
  eventId: string;
}

export default function AutoRefreshTaskList({
  workbookId,
  eventId,
}: AutoRefreshTaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Function to fetch tasks (wrapped in useCallback to avoid unnecessary re-renders)
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tasks?workbookId=${workbookId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await response.json();
      setTasks(data);
      setError("");
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [workbookId]);

  // Register the refresh function globally
  useEffect(() => {
    window.refreshTasks = fetchTasks;
    return () => {
      delete window.refreshTasks;
    };
  }, [fetchTasks]);

  // Initial fetch and setup refresh interval
  useEffect(() => {
    // Fetch tasks immediately
    fetchTasks();

    // Set up polling with a reasonable interval
    const interval = setInterval(() => {
      fetchTasks();
    }, 30000); // Refresh every 30 seconds instead of every 5 seconds

    // Cleanup function
    return () => clearInterval(interval);
  }, [fetchTasks]); // Include fetchTasks in the dependency array

  if (loading && tasks.length === 0) {
    return <div className="text-gray-500">Memuat tasks...</div>;
  }

  if (error && tasks.length === 0) {
    return (
      <div className="text-red-500">
        {error}
        <button
          onClick={fetchTasks}
          className="ml-2 bg-blue-500 text-white px-2 py-1 rounded text-sm"
        >
          Coba lagi
        </button>
      </div>
    );
  }
  return (
    <div>
      {tasks.length > 0 ? (
        <ul className="list-disc pl-5">
          {tasks.map((task) => (
            <li key={task._id.toString()}>
              <Link
                href={`/event/${eventId}/workbook/${workbookId}/task/${task._id.toString()}`}
                className="text-blue-600 hover:underline"
              >
                {task.name} {task.parentTask ? "(Subtask)" : ""}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Tidak ada task untuk workbook ini.</p>
      )}
    </div>
  );
}
