import { getEventBySlugOrId } from "@/lib/data/event";
import { getPanitiaRequestsByEventId } from "@/lib/data/panitiaRequest";
import { cookies } from "next/headers";

export default async function PanitiaRequestsPage({
  params,
}: {
  params: Promise<{ event: string }>;
}) {
  const { event } = await params;
  const eventData = await getEventBySlugOrId(event);
  const eventId = eventData?._id?.toString() || "";
  const cookieStore = await cookies();
  const userId = cookieStore.get("x-user-id")?.value || "";

  // Hanya creator yang boleh akses
  if (!eventData || eventData.creator?.toString() !== userId) {
    return <div className="text-red-500">Akses ditolak</div>;
  }

  const requests = await getPanitiaRequestsByEventId(eventId);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Permintaan Jadi Panitia</h1>
      {requests.length === 0 ? (
        <div>Tidak ada permintaan.</div>
      ) : (
        <ul>
          {requests.map((req) => (
            <li key={req._id.toString()}>
              User: {req.userId} | Workbook: {req.workbookId} | Status:{" "}
              {req.status}
              <form
                action={`/api/request-panitia/${req._id}/approve`}
                method="POST"
                style={{ display: "inline" }}
              >
                <button type="submit" className="ml-2 text-green-600">
                  Terima
                </button>
              </form>
              <form
                action={`/api/request-panitia/${req._id}/reject`}
                method="POST"
                style={{ display: "inline" }}
              >
                <button type="submit" className="ml-2 text-red-600">
                  Tolak
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
