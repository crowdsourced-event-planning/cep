"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

interface WorkbookFormData {
  name: string;
  description: string;
}

interface WorkbookManagerProps {
  eventId: string;
  onWorkbookCreate?: () => void;
  variant?: "button" | "large-button";
}

export default function WorkbookManager({
  eventId,
  onWorkbookCreate,
}: WorkbookManagerProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<WorkbookFormData>({
    name: "",
    description: "",
  });
  const router = useRouter();

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    });
    setError("");
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Workbook name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userId = "6838676f883ee5cb0dac53eb"; // This should come from auth context

      const response = await fetch("/api/workbooks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          eventId: eventId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create workbook");
      }

      // Success
      setShowCreateModal(false);
      resetForm();
      onWorkbookCreate?.();

      // Show success message
      alert("Workbook created successfully!");

      // Refresh the page to show the new workbook
      router.refresh();
    } catch (err) {
      console.error("Error creating workbook:", err);
      setError(
        err instanceof Error ? err.message : "Failed to create workbook"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      {/* Create Workbook Button */}
      <Button size="sm" onClick={openCreateModal}>
        Create Workbook
      </Button>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Create New Workbook</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Workbook Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter workbook name..."
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the workbook purpose..."
                  disabled={loading}
                />
              </div>

              {error && <div className="text-red-600 text-sm">{error}</div>}

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Creating..." : "Create Workbook"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
