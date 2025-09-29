"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Common";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Button";
import Designer from "@/components/designer/Designer";

// Types for bracelet configuration
type MetalType = 'GOLD' | 'SILVER' | 'ROSE_GOLD' | 'WHITE_GOLD' | 'PLATINUM' | 'STAINLESS_STEEL';
type ChainType = 'CABLE' | 'CURB' | 'FIGARO' | 'ROPE' | 'BOX' | 'SNAKE' | 'HERRINGBONE' | 'BYZANTINE';

interface BraceletConfig {
  baseType: 'classic' | 'elegant' | 'modern';
  thickness: number;
  length: number;
  color: string;
  metalType: MetalType;
  chainType: ChainType;
}

const metalOptions: Array<{ value: MetalType; label: string; price: number }> = [
  { value: 'SILVER', label: 'Silver', price: 0 },
  { value: 'GOLD', label: 'Gold', price: 500 },
  { value: 'ROSE_GOLD', label: 'Rose Gold', price: 450 },
  { value: 'WHITE_GOLD', label: 'White Gold', price: 600 },
  { value: 'PLATINUM', label: 'Platinum', price: 1000 },
  { value: 'STAINLESS_STEEL', label: 'Stainless Steel', price: -200 }
];

const chainOptions: Array<{ value: ChainType; label: string; description: string }> = [
  { value: 'CABLE', label: 'Cable Chain', description: 'Classic oval links' },
  { value: 'CURB', label: 'Curb Chain', description: 'Flat interlocking links' },
  { value: 'FIGARO', label: 'Figaro Chain', description: 'Alternating link pattern' },
  { value: 'ROPE', label: 'Rope Chain', description: 'Twisted rope design' },
  { value: 'BOX', label: 'Box Chain', description: 'Square box links' },
  { value: 'SNAKE', label: 'Snake Chain', description: 'Smooth flexible design' },
  { value: 'HERRINGBONE', label: 'Herringbone', description: 'Flat chevron pattern' },
  { value: 'BYZANTINE', label: 'Byzantine', description: 'Intricate woven links' }
];

const thicknessOptions = [
  { value: 1.5, label: '1.5mm - Delicate' },
  { value: 2.0, label: '2.0mm - Classic' },
  { value: 2.5, label: '2.5mm - Bold' },
  { value: 3.0, label: '3.0mm - Statement' }
];

const lengthOptions = [
  { value: 160, label: '16cm - Tight fit' },
  { value: 180, label: '18cm - Standard' },
  { value: 200, label: '20cm - Comfortable' },
  { value: 220, label: '22cm - Loose fit' }
];

export default function DesignerPage() {
  const [step, setStep] = useState<'configure' | 'design'>('configure');
  const [config, setConfig] = useState<BraceletConfig>({
    baseType: 'classic',
    thickness: 2.0,
    length: 180,
    color: 'silver',
    metalType: 'SILVER',
    chainType: 'CABLE'
  });

  const handleConfigChange = (key: keyof BraceletConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const calculatePrice = () => {
    const basePrice = config.baseType === 'classic' ? 25 : config.baseType === 'elegant' ? 35 : 40;
    const metalPrice = metalOptions.find(m => m.value === config.metalType)?.price || 0;
    const thicknessPrice = (config.thickness - 2.0) * 5; // €5 per 0.5mm extra
    const lengthPrice = config.length > 180 ? (config.length - 180) * 0.5 : 0; // €0.50 per cm extra
    
    return (basePrice + (metalPrice + thicknessPrice + lengthPrice) / 100);
  };

  if (step === 'design') {
    return <Designer braceletSlug={config.baseType} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Design Your Bracelet
            </h1>
            <p className="text-gray-600">
              Configure your perfect bracelet before adding charms
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Configuration Panel */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Base Style */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">1. Choose Base Style</h3>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {['classic', 'elegant', 'modern'].map((style) => (
                      <button
                        key={style}
                        className={`p-4 border-2 rounded-lg text-center transition-colors ${
                          config.baseType === style
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleConfigChange('baseType', style)}
                      >
                        <div className="text-lg font-medium capitalize">{style}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {style === 'classic' && 'Timeless design'}
                          {style === 'elegant' && 'Sophisticated curves'}
                          {style === 'modern' && 'Contemporary style'}
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Metal Type */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">2. Select Metal</h3>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {metalOptions.map((metal) => (
                      <button
                        key={metal.value}
                        className={`p-3 border-2 rounded-lg text-left transition-colors ${
                          config.metalType === metal.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleConfigChange('metalType', metal.value)}
                      >
                        <div className="font-medium">{metal.label}</div>
                        <div className="text-sm text-gray-500">
                          {metal.price > 0 ? `+€${(metal.price / 100).toFixed(2)}` : 
                           metal.price < 0 ? `-€${Math.abs(metal.price / 100).toFixed(2)}` : 
                           'Base price'}
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Chain Type */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">3. Chain Style</h3>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {chainOptions.map((chain) => (
                      <button
                        key={chain.value}
                        className={`p-3 border-2 rounded-lg text-left transition-colors ${
                          config.chainType === chain.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleConfigChange('chainType', chain.value)}
                      >
                        <div className="font-medium">{chain.label}</div>
                        <div className="text-sm text-gray-500">{chain.description}</div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Size Options */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">4. Size & Thickness</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {/* Thickness */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thickness
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {thicknessOptions.map((option) => (
                        <button
                          key={option.value}
                          className={`p-2 border-2 rounded text-sm transition-colors ${
                            config.thickness === option.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleConfigChange('thickness', option.value)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Length */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Length
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {lengthOptions.map((option) => (
                        <button
                          key={option.value}
                          className={`p-2 border-2 rounded text-sm transition-colors ${
                            config.length === option.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleConfigChange('length', option.value)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                </CardContent>
              </Card>

            </div>

            {/* Preview & Summary */}
            <div className="space-y-6">
              
              {/* Preview */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Preview</h3>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-gray-400">Bracelet Preview</div>
                  </div>
                  <div className="text-sm space-y-1">
                    <div><strong>Style:</strong> {config.baseType}</div>
                    <div><strong>Metal:</strong> {metalOptions.find(m => m.value === config.metalType)?.label}</div>
                    <div><strong>Chain:</strong> {chainOptions.find(c => c.value === config.chainType)?.label}</div>
                    <div><strong>Size:</strong> {config.thickness}mm × {config.length}mm</div>
                  </div>
                </CardContent>
              </Card>

              {/* Price Summary */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Price Summary</h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-2xl font-bold text-blue-600">
                    €{calculatePrice().toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Base bracelet price (before charms)
                  </div>
                  
                  <PrimaryButton 
                    className="w-full"
                    onClick={() => setStep('design')}
                  >
                    Continue to Add Charms
                  </PrimaryButton>
                  
                  <SecondaryButton 
                    className="w-full"
                    onClick={() => window.history.back()}
                  >
                    Back to Home
                  </SecondaryButton>
                </CardContent>
              </Card>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}