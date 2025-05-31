import React from "react";
import Card from "./ui/card";
import { Workbook } from "../../types/workbook";
import { formatDate } from "@/lib/utils/formatDate";

interface WorkbookListProps {
  workbooks: Workbook[];
  onSelectWorkbook?: (workbookId: string) => void;
}

export default function WorkbookList({
  workbooks,
  onSelectWorkbook,
}: WorkbookListProps) {
  if (workbooks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No workbooks found for this event.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workbooks.map((workbook) => (
        <Card
          key={workbook._id}
          className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
          onClick={() => onSelectWorkbook?.(workbook._id)}
        >
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">
              {workbook.name}
            </h3>
            <p className="text-gray-600 text-sm">{workbook.description}</p>
            <p className="text-xs text-gray-500">
              Created: {formatDate(workbook.createdAt)}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
