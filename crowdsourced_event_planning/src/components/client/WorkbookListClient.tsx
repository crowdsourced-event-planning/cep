"use client";

import { useRouter } from "next/navigation";
import WorkbookList from "@/components/WorkbookList";

// Tipe khusus untuk client, semua field string
export interface WorkbookClient {
  _id: string;
  name: string;
  slug: string;
  description: string;
  eventId: string;
  createdAt: string;
  updatedAt?: string;
}

interface WorkbookListClientProps {
  workbooks: WorkbookClient[];
  eventSlug: string;
  isCreator?: boolean; // Tambahkan ini
}

export default function WorkbookListClient({
  workbooks,
  eventSlug,
  isCreator = false, // Default false
}: WorkbookListClientProps) {
  const router = useRouter();

  const handleSelectWorkbook = (workbookSlug: string) => {
    router.push(`/event/${eventSlug}/workbook/${workbookSlug}`);
  };

  return (
    <WorkbookList
      workbooks={workbooks}
      onSelectWorkbook={handleSelectWorkbook}
      eventSlug={eventSlug}
      isCreator={isCreator} // Teruskan ke WorkbookList
    />
  );
}
