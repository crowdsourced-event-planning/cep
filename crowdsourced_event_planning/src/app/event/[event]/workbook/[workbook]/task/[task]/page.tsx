import { getTaskBySlug } from "@/lib/data/task";
import { getWorkbookByEventAndSlug } from "@/lib/data/workbook";
import { getEventBySlugOrId } from "@/lib/data/event";
import Breadcrumbs from "@/components/Breadcrumbs";

interface TaskPageProps {
  params: Promise<{ event: string; workbook: string; task: string }>;
}

export default async function TaskDetail({ params }: TaskPageProps) {
  const resolvedParams = await params;
  const eventSlug = resolvedParams.event;
  const workbookSlug = resolvedParams.workbook;
  const taskSlug = resolvedParams.task;

  if (!eventSlug || !workbookSlug || !taskSlug) {
    return (
      <div className="text-red-500">
        ID event, workbook, atau task tidak ditemukan
      </div>
    );
  }

  const event = await getEventBySlugOrId(eventSlug);
  if (!event) return <div className="text-red-500">Event tidak ditemukan</div>;

  const workbook = await getWorkbookByEventAndSlug(
    event._id?.toString() ?? "",
    workbookSlug
  );
  if (!workbook)
    return <div className="text-red-500">Workbook tidak ditemukan</div>;

  const task = await getTaskBySlug(workbook._id.toString(), taskSlug);
  if (!task) return <div className="text-red-500">Task tidak ditemukan</div>;

  // Define Task type with assignees property
  interface TaskWithAssignees {
    name: string;
    description?: string;
    status?: string;
    dueDate?: string;
    assignees?: { name: string }[];
    parentTask?: string;
    customColumn?: { label: string; value: string }[];
  }

  const typedTask = task as TaskWithAssignees;
  const assignees: { name: string }[] = Array.isArray(typedTask.assignees)
    ? typedTask.assignees!
    : [];

  // Breadcrumb items
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Events", href: "/events" },
    { label: event.title, href: `/event/${event.slug}` },
    {
      label: workbook.name,
      href: `/event/${event.slug}/workbook/${workbook.slug}`,
    },
    { label: task.name },
  ];

  return (
    <div className="container mx-auto max-w-3xl p-4">
      <Breadcrumbs items={breadcrumbs} />

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h1 className="text-2xl font-bold mb-2">{task.name}</h1>
        <p className="mb-4 text-gray-700">{task.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <span className="font-semibold">Status:</span>{" "}
            <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs">
              {task.status}
            </span>
          </div>
          <div>
            <span className="font-semibold">Batas Waktu:</span>{" "}
            {task.dueDate
              ? new Date(task.dueDate).toLocaleDateString()
              : "Tidak ada"}
            {assignees.length > 0
              ? assignees.map((user: { name: string }) => user.name).join(", ")
              : "Tidak ada"}
            {assignees.length > 0
              ? assignees.map((user) => user.name).join(", ")
              : "Tidak ada"}
          </div>
          {task.parentTask && (
            <div>
              <span className="font-semibold">Subtask dari:</span>{" "}
              <span className="text-blue-600">
                {task.parentTask.toString()}
              </span>
            </div>
          )}
        </div>
        {Array.isArray(task.customColumn) && task.customColumn.length > 0 && (
          <>
            <h2 className="text-lg font-semibold mt-6 mb-2">Kolom Kustom</h2>
            <ul className="list-disc pl-5">
              {(task.customColumn as { label: string; value: string }[]).map(
                (col, index) => (
                  <li key={index}>
                    <span className="font-semibold">{col.label}:</span>{" "}
                    {col.value}
                  </li>
                )
              )}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
