import { useState, useRef } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Check, Upload } from "lucide-react";

interface ObjectUploaderProps {
  maxFileSize?: number;
  allowedFileTypes?: string[];
  onGetUploadParameters: () => Promise<{
    method: "PUT";
    url: string;
  }>;
  onComplete?: (result: { uploadURL: string }) => void;
  buttonClassName?: string;
  children: ReactNode;
}

export function ObjectUploader({
  maxFileSize = 10485760,
  allowedFileTypes,
  onGetUploadParameters,
  onComplete,
  buttonClassName,
  children,
}: ObjectUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (maxFileSize && file.size > maxFileSize) {
      alert(`File size must be less than ${Math.round(maxFileSize / 1024 / 1024)}MB`);
      return;
    }

    if (allowedFileTypes && allowedFileTypes.length > 0) {
      const isAllowed = allowedFileTypes.some(type => {
        if (type === "image/*") return file.type.startsWith("image/");
        if (type.startsWith(".")) return file.name.toLowerCase().endsWith(type);
        return file.type === type;
      });
      if (!isAllowed) {
        alert("File type not allowed");
        return;
      }
    }

    setUploading(true);
    try {
      const params = await onGetUploadParameters();
      const response = await fetch(params.url, {
        method: params.method,
        body: file,
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
      });

      if (response.ok) {
        setUploaded(true);
        onComplete?.({ uploadURL: params.url });
      } else {
        alert("Upload failed. Please try again.");
      }
    } catch {
      alert("Upload error. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept={allowedFileTypes?.join(",")}
        className="hidden"
      />
      <Button 
        type="button"
        onClick={handleClick}
        disabled={uploading || uploaded}
        className={buttonClassName}
      >
        {uploading ? (
          <>
            <Loader2 size={16} className="animate-spin mr-2" />
            Uploading...
          </>
        ) : uploaded ? (
          <>
            <Check size={16} className="mr-2" />
            Uploaded
          </>
        ) : (
          children
        )}
      </Button>
    </div>
  );
}
