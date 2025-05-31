import React from "react";
import { Card } from "./ui/card";
import { Task } from "../../types/task";
import { formatDate } from "@/lib/utils/formatDate";

interface TaskListProps {
  tasks: Task[];
  onSelectTask?: (taskId: string) => void;
}

export default function TaskList({ tasks, onSelectTask }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No tasks found for this workbook.</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-gray-100 text-gray-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "review":
        return "bg-yellow-100 text-yellow-800";
      case "done":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card
          key={task._id}
          className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
          onClick={() => onSelectTask?.(task._id)}
        >
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-900">
                {task.name}
              </h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  task.status
                )}`}
              >
                {task.status.replace("_", " ").toUpperCase()}
              </span>
            </div>

            <p className="text-gray-600 text-sm">{task.description}</p>

            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Assigned to: {task.assignedTo.length} users</span>
              <span>Created: {formatDate(task.createdAt)}</span>
            </div>

            {task.dueDate && (
              <p className="text-xs text-red-600">
                Due: {formatDate(task.dueDate)}
              </p>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
