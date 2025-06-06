"use client";

import React, { useState } from "react";
import Card from "@/components/ui/Card";
import { formatDate } from "@/lib/utils/format";
import type { WorkbookClient } from "./client/WorkbookListClient";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import ModalEditWorkbook from "./ModalEditWorkbook";

interface WorkbookListProps {
  workbooks: WorkbookClient[];
  onSelectWorkbook?: (workbookSlug: string) => void;
  eventSlug: string;
  isCreator?: boolean;
}

export default function WorkbookList({
  workbooks,
  onSelectWorkbook,
  isCreator = false,
}: WorkbookListProps) {
  const router = useRouter();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedWorkbook, setSelectedWorkbook] =
    useState<WorkbookClient | null>(null);

  if (workbooks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No workbooks found for this event.</p>
      </div>
    );
  }

  return (
    <>
      {/* Modal Edit Workbook */}
      {editModalOpen && selectedWorkbook && (
        <ModalEditWorkbook
          workbook={selectedWorkbook}
          onClose={() => setEditModalOpen(false)}
          onUpdated={() => {
            setEditModalOpen(false);
            router.refresh();
          }}
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workbooks.map((workbook) => (
          <Card
            key={workbook._id}
            className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            onClick={() => onSelectWorkbook?.(workbook.slug)}
          >
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {workbook.name}
              </h3>
              <p className="text-gray-600 text-sm">{workbook.description}</p>
              <p className="text-xs text-gray-500">
                Created: {formatDate(workbook.createdAt)}
              </p>
              {isCreator && (
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="cursor-pointer"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      setSelectedWorkbook(workbook);
                      setEditModalOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="cursor-pointer"
                    onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      if (
                        confirm(
                          `Yakin ingin menghapus "${workbook.name}"? Semua task di dalamnya juga akan terhapus.`
                        )
                      ) {
                        try {
                          const res = await fetch(
                            `/api/workbooks/${workbook._id}`,
                            { method: "DELETE" }
                          );
                          if (res.ok) {
                            toast.success("Workbook deleted!");
                            router.refresh();
                          } else {
                            const err = await res.json();
                            toast.error(
                              err.error || "Failed to delete workbook"
                            );
                          }
                        } catch (err) {
                          console.log("🚀 ~ onClick={ ~ err:", err);
                          toast.error("Failed to delete workbook");
                        }
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
