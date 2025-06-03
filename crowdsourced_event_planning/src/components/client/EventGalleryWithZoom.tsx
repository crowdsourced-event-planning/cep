"use client";
import { useState } from "react";
import Image from "next/image";
import ImageModal from "@/components/ImageModal";

export default function EventGalleryWithZoom({
  images = [],
  documents = [],
}: {
  images: string[];
  documents: string[];
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  if (images.length === 0 && documents.length === 0) {
    return <div className="text-gray-500">No gallery or documents.</div>;
  }

  return (
    <div>
      {/* Gallery */}
      {images.length > 0 && (
        <div className="flex gap-3 flex-wrap mb-4">
          {images.map((img, idx) => (
            <div key={img} className="relative">
              <Image
                src={img}
                alt={`Event Image ${idx + 1}`}
                width={160}
                height={90}
                className="rounded-lg object-cover w-40 h-24 cursor-zoom-in border border-gray-200"
                onClick={() => {
                  setModalIndex(idx);
                  setModalOpen(true);
                }}
              />
            </div>
          ))}
        </div>
      )}
      {/* Documents */}
      {documents.length > 0 && (
        <div className="flex flex-col gap-2">
          {documents.map((doc, idx) => (
            <a
              key={doc}
              href={doc}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Dokumen {idx + 1}
            </a>
          ))}
        </div>
      )}
      {/* Modal */}
      {modalOpen && (
        <ImageModal
          images={images}
          current={modalIndex}
          onClose={() => setModalOpen(false)}
          onPrev={() =>
            setModalIndex((modalIndex - 1 + images.length) % images.length)
          }
          onNext={() => setModalIndex((modalIndex + 1) % images.length)}
        />
      )}
    </div>
  );
}