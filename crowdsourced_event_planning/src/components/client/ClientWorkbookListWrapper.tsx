// filepath: src/components/client/ClientWorkbookListWrapper.tsx
"use client";

import WorkbookList from "@/components/WorkbookList";

import type { Workbook } from "../../../types/workbook";

export default function ClientWorkbookListWrapper({
  workbooks,
  eventId,
}: {
  workbooks: Workbook[];
  eventId: string;
}) {
  const handleSelectWorkbook = (workbookId: string) => {
    window.location.href = `/event/${eventId}/workbook/${workbookId}`;
  };

  return (
    <WorkbookList
      workbooks={workbooks}
      onSelectWorkbook={handleSelectWorkbook}
    />
  );
}
