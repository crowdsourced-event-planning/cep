"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Input from "@/components/ui/Input";
import { Event } from "@/types/event";

interface EditEventPageProps {
  params: Promise<{ event: string }>;
}

export default function EditEventPage({ params }: EditEventPageProps) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [eventId, setEventId] = useState<string | null>(null);

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setEventId(resolvedParams.event);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/events/${eventId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch event: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched event data:", data); // Debug log
        setEvent(data);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to load event. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!event || !eventId) return;

    try {
      setSaving(true);
      setError(null);

      const response = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update event");
      }

      router.push(`/events/${eventId}`);
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update event"
      );
    } finally {
      setSaving(false);
    }
  };

  const formatDateForInput = (date: Date | string) => {
    if (!date) return "";
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return "";
      return d.toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  const formatTimeForInput = (time: string | Date) => {
    if (!time) return "";
    try {
      if (typeof time === "string") {
        // If it's already in HH:MM format
        if (time.match(/^\d{2}:\d{2}$/)) return time;

        // If it's a full datetime string, extract time
        const date = new Date(time);
        if (!isNaN(date.getTime())) {
          return date.toTimeString().substring(0, 5);
        }
      }

      if (time instanceof Date) {
        return time.toTimeString().substring(0, 5);
      }

      return "";
    } catch {
      return "";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">Loading event...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-lg text-red-600 mb-4">{error}</div>
              <Button
                onClick={() => window.location.reload()}
                variant="secondary"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">Event not found</div>
          </div>
        </div>
      </div>
    );
  }

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
            <Link href="/events" className="hover:text-blue-600">
              Events
            </Link>
            <span>/</span>
            <span className="text-gray-900">Edit Event</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
          <p className="mt-2 text-gray-600">Update your event details</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                      value={event.title || ""}
                      onChange={(e) =>
                        setEvent({ ...event, title: e.target.value })
                      }
                      placeholder="Give your event a compelling title"
                      className="text-lg"
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
                      value={event.description || ""}
                      onChange={(e) =>
                        setEvent({ ...event, description: e.target.value })
                      }
                      placeholder="Describe your event, its purpose, and what makes it special..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                        value={event.category || ""}
                        onChange={(e) =>
                          setEvent({ ...event, category: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                        value={event.typeEvent || ""}
                        onChange={(e) =>
                          setEvent({ ...event, typeEvent: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                      value={event.location || ""}
                      onChange={(e) =>
                        setEvent({ ...event, location: e.target.value })
                      }
                      placeholder="Enter event location or 'Online' for virtual events"
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
                        value={formatDateForInput(event.startDate)}
                        onChange={(e) =>
                          setEvent({
                            ...event,
                            startDate: new Date(e.target.value),
                          })
                        }
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
                        value={formatTimeForInput(event.startTime)}
                        onChange={(e) =>
                          setEvent({ ...event, startTime: e.target.value })
                        }
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
                        value={formatDateForInput(event.endDate)}
                        onChange={(e) =>
                          setEvent({
                            ...event,
                            endDate: new Date(e.target.value),
                          })
                        }
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
                        value={formatTimeForInput(event.endTime)}
                        onChange={(e) =>
                          setEvent({ ...event, endTime: e.target.value })
                        }
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
                        $
                      </span>
                      <Input
                        id="targetFunding"
                        name="targetFunding"
                        type="number"
                        min="0"
                        step="0.01"
                        value={event.targetFunding || ""}
                        onChange={(e) =>
                          setEvent({
                            ...event,
                            targetFunding: e.target.value
                              ? Number(e.target.value)
                              : 0,
                          })
                        }
                        placeholder="0.00"
                        className="pl-8"
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
                        <Input placeholder="Budget item name" />
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-gray-500">
                            $
                          </span>
                          <Input
                            type="number"
                            placeholder="0.00"
                            className="pl-8"
                          />
                        </div>
                      </div>
                      <Button type="button" variant="secondary" size="sm">
                        Add Budget Item
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Media & Documents */}
              <Card>
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Media & Documents
                    </h2>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Images
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="mt-4">
                        <label htmlFor="images" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            Upload event images
                          </span>
                          <input
                            id="images"
                            name="images"
                            type="file"
                            multiple
                            accept="image/*"
                            className="sr-only"
                          />
                        </label>
                        <p className="mt-1 text-sm text-gray-500">
                          PNG, JPG, GIF up to 10MB each
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Documents (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <div className="mt-4">
                        <label htmlFor="documents" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            Upload documents
                          </span>
                          <input
                            id="documents"
                            name="documents"
                            type="file"
                            multiple
                            className="sr-only"
                          />
                        </label>
                        <p className="mt-1 text-sm text-gray-500">
                          PDF, DOC, DOCX up to 10MB each
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.back()}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
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
                    {event.title || "Your Event Title"}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {event.description ||
                      "Your event description will appear here..."}
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <span>📍 {event.location || "Location"}</span>
                    <span className="mx-2">•</span>
                    <span>
                      📅 {formatDateForInput(event.startDate) || "Date"}
                    </span>
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
