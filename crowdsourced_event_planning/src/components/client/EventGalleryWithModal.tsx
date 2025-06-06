"use client";
import { useState } from "react";
import ImageModal from "@/components/ImageModal";
import EventGalleryWithDocs from "@/components/Gallery";

type Props = {
  images: string[];
  documents: string[];
};

export default function EventGalleryWithModal({ images, documents }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  if (!images?.length && !documents?.length) return null;

  return (
    <>
      <EventGalleryWithDocs
        images={images}
        documents={documents}
        onImageClick={(idx: number) => {
          setModalIndex(idx);
          setModalOpen(true);
        }}
      />
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
    </>
  );
}
