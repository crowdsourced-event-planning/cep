"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { toast } from "react-hot-toast";

interface CreateWorkbookButtonProps {
  eventId: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
}

export default function CreateWorkbookButton({
  eventId,
  variant = "primary",
  size = "sm",
  className = "",
  children,
}: CreateWorkbookButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [workbookName, setWorkbookName] = useState("");
  const [workbookDescription, setWorkbookDescription] = useState("");
  const router = useRouter();

  const handleCreateWorkbook = async () => {
    if (!workbookName.trim()) {
      toast.error("Please enter a workbook name");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/events/${eventId}/workbooks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: workbookName.trim(),
          description: workbookDescription.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create workbook");
      }

      const result = await response.json();

      setIsDialogOpen(false);
      setWorkbookName("");
      setWorkbookDescription("");
      toast.success("Workbook created successfully!");

      // Redirect ke slug, bukan _id
      router.push(`/event/${eventId}/workbook/${result.workbook.slug}`);

      router.refresh();
    } catch (error) {
      console.error("Error creating workbook:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create workbook"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setIsDialogOpen(true)}
        disabled={isLoading}
      >
        {children}
      </Button>

      {/* Simple Modal Dialog */}
      {isDialogOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0,0,0,0.4)" }}
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Create New Workbook</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workbook Name *
                </label>
                <input
                  type="text"
                  value={workbookName}
                  onChange={(e) => setWorkbookName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter workbook name..."
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={workbookDescription}
                  onChange={(e) => setWorkbookDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the workbook purpose..."
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsDialogOpen(false);
                  setWorkbookName("");
                  setWorkbookDescription("");
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateWorkbook}
                disabled={isLoading || !workbookName.trim()}
              >
                {isLoading ? "Creating..." : "Create Workbook"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
