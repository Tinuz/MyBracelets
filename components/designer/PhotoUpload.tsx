"use client";

import React, { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { LoadingSpinner } from "@/components/ui/Common";

interface PhotoUploadProps {
  onAnalysisComplete: (suggestions: DesignSuggestion[]) => void;
  onError: (error: string) => void;
}

export interface DesignSuggestion {
  name: string;
  description: string;
  colors: string[];
  beadIds: string[];
}

export default function PhotoUpload({ onAnalysisComplete, onError }: PhotoUploadProps) {
  const t = useTranslations("photoUpload");
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        onError("Please select an image file");
        return;
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        onError("Image size must be less than 10MB");
        return;
      }

      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload and analyze
      setUploading(true);
      setAnalyzing(true);

      try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch("/api/beads/analyze-photo", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to analyze photo");
        }

        const data = await response.json();
        console.log("✅ Photo analysis result:", data);

        onAnalysisComplete(data.suggestions);
      } catch (error) {
        console.error("Photo analysis error:", error);
        onError(error instanceof Error ? error.message : "Failed to analyze photo");
        setPreview(null);
      } finally {
        setUploading(false);
        setAnalyzing(false);
      }
    },
    [onAnalysisComplete, onError]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const clearPreview = useCallback(() => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  return (
    <div className="space-y-4">
      {!preview ? (
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-all duration-200
            ${
              dragOver
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />

          <div className="space-y-3">
            {/* Camera Icon */}
            <div className="flex justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>

            <div>
              <p className="text-lg font-medium text-gray-700">
                {t("uploadTitle") || "Upload een foto van je outfit"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {t("uploadDescription") || "Sleep een foto hierheen of klik om te selecteren"}
              </p>
            </div>

            <p className="text-xs text-gray-400">
              {t("uploadLimit") || "PNG, JPG, WEBP tot 10MB"}
            </p>
          </div>
        </div>
      ) : (
        <div className="relative">
          {/* Preview Image */}
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={preview}
              alt="Preview"
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover"
            />
            
            {/* Analyzing Overlay */}
            {analyzing && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-6 text-center">
                  <LoadingSpinner size="lg" />
                  <p className="mt-4 text-sm font-medium text-gray-700">
                    {t("analyzing") || "AI analyseert je foto..."}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {t("analyzingDescription") || "We zoeken de mooiste kleuren voor je armband"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Remove Button */}
          {!analyzing && (
            <button
              onClick={clearPreview}
              className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              title="Verwijder foto"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
