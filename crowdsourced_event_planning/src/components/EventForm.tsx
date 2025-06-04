import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ImageUploader from "@/components/ImageUploader";
import DocumentUploader from "@/components/DocumentUploader";
import ImageModal from "@/components/ImageModal";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { formatCurrency, formatRupiahInput } from "@/lib/utils/format";

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

type EventFormProps = {
  formData: EventFormData;
  setFormData: React.Dispatch<React.SetStateAction<EventFormData>>;
  budgetItems: BudgetItem[];
  setBudgetItems: React.Dispatch<React.SetStateAction<BudgetItem[]>>;
  currentBudgetItem: BudgetItem;
  setCurrentBudgetItem: React.Dispatch<React.SetStateAction<BudgetItem>>;
  gallery: string[];
  setGallery: React.Dispatch<React.SetStateAction<string[]>>;
  documents: string[];
  setDocuments: React.Dispatch<React.SetStateAction<string[]>>;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalIndex: number;
  setModalIndex: React.Dispatch<React.SetStateAction<number>>;
  uploadingImage: boolean;
  setUploadingImage: React.Dispatch<React.SetStateAction<boolean>>;
  uploadingDoc: boolean;
  setUploadingDoc: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleFundingChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  addBudgetItem: () => void;
  removeBudgetItem: (index: number) => void;
  handleSubmit: (e: React.FormEvent) => void;
  buttonLabel: string;
};

const EventForm: React.FC<EventFormProps> = ({
  formData,
  budgetItems,
  currentBudgetItem,
  setCurrentBudgetItem,
  gallery,
  setGallery,
  documents,
  setDocuments,
  modalOpen,
  setModalOpen,
  modalIndex,
  setModalIndex,
  setUploadingImage,
  setUploadingDoc,
  loading,
  handleInputChange,
  handleFundingChange,
  addBudgetItem,
  removeBudgetItem,
  handleSubmit,
  buttonLabel,
}) => {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="">
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
                        min={today}
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
                        min={today}
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
                        min={formData.startTime || undefined}
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
                        type="text"
                        min="0"
                        value={
                          formData.targetFunding
                            ? formatRupiahInput(formData.targetFunding)
                            : ""
                        }
                        onChange={handleFundingChange}
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
                        className="cursor-pointer"
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
                                  {formatCurrency(item.amount ?? 0)}
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
              {/* Event Gallery & Document */}
              <Card>
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Event Gallery & Document
                  </h2>
                  <ImageUploader
                    images={gallery}
                    setImages={setGallery}
                    setUploading={setUploadingImage}
                  />
                  <DocumentUploader
                    documentUrl={documents[0] || ""}
                    setDocumentUrl={(url) => setDocuments([url])}
                    setUploading={setUploadingDoc}
                  />
                </div>
              </Card>
              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <Button
                  type="submit"
                  className={`... ${
                    loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                  }`}
                  disabled={loading}
                >
                  {buttonLabel}
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
                  <div className="aspect-video bg-gray-200 rounded mb-3 flex items-center justify-center relative">
                    {gallery.length === 0 ? (
                      <span className="text-gray-500">Event Image</span>
                    ) : (
                      <>
                        <Image
                          src={gallery[modalIndex]}
                          alt="Preview"
                          width={400}
                          height={225}
                          className="object-cover w-full h-full rounded cursor-pointer"
                          onClick={() => setModalOpen(true)}
                        />
                        {gallery.length > 1 && (
                          <>
                            <button
                              type="button"
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                setModalIndex(
                                  (modalIndex - 1 + gallery.length) %
                                    gallery.length
                                );
                              }}
                              aria-label="Previous image"
                            >
                              <ChevronLeft className="w-6 h-6 text-gray-700 cursor-pointer" />
                            </button>
                            <button
                              type="button"
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                setModalIndex(
                                  (modalIndex + 1) % gallery.length
                                );
                              }}
                              aria-label="Next image"
                            >
                              <ChevronRight className="w-6 h-6 text-gray-700 cursor-pointer" />
                            </button>
                          </>
                        )}
                      </>
                    )}
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
                  Tips Guidelines
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
          </div>
        </div>
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
};

export default EventForm;
