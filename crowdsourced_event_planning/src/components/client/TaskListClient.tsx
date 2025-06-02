"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Task } from "@/types/task";

interface TaskListClientProps {
  initialTasks: Task[];
  workbookId: string;
  eventId: string;
}

export default function TaskListClient({
  initialTasks,
  workbookId,
  eventId,
}: TaskListClientProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await fetch(`/api/tasks?workbookId=${workbookId}`);

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to fetch tasks");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("An error occurred while fetching tasks");
    } finally {
      setIsLoading(false);
    }
  }, [workbookId]);
  // This function will be called from the parent component
  useEffect(() => {
    // We set up a polling mechanism to fetch tasks periodically
    const interval = setInterval(() => {
      fetchTasks();
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [fetchTasks]);

  // Define a refresh function that can be exposed to parent components
  useEffect(() => {
    // Define a global function that the parent can call
    window.refreshTasks = fetchTasks;

    return () => {
      // Cleanup
      delete window.refreshTasks;
    };
  }, [fetchTasks]);

  return (
    <div>
      {isLoading && <p className="text-blue-500">Menyegarkan data...</p>}
      {error && <p className="text-red-500">{error}</p>}

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

      <button
        onClick={fetchTasks}
        className="mt-2 px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
      >
        Refresh Tasks
      </button>
    </div>
  );
}

// Add refreshTasks to the Window interface
declare global {
  interface Window {
    refreshTasks?: () => void;
  }
}
