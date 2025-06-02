import { getWorkbookById } from "@/lib/data/workbook";
import { getEventBySlugOrId } from "@/lib/data/event";
import TaskForm from "@/components/client/TaskForm";
import AutoRefreshTaskList from "@/components/client/AutoRefreshTaskList";

interface WorkbookPageProps {
  params: Promise<{ event: string; workbook: string }>;
}

export default async function WorkbookDetail({ params }: WorkbookPageProps) {
  const resolvedParams = await params;
  const eventParam = resolvedParams.event;
  const workbookId = resolvedParams.workbook;

  if (!eventParam || !workbookId) {
    return <div>ID event atau workbook tidak ditemukan</div>;
  }

  const workbook = await getWorkbookById(workbookId);
  if (!workbook) {
    return <div>Workbook tidak ditemukan</div>;
  }

  // Get the event to verify the relationship
  const event = await getEventBySlugOrId(eventParam);
  if (!event) {
    return <div>Event tidak ditemukan</div>;
  }

  // Compare the actual event ID with the workbook's eventId
  const eventId = event._id?.toString();
  if (workbook.eventId.toString() !== eventId) {
    return <div>Workbook tidak sesuai dengan event ini</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{workbook.name}</h1>
      <p className="mb-2">{workbook.description}</p>
      <p className="mb-2">
        Dibuat pada:{" "}
        {workbook.createdAt?.toLocaleDateString() ?? "Tanggal tidak tersedia"}
      </p>

      <h2 className="text-2xl font-bold mt-6 mb-4">Tasks</h2>
      <AutoRefreshTaskList workbookId={workbookId} eventId={eventId} />

      <h2 className="text-2xl font-bold mt-6 mb-4">Tambah Task Baru</h2>
      <TaskForm workbookId={workbookId} />
    </div>
  );
}
