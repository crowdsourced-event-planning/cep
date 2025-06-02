"use client";

import WorkbookList from "@/components/WorkbookList";
import { Workbook } from "../../../types/workbook";

interface WorkbookListClientProps {
  workbooks: Workbook[];
  eventId: string;
}

export default function WorkbookListClient({
  workbooks,
  eventId,
}: WorkbookListClientProps) {
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
