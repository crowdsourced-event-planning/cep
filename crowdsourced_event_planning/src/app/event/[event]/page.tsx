// app/event/[event]/page.tsx
import { getEventById, getWorkbooksByEvent } from "@/lib/data/event";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, DollarSign, List } from "lucide-react";
import { Event } from "@/types/event";
import { Workbook } from "@/types/workbook";

const formatRupiah = (number: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

interface EventPageProps {
  params: Promise<{ event: string }>;
}

export default async function EventDetail({ params }: EventPageProps) {
  const { event: eventId } = await params;

  if (!eventId) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-500">ID event tidak ditemukan</p>
      </div>
    );
  }

  let event: Event | null = null;
  let workbooks: Workbook[] = [];
  try {
    event = await getEventById(eventId);
    if (!event) {
      return (
        <div className="container mx-auto p-4">
          <p className="text-red-500">Event tidak ditemukan</p>
        </div>
      );
    }
    workbooks = await getWorkbooksByEvent(eventId);
  } catch (error) {
    console.error("🚀 ~ EventDetail ~ error:", error);
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-500">Gagal memuat data event</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-bold">{event.title}</CardTitle>
            <Badge
              variant={event.status === "active" ? "default" : "secondary"}
            >
              {event.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{event.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span>{event.location}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span>
                {new Date(event.startDate).toLocaleDateString()} -{" "}
                {new Date(event.endDate).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span>
                {event.startTime} - {event.endTime}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <List className="h-5 w-5 text-muted-foreground" />
              <span>Tipe: {event.typeEvent}</span>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <span>Dana Target: {formatRupiah(event.targetFunding)}</span>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <span>Dana Terkumpul: {formatRupiah(event.currentFunding)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Workbooks</CardTitle>
        </CardHeader>
        <CardContent>
          {workbooks.length > 0 ? (
            <ul className="space-y-2">
              {workbooks.map((workbook) => (
                <li
                  key={workbook._id.toString()}
                  className="flex items-center gap-2"
                >
                  <Link
                    href={`/event/${event._id}/workbook/${workbook._id}`}
                    className="text-primary hover:underline"
                  >
                    {workbook.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">
              Tidak ada workbook untuk event ini.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button asChild>
          <Link href={`/event/${event._id}/workbook/new`}>
            Tambah Workbook Baru
          </Link>
        </Button>
      </div>
    </div>
  );
}
