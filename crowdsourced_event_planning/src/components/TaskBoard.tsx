"use client";

import { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import type { SerializedTask } from "@/types/serializedtask";
import type { IUser } from "@/db/models/UserModel";
import toast from "react-hot-toast";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { User, Trash } from "lucide-react";

const statusList = [
  { key: "pending", label: "Pending" },
  { key: "in_progress", label: "Dikerjakan" },
  { key: "done", label: "Selesai" },
];

interface TaskBoardProps {
  tasks: SerializedTask[];
  eventId: string;
  workbookId: string;
  refreshTasks?: () => void;
  isCreator: boolean;
  userId: string;
  canAssign?: boolean; // tambahkan
}

export default function TaskBoard({
  tasks,
  eventId,
  isCreator,
  userId,
  canAssign = false,
}: TaskBoardProps) {
  const [columns, setColumns] = useState<Record<string, SerializedTask[]>>({});
  const [participants, setParticipants] = useState<IUser[]>([]);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);

  useEffect(() => {
    // Group tasks by status
    const grouped: Record<string, SerializedTask[]> = {};
    statusList.forEach((s) => (grouped[s.key] = []));
    tasks.forEach((task) => {
      grouped[task.status || "pending"].push(task);
    });
    setColumns(grouped);
  }, [tasks]);

  useEffect(() => {
    const fetchParticipants = async () => {
      const res = await fetch(`/api/participants?eventId=${eventId}`);
      const participants = await res.json();
      setParticipants(participants);
    };
    fetchParticipants();
  }, [eventId]);

  const updateTaskAPI = async (
    taskId: string,
    data: Partial<SerializedTask>
  ) => {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update task");
    return res.json();
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceCol = Array.from(columns[source.droppableId] || []);
    const destCol = Array.from(columns[destination.droppableId] || []);
    const [movedTask] = sourceCol.splice(source.index, 1);
    movedTask.status = destination.droppableId;
    destCol.splice(destination.index, 0, movedTask);

    setColumns({
      ...columns,
      [source.droppableId]: sourceCol,
      [destination.droppableId]: destCol,
    });

    // Update status di backend
    await updateTaskAPI(movedTask._id!.toString(), {
      status: movedTask.status,
    });
    toast.success("Status task diperbarui!");
  };

  const handleAssign = async (task: SerializedTask, userId: string) => {
    if (!canAssign) return; // hanya creator yang bisa assign
    await updateTaskAPI(task._id!.toString(), {
      assignedTo: [userId],
    });

    // Update state columns di client
    setColumns((prev) => {
      const newColumns = { ...prev };
      for (const statusKey in newColumns) {
        newColumns[statusKey] = newColumns[statusKey].map((t) =>
          t._id === task._id ? { ...t, assignedTo: [userId] } : t
        );
      }
      return newColumns;
    });

    toast.success("Task di-assign!");
  };

  const handleDelete = async (taskId: string) => {
    await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
    setColumns((prev) => {
      const newColumns = { ...prev };
      for (const statusKey in newColumns) {
        newColumns[statusKey] = newColumns[statusKey].filter(
          (t) => t._id !== taskId
        );
      }
      return newColumns;
    });
    toast.success("Task dihapus!");
    setDeleteTaskId(null);
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto">
          {statusList.map((status) => (
            <Droppable droppableId={status.key} key={status.key}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-100 rounded-lg p-4 min-w-[300px] flex-1"
                >
                  <h2 className="font-bold mb-2">{status.label}</h2>
                  {columns[status.key]?.map((task, idx) => (
                    <Draggable
                      key={task._id!.toString()}
                      draggableId={task._id!.toString()}
                      index={idx}
                      isDragDisabled={
                        // Hanya assignee (task.assignedTo[0] === userId) atau creator yang bisa drag
                        task.assignedTo?.[0]?.toString() !== userId &&
                        !isCreator
                      }
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`bg-white rounded shadow p-3 mb-3 transition-all ${
                            snapshot.isDragging ? "ring-2 ring-blue-400" : ""
                          }`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div className="font-semibold">{task.name}</div>
                            {(isCreator ||
                              task.assignedTo?.[0]?.toString() === userId) && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteTaskId(task._id);
                                }}
                                className="text-red-500 hover:text-red-700 p-1"
                                title="Hapus Task"
                              >
                                <Trash className="w-4 h-4 cursor-pointer" />
                              </button>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mb-2">
                            {task.description}
                          </div>
                          <div className="mb-2 flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="font-semibold">Assignee:</span>
                            <Select
                              value={task.assignedTo?.[0] || ""}
                              onValueChange={(value) => {
                                if (canAssign && value)
                                  handleAssign(task, value);
                              }}
                              disabled={!canAssign}
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Pilih" />
                              </SelectTrigger>
                              <SelectContent searchable>
                                {participants.map((p) => (
                                  <SelectItem
                                    key={p._id?.toString()}
                                    value={p._id?.toString() || ""}
                                  >
                                    {p.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Modal Konfirmasi Hapus */}
      {deleteTaskId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px]">
            <h3 className="font-bold text-lg mb-4 text-red-600 flex items-center gap-2">
              <Trash className="w-5 h-5" /> Konfirmasi Hapus
            </h3>
            <p className="mb-6">Yakin ingin menghapus task ini?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteTaskId(null)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteTaskId)}
                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
