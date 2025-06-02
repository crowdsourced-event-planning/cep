import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventById } from "@/lib/data/event";
import { getWorkbookById } from "@/lib/data/workbook";
import Card from "@/components/ui/Card_temp";
import Button from "@/components/ui/Button_temp";

interface NewTaskPageProps {
  params: Promise<{
    event: string;
    workbook: string;
  }>;
}

export async function generateMetadata({
  params,
}: NewTaskPageProps): Promise<Metadata> {
  const { event: eventParam, workbook: workbookParam } = await params;
  const [event, workbook] = await Promise.all([
    getEventById(eventParam),
    getWorkbookById(workbookParam),
  ]);

  if (!event || !workbook) {
    return {
      title: "Create Task - Collabora",
    };
  }

  return {
    title: `Create Task - ${workbook.name} - ${event.title} - Collabora`,
    description: `Create a new task for ${workbook.name}`,
  };
}

export default async function NewTaskPage({ params }: NewTaskPageProps) {
  try {
    const { event: eventParam, workbook: workbookParam } = await params;
    const [event, workbook] = await Promise.all([
      getEventById(eventParam),
      getWorkbookById(workbookParam),
    ]);

    if (!event || !workbook) {
      notFound();
    }

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
            <span className="text-gray-900">Create Task</span>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card>
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Create New Task
                  </h1>
                  <p className="text-gray-600">
                    Add a new task to {workbook.name}
                  </p>
                </div>

                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Task Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter task name..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describe the task..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <select
                        name="priority"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium" selected>
                          Medium
                        </option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Due Date
                      </label>
                      <input
                        type="date"
                        name="dueDate"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assign To (optional)
                    </label>
                    <input
                      type="text"
                      name="assignedTo"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter user IDs separated by commas..."
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Leave empty to assign later
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <Link
                      href={`/event/${eventParam}/workbook/${workbookParam}`}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      ← Back to Workbook
                    </Link>
                    <div className="flex space-x-3">
                      <Button variant="secondary" type="button">
                        Save as Draft
                      </Button>
                      <Button variant="primary" type="submit">
                        Create Task
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading new task page:", error);
    notFound();
  }
}
