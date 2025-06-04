import Button from "@/components/ui/Button";
import { Upload, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

export default function DocumentUploader({
  documentUrl,
  setDocumentUrl,
  setUploading, // <-- tambahkan prop ini
}: {
  documentUrl: string;
  setDocumentUrl: (url: string) => void;
  setUploading?: (v: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploadingLocal] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (
      ![
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type)
    ) {
      toast.error("Hanya PDF atau DOCX yang diperbolehkan!");
      return;
    }
    setUploadingLocal(true);
    setUploading?.(true);
    setProgress(0);

    const formData = new FormData();
    formData.append(
      "UPLOADCARE_PUB_KEY",
      process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY || ""
    );
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://upload.uploadcare.com/base/");
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    const res = await new Promise<{ file?: string }>((resolve) => {
      xhr.onload = () => resolve(JSON.parse(xhr.responseText));
      xhr.send(formData);
    });
    if (!res.file) {
      toast.error("Gagal upload dokumen!");
      setUploadingLocal(false);
      setUploading?.(false);
      setProgress(0);
      return;
    }
    setDocumentUrl(`https://ucarecdn.com/${res.file}/`);
    setUploadingLocal(false);
    setUploading?.(false);
    setProgress(0);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemove = () => {
    setDocumentUrl("");
    if (inputRef.current) inputRef.current.value = "";
    toast.success("Dokumen berhasil dihapus!");
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={!!documentUrl}
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Pilih Dokumen
        </Button>
        <span className="text-xs text-gray-500">
          {documentUrl ? "1/1 file dipilih" : "Belum ada file"}
        </span>
        {documentUrl && (
          <button
            type="button"
            onClick={handleRemove}
            className="ml-2 text-red-500 hover:text-red-700 p-1 rounded"
            title="Hapus dokumen"
          >
            <Trash2 className="w-5 h-5 cursor-pointer" />
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleUpload}
        disabled={!!documentUrl}
        className="hidden"
      />
      {documentUrl && (
        <div className="mt-2">
          <a
            href={documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Lihat Dokumen
          </a>
          {/* Preview PDF jika file PDF */}
          {documentUrl.endsWith(".pdf") && (
            <iframe
              src={documentUrl}
              width="100%"
              height="400px"
              className="mt-2 rounded border"
            />
          )}
        </div>
      )}
      {uploading && (
        <div className="w-full bg-gray-200 rounded h-2 mb-2 overflow-hidden">
          <div
            className="bg-green-500 h-2 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      <p className="text-xs text-gray-500 mt-2">
        Maksimal 1 file. Format: PDF atau DOCX.
      </p>
    </div>
  );
}
