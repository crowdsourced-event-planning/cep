import { getWorkbookByEventAndSlug } from "@/lib/data/workbook";
import { getEventBySlugOrId } from "@/lib/data/event";
import TaskBoardWrapper from "@/components/client/TaskBoardWrapper";
import { getTasksByWorkbookId } from "@/lib/data/task";
import { cookies } from "next/headers";
import Breadcrumbs from "@/components/Breadcrumbs";

interface WorkbookPageProps {
  params: Promise<{ event: string; workbook: string }>;
}

export default async function WorkbookDetail({ params }: WorkbookPageProps) {
  const resolvedParams = await params;
  const eventParam = resolvedParams.event;
  const { workbook: workbookSlug } = resolvedParams;

  if (!eventParam || !workbookSlug) {
    return (
      <div className="text-red-500">ID event atau workbook tidak ditemukan</div>
    );
  }

  const event = await getEventBySlugOrId(eventParam);
  if (!event) {
    return <div className="text-red-500">Event tidak ditemukan</div>;
  }
  const eventId = event._id?.toString();

  if (!eventId) {
    return <div className="text-red-500">ID event tidak valid</div>;
  }

  const workbook = await getWorkbookByEventAndSlug(eventId, workbookSlug);
  if (!workbook) {
    return <div className="text-red-500">Workbook tidak ditemukan</div>;
  }
  const workbookId = workbook._id ? workbook._id.toString() : "";

  // Ambil semua tasks untuk workbook ini
  const tasksRaw = await getTasksByWorkbookId(workbookId);

  // Ambil userId dari cookies
  const cookieStore = await cookies();
  const userId = cookieStore.get("x-user-id")?.value || "";

  // Cek apakah user adalah assignee di salah satu task
  const isAssignee = tasksRaw.some(
    (task) =>
      Array.isArray(task.assignedTo) &&
      task.assignedTo.map((id) => id?.toString()).includes(userId)
  );

  // Cek apakah user adalah creator event
  const isCreator = event.creator?.toString() === userId;

  return (
    <div className="container mx-auto p-4">
      {/* Breadcrumb */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Events", href: "/event" },
          { label: event.title, href: `/event/${event.slug}` },
          { label: workbook.name },
        ]}
      />

      <section className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{workbook.name}</h1>
        <p className="mb-1 text-gray-700">{workbook.description}</p>
        <p className="mb-1 text-gray-500 text-sm">
          Dibuat pada:{" "}
          {workbook.createdAt
            ? new Date(workbook.createdAt).toLocaleDateString()
            : "Tanggal tidak tersedia"}
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Task Board</h2>
        {isAssignee ? (
          <TaskBoardWrapper
            initialTasks={tasksRaw
              .filter((task) => !!task._id)
              .map((task) => ({
                ...task,
                _id: task._id!.toString(),
                workbookId: task.workbookId?.toString(),
                parentTask: task.parentTask ? task.parentTask.toString() : null,
                assignedTo: Array.isArray(task.assignedTo)
                  ? task.assignedTo.map((id) => id?.toString())
                  : [],
                dueDate: task.dueDate ? task.dueDate.toISOString() : null,
                createdAt: task.createdAt ? task.createdAt.toISOString() : null,
                updatedAt: task.updatedAt ? task.updatedAt.toISOString() : null,
              }))}
            eventId={eventId}
            workbookId={workbookId}
            isCreator={isCreator}
            userId={userId}
          />
        ) : (
          <div className="text-gray-500 italic">
            Anda tidak di-assign ke task manapun di workbook ini.
          </div>
        )}
      </section>
    </div>
  );
}
