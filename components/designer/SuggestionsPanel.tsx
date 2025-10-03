"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader } from "@/components/ui/Common";
import { PrimaryButton } from "@/components/ui/Button";

export interface DesignSuggestion {
  name: string;
  description: string;
  colors: string[];
  beadIds: string[];
}

interface SuggestionsPanelProps {
  suggestions: DesignSuggestion[];
  onSelectSuggestion: (suggestion: DesignSuggestion) => void;
  onClose: () => void;
}

export default function SuggestionsPanel({
  suggestions,
  onSelectSuggestion,
  onClose,
}: SuggestionsPanelProps) {
  const t = useTranslations("suggestions");

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {t("title") || "AI Ontwerp Suggesties"}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {t("description") || "Kies een ontwerp dat bij je foto past"}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          title="Sluiten"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Suggestions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {suggestions.map((suggestion, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <h4 className="font-semibold text-gray-900">{suggestion.name}</h4>
              <p className="text-xs text-gray-600 mt-1">{suggestion.description}</p>
            </CardHeader>
            <CardContent>
              {/* Color Preview */}
              <div className="space-y-3">
                <div className="flex gap-2 flex-wrap">
                  {suggestion.colors.map((color, colorIndex) => (
                    <div
                      key={colorIndex}
                      className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>

                {/* Bracelet Preview */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-1">
                    {suggestion.colors.slice(0, 8).map((color, beadIndex) => (
                      <div
                        key={beadIndex}
                        className="w-6 h-6 rounded-full shadow-sm border border-gray-200"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    {suggestion.colors.length > 8 && (
                      <span className="text-xs text-gray-500 ml-2">
                        +{suggestion.colors.length - 8}
                      </span>
                    )}
                  </div>
                </div>

                {/* Select Button */}
                <PrimaryButton
                  onClick={() => onSelectSuggestion(suggestion)}
                  className="w-full text-sm py-2"
                >
                  {t("selectButton") || "Gebruik dit ontwerp"}
                </PrimaryButton>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Text */}
      <p className="text-xs text-gray-500 text-center">
        {t("info") || "Na het kiezen kun je het ontwerp nog aanpassen"}
      </p>
    </div>
  );
}
