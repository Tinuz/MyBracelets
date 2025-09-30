'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ChainModalProps {
  isOpen: boolean
  onClose: () => void
  chainType: string
  imagePath: string
}

export default function ChainModal({ isOpen, onClose, chainType, imagePath }: ChainModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-semibold text-gray-900 capitalize">
            {chainType} Chain Pattern
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="mb-4">
            <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center">
              <Image
                src={imagePath}
                alt={`${chainType} chain pattern`}
                width={400}
                height={160}
                className="max-w-full h-auto"
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
          
          {/* Chain description */}
          <div className="text-gray-600">
            <h3 className="font-medium text-gray-900 mb-2">About {chainType} Chain</h3>
            <p className="text-sm">
              {getChainDescription(chainType)}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t rounded-b-lg">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

function getChainDescription(chainType: string): string {
  const descriptions = {
    cable: 'A classic chain style featuring uniform oval links connected in sequence. Simple, elegant, and versatile for any occasion.',
    curb: 'Features flattened interlocking links that lay flat against the skin. Known for its strength and distinctive twisted appearance.',
    figaro: 'Alternating pattern of long and short links creating a unique rhythm. Originally from Italy, it\'s both stylish and substantial.',
    rope: 'Twisted design that resembles rope, creating texture and visual interest. Catches light beautifully from multiple angles.',
    box: 'Square-shaped links connected at corners create a smooth, flexible chain. Modern and geometric in appearance.',
    snake: 'Smooth, flexible design with tightly connected segments that create a seamless, flowing appearance like a snake.',
    herringbone: 'Flat chain with V-shaped links that create a sophisticated chevron pattern. Lies elegantly against the skin.',
    byzantine: 'Complex interlocking pattern creating a rich, textured appearance. Traditional design known for its intricate beauty.'
  }
  
  return descriptions[chainType as keyof typeof descriptions] || 'A beautiful chain design perfect for your bracelet.'
}