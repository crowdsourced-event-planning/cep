"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { toast } from "react-hot-toast";

interface ModalEditWorkbookProps {
  workbook: {
    _id: string;
    name: string;
    description: string;
  };
  onClose: () => void;
  onUpdated: () => void;
}

export default function ModalEditWorkbook({
  workbook,
  onClose,
  onUpdated,
}: ModalEditWorkbookProps) {
  const [name, setName] = useState(workbook.name);
  const [description, setDescription] = useState(workbook.description || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!name.trim()) {
      toast.error("Workbook name is required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/workbooks/${workbook._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
        }),
      });
      if (res.ok) {
        toast.success("Workbook updated!");
        onUpdated();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to update workbook");
      }
    } catch (err) {
      console.log("🚀 ~ handleUpdate ~ err:", err);
      toast.error("Failed to update workbook");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.4)" }}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Tutup"
        >
          ×
        </button>
        <h2 className="text-xl font-semibold mb-4">Edit Workbook</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Workbook Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2 rounded"
              rows={3}
              disabled={loading}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate} loading={loading}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
