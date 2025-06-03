import Image from "next/image";
import { useState } from "react";
import ImageModal from "./ImageModel";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import toast from "react-hot-toast";
import { X } from "lucide-react";

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function ImageUploader({
  images,
  setImages,
}: {
  images: string[];
  setImages: (urls: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let files = Array.from(e.target.files || []);
    const maxAllowed = 5 - images.length;

    if (files.length > maxAllowed) {
      toast.error(
        `Maksimal upload 5 gambar. Hanya ${maxAllowed} gambar yang di-upload.`
      );
      files = files.slice(0, maxAllowed);
    }

    if (files.length === 0) return;

    setUploading(true);
    const uploaded: string[] = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset ?? "");
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (!data.secure_url) {
        toast.error("Gagal upload gambar!");
        continue;
      }
      uploaded.push(data.secure_url);
    }
    setImages([...images, ...uploaded]);
    setUploading(false);
  };

  const handleRemove = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  // Drag & drop reorder
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(images);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setImages(reordered);
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        multiple
        disabled={uploading || images.length >= 5}
        onChange={handleUpload}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="gallery" direction="horizontal">
          {(provided) => (
            <div
              className="flex gap-2 mt-2"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {images.map((url, idx) => (
                <Draggable key={url} draggableId={url} index={idx}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`relative group transition-all duration-200
                        ${
                          snapshot.isDragging
                            ? "z-10 scale-105 shadow-2xl ring-2 ring-blue-400 cursor-grabbing"
                            : "cursor-grab"
                        }
                      `}
                      style={{
                        ...provided.draggableProps.style,
                        transition: snapshot.isDropAnimating
                          ? "transform 0.2s cubic-bezier(0.2, 1, 0.22, 1)"
                          : "transform 0.15s cubic-bezier(0.2, 1, 0.22, 1)",
                      }}
                    >
                      <Image
                        src={url}
                        alt="event"
                        width={1000}
                        height={1000}
                        className="w-32 h-32 object-cover rounded cursor-pointer select-none"
                        onClick={() => {
                          setModalIndex(idx);
                          setModalOpen(true);
                        }}
                        draggable={false}
                      />
                      <button
                        type="button"
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-80 hover:opacity-100 cursor-pointer"
                        onClick={() => handleRemove(idx)}
                        tabIndex={-1}
                        aria-label="Remove image"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <p className="text-xs text-gray-500">
        Maksimal 5 gambar. Drag & drop untuk urutkan. Klik gambar untuk preview.
      </p>
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
