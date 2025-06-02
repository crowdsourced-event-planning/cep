"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Input from "@/components/ui/Input";
import Swal from "sweetalert2";

interface EventFormData {
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
  budget: Array<{ name: string; amount: number }>;
}

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

  const [budgetItems, setBudgetItems] = useState<
    Array<{ name: string; amount: number }>
  >([]);
  const [currentBudgetItem, setCurrentBudgetItem] = useState({
    name: "",
    amount: 0,
  });

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
      await Swal.fire({
        icon: "error",
        title: "Validation Error",
        html: validationErrors.map((error) => `<li>${error}</li>`).join(""),
        confirmButtonColor: "#3b82f6",
      });
      return;
    }

    setLoading(true);

    try {
      // Hard-coded user ID for now (should come from auth context)
      const userId = "6838676f883ee5cb0dac53eb";

      const eventData = {
        ...formData,
        budget: budgetItems,
        status: isDraft ? "draft" : "open",
        creator: userId,
      };

      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify(eventData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create event");
      }

      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: `Event ${isDraft ? "saved as draft" : "created"} successfully!`,
        showConfirmButton: false,
        timer: 2000,
      });

      // Redirect to home page
      router.push("/");
      router.refresh(); // Refresh to update events list
    } catch (error) {
      console.error("Error creating event:", error);
      await Swal.fire({
        icon: "error",
        title: "Error!",
        text: error instanceof Error ? error.message : "Failed to create event",
        confirmButtonColor: "#3b82f6",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={(e) => handleSubmit(e, false)}
              className="space-y-6"
            >
              {/* Basic Information */}
              <Card>
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Basic Information
                    </h2>
                  </div>

                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Event Title *
                    </label>
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Give your event a compelling title"
                      className="text-lg"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      required
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your event, its purpose, and what makes it special..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      disabled={loading}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="category"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Category *
                      </label>
                      <select
                        id="category"
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        disabled={loading}
                      >
                        <option value="">Select a category</option>
                        <option value="conference">Conference</option>
                        <option value="workshop">Workshop</option>
                        <option value="meetup">Meetup</option>
                        <option value="charity">Charity</option>
                        <option value="social">Social</option>
                        <option value="sports">Sports</option>
                        <option value="cultural">Cultural</option>
                        <option value="educational">Educational</option>
                        <option value="business">Business</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="typeEvent"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Event Type *
                      </label>
                      <select
                        id="typeEvent"
                        name="typeEvent"
                        required
                        value={formData.typeEvent}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        disabled={loading}
                      >
                        <option value="">Select event type</option>
                        <option value="in-person">In-Person</option>
                        <option value="virtual">Virtual</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Location *
                    </label>
                    <Input
                      id="location"
                      name="location"
                      type="text"
                      required
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Enter event location or 'Online' for virtual events"
                      disabled={loading}
                    />
                  </div>
                </div>
              </Card>
              {/* Date and Time */}
              <Card>
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Date & Time
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="startDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Start Date *
                      </label>
                      <Input
                        id="startDate"
                        name="startDate"
                        type="date"
                        required
                        value={formData.startDate}
                        onChange={handleInputChange}
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="startTime"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Start Time *
                      </label>
                      <Input
                        id="startTime"
                        name="startTime"
                        type="time"
                        required
                        value={formData.startTime}
                        onChange={handleInputChange}
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="endDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        End Date *
                      </label>
                      <Input
                        id="endDate"
                        name="endDate"
                        type="date"
                        required
                        value={formData.endDate}
                        onChange={handleInputChange}
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="endTime"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        End Time *
                      </label>
                      <Input
                        id="endTime"
                        name="endTime"
                        type="time"
                        required
                        value={formData.endTime}
                        onChange={handleInputChange}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              </Card>
              {/* Funding & Budget */}
              <Card>
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Funding & Budget
                    </h2>
                  </div>

                  <div>
                    <label
                      htmlFor="targetFunding"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Target Funding Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">
                        Rp
                      </span>
                      <Input
                        id="targetFunding"
                        name="targetFunding"
                        type="number"
                        min="0"
                        step="1000"
                        value={formData.targetFunding || ""}
                        onChange={handleInputChange}
                        placeholder="0"
                        className="pl-8"
                        disabled={loading}
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Leave blank if no funding is needed
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Breakdown (Optional)
                    </label>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Budget item name"
                          value={currentBudgetItem.name}
                          onChange={(e) =>
                            setCurrentBudgetItem((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          disabled={loading}
                        />
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-gray-500">
                            Rp
                          </span>
                          <Input
                            type="number"
                            placeholder="0"
                            value={currentBudgetItem.amount || ""}
                            onChange={(e) =>
                              setCurrentBudgetItem((prev) => ({
                                ...prev,
                                amount: Number(e.target.value),
                              }))
                            }
                            className="pl-8"
                            disabled={loading}
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={addBudgetItem}
                        disabled={
                          loading ||
                          !currentBudgetItem.name ||
                          currentBudgetItem.amount <= 0
                        }
                      >
                        Add Budget Item
                      </Button>

                      {budgetItems.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-700">
                            Budget Items:
                          </h4>
                          {budgetItems.map((item, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center bg-gray-50 p-3 rounded"
                            >
                              <span>{item.name}</span>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">
                                  Rp {item.amount.toLocaleString()}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeBudgetItem(index)}
                                  className="text-red-500 hover:text-red-700"
                                  disabled={loading}
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
              {/* Action Buttons */}{" "}
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    handleSubmit(
                      { preventDefault: () => {} } as React.FormEvent,
                      true
                    )
                  }
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save as Draft"}
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Event"}
                </Button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview */}
            <Card>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="aspect-video bg-gray-200 rounded mb-3 flex items-center justify-center">
                    <span className="text-gray-500">Event Image</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    {formData.title || "Your Event Title"}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {formData.description ||
                      "Your event description will appear here..."}
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <span>📍 {formData.location || "Location"}</span>
                    <span className="mx-2">•</span>
                    <span>📅 {formData.startDate || "Date"}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Tips */}
            <Card>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Tips for Success
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Use a clear, descriptive title
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Add high-quality images
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Be specific about location and time
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Set realistic funding goals
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Provide detailed descriptions
                  </li>
                </ul>
              </div>
            </Card>

            {/* Help */}
            <Card>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Need Help?
                </h3>
                <p className="text-sm text-gray-600">
                  Check out our event creation guide or contact support.
                </p>
                <div className="space-y-2">
                  <Button variant="secondary" size="sm" className="w-full">
                    View Guide
                  </Button>
                  <Button variant="secondary" size="sm" className="w-full">
                    Contact Support
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
