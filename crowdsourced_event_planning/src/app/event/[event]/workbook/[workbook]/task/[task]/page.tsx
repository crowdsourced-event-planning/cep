import { getTaskById } from "@/lib/data/task";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

interface TaskPageProps {
  params: Promise<{ event: string; workbook: string; task: string }>;
}

export default async function TaskDetail({ params }: TaskPageProps) {
  const resolvedParams = await params;
  const eventId = resolvedParams.event;
  const workbookId = resolvedParams.workbook;
  const taskId = resolvedParams.task;

  if (!eventId || !workbookId || !taskId) {
    return <div>ID event, workbook, atau task tidak ditemukan</div>;
  }

  const task = await getTaskById(taskId);
  if (!task) {
    return <div>Task tidak ditemukan</div>;
  }

  if (task.workbookId.toString() !== workbookId) {
    return <div>Task tidak sesuai dengan workbook ini</div>;
  }

  const db = await getDb();
  const workbook = await db
    .collection("workbooks")
    .findOne({ _id: new ObjectId(workbookId) });
  if (!workbook || workbook.eventId.toString() !== eventId) {
    return <div>Workbook tidak sesuai dengan event ini</div>;
  }

  const assignees = await db
    .collection("users")
    .find({ _id: { $in: task.assignedTo } })
    .toArray();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{task.name}</h1>
      <p className="mb-2">{task.description}</p>
      <p className="mb-2">Status: {task.status}</p>
      <p className="mb-2">
        Batas Waktu:{" "}
        {task.dueDate
          ? new Date(task.dueDate).toLocaleDateString()
          : "Tidak ada"}
      </p>
      <p className="mb-2">
        Ditugaskan kepada:{" "}
        {assignees.map((user) => user.name).join(", ") || "Tidak ada"}
      </p>
      {task.parentTask && (
        <p className="mb-2">Subtask dari: {task.parentTask.toString()}</p>
      )}

      {task.customColumn && task.customColumn.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mt-6 mb-4">Kolom Kustom</h2>
          <ul className="list-disc pl-5">
            {task.customColumn.map(
              (col: { label: string; value: string }, index: number) => (
                <li key={index}>
                  {col.label}: {col.value}
                </li>
              )
            )}
          </ul>
        </>
      )}
    </div>
  );
}
