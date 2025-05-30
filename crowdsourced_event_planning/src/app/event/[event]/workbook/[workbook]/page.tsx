import { getWorkbookById, getTasksByWorkbook } from "@/lib/data/workbook";
import Link from "next/link";
import TaskForm from "@/components/client/TaskForm";

interface WorkbookPageProps {
  params: Promise<{ event: string; workbook: string }>;
}

export default async function WorkbookDetail({ params }: WorkbookPageProps) {
  const resolvedParams = await params;
  const eventId = resolvedParams.event;
  const workbookId = resolvedParams.workbook;

  if (!eventId || !workbookId) {
    return <div>ID event atau workbook tidak ditemukan</div>;
  }

  const workbook = await getWorkbookById(workbookId);
  if (!workbook) {
    return <div>Workbook tidak ditemukan</div>;
  }

  if (workbook.eventId.toString() !== eventId) {
    return <div>Workbook tidak sesuai dengan event ini</div>;
  }

  const tasks = await getTasksByWorkbook(workbookId);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{workbook.name}</h1>
      <p className="mb-2">{workbook.description}</p>
      <p className="mb-2">
        Dibuat pada: {new Date(workbook.createdAt).toLocaleDateString()}
      </p>

      <h2 className="text-2xl font-bold mt-6 mb-4">Tasks</h2>
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

      <h2 className="text-2xl font-bold mt-6 mb-4">Tambah Task Baru</h2>
      <TaskForm workbookId={workbookId} />
    </div>
  );
}
