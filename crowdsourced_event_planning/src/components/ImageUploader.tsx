import Image from "next/image";
import { useRef, useState } from "react";
import ImageModal from "./ImageModal";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import toast from "react-hot-toast";
import { X, Upload } from "lucide-react";
import Button from "@/components/ui/Button";

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function ImageUploader({
  images,
  setImages,
  setUploading, // <-- tambahkan prop ini
}: {
  images: string[];
  setImages: (urls: string[]) => void;
  setUploading?: (v: boolean) => void; // optional
}) {
  const [uploading, setUploadingLocal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

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

    setUploadingLocal(true);
    setUploading?.(true); // notify parent
    setProgress(0);

    const uploaded: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
      );
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setProgress(
            Math.round(((i + event.loaded / event.total) / files.length) * 100)
          );
        }
      };
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset ?? "");
      const res = await new Promise<{ secure_url?: string }>((resolve) => {
        xhr.onload = () => resolve(JSON.parse(xhr.responseText));
        xhr.send(formData);
      });
      if (!res.secure_url) {
        toast.error("Gagal upload gambar!");
        continue;
      }
      uploaded.push(res.secure_url);
    }
    setImages([...images, ...uploaded]);
    setUploadingLocal(false);
    setUploading?.(false);
    setProgress(0);
    if (inputRef.current) inputRef.current.value = "";
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
      <div className="flex items-center gap-3 mb-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading || images.length >= 5}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          Pilih Gambar
        </Button>
        <span className="text-xs text-gray-500">
          {images.length}/5 gambar dipilih
        </span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        disabled={uploading || images.length >= 5}
        onChange={handleUpload}
        className="hidden"
      />
      {uploading && (
        <div className="w-full bg-gray-200 rounded h-2 mb-2 overflow-hidden">
          <div
            className="bg-green-500 h-2 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
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
      <p className="text-xs text-gray-500 mt-2">
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
