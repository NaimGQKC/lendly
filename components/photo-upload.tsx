"use client";

import { useCallback, useRef, useState } from "react";
import { Camera, Upload } from "lucide-react";

interface PhotoUploadProps {
  onUpload: (file: File) => void;
  isLoading?: boolean;
}

export function PhotoUpload({ onUpload, isLoading = false }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      setPreview(url);
      onUpload(file);
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-10">
        <div className="relative mb-4">
          {preview && (
            <div className="relative mx-auto mb-4 h-32 w-32 overflow-hidden rounded-lg">
              <img
                src={preview}
                alt="Uploaded photo"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          )}
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="font-heading text-sm font-semibold text-primary">
              Analyzing your item with AI...
            </span>
          </div>
        </div>
        {/* Shimmer skeleton for form fields */}
        <div className="mt-4 w-full max-w-xs space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-4 animate-pulse rounded bg-primary/10"
              style={{ width: `${85 - i * 12}%`, animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-colors ${
        isDragging
          ? "border-primary bg-primary/10"
          : "border-primary/30 bg-primary/5 hover:border-primary/50 hover:bg-primary/10"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      {preview ? (
        <div className="relative mx-auto mb-4 h-32 w-32 overflow-hidden rounded-lg">
          <img
            src={preview}
            alt="Uploaded photo"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Camera className="h-7 w-7 text-primary" />
        </div>
      )}

      <p className="font-heading text-base font-semibold text-foreground">
        {preview ? "Photo ready" : "Drop a photo and we'll do the rest"}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        {preview ? "Click to change photo" : "or click to select a file"}
      </p>
      <div className="mt-3 flex items-center gap-1.5 text-xs text-primary">
        <Upload className="h-3.5 w-3.5" />
        <span>JPG, PNG up to 10MB</span>
      </div>
    </div>
  );
}
