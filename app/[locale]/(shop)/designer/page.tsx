"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/Common";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Button";
import Designer from "@/components/designer/Designer";
import ChainModal from "@/components/ui/ChainModal";

// Types for bracelet configuration
type BraceletType = 'CHAIN' | 'BEADS';
type MetalType = 'GOLD' | 'SILVER' | 'ROSE_GOLD' | 'WHITE_GOLD' | 'PLATINUM' | 'STAINLESS_STEEL';
type ChainType = 'CABLE' | 'CURB' | 'FIGARO' | 'ROPE' | 'BOX' | 'SNAKE' | 'HERRINGBONE' | 'BYZANTINE';
type BeadSize = 2.0 | 4.0 | 6.0;

interface BraceletConfig {
  braceletType: BraceletType;
  thickness: number;
  length: number;
  color: string;
  metalType?: MetalType; // Optional for beads bracelets
  chainType?: ChainType; // Optional for beads bracelets
  beadSize?: BeadSize; // For beads bracelets
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
    braceletType: 'CHAIN',
    thickness: 2,
    length: 180,
    color: 'gold',
    metalType: 'GOLD',
    chainType: 'CABLE'
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedChain, setSelectedChain] = useState<ChainType | null>(null);

  const handleConfigChange = (key: keyof BraceletConfig, value: any) => {
    setConfig(prev => {
      const newConfig = { ...prev, [key]: value };
      
      // Set default values when switching bracelet types
      if (key === 'braceletType') {
        if (value === 'BEADS') {
          // Set default bead size if not already set
          if (!prev.beadSize) {
            newConfig.beadSize = 4.0;
          }
          // Clear chain/metal specific properties
          delete newConfig.metalType;
          delete newConfig.chainType;
        } else if (value === 'CHAIN') {
          // Set default metal and chain type if not already set
          if (!prev.metalType) {
            newConfig.metalType = 'GOLD';
          }
          if (!prev.chainType) {
            newConfig.chainType = 'CABLE';
          }
          // Clear bead specific properties
          delete newConfig.beadSize;
        }
      }
      
      return newConfig;
    });
  };

  const handleChainImageClick = (chainType: ChainType) => {
    setSelectedChain(chainType);
    setModalOpen(true);
  };

  const getChainImagePath = (chainType?: ChainType) => {
    if (!chainType) return '/images/chains/cable.svg';
    return `/images/chains/${chainType.toLowerCase()}.svg`;
  };

  const calculatePrice = () => {
    if (config.braceletType === 'BEADS') {
      // Base price for beads bracelet
      const basePrice = 5; // €5.00 base price for beads bracelet
      const beadPrice = (config.beadSize || 4.0) * 0.50; // €0.50 per mm diameter
      const estimatedBeads = Math.floor(config.length / ((config.beadSize || 4.0) + 1)); // Rough estimate
      return basePrice + (beadPrice * estimatedBeads);
    } else {
      // Chain bracelet pricing
      const basePrice = 25; // Fixed classic style price
      const metalPrice = metalOptions.find(m => m.value === config.metalType)?.price || 0;
      const thicknessPrice = (config.thickness - 2.0) * 5; // €5 per 0.5mm extra
      const lengthPrice = config.length > 180 ? (config.length - 180) * 0.5 : 0; // €0.50 per cm extra
      
      return (basePrice + (metalPrice + thicknessPrice + lengthPrice) / 100);
    }
  };

  if (step === 'design') {
    const braceletSlug = config.braceletType === 'BEADS' ? 'beads-bracelet' : 'classic';
    return <Designer braceletSlug={braceletSlug} config={config} />;
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
              {config.braceletType === 'CHAIN' 
                ? 'Configure your perfect chain bracelet before adding charms'
                : 'Configure your perfect beads bracelet and create patterns'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Configuration Panel */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Bracelet Type Selection */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">1. Choose Bracelet Type</h3>
                  <p className="text-sm text-gray-500">Select between chain or beads bracelet</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <button
                      className={`p-4 border-2 rounded-lg text-left transition-colors ${
                        config.braceletType === 'CHAIN'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleConfigChange('braceletType', 'CHAIN')}
                    >
                      <div className="font-medium">Chain Bracelet</div>
                      <div className="text-sm text-gray-500">Traditional chain with charms</div>
                    </button>
                    <button
                      className={`p-4 border-2 rounded-lg text-left transition-colors ${
                        config.braceletType === 'BEADS'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleConfigChange('braceletType', 'BEADS')}
                    >
                      <div className="font-medium">Beads Bracelet</div>
                      <div className="text-sm text-gray-500">Colorful beads pattern</div>
                    </button>
                  </div>
                </CardContent>
              </Card>



              {/* Chain Bracelet Configuration */}
              {config.braceletType === 'CHAIN' && (
                <>
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
                </>
              )}

              {/* Beads Bracelet Configuration */}
              {config.braceletType === 'BEADS' && (
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">3. Bead Size</h3>
                    <p className="text-sm text-gray-500">Choose the diameter of your beads</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      {[2.0, 4.0, 6.0].map((size) => (
                        <button
                          key={size}
                          className={`p-4 border-2 rounded-lg text-center transition-colors ${
                            config.beadSize === size
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleConfigChange('beadSize', size)}
                        >
                          <div className="font-medium">{size}mm</div>
                          <div className="text-sm text-gray-500">
                            {size === 2.0 && 'Delicate'}
                            {size === 4.0 && 'Classic'}
                            {size === 6.0 && 'Bold'}
                          </div>
                          <div className="text-xs text-blue-600 mt-1">
                            €{(size * 25).toFixed(2)} per bead
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Chain Type - Only for Chain Bracelets */}
              {config.braceletType === 'CHAIN' && (
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">3. Chain Style</h3>
                    <p className="text-sm text-gray-500">Click on an image to see the pattern in detail</p>
                  </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {chainOptions.map((chain) => (
                      <div key={chain.value} className="space-y-2">
                        <button
                          className={`w-full p-3 border-2 rounded-lg text-left transition-colors ${
                            config.chainType === chain.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleConfigChange('chainType', chain.value)}
                        >
                          <div className="font-medium">{chain.label}</div>
                          <div className="text-sm text-gray-500 mb-2">{chain.description}</div>
                          
                          {/* Chain Pattern Image */}
                          <div 
                            className="bg-gray-50 rounded p-2 cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleChainImageClick(chain.value);
                            }}
                          >
                            <Image
                              src={getChainImagePath(chain.value)}
                              alt={`${chain.label} pattern`}
                              width={150}
                              height={60}
                              className="w-full h-auto"
                            />
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
                </Card>
              )}

              {/* Size Options */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">
                    {config.braceletType === 'CHAIN' ? '5. Size & Thickness' : '4. Size'}
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {/* Chain Thickness - Only for Chain Bracelets */}
                  {config.braceletType === 'CHAIN' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chain Thickness
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
                  )}

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
                  <div className="bg-gray-50 rounded-lg p-6 mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-3 text-center">
                      {config.braceletType === 'CHAIN' 
                        ? `${chainOptions.find(c => c.value === config.chainType)?.label} Chain`
                        : `${config.beadSize}mm Beads Bracelet`
                      }
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      {config.braceletType === 'CHAIN' ? (
                        <Image
                          src={getChainImagePath(config.chainType)}
                          alt={`${config.chainType} chain pattern`}
                          width={250}
                          height={100}
                          className="w-full h-auto"
                        />
                      ) : (
                        <div className="flex items-center justify-center space-x-1 py-8">
                          {/* Sample beads preview */}
                          {['red', 'blue', 'yellow', 'green', 'gold'].map((color, index) => (
                            <div
                              key={color}
                              className={`rounded-full bg-${color === 'red' ? 'red-500' : color === 'blue' ? 'blue-500' : color === 'yellow' ? 'yellow-400' : color === 'green' ? 'green-500' : 'yellow-600'}`}
                              style={{ 
                                width: `${config.beadSize || 4}px`, 
                                height: `${config.beadSize || 4}px`,
                                minWidth: `${Math.max((config.beadSize || 4) * 2, 12)}px`,
                                minHeight: `${Math.max((config.beadSize || 4) * 2, 12)}px`
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-sm space-y-1">
                    <div><strong>Type:</strong> {config.braceletType === 'CHAIN' ? 'Chain Bracelet' : 'Beads Bracelet'}</div>

                    {config.braceletType === 'CHAIN' && (
                      <>
                        <div><strong>Metal:</strong> {metalOptions.find(m => m.value === config.metalType)?.label}</div>
                        <div><strong>Chain:</strong> {chainOptions.find(c => c.value === config.chainType)?.label}</div>
                        <div><strong>Size:</strong> {config.thickness}mm × {config.length}mm</div>
                      </>
                    )}
                    {config.braceletType === 'BEADS' && (
                      <>
                        <div><strong>Bead Size:</strong> {config.beadSize}mm</div>
                        <div><strong>Length:</strong> {config.length}mm</div>
                      </>
                    )}
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
                    {config.braceletType === 'BEADS' 
                      ? 'Base bracelet price (before beads & charms)' 
                      : 'Base bracelet price (before charms)'
                    }
                  </div>
                  
                  <PrimaryButton 
                    className="w-full"
                    onClick={() => setStep('design')}
                  >
                    {config.braceletType === 'BEADS' 
                      ? 'Continue to Design Beads' 
                      : 'Continue to Add Charms'
                    }
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

      {/* Chain Modal */}
      {selectedChain && (
        <ChainModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          chainType={selectedChain.toLowerCase()}
          imagePath={getChainImagePath(selectedChain)}
        />
      )}
    </div>
  );
}