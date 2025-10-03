"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, WizardStepper, type WizardStep } from "@/components/ui";
import { PrimaryButton, SecondaryButton } from "@/components/ui";
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
  const t = useTranslations('designer');
  
  // State management
  const [currentStepId, setCurrentStepId] = useState<string>('type');
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
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Define wizard steps
  const wizardSteps: WizardStep[] = useMemo(() => {
    const baseSteps: WizardStep[] = [
      {
        id: 'type',
        title: t('steps.type.title'),
        description: t('steps.type.description'),
        isValid: !!config.braceletType,
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7l2 2m0 0l2 2m-2-2v6a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7l4 4z" />
          </svg>
        )
      }
    ];

    if (config.braceletType === 'CHAIN') {
      baseSteps.push(
        {
          id: 'metal',
          title: t('steps.metal.title'),
          description: t('steps.metal.description'),
          isValid: !!config.metalType,
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          )
        },
        {
          id: 'chain',
          title: t('steps.chain.title'),
          description: t('steps.chain.description'),
          isValid: !!config.chainType,
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          )
        }
      );
    } else if (config.braceletType === 'BEADS') {
      baseSteps.push({
        id: 'beads',
        title: t('steps.beads.title'),
        description: t('steps.beads.description'),
        isValid: !!config.beadSize,
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
          </svg>
        )
      });
    }

    baseSteps.push(
      {
        id: 'size',
        title: t('steps.size.title'),
        description: t('steps.size.description'),
        isValid: !!(config.thickness && config.length),
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        )
      },
      {
        id: 'design',
        title: t('steps.design.title'),
        description: t('steps.design.description'),
        isValid: true,
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        )
      }
    );

    return baseSteps;
  }, [config.braceletType, config.metalType, config.chainType, config.beadSize, config.thickness, config.length, t]);

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

  // Navigation handlers
  const handleStepChange = (stepId: string) => {
    setCurrentStepId(stepId);
  };

  const handleNext = () => {
    const currentIndex = wizardSteps.findIndex(step => step.id === currentStepId);
    if (currentIndex < wizardSteps.length - 1) {
      setCurrentStepId(wizardSteps[currentIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    const currentIndex = wizardSteps.findIndex(step => step.id === currentStepId);
    if (currentIndex > 0) {
      setCurrentStepId(wizardSteps[currentIndex - 1].id);
    }
  };

  const handleComplete = () => {
    // Navigate to the actual designer
    setCurrentStepId('design');
  };

  const canGoNext = () => {
    const currentStep = wizardSteps.find(step => step.id === currentStepId);
    return currentStep?.isValid || currentStep?.isOptional || false;
  };

  const canGoPrevious = () => {
    const currentIndex = wizardSteps.findIndex(step => step.id === currentStepId);
    return currentIndex > 0;
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

  // If we're on the design step, show the Designer component
  if (currentStepId === 'design') {
    const braceletSlug = config.braceletType === 'BEADS' ? 'beads-bracelet' : 'classic';
    return <Designer braceletSlug={braceletSlug} config={config} />;
  }

  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStepId) {
      case 'type':
        return (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">{t('configuration.braceletType')}</h3>
              <p className="text-sm text-gray-500">{t('configuration.braceletTypeDescription')}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  className={`p-6 border-2 rounded-lg text-left transition-all duration-200 hover:shadow-md ${
                    config.braceletType === 'CHAIN'
                      ? 'border-primary-500 bg-primary-50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleConfigChange('braceletType', 'CHAIN')}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{t('configuration.chainBracelet')}</div>
                      <div className="text-sm text-gray-500">Traditional chain with charms</div>
                    </div>
                  </div>
                </button>
                <button
                  className={`p-6 border-2 rounded-lg text-left transition-all duration-200 hover:shadow-md ${
                    config.braceletType === 'BEADS'
                      ? 'border-primary-500 bg-primary-50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleConfigChange('braceletType', 'BEADS')}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{t('configuration.beadsBracelet')}</div>
                      <div className="text-sm text-gray-500">Colorful beads pattern</div>
                    </div>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>
        );

      case 'metal':
        return (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">{t('selectMetal')}</h3>
              <p className="text-sm text-gray-500">Choose the metal type for your chain</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {metalOptions.map((metal) => (
                  <button
                    key={metal.value}
                    className={`p-4 border-2 rounded-lg text-left transition-all duration-200 hover:shadow-sm ${
                      config.metalType === metal.value
                        ? 'border-primary-500 bg-primary-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleConfigChange('metalType', metal.value)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{metal.label}</div>
                        <div className="text-sm text-gray-500">
                          {metal.price > 0 ? `+€${(metal.price / 100).toFixed(2)}` : 
                           metal.price < 0 ? `-€${Math.abs(metal.price / 100).toFixed(2)}` : 
                           'Base price'}
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full ${
                        metal.value === 'GOLD' ? 'bg-yellow-400' :
                        metal.value === 'SILVER' ? 'bg-gray-300' :
                        metal.value === 'ROSE_GOLD' ? 'bg-rose-400' :
                        metal.value === 'WHITE_GOLD' ? 'bg-gray-100' :
                        metal.value === 'PLATINUM' ? 'bg-gray-400' :
                        'bg-gray-500'
                      }`} />
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'chain':
        return (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">{t('chainStyle')}</h3>
              <p className="text-sm text-gray-500">{t('chainStyleDescription')}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {chainOptions.map((chain) => (
                  <div key={chain.value} className="space-y-2">
                    <button
                      className={`w-full p-4 border-2 rounded-lg text-left transition-all duration-200 hover:shadow-sm ${
                        config.chainType === chain.value
                          ? 'border-primary-500 bg-primary-50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleConfigChange('chainType', chain.value)}
                    >
                      <div className="font-medium text-gray-900 mb-1">{chain.label}</div>
                      <div className="text-sm text-gray-500 mb-3">{chain.description}</div>
                      
                      {/* Chain Pattern Preview */}
                      <div 
                        className="bg-gray-50 rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-colors"
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
                          className="w-full h-auto rounded"
                        />
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'beads':
        return (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">{t('beadSize')}</h3>
              <p className="text-sm text-gray-500">{t('beadSizeDescription')}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[2.0, 4.0, 6.0].map((size) => (
                  <button
                    key={size}
                    className={`p-6 border-2 rounded-lg text-center transition-all duration-200 hover:shadow-sm ${
                      config.beadSize === size
                        ? 'border-primary-500 bg-primary-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleConfigChange('beadSize', size)}
                  >
                    <div className="mb-3">
                      <div 
                        className="mx-auto rounded-full bg-gradient-to-br from-purple-400 to-purple-600"
                        style={{
                          width: `${Math.max(size * 8, 24)}px`,
                          height: `${Math.max(size * 8, 24)}px`
                        }}
                      />
                    </div>
                    <div className="font-medium text-gray-900">{size}mm</div>
                    <div className="text-sm text-gray-500 mb-2">
                      {size === 2.0 && t('delicate')}
                      {size === 4.0 && t('classic')}
                      {size === 6.0 && t('bold')}
                    </div>
                    <div className="text-xs text-primary-600 font-medium">
                      €{(size * 25).toFixed(2)} per bead
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'size':
        return (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">{t('thickness')} & {t('length')}</h3>
              <p className="text-sm text-gray-500">Configure the dimensions of your bracelet</p>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Chain Thickness - Only for Chain Bracelets */}
              {config.braceletType === 'CHAIN' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t('thickness')}
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {thicknessOptions.map((option) => (
                      <button
                        key={option.value}
                        className={`p-3 border-2 rounded-lg text-left transition-all duration-200 hover:shadow-sm ${
                          config.thickness === option.value
                            ? 'border-primary-500 bg-primary-50 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleConfigChange('thickness', option.value)}
                      >
                        <div className="font-medium text-gray-900">{option.label}</div>
                        <div 
                          className="mt-2 bg-gray-400 rounded"
                          style={{ height: `${option.value}px`, width: '100px' }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Length */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('length')}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {lengthOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`p-3 border-2 rounded-lg text-left transition-all duration-200 hover:shadow-sm ${
                        config.length === option.value
                          ? 'border-primary-500 bg-primary-50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleConfigChange('length', option.value)}
                    >
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-500">Perfect for wrist size {Math.round(option.value * 0.8)}-{Math.round(option.value * 0.9)}mm</div>
                    </button>
                  ))}
                </div>
              </div>

            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('configuration.title')}
            </h1>
            <p className="text-gray-600">
              {config.braceletType === 'CHAIN' 
                ? t('configuration.chainDescription')
                : t('configuration.beadsDescription')
              }
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Main Configuration Panel */}
            <div className="lg:col-span-3">
              
              {/* Wizard Stepper */}
              <div className="mb-8">
                <WizardStepper
                  steps={wizardSteps}
                  currentStepId={currentStepId}
                  onStepChange={handleStepChange}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                  onComplete={handleComplete}
                  canGoNext={canGoNext()}
                  canGoPrevious={canGoPrevious()}
                  isLoading={isTransitioning}
                />
              </div>

              {/* Step Content */}
              <div className="transition-all duration-300">
                {renderStepContent()}
              </div>

            </div>

            {/* Sidebar - Preview & Summary */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Live Preview - Sticky Container */}
              <div className="sticky top-24 space-y-6">
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Live Preview</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="text-sm font-medium text-gray-700 mb-3 text-center">
                        {config.braceletType === 'CHAIN' 
                          ? `${chainOptions.find(c => c.value === config.chainType)?.label || 'Chain'} Bracelet`
                          : `${config.beadSize || 4}mm Beads Bracelet`
                        }
                      </div>
                      
                      {/* 3D-like Preview */}
                      <div className="bg-white rounded-lg p-4 shadow-inner min-h-[120px] flex items-center justify-center">
                        {config.braceletType === 'CHAIN' && config.chainType ? (
                          <div className="relative">
                            <Image
                              src={getChainImagePath(config.chainType)}
                              alt={`${config.chainType} chain pattern`}
                              width={200}
                              height={80}
                              className="w-full h-auto opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20" />
                          </div>
                        ) : config.braceletType === 'BEADS' ? (
                          <div className="flex items-center justify-center space-x-1">
                            {/* Animated beads preview */}
                            {['red', 'blue', 'yellow', 'green', 'purple', 'pink'].map((color, index) => (
                              <div
                                key={color}
                                className={`rounded-full shadow-sm transition-all duration-300 hover:scale-110 ${
                                  color === 'red' ? 'bg-red-400' : 
                                  color === 'blue' ? 'bg-blue-400' : 
                                  color === 'yellow' ? 'bg-yellow-400' : 
                                  color === 'green' ? 'bg-green-400' : 
                                  color === 'purple' ? 'bg-purple-400' : 'bg-pink-400'
                                }`}
                                style={{ 
                                  width: `${Math.max((config.beadSize || 4) * 3, 16)}px`, 
                                  height: `${Math.max((config.beadSize || 4) * 3, 16)}px`,
                                  animationDelay: `${index * 100}ms`
                                }}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="text-gray-400 text-sm">
                            Select a bracelet type to see preview
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Configuration Summary */}
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium">
                          {config.braceletType === 'CHAIN' ? 'Chain Bracelet' : 'Beads Bracelet'}
                        </span>
                      </div>

                      {config.braceletType === 'CHAIN' && (
                        <>
                          {config.metalType && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Metal:</span>
                              <span className="font-medium">
                                {metalOptions.find(m => m.value === config.metalType)?.label}
                              </span>
                            </div>
                          )}
                          {config.chainType && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Chain:</span>
                              <span className="font-medium">
                                {chainOptions.find(c => c.value === config.chainType)?.label}
                              </span>
                            </div>
                          )}
                          {config.thickness && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Thickness:</span>
                              <span className="font-medium">{config.thickness}mm</span>
                            </div>
                          )}
                        </>
                      )}
                      
                      {config.braceletType === 'BEADS' && config.beadSize && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bead Size:</span>
                          <span className="font-medium">{config.beadSize}mm</span>
                        </div>
                      )}
                      
                      {config.length && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Length:</span>
                          <span className="font-medium">{config.length}mm</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Price Estimate */}
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">{t('priceEstimate')}</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-600 mb-2">
                        €{calculatePrice().toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500 mb-4">
                        {config.braceletType === 'BEADS' 
                          ? t('baseBraceletPriceBeads')
                          : t('baseBraceletPrice')
                        }
                      </div>
                      
                      {/* Progress indicator */}
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div 
                          className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${((wizardSteps.findIndex(s => s.id === currentStepId) + 1) / wizardSteps.length) * 100}%` }}
                        />
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Configuration {Math.round(((wizardSteps.findIndex(s => s.id === currentStepId) + 1) / wizardSteps.length) * 100)}% complete
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

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