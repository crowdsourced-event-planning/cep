import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventBySlug } from "@/lib/data/event";
import { getWorkbookById } from "@/lib/data/workbook";
import { getTasksByWorkbookId } from "@/lib/data/task";
import { getChatsByEventId } from "@/lib/data/chat";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatDateTime } from "@/lib/utils/formatDate";
import TaskManager from "@/components/client/TaskManager";
import ChatComponent from "@/components/client/ChatComponent";
import { ITask } from "@/db/models/TaskModel";

interface WorkbookPageProps {
  params: {
    slug: string;
    workbook: string;
  };
}

export async function generateMetadata({
  params,
}: WorkbookPageProps): Promise<Metadata> {
  const { slug: eventSlug, workbook: workbookParam } = params;
  const [event, workbook] = await Promise.all([
    getEventBySlug(eventSlug),
    getWorkbookById(workbookParam),
  ]);

  if (!event || !workbook) {
    return {
      title: "Workbook Not Found - Collabora",
    };
  }

  return {
    title: `${workbook.name} - ${event.title} - Collabora`,
    description: workbook.description,
  };
}

export default async function WorkbookDetailPage({
  params,
}: WorkbookPageProps) {
  // Ambil slug dari params
  const { slug: eventSlug, workbook: workbookParam } = params;
  // Fetch event by slug first
  const event = await getEventBySlug(eventSlug);
  // If event not found, skip further fetching
  if (!event) {
    notFound();
  }
  // Fetch workbook, tasks, and chats in parallel
  const [workbook, tasks, chats] = await Promise.all([
    getWorkbookById(workbookParam),
    getTasksByWorkbookId(workbookParam),
    getChatsByEventId(event._id?.toString() || ""),
  ]);

  if (!event || !workbook) {
    notFound();
  }

  const completedTasks = tasks.filter(
    (task: ITask) => task.status === "done"
  ).length;
  const totalTasks = tasks.length;
  const progressPercentage =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0; // Transform ITask to Task interface expected by TaskManager
  const transformedTasks = tasks.map((task: ITask) => ({
    _id: task._id?.toString() || "",
    title: task.name || task.title || "",
    description: task.description,
    workbookId: task.workbookId,
    priority: "medium" as const,
    status:
      task.status === "todo"
        ? ("pending" as const)
        : task.status === "done"
        ? ("completed" as const)
        : (task.status as "in_progress"),
    assignedTo: (task.assignedTo || []).join(", "),
    dueDate: task.dueDate?.toISOString() || "",
    tags: [],
    createdAt: task.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: task.updatedAt?.toISOString() || new Date().toISOString(),
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <span>/</span>
          <Link href={`/event/${eventSlug}`} className="hover:text-blue-600">
            {event.title}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{workbook.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Workbook Header */}
            <Card>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {workbook.name}
                  </h1>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    ACTIVE
                  </span>
                </div>{" "}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <strong>Created:</strong>{" "}
                    {formatDateTime(workbook.createdAt || new Date())}
                  </div>
                  <div>
                    <strong>Updated:</strong>{" "}
                    {formatDateTime(
                      workbook.updatedAt || workbook.createdAt || new Date()
                    )}
                  </div>
                </div>
                {workbook.description && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {workbook.description}
                    </p>
                  </div>
                )}
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Progress</h3>
                    <span className="text-sm text-gray-600">
                      {completedTasks} of {totalTasks} tasks completed
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-sm text-gray-500 mt-1">
                    {progressPercentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            </Card>

            {/* Tasks Section */}
            <Card>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
                  <Link
                    href={`/event/${eventSlug}/workbook/${workbookParam}/task/new`}
                  >
                    <Button size="sm">Add Task</Button>
                  </Link>
                </div>

                <TaskManager
                  tasks={transformedTasks}
                  workbookId={workbookParam}
                />
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Workbook Actions */}
            <Card>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Actions</h3>

                <Button variant="primary" className="w-full">
                  Edit Workbook
                </Button>

                <Button variant="secondary" className="w-full">
                  Share Workbook
                </Button>

                <Button variant="secondary" className="w-full">
                  Export Data
                </Button>

                <Button variant="danger" className="w-full">
                  Archive Workbook
                </Button>
              </div>
            </Card>{" "}
            {/* Team Chat */}
            <Card>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Event Chat</h3>

                <ChatComponent
                  workbookId={workbookParam}
                  currentUserId="user-id" // This should come from auth context
                />
              </div>
            </Card>
            {/* Workbook Stats */}
            <Card>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Statistics</h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Tasks:</span>
                    <span className="font-medium">{totalTasks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed:</span>
                    <span className="font-medium text-green-600">
                      {completedTasks}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">In Progress:</span>
                    <span className="font-medium text-yellow-600">
                      {
                        tasks.filter(
                          (task: ITask) => task.status === "in_progress"
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Todo:</span>
                    <span className="font-medium text-gray-600">
                      {
                        tasks.filter((task: ITask) => task.status === "todo")
                          .length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Review:</span>
                    <span className="font-medium text-blue-600">
                      {
                        tasks.filter((task: ITask) => task.status === "review")
                          .length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Messages:</span>
                    <span className="font-medium">{chats.length}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
