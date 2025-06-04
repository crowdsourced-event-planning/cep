// filepath: src/components/client/ClientWorkbookListWrapper.tsx
"use client";

import { useRouter } from "next/navigation";
import WorkbookList from "@/components/WorkbookList";
import type { Workbook } from "../../../types/workbook";

export default function ClientWorkbookListWrapper({
  workbooks,
  eventSlug,
}: {
  workbooks: Workbook[];
  eventSlug: string;
}) {
  const router = useRouter();

  const handleSelectWorkbook = (workbookId: string) => {
    router.push(`/event/${eventSlug}/workbook/${workbookId}`);
  };

  return (
    <WorkbookList
      workbooks={workbooks}
      onSelectWorkbook={handleSelectWorkbook}
    />
  );
}
