"use client";

import React, { useState, useRef } from 'react';

interface ColorPickerProps {
  label: string;
  colorName: string;
  colorHex: string;
  onColorChange: (colorName: string, colorHex: string) => void;
  disabled?: boolean;
}

const PRESET_COLORS = [
  { name: 'RED', hex: '#EF4444' },
  { name: 'BLUE', hex: '#3B82F6' },
  { name: 'GREEN', hex: '#10B981' },
  { name: 'YELLOW', hex: '#F59E0B' },
  { name: 'PURPLE', hex: '#8B5CF6' },
  { name: 'ORANGE', hex: '#F97316' },
  { name: 'PINK', hex: '#EC4899' },
  { name: 'BLACK', hex: '#000000' },
  { name: 'WHITE', hex: '#FFFFFF' },
  { name: 'GOLD', hex: '#FBBF24' },
  { name: 'SILVER', hex: '#D1D5DB' },
  { name: 'BROWN', hex: '#92400E' },
  { name: 'TURQUOISE', hex: '#14B8A6' },
  { name: 'TEAL', hex: '#0D9488' },
  { name: 'CORAL', hex: '#FF7F7F' },
  { name: 'MAROON', hex: '#991B1B' },
  { name: 'LIME', hex: '#65A30D' },
  { name: 'NAVY', hex: '#1E3A8A' },
  { name: 'CRIMSON', hex: '#DC2626' },
  { name: 'EMERALD', hex: '#059669' },
];

export default function ColorPicker({ 
  label, 
  colorName, 
  colorHex, 
  onColorChange, 
  disabled = false 
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const handlePresetClick = (preset: typeof PRESET_COLORS[0]) => {
    onColorChange(preset.name, preset.hex);
    setIsOpen(false);
  };

  const handleCustomColorClick = () => {
    colorInputRef.current?.click();
  };

  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = e.target.value;
    onColorChange(colorName || 'CUSTOM', newHex);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onColorChange(e.target.value.toUpperCase(), colorHex);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      {/* Color Name Input */}
      <div>
        <input
          type="text"
          value={colorName}
          onChange={handleNameChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Color name (e.g., TURQUOISE, CORAL)"
          disabled={disabled}
        />
      </div>

      {/* Current Color Display */}
      <div className="flex items-center space-x-3">
        <div 
          className={`w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer transition-transform hover:scale-105 ${
            disabled ? 'cursor-not-allowed opacity-50' : ''
          }`}
          style={{ backgroundColor: colorHex }}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        />
        <div className="flex-1">
          <input
            type="text"
            value={colorHex}
            onChange={(e) => onColorChange(colorName, e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="#RRGGBB"
            disabled={disabled}
          />
        </div>
      </div>

      {/* Color Picker Dropdown */}
      {isOpen && !disabled && (
        <div className="relative">
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-4">
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Preset Colors</h4>
              <div className="grid grid-cols-5 gap-2">
                {PRESET_COLORS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handlePresetClick(preset)}
                    className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                      colorHex === preset.hex 
                        ? 'border-blue-500 ring-2 ring-blue-200' 
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: preset.hex }}
                    title={preset.name}
                  />
                ))}
              </div>
            </div>

            <div className="border-t pt-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Custom Color</h4>
              <button
                type="button"
                onClick={handleCustomColorClick}
                className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
              >
                Choose Custom Color
              </button>
            </div>

            <div className="flex justify-end mt-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Color Input */}
      <input
        ref={colorInputRef}
        type="color"
        value={colorHex}
        onChange={handleColorInputChange}
        className="hidden"
      />
    </div>
  );
}