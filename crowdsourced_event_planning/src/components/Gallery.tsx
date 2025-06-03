"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, FileDown } from "lucide-react";

export default function EventGalleryWithDocs({
  images,
  documents,
}: {
  images: string[];
  documents: string[];
}) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);

  const handlePrev = () =>
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  const handleNext = () => setCurrent((prev) => (prev + 1) % images.length);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].screenX - touchStartX.current;
    if (diff > 50) handlePrev();
    if (diff < -50) handleNext();
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Image Gallery */}
      {images.length > 0 && (
        <div className="relative flex items-center justify-center">
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 z-10"
            onClick={handlePrev}
            aria-label="Prev"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div
            className="w-full flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              src={images[current]}
              alt={`Event Image ${current + 1}`}
              width={600}
              height={400}
              className="rounded-lg object-cover max-h-80"
            />
          </div>
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 z-10"
            onClick={handleNext}
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      )}
      {/* Thumbnail List */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-2 justify-center">
          {images.map((img, idx) => (
            <button
              key={img}
              className={`border-2 rounded ${
                idx === current ? "border-blue-500" : "border-transparent"
              }`}
              onClick={() => setCurrent(idx)}
            >
              <Image
                src={img}
                alt=""
                width={60}
                height={60}
                className="object-cover rounded"
              />
            </button>
          ))}
        </div>
      )}

      {/* Document List */}
      {documents.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="font-semibold">Documents</h4>
          {documents.map((doc, idx) => (
            <div key={doc} className="flex items-center gap-2">
              <a
                href={doc}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline flex items-center gap-1"
              >
                <FileDown className="w-4 h-4" />
                Lihat / Download Dokumen {idx + 1}
              </a>
              {doc.endsWith(".pdf") && (
                <iframe
                  src={doc}
                  width="100%"
                  height="200"
                  className="rounded border mt-2"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
