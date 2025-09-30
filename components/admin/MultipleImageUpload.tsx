"use client";

import React, { useState } from 'react';
import ImageUpload from './ImageUpload';

interface MultipleImageUploadProps {
  images: {
    imageUrl?: string;
    imageUrl2?: string;
    imageUrl3?: string;
  };
  onImagesChange: (images: {
    imageUrl?: string;
    imageUrl2?: string;
    imageUrl3?: string;
  }) => void;
  disabled?: boolean;
}

export default function MultipleImageUpload({ 
  images, 
  onImagesChange, 
  disabled = false 
}: MultipleImageUploadProps) {
  
  const handleImageChange = (index: number, imageUrl: string) => {
    const newImages = { ...images };
    
    if (index === 0) newImages.imageUrl = imageUrl;
    if (index === 1) newImages.imageUrl2 = imageUrl;
    if (index === 2) newImages.imageUrl3 = imageUrl;
    
    onImagesChange(newImages);
  };

  const imageLabels = [
    'Primary Image (Main product photo)',
    'Secondary Image (Detail or alternate angle)', 
    'Third Image (Lifestyle or additional angle)'
  ];

  const currentImages = [
    images.imageUrl,
    images.imageUrl2,
    images.imageUrl3
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Product Images</h3>
        <p className="text-sm text-gray-600 mb-4">
          Upload up to 3 high-quality images of your bracelet. The first image will be used as the main product photo.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[0, 1, 2].map((index) => (
          <div key={index} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {imageLabels[index]}
            </label>
            <ImageUpload
              category="bracelets"
              currentImageUrl={currentImages[index]}
              onImageUploaded={(imageUrl) => handleImageChange(index, imageUrl)}
              disabled={disabled}
            />
            {index === 0 && (
              <p className="text-xs text-gray-500">
                Required - This will be the main product image
              </p>
            )}
            {index > 0 && (
              <p className="text-xs text-gray-500">
                Optional - Additional product angles
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}