import Image from "next/image";
import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageModal({
  images,
  current,
  onClose,
  onPrev,
  onNext,
}: {
  images: string[];
  current: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  // Close modal on ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext]);

  // Swipe support (mobile)
  let touchStartX = 0;
  let touchEndX = 0;
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.changedTouches[0].screenX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchEndX - touchStartX > 50) onPrev();
    if (touchStartX - touchEndX > 50) onNext();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.4)" }}
    >
      <button
        className="absolute top-4 right-4 text-white text-3xl cursor-pointer"
        onClick={onClose}
        aria-label="Close"
      >
        <X className="w-8 h-8" />
      </button>
      <button
        className="absolute left-4 text-white px-2 py-1 cursor-pointer"
        onClick={onPrev}
        aria-label="Previous"
        style={{ top: "50%", transform: "translateY(-50%)" }}
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      <div
        className="max-w-full max-h-full flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={images[current]}
          alt={`Event Image ${current + 1}`}
          width={600}
          height={400}
          className="rounded shadow max-h-[80vh] max-w-[90vw] object-contain"
        />
      </div>
      <button
        className="absolute right-4 text-white px-2 py-1 cursor-pointer"
        onClick={onNext}
        aria-label="Next"
        style={{ top: "50%", transform: "translateY(-50%)" }}
      >
        <ChevronRight className="w-8 h-8" />
      </button>
    </div>
  );
}
