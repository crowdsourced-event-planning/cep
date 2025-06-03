"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, isAuthenticated } from "@/lib/auth-client";
import EventForm from "@/components/EventForm";
import ImageModal from "@/components/ImageModal";
import toast from "react-hot-toast"; // Ganti import ini

// Tipe data
type BudgetItem = { name: string; amount: number };
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

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "targetFunding" ? Number(value) : value,
    }));
  };

  const handleFundingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const raw = e.target.value.replace(/\./g, "");
    setFormData((prev) => ({
      ...prev,
      targetFunding: Number(raw),
    }));
  };

  const addBudgetItem = () => {
    if (currentBudgetItem.name && currentBudgetItem.amount > 0) {
      setBudgetItems((prev) => [...prev, currentBudgetItem]);
      setCurrentBudgetItem({ name: "", amount: 0 });
    }
  };

  const removeBudgetItem = (index: number) => {
    setBudgetItems((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!formData.title.trim()) errors.push("Event title is required");
    if (!formData.description.trim()) errors.push("Description is required");
    if (!formData.category) errors.push("Category is required");
    if (!formData.typeEvent) errors.push("Event type is required");
    if (!formData.location.trim()) errors.push("Location is required");
    if (!formData.startDate) errors.push("Start date is required");
    if (!formData.startTime) errors.push("Start time is required");
    if (!formData.endDate) errors.push("End date is required");
    if (!formData.endTime) errors.push("End time is required");

    // Validate dates
    if (formData.startDate && formData.endDate) {
      const startDateTime = new Date(
        `${formData.startDate}T${formData.startTime}`
      );
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

      if (startDateTime >= endDateTime) {
        errors.push("End date/time must be after start date/time");
      }

      if (startDateTime < new Date()) {
        errors.push("Start date/time cannot be in the past");
      }
    }

    if (formData.targetFunding < 0) {
      errors.push("Target funding cannot be negative");
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateForm();
    if (!isDraft && validationErrors.length > 0) {
      toast.error(validationErrors.map((error) => `• ${error}`).join("\n"), {
        duration: 4000,
      });
      return;
    }

    if (!isAuthenticated()) {
      toast.error("You must be logged in to create an event.");
      router.push("/login?callbackUrl=/create");
      return;
    }

    // Ambil user dari JWT/cookie
    const user = getCurrentUser();
    if (!user || !user._id) {
      toast.error("You must be logged in to create an event.");
      router.push("/login?callbackUrl=/create");
      return;
    }

    setLoading(true);

    try {
      const userId = user._id;

      const eventData = {
        ...formData,
        creator: user._id,
        budget: budgetItems,
        status: isDraft ? "draft" : "open",
        gallery,
        documents,
      };

      await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify(eventData),
      });

      toast.success(
        `Event ${isDraft ? "saved as draft" : "created"} successfully!`
      );
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 300);
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create event"
      );
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
            <span className="text-gray-900">Create Event</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
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
          handleSubmit={(e) => handleSubmit(e, false)}
          buttonLabel="Create Event"
        />
      </div>
      {modalOpen && (
        <ImageModal
          images={gallery}
          current={modalIndex}
          onClose={() => setModalOpen(false)}
          onPrev={() =>
            setModalIndex((modalIndex - 1 + gallery.length) % gallery.length)
          }
          onNext={() => setModalIndex((modalIndex + 1) % gallery.length)}
        />
      )}
    </div>
  );
}
