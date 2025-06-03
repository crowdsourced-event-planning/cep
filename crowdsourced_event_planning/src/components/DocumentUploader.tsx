export default function DocumentUploader({
  documentUrl,
  setDocumentUrl,
}: {
  documentUrl: string;
  setDocumentUrl: (url: string) => void;
}) {
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (
      ![
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type)
    ) {
      alert("Hanya PDF atau DOCX yang diperbolehkan!");
      return;
    }
    const formData = new FormData();
    formData.append(
      "UPLOADCARE_PUB_KEY",
      process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY || ""
    );
    formData.append("file", file);
    const res = await fetch("https://upload.uploadcare.com/base/", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!data.file) {
      alert("Gagal upload dokumen!");
      return;
    }
    setDocumentUrl(`https://ucarecdn.com/${data.file}/`);
  };

  return (
    <div>
      <input
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleUpload}
        disabled={!!documentUrl}
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
      <p className="text-xs text-gray-500">
        Maksimal 1 file. Format: PDF atau DOCX.
      </p>
    </div>
  );
}
