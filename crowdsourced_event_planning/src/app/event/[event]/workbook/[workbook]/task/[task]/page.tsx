import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventById } from "@/lib/data/event";
import { getWorkbookById } from "@/lib/data/workbook";
import { getTaskById } from "@/lib/data/task";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatDateTime } from "@/lib/utils/formatDate";
import ChatComponent from "@/components/client/ChatComponent";

interface TaskPageProps {
  params: Promise<{
    event: string;
    workbook: string;
    task: string;
  }>;
}

export async function generateMetadata({
  params,
}: TaskPageProps): Promise<Metadata> {
  const {
    event: eventParam,
    workbook: workbookParam,
    task: taskParam,
  } = await params;
  const [event, workbook, task] = await Promise.all([
    getEventById(eventParam),
    getWorkbookById(workbookParam),
    getTaskById(taskParam),
  ]);

  if (!event || !workbook || !task) {
    return {
      title: "Task Not Found - Collabora",
    };
  }
  return {
    title: `${task.name} - ${workbook.name} - ${event.title} - Collabora`,
    description: task.description,
  };
}

export default async function TaskDetailPage({ params }: TaskPageProps) {
  try {
    const {
      event: eventParam,
      workbook: workbookParam,
      task: taskParam,
    } = await params;
    const [event, workbook, task] = await Promise.all([
      getEventById(eventParam),
      getWorkbookById(workbookParam),
      getTaskById(taskParam),
    ]);

    if (!event || !workbook || !task) {
      notFound();
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

    const getPriorityColor = (priority: string) => {
      switch (priority?.toLowerCase()) {
        case "high":
          return "bg-red-100 text-red-800";
        case "medium":
          return "bg-orange-100 text-orange-800";
        case "low":
          return "bg-green-100 text-green-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <span>/</span>
            <Link href={`/event/${eventParam}`} className="hover:text-blue-600">
              {event.title}
            </Link>
            <span>/</span>
            <Link
              href={`/event/${eventParam}/workbook/${workbookParam}`}
              className="hover:text-blue-600"
            >
              {workbook.name}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{task.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Task Header */}
              <Card>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-gray-900 mb-3">
                        {task.name}
                      </h1>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            task.status
                          )}`}
                        >
                          {task.status.toUpperCase().replace("_", " ")}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
                            "medium"
                          )}`}
                        >
                          MEDIUM PRIORITY
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="secondary" size="sm">
                        Edit Task
                      </Button>
                      <Button variant="primary" size="sm">
                        Update Status
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <strong>Created:</strong> {formatDateTime(task.createdAt)}
                    </div>
                    <div>
                      <strong>Due Date:</strong>{" "}
                      {task.dueDate ? formatDateTime(task.dueDate) : "Not set"}
                    </div>
                    <div>
                      <strong>Assignees:</strong>{" "}
                      {task.assignedTo.length > 0
                        ? task.assignedTo.join(", ")
                        : "Not assigned"}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Task Description */}
              {task.description && (
                <Card>
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900">
                      Description
                    </h2>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {task.description}
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Task Activity */}
              <Card>
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900">Activity</h2>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          C
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">System</span>
                          <span className="text-gray-500 text-sm">
                            {formatDateTime(task.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">
                          Task was created
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Task Actions */}
              <Card>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Actions</h3>

                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option value="todo">Todo</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                  </select>

                  <Button variant="primary" className="w-full">
                    Update Status
                  </Button>

                  <Button variant="secondary" className="w-full">
                    Edit Task
                  </Button>

                  <Button variant="secondary" className="w-full">
                    Assign Users
                  </Button>

                  <Button variant="danger" className="w-full">
                    Delete Task
                  </Button>
                </div>
              </Card>
              {/* Task Details */}
              <Card>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Details</h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Due Date
                      </label>
                      <input
                        type="date"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        defaultValue={
                          task.dueDate
                            ? new Date(task.dueDate).toISOString().split("T")[0]
                            : ""
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <select className="w-full p-2 border border-gray-300 rounded-md">
                        <option value="low">Low</option>
                        <option value="medium" selected>
                          Medium
                        </option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Assignees
                      </label>
                      <div className="text-sm text-gray-600">
                        {task.assignedTo.length > 0
                          ? task.assignedTo.join(", ")
                          : "Not assigned"}
                      </div>
                    </div>
                  </div>

                  <Button variant="secondary" className="w-full">
                    Save Changes
                  </Button>
                </div>
              </Card>{" "}
              {/* Task Chat */}
              <Card>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Task Discussion</h3>

                  <ChatComponent
                    taskId={taskParam}
                    currentUserId="user-id" // This should come from auth context
                  />
                </div>
              </Card>
              {/* Related */}
              <Card>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Related</h3>

                  <div className="space-y-2">
                    <Link
                      href={`/event/${eventParam}`}
                      className="block text-blue-600 hover:underline text-sm"
                    >
                      ← Back to Event
                    </Link>
                    <Link
                      href={`/event/${eventParam}/workbook/${workbookParam}`}
                      className="block text-blue-600 hover:underline text-sm"
                    >
                      ← Back to Workbook
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading task:", error);
    notFound();
  }
}
