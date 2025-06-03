// filepath: src/app/event/[event]/edit/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import EventForm from "@/components/EventForm";
import Link from "next/link";

type BudgetItem = {
  name: string;
  amount: number;
};

type EventFormData = {
  title: string;
  description: string;
  category: string;
  typeEvent: string;
  location: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  targetFunding: number;
  budget: BudgetItem[];
};

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const { event } = params as { event: string };

  // State sama seperti create event
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    category: "",
    typeEvent: "",
    location: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    targetFunding: 0,
    budget: [],
  });
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [currentBudgetItem, setCurrentBudgetItem] = useState<BudgetItem>({
    name: "",
    amount: 0,
  });
  const [gallery, setGallery] = useState<string[]>([]);
  const [documents, setDocuments] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    fetch(`/api/events/${event}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Event not found");
        return res.json();
      })
      .then((data) => {
        if (ignore) return;
        setFormData({
          title: data.title || "",
          description: data.description || "",
          category: data.category || "",
          typeEvent: data.typeEvent || "",
          location: data.location || "",
          startDate: data.startDate
            ? new Date(data.startDate).toISOString().split("T")[0]
            : "",
          startTime: data.startTime || "",
          endDate: data.endDate
            ? new Date(data.endDate).toISOString().split("T")[0]
            : "",
          endTime: data.endTime || "",
          targetFunding: data.targetFunding || 0,
          budget: data.budget || [],
        });
        setBudgetItems(data.budget || []);
        setGallery(data.gallery || []);
        setDocuments(data.documents || []);
        setLoading(false);
      })
      .catch(() => {
        if (ignore) return;
        toast.error("Event tidak ditemukan.");
        setTimeout(() => router.push("/events"), 1500);
        setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [event, router]);

  // Handler sama seperti create event
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev: EventFormData) => ({
      ...prev,
      [name]: name === "targetFunding" ? Number(value) : value,
    }));
  };

  const handleFundingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const raw = e.target.value.replace(/\./g, "");
    setFormData((prev: EventFormData) => ({
      ...prev,
      targetFunding: Number(raw),
    }));
  };

  const addBudgetItem = () => {
    if (currentBudgetItem.name && currentBudgetItem.amount > 0) {
      setBudgetItems((prev: BudgetItem[]) => [...prev, currentBudgetItem]);
      setCurrentBudgetItem({ name: "", amount: 0 });
    }
  };

  const removeBudgetItem = (index: number) => {
    setBudgetItems((prev: BudgetItem[]) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${event}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          budget: budgetItems,
          gallery,
          documents,
        }),
      });
      if (res.ok) {
        toast.success("Event berhasil diupdate!");
        setTimeout(() => router.back(), 300);
      } else {
        toast.error("Gagal update event.");
        setTimeout(() => router.back(), 300);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="">
        {/* Header */}
        <div className="mb-2">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900">Edit Event</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
          <p className="mt-2 text-gray-600">
            Bring people together and make your event idea a reality
          </p>
        </div>

        <EventForm
          formData={formData}
          setFormData={setFormData}
          budgetItems={budgetItems}
          setBudgetItems={setBudgetItems}
          currentBudgetItem={currentBudgetItem}
          setCurrentBudgetItem={setCurrentBudgetItem}
          gallery={gallery}
          setGallery={setGallery}
          documents={documents}
          setDocuments={setDocuments}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          modalIndex={modalIndex}
          setModalIndex={setModalIndex}
          uploadingImage={uploadingImage}
          setUploadingImage={setUploadingImage}
          uploadingDoc={uploadingDoc}
          setUploadingDoc={setUploadingDoc}
          loading={loading}
          handleInputChange={handleInputChange}
          handleFundingChange={handleFundingChange}
          addBudgetItem={addBudgetItem}
          removeBudgetItem={removeBudgetItem}
          handleSubmit={handleSubmit}
          buttonLabel="Edit Event"
        />
      </div>
    </div>
  );
}
