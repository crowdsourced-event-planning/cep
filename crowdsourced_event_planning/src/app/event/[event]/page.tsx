import { getEventById, getWorkbooksByEvent } from "@/lib/data/event";
import Link from "next/link";

interface EventPageProps {
  params: Promise<{ event: string }>;
}

export default async function EventDetail({ params }: EventPageProps) {
  const resolvedParams = await params;
  const eventId = resolvedParams.event;

  if (!eventId) {
    return <div>ID event tidak ditemukan</div>;
  }

  const event = await getEventById(eventId);
  if (!event) {
    return <div>Event tidak ditemukan</div>;
  }

  const workbooks = await getWorkbooksByEvent(eventId);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <p className="mb-2">{event.description}</p>
      <p className="mb-2">Lokasi: {event.location}</p>
      <p className="mb-2">
        Tanggal: {new Date(event.startDate).toLocaleDateString()} -{" "}
        {new Date(event.endDate).toLocaleDateString()}
      </p>
      <p className="mb-2">
        Waktu: {event.startTime} - {event.endTime}
      </p>
      <p className="mb-2">Tipe: {event.typeEvent}</p>
      <p className="mb-2">Status: {event.status}</p>
      <p className="mb-2">Dana Target: {event.targetFunding}</p>
      <p className="mb-2">Dana Terkumpul: {event.currentFunding}</p>

      <h2 className="text-2xl font-bold mt-6 mb-4">Workbooks</h2>
      {workbooks.length > 0 ? (
        <ul className="list-disc pl-5">
          {workbooks.map((workbook) => (
            <li key={workbook._id}>
              <Link
                href={`/event/${eventId}/workbook/${workbook._id}`}
                className="text-blue-600 hover:underline"
              >
                {workbook.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Tidak ada workbook untuk event ini.</p>
      )}
    </div>
  );
}
