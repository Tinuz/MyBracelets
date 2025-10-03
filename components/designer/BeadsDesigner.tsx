"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Button";
import { LoadingSpinner, Alert, Card, CardContent, CardHeader } from "@/components/ui/Common";
import { addToCart } from "@/lib/cart";
import PhotoUpload, { DesignSuggestion } from "./PhotoUpload";
import SuggestionsPanel from "./SuggestionsPanel";

import { useTranslations } from 'next-intl';



// Types
interface Bead {
  id: string;
  color: string;
  colorHex?: string | null;
  name: string;
  priceCents: number;
  diameterMm: number;
  imageUrl?: string | null;
}

interface BeadPlacement {
  id: string;
  beadId: string;
  position: number; // Position on the bracelet (0, 1, 2, etc.)
  quantity: number;
}

interface BeadsDesignerProps {
  braceletSlug: string;
  beadSize: number;
  braceletLength: number;
}

export default function BeadsDesigner({ braceletSlug, beadSize, braceletLength }: BeadsDesignerProps) {
  const t = useTranslations('beadsDesigner');
  
  // Refs for touch handling
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // State
  const [beads, setBeads] = useState<Bead[]>([]);
  const [placements, setPlacements] = useState<BeadPlacement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draggedBead, setDraggedBead] = useState<Bead | null>(null);
  const [draggedPlacement, setDraggedPlacement] = useState<BeadPlacement | null>(null);
  const [dragOverPosition, setDragOverPosition] = useState<number | null>(null);
  
  // Enhanced UX state
  const [isDragging, setIsDragging] = useState(false);
  const [selectedBead, setSelectedBead] = useState<string | null>(null);
  const [hoveredPosition, setHoveredPosition] = useState<number | null>(null);
  const [showPatternPreview, setShowPatternPreview] = useState(true);
  const [animatingPosition, setAnimatingPosition] = useState<number | null>(null);
  
  // Undo/Redo functionality
  const [undoStack, setUndoStack] = useState<BeadPlacement[][]>([]);
  const [redoStack, setRedoStack] = useState<BeadPlacement[][]>([]);
  
  // Pattern generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [patternMode, setPatternMode] = useState<'manual' | 'pattern'>('manual');
  
  // Photo upload and AI suggestions state
  const [showPhotoUpload, setShowPhotoUpload] = useState(true);
  const [suggestions, setSuggestions] = useState<DesignSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Calculate how many beads fit on the bracelet
  const maxBeads = Math.floor(braceletLength / (beadSize + 1)); // +1 for spacing

  // Save state for undo functionality
  const saveState = useCallback(() => {
    setUndoStack(prev => [...prev.slice(-19), placements]); // Keep last 20 states
    setRedoStack([]); // Clear redo stack when making new changes
  }, [placements]);

  // Undo functionality
  const undo = useCallback(() => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      setRedoStack(prev => [placements, ...prev.slice(0, 19)]);
      setPlacements(previousState);
      setUndoStack(prev => prev.slice(0, -1));
    }
  }, [undoStack, placements]);

  // Redo functionality
  const redo = useCallback(() => {
    if (redoStack.length > 0) {
      const nextState = redoStack[0];
      setUndoStack(prev => [...prev, placements]);
      setPlacements(nextState);
      setRedoStack(prev => prev.slice(1));
    }
  }, [redoStack, placements]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      } else if (e.key === 'Escape') {
        setSelectedBead(null);
        setDraggedBead(null);
        setDraggedPlacement(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  // Load beads on component mount
  useEffect(() => {
    const loadBeads = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/beads');
        if (!response.ok) {
          throw new Error('Failed to load beads');
        }
        const data = await response.json();
        
        // Filter beads by the selected size
        const filteredBeads = data.filter((bead: Bead) => bead.diameterMm === beadSize);
        setBeads(filteredBeads);
      } catch (error) {
        console.error('Error loading beads:', error);
        setError('Failed to load beads');
      } finally {
        setLoading(false);
      }
    };

    loadBeads();
  }, [beadSize]);

  // Enhanced pointer event handlers for better touch/mouse support
  const handlePointerDown = useCallback((e: React.PointerEvent, bead: Bead) => {
    // Only select the bead, don't set dragging state yet
    // Dragging state will be set by onDragStart event
    setSelectedBead(bead.id);
    console.log('🎯 Bead pointer down:', bead.name);
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    // No longer needed since isDragging is only set during actual drag operations
    console.log('🔄 Pointer up event');
  }, []);

  const handlePlacementPointerDown = useCallback((e: React.PointerEvent, placement: BeadPlacement) => {
    e.preventDefault();
    e.stopPropagation();
    // Save state before potential move, but don't set dragging state yet
    saveState(); 
    console.log('🎯 Placement pointer down:', placement.id);
  }, [saveState]);

  // Handle drag start from palette
  const handleDragStart = useCallback((bead: Bead) => {
    console.log('🎯 Starting drag from palette with bead:', bead);
    setDraggedBead(bead);
    setDraggedPlacement(null);
    setIsDragging(true);
    setSelectedBead(bead.id); // Also select the bead being dragged
  }, []);

  // Handle drag start from canvas (existing bead)
  const handlePlacementDragStart = useCallback((placement: BeadPlacement) => {
    console.log('🎯 Starting drag from canvas with placement:', placement);
    setDraggedPlacement(placement);
    setDraggedBead(null);
    setIsDragging(true);
  }, []);

  // Handle drop on canvas
  const handleDrop = useCallback((position: number) => {
    console.log('🚀 Drop triggered at position:', position);
    console.log('🚀 Dragged bead:', draggedBead);
    console.log('🚀 Dragged placement:', draggedPlacement);
    
    if (draggedBead) {
      // Save state before adding new bead
      saveState();
      
      // Add new bead
      const newPlacement: BeadPlacement = {
        id: `placement-${Date.now()}`,
        beadId: draggedBead.id,
        position,
        quantity: 1
      };
      
      console.log('✨ Creating new placement:', newPlacement);
      
      // Animate the position
      setAnimatingPosition(position);
      setTimeout(() => setAnimatingPosition(null), 300);
      
      setPlacements(prev => {
        // Remove any existing bead at this position
        const filtered = prev.filter(p => p.position !== position);
        const updated = [...filtered, newPlacement];
        console.log('✅ Updated placements:', updated);
        return updated;
      });
    } else if (draggedPlacement) {
      // Move existing bead
      console.log('📦 Moving existing placement to position:', position);
      
      // Animate the position
      setAnimatingPosition(position);
      setTimeout(() => setAnimatingPosition(null), 300);
      
      setPlacements(prev => {
        // Remove any existing bead at target position first
        const filtered = prev.filter(p => p.position !== position);
        const updated = filtered.map(p => 
          p.id === draggedPlacement.id ? { ...p, position } : p
        );
        console.log('✅ Updated placements after move:', updated);
        return updated;
      });
    } else {
      console.log('❌ No dragged item found!');
    }
    
    // Clear drag state
    setDraggedBead(null);
    setDraggedPlacement(null);
    setIsDragging(false);
  }, [draggedBead, draggedPlacement, saveState]);

  // Pattern generation functions
  const generatePattern = useCallback((type: 'alternating' | 'gradient' | 'random' | 'symmetrical') => {
    if (beads.length === 0) return;
    
    setIsGenerating(true);
    saveState(); // Save current state
    
    setTimeout(() => {
      let newPlacements: BeadPlacement[] = [];
      
      switch (type) {
        case 'alternating':
          // Alternate between first two bead colors
          for (let i = 0; i < Math.min(maxBeads, 12); i++) {
            const bead = beads[i % 2];
            newPlacements.push({
              id: `pattern-${i}`,
              beadId: bead.id,
              position: i,
              quantity: 1
            });
          }
          break;
          
        case 'gradient':
          // Use beads in order for gradient effect
          for (let i = 0; i < Math.min(maxBeads, beads.length, 12); i++) {
            const bead = beads[i];
            newPlacements.push({
              id: `pattern-${i}`,
              beadId: bead.id,
              position: i,
              quantity: 1
            });
          }
          break;
          
        case 'random':
          // Random selection of beads
          for (let i = 0; i < Math.min(maxBeads, 12); i++) {
            const randomBead = beads[Math.floor(Math.random() * beads.length)];
            newPlacements.push({
              id: `pattern-${i}`,
              beadId: randomBead.id,
              position: i,
              quantity: 1
            });
          }
          break;
          
        case 'symmetrical':
          // Mirror pattern from center
          const centerCount = Math.min(maxBeads, 12);
          const halfCount = Math.floor(centerCount / 2);
          for (let i = 0; i < halfCount; i++) {
            const bead = beads[i % beads.length];
            newPlacements.push({
              id: `pattern-${i}`,
              beadId: bead.id,
              position: i,
              quantity: 1
            });
            if (centerCount - 1 - i !== i) {
              newPlacements.push({
                id: `pattern-mirror-${i}`,
                beadId: bead.id,
                position: centerCount - 1 - i,
                quantity: 1
              });
            }
          }
          break;
      }
      
      setPlacements(newPlacements);
      setIsGenerating(false);
    }, 300);
  }, [beads, maxBeads, saveState]);

  // Remove bead from canvas
  const removeBead = useCallback((placementId: string) => {
    saveState(); // Save state before removal
    setPlacements(prev => prev.filter(p => p.id !== placementId));
  }, [saveState]);

  // Clear all beads
  const clearAll = useCallback(() => {
    if (placements.length > 0) {
      saveState();
      setPlacements([]);
    }
  }, [placements.length, saveState]);

  // Handle clicking on empty position to add selected bead
  const handlePositionClick = useCallback((position: number) => {
    console.log('📍 handlePositionClick called:', { position, selectedBead });
    
    if (!selectedBead) {
      console.log('❌ No bead selected');
      return;
    }
    
    const bead = beads.find(b => b.id === selectedBead);
    if (!bead) {
      console.log('❌ Selected bead not found in beads array');
      return;
    }
    
    console.log('✅ Placing bead:', bead.name, 'at position:', position);
    
    // Save state before adding new bead
    saveState();
    
    // Add new bead
    const newPlacement: BeadPlacement = {
      id: `placement-${Date.now()}`,
      beadId: bead.id,
      position,
      quantity: 1
    };
    
    // Animate the position
    setAnimatingPosition(position);
    setTimeout(() => setAnimatingPosition(null), 300);
    
    setPlacements(prev => {
      // Remove any existing bead at this position
      const filtered = prev.filter(p => p.position !== position);
      const newPlacements = [...filtered, newPlacement];
      console.log('📍 Updated placements:', newPlacements);
      return newPlacements;
    });
    
    // Don't clear selectedBead so user can place multiple beads of same type
    console.log('✅ Bead placement complete');
  }, [selectedBead, beads, saveState]);

  // Handle photo analysis complete
  const handleAnalysisComplete = useCallback((newSuggestions: DesignSuggestion[]) => {
    console.log('✅ Photo analysis complete:', newSuggestions);
    setSuggestions(newSuggestions);
    setShowSuggestions(true);
    setShowPhotoUpload(false);
  }, []);

  // Handle photo upload error
  const handlePhotoError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => setError(null), 5000);
  }, []);

  // Handle suggestion selection
  const handleSelectSuggestion = useCallback((suggestion: DesignSuggestion) => {
    console.log('🎨 Selected suggestion:', suggestion);
    
    // Save current state
    saveState();
    
    // Create placements based on the suggestion's bead IDs
    const newPlacements: BeadPlacement[] = suggestion.beadIds.map((beadId, index) => ({
      id: `placement-${Date.now()}-${index}`,
      beadId,
      position: index,
      quantity: 1,
    }));
    
    setPlacements(newPlacements);
    setShowSuggestions(false);
    setShowPhotoUpload(false);
    
    // Scroll to the canvas
    canvasRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [saveState]);

  // Handle close suggestions
  const handleCloseSuggestions = useCallback(() => {
    setShowSuggestions(false);
    setShowPhotoUpload(true);
  }, []);

  // Calculate total price
  const calculatePrice = () => {
    const beadCosts = placements.reduce((total, placement) => {
      const bead = beads.find(b => b.id === placement.beadId);
      return total + (bead ? bead.priceCents * placement.quantity : 0);
    }, 0);
    
    return beadCosts / 100; // Convert cents to euros
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Alert variant="error">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('beadsTitle', { default: 'Design Your Beads Bracelet' })}
            </h1>
            <p className="text-gray-600 mb-4">
              {t('beadsSubtitle', { default: 'Drag beads from the palette to create your pattern' })}
            </p>
          </div>
          
          {/* Photo Upload Section */}
          {showPhotoUpload && placements.length === 0 && (
            <div className="mb-8">
              <Card>
                <CardHeader>
                  <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      🎨 {t('aiDesignTitle', { default: 'AI Design Assistant' })}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {t('aiDesignDescription', { default: 'Upload een foto van je outfit en krijg 3 kleur-gecoördineerde ontwerpen' })}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <PhotoUpload
                    onAnalysisComplete={handleAnalysisComplete}
                    onError={handlePhotoError}
                  />
                  
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => setShowPhotoUpload(false)}
                      className="text-sm text-gray-500 hover:text-gray-700 underline"
                    >
                      {t('skipPhotoUpload', { default: 'Overslaan en zelf ontwerpen' })}
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* AI Suggestions Panel */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="mb-8">
              <SuggestionsPanel
                suggestions={suggestions}
                onSelectSuggestion={handleSelectSuggestion}
                onClose={handleCloseSuggestions}
              />
            </div>
          )}
          
          {/* Show manual design section only when not showing photo upload or suggestions */}
          {(!showPhotoUpload || placements.length > 0) && !showSuggestions && (
            <>
            {/* Controls Bar */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
              <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm border">
                <button
                  onClick={undo}
                  disabled={undoStack.length === 0}
                  className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Undo (Cmd+Z)"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                </button>
                <button
                  onClick={redo}
                  disabled={redoStack.length === 0}
                  className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Redo (Cmd+Y)"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
                  </svg>
                </button>
                <div className="w-px h-6 bg-gray-200"></div>
                <button
                  onClick={clearAll}
                  disabled={placements.length === 0}
                  className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-red-600"
                  title="Clear All"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              
              {/* Pattern Generator */}
              <div className="flex items-center gap-2">
                <select
                  value={patternMode}
                  onChange={(e) => setPatternMode(e.target.value as 'manual' | 'pattern')}
                  className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="manual">{t('manual', { default: 'Manual' })}</option>
                  <option value="pattern">{t('pattern', { default: 'Pattern' })}</option>
                </select>
                
                {patternMode === 'pattern' && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => generatePattern('alternating')}
                      disabled={isGenerating}
                      className="px-3 py-2 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600 disabled:opacity-50"
                      title="Alternating Pattern"
                    >
                      Alt
                    </button>
                    <button
                      onClick={() => generatePattern('gradient')}
                      disabled={isGenerating}
                      className="px-3 py-2 bg-purple-500 text-white text-xs rounded-md hover:bg-purple-600 disabled:opacity-50"
                      title="Gradient Pattern"
                    >
                      Grad
                    </button>
                    <button
                      onClick={() => generatePattern('symmetrical')}
                      disabled={isGenerating}
                      className="px-3 py-2 bg-green-500 text-white text-xs rounded-md hover:bg-green-600 disabled:opacity-50"
                      title="Symmetrical Pattern"
                    >
                      Sym
                    </button>
                    <button
                      onClick={() => generatePattern('random')}
                      disabled={isGenerating}
                      className="px-3 py-2 bg-orange-500 text-white text-xs rounded-md hover:bg-orange-600 disabled:opacity-50"
                      title="Random Pattern"
                    >
                      Rand
                    </button>
                  </div>
                )}
              </div>
              
              {/* Preview Toggle */}
              <button
                onClick={() => setShowPatternPreview(!showPatternPreview)}
                className={`px-3 py-2 text-sm rounded-md border ${
                  showPatternPreview 
                    ? 'bg-blue-50 border-blue-200 text-blue-700' 
                    : 'bg-gray-50 border-gray-200 text-gray-600'
                }`}
              >
                {showPatternPreview ? t('hidePreview', { default: 'Hide Preview' }) : t('showPreview', { default: 'Show Preview' })}
              </button>
            </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Beads Palette */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">{t('beadsPalette', { default: 'Beads Palette' })}</h3>
                  <p className="text-sm text-gray-500">{beadSize}mm {t('beads', { default: 'beads' })}</p>
                  {selectedBead && (
                    <div className="text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded border border-blue-200">
                      ✨ {t('clickToPlace', { default: 'Click positions to place selected bead' })}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {beads.map((bead) => (
                      <div
                        key={bead.id}
                        className={`group relative p-3 border-2 rounded-lg cursor-grab active:cursor-grabbing transition-all duration-200 ${
                          selectedBead === bead.id
                            ? 'border-blue-500 bg-blue-50 scale-105 shadow-md'
                            : draggedBead?.id === bead.id 
                              ? 'border-blue-400 bg-blue-25 scale-95' 
                              : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                        }`}
                        onClick={() => {
                          console.log('🎯 Bead clicked:', bead.name, 'Current selected:', selectedBead);
                          setSelectedBead(selectedBead === bead.id ? null : bead.id);
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          {/* Color Preview */}
                          <div className="relative flex-shrink-0">
                            <div 
                              className="w-8 h-8 rounded-full border-2 border-gray-300 shadow-sm overflow-hidden"
                              style={{
                                backgroundColor: bead.colorHex || (bead.color === 'RED' ? '#DC2626' : 
                                                                 bead.color === 'BLUE' ? '#2563EB' : 
                                                                 bead.color === 'GREEN' ? '#059669' : 
                                                                 bead.color === 'YELLOW' ? '#FBBF24' : 
                                                                 bead.color === 'PINK' ? '#EC4899' : 
                                                                 bead.color === 'PURPLE' ? '#7C3AED' : 
                                                                 bead.color === 'ORANGE' ? '#EA580C' : 
                                                                 bead.color === 'TEAL' ? '#0D9488' : 
                                                                 bead.color === 'EMERALD' ? '#10B981' : 
                                                                 bead.color === 'SAGE' ? '#84CC16' : 
                                                                 bead.color === 'TURQUOISE' ? '#06B6D4' : 
                                                                 bead.color === 'GOLD' ? '#D97706' : 
                                                                 bead.color === 'PALE_GREEN' ? '#86EFAC' : '#6B7280'),
                                backgroundImage: 'none !important'
                              }}
                            />
                            {/* No image display - only solid colors */}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{bead.name}</div>
                            <div className="text-xs text-gray-500">€{(bead.priceCents / 100).toFixed(2)}</div>
                          </div>
                          
                          {/* Selection Indicator */}
                          {selectedBead === bead.id && (
                            <div className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Canvas Area */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">{t('braceletCanvas', { default: 'Bracelet Canvas' })}</h3>
                  <p className="text-sm text-gray-500">
                    {t('canvasInstructions', { 
                      maxBeads: maxBeads,
                      default: `Drop beads here to create your pattern (max ${maxBeads} beads)`
                    })}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{t('beadsUsed', { default: 'Beads Used' })}: {placements.length}/{maxBeads}</span>
                    <div className="flex items-center gap-4">
                      <span>{t('beadSize', { default: 'Size' })}: {beadSize}mm</span>
                      <span>{t('length', { default: 'Length' })}: {braceletLength}mm</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
                    {/* Bracelet Canvas */}
                    <div className="relative" ref={canvasRef}>
                      
                      {/* Enhanced Bracelet Preview */}
                      {showPatternPreview && (
                        <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border">
                          <div className="text-sm font-medium text-gray-700 mb-3 flex items-center justify-between">
                            <span>{t('braceletPreview', { default: 'Bracelet Preview' })}</span>
                            <span className="text-xs text-gray-500">{t('actualSize', { default: 'Scaled representation' })}</span>
                          </div>
                          <div className="relative w-full min-h-[3rem] bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-amber-200">
                            {/* Enhanced chain/cord background with texture */}
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 rounded-full opacity-60"></div>
                            <div className="absolute inset-0 bg-gradient-radial from-transparent via-amber-50 to-transparent rounded-full opacity-40"></div>
                            
                            {/* Placed beads on bracelet with enhanced styling */}
                            <div className="flex items-center gap-1 relative z-10 px-4">
                              {placements.length === 0 ? (
                                <span className="text-amber-600 text-sm italic">{t('emptyBracelet', { default: 'Empty bracelet' })}</span>
                              ) : (
                                <>
                                  {Array.from({ length: Math.min(maxBeads, 16) }, (_, index) => {
                                    const placement = placements.find(p => p.position === index);
                                    const bead = placement ? beads.find(b => b.id === placement.beadId) : null;
                                    
                                    return (
                                      <div key={index} className="relative">
                                        {placement && bead ? (
                                          <div 
                                            className={`w-5 h-5 rounded-full border-2 border-gray-400 shadow-sm transition-all duration-300 hover:scale-110 overflow-hidden ${
                                              animatingPosition === index ? 'scale-125 ring-2 ring-blue-400' : ''
                                            }`}
                                            style={{
                                              backgroundColor: bead.colorHex || (bead.color === 'RED' ? '#DC2626' : 
                                                                               bead.color === 'BLUE' ? '#2563EB' : 
                                                                               bead.color === 'GREEN' ? '#059669' : 
                                                                               bead.color === 'YELLOW' ? '#FBBF24' : 
                                                                               bead.color === 'PINK' ? '#EC4899' : 
                                                                               bead.color === 'PURPLE' ? '#7C3AED' : 
                                                                               bead.color === 'ORANGE' ? '#EA580C' : 
                                                                               bead.color === 'TEAL' ? '#0D9488' : 
                                                                               bead.color === 'EMERALD' ? '#10B981' : 
                                                                               bead.color === 'SAGE' ? '#84CC16' : 
                                                                               bead.color === 'TURQUOISE' ? '#06B6D4' : 
                                                                               bead.color === 'GOLD' ? '#D97706' : 
                                                                               bead.color === 'PALE_GREEN' ? '#86EFAC' : '#6B7280'),
                                              backgroundImage: 'none !important'
                                            }}
                                            title={`Position ${index + 1}: ${bead.name}`}
                                          />
                                        ) : (
                                          <div className="w-2 h-2 bg-amber-200 rounded-full opacity-50" />
                                        )}
                                      </div>
                                    );
                                  })}
                                  {placements.length > 16 && (
                                    <span className="text-xs text-amber-700 ml-2 bg-amber-200 px-2 py-1 rounded">
                                      +{placements.length - 16}
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Enhanced Bead Positions Grid */}
                      <div className="bg-white rounded-xl p-4 shadow-sm border">
                        <div className="text-sm font-medium text-gray-700 mb-3">{t('designArea', { default: 'Design Area' })}</div>
                        
                        <div 
                          className={`grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 min-h-[120px] p-4 rounded-lg border-2 border-dashed transition-all duration-300 ${
                            (draggedBead || draggedPlacement) 
                              ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-blue-25 shadow-inner' 
                              : 'border-gray-200 bg-gradient-to-br from-gray-25 to-gray-50'
                          }`}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          {Array.from({ length: maxBeads }, (_, index) => {
                            const placement = placements.find(p => p.position === index);
                            const bead = placement ? beads.find(b => b.id === placement.beadId) : null;
                            const isHovered = hoveredPosition === index;
                            const isAnimating = animatingPosition === index;
                            const isSelected = selectedBead && !placement;
                            
                            return (
                              <div
                                key={index}
                                className={`relative aspect-square border-2 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer group overflow-hidden ${
                                  dragOverPosition === index 
                                    ? 'border-blue-500 bg-blue-100 scale-110 shadow-xl ring-2 ring-blue-300' 
                                    : isHovered
                                    ? 'border-blue-400 bg-blue-50 scale-105 shadow-lg'
                                    : placement && bead
                                    ? 'border-gray-400 bg-white hover:shadow-md hover:scale-105'
                                    : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-25'
                                } ${(draggedBead || draggedPlacement) ? 'border-dashed' : ''} ${
                                  isAnimating ? 'animate-pulse ring-2 ring-green-400' : ''
                                } ${isSelected ? 'ring-2 ring-blue-400 border-blue-400 bg-blue-50' : ''}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  console.log('🎯 Position clicked:', index, 'Selected bead:', selectedBead);
                                  handlePositionClick(index);
                                }}
                                onPointerEnter={() => setHoveredPosition(index)}
                                onPointerLeave={() => setHoveredPosition(null)}

                              >
                                {placement && bead ? (
                                  <div
                                    className="relative cursor-move group/bead w-full h-full flex items-center justify-center"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Option to remove bead on click
                                      if (confirm('Remove this bead?')) {
                                        setPlacements(prev => prev.filter(p => p.id !== placement.id));
                                      }
                                    }}
                                  >
                                    {/* Enhanced bead display - solid colors only, fills entire container */}
                                    <div 
                                      className="absolute inset-1 rounded-full transition-all duration-200 group-hover/bead:scale-105"
                                      style={{
                                        backgroundColor: bead.colorHex || (bead.color === 'RED' ? '#DC2626' : 
                                                                         bead.color === 'BLUE' ? '#2563EB' : 
                                                                         bead.color === 'GREEN' ? '#059669' : 
                                                                         bead.color === 'YELLOW' ? '#FBBF24' : 
                                                                         bead.color === 'PINK' ? '#EC4899' : 
                                                                         bead.color === 'PURPLE' ? '#7C3AED' : 
                                                                         bead.color === 'ORANGE' ? '#EA580C' : 
                                                                         bead.color === 'TEAL' ? '#0D9488' : 
                                                                         bead.color === 'EMERALD' ? '#10B981' : 
                                                                         bead.color === 'SAGE' ? '#84CC16' : 
                                                                         bead.color === 'TURQUOISE' ? '#06B6D4' : 
                                                                         bead.color === 'GOLD' ? '#D97706' : 
                                                                         bead.color === 'PALE_GREEN' ? '#86EFAC' : '#6B7280'),
                                        backgroundImage: 'none !important'
                                      }}
                                      title={`Position ${index + 1}: ${bead.name} (${bead.color}) - DB: ${bead.colorHex || 'none'}`}
                                    >
                                      {/* Absolutely no overlay elements */}
                                    </div>
                                    
                                    {/* Enhanced remove button */}
                                    <button
                                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 hover:scale-110 transition-all duration-200 opacity-0 group-hover/bead:opacity-100 shadow-md"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        removeBead(placement.id);
                                      }}
                                      title={t('removeBead', { default: 'Remove bead' })}
                                    >
                                      ×
                                    </button>
                                    
                                    {/* Position indicator */}
                                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 bg-white px-1 rounded shadow-sm opacity-0 group-hover/bead:opacity-100 transition-opacity">
                                      {index + 1}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center justify-center text-gray-400 h-full">
                                    <div className={`w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-xs transition-all duration-200 ${
                                      isSelected ? 'border-blue-400 text-blue-500 bg-blue-50' : 'group-hover:border-blue-400 group-hover:text-blue-500'
                                    }`}>
                                      +
                                    </div>
                                  </div>
                                )}
                            </div>
                            );
                          })}
                        </div>
                        
                        {/* Enhanced empty state */}
                        {placements.length === 0 && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 pointer-events-none">
                            <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <div className="text-center">
                              <div className="font-medium">{t('emptyCanvasTitle', { default: 'Start designing your bracelet' })}</div>
                              <div className="text-xs mt-1">{t('emptyCanvasSubtitle', { default: 'Drag beads from the palette or click to place selected bead' })}</div>
                            </div>
                          </div>
                        )}
                        
                        {/* Drag feedback overlay */}
                        {isDragging && (
                          <div className="absolute inset-0 bg-blue-100 bg-opacity-30 rounded-lg flex items-center justify-center pointer-events-none">
                            <div className="bg-white px-4 py-2 rounded-lg shadow-md border border-blue-200">
                              <div className="text-sm text-blue-700 font-medium">
                                {draggedBead ? t('placeBead', { beadName: draggedBead.name, default: `Drop to place ${draggedBead.name}` }) : t('moveBead', { default: 'Drop to move bead' })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Enhanced status info */}
                      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-4">
                          {isDragging && (
                            <div className="flex items-center gap-2 text-blue-600">
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                              <span>{draggedBead ? `${draggedBead.name}` : `Position ${draggedPlacement?.position}`}</span>
                            </div>
                          )}
                          {selectedBead && (
                            <div className="flex items-center gap-2 text-green-600">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span>{t('selectedBead', { default: 'Selected bead' })}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="hidden sm:inline">{t('keyboardShortcuts', { default: 'Cmd+Z: Undo, Escape: Cancel' })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Summary */}
            <div className="lg:col-span-1 space-y-4">
              
              {/* Pattern Summary */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t('patternSummary', { default: 'Pattern Summary' })}
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">{placements.length}</div>
                        <div className="text-xs text-blue-700">{t('beadsUsed', { default: 'Beads Used' })}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-gray-600">{maxBeads}</div>
                        <div className="text-xs text-gray-700">{t('maxCapacity', { default: 'Max Capacity' })}</div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-500 ease-out"
                        style={{ width: `${Math.min((placements.length / maxBeads) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{t('progress', { default: 'Progress' })}: {Math.round((placements.length / maxBeads) * 100)}%</span>
                      <span>{maxBeads - placements.length} {t('remaining', { default: 'remaining' })}</span>
                    </div>
                    
                    {/* Specifications */}
                    <div className="pt-3 border-t border-gray-100 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('beadSize', { default: 'Bead Size' })}</span>
                        <span className="font-medium">{beadSize}mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('braceletLength', { default: 'Bracelet Length' })}</span>
                        <span className="font-medium">{braceletLength}mm</span>
                      </div>
                    </div>
                    
                    {/* Pattern Breakdown */}
                    {placements.length > 0 && (
                      <div className="pt-3 border-t border-gray-100">
                        <div className="text-sm font-medium text-gray-700 mb-2">
                          {t('beadBreakdown', { default: 'Bead Breakdown' })}
                        </div>
                        <div className="max-h-24 overflow-y-auto space-y-1">
                          {placements
                            .sort((a, b) => a.position - b.position)
                            .map((placement, idx) => {
                              const bead = beads.find(b => b.id === placement.beadId);
                              return (
                                <div key={placement.id} className="flex items-center justify-between text-xs py-1">
                                  <div className="flex items-center gap-2">
                                    <div 
                                      className="w-3 h-3 rounded-full border overflow-hidden"
                                      style={{
                                        backgroundColor: bead?.colorHex || (bead?.color === 'RED' ? '#DC2626' : 
                                                                           bead?.color === 'BLUE' ? '#2563EB' : 
                                                                           bead?.color === 'GREEN' ? '#059669' : 
                                                                           bead?.color === 'YELLOW' ? '#FBBF24' : 
                                                                           bead?.color === 'PINK' ? '#EC4899' : 
                                                                           bead?.color === 'PURPLE' ? '#7C3AED' : 
                                                                           bead?.color === 'ORANGE' ? '#EA580C' : 
                                                                           bead?.color === 'TEAL' ? '#0D9488' : 
                                                                           bead?.color === 'EMERALD' ? '#10B981' : 
                                                                           bead?.color === 'SAGE' ? '#84CC16' : 
                                                                           bead?.color === 'TURQUOISE' ? '#06B6D4' : 
                                                                           bead?.color === 'GOLD' ? '#D97706' : 
                                                                           bead?.color === 'PALE_GREEN' ? '#86EFAC' : '#6B7280'),
                                        backgroundImage: 'none !important'
                                      }}
                                    />
                                    <span className="truncate max-w-20">{bead?.name || 'Unknown'}</span>
                                  </div>
                                  <span className="text-gray-500">#{placement.position + 1}</span>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Price Summary */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    {t('priceSummary', { default: 'Price Summary' })}
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Price Display */}
                  <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      €{calculatePrice().toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {t('basedOnBeads', { 
                        count: placements.length,
                        default: `Based on ${placements.length} beads`
                      })}
                    </div>
                    {placements.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        {t('avgCostPerBead', { 
                          price: (calculatePrice() / placements.length).toFixed(2),
                          default: `Avg: €${(calculatePrice() / placements.length).toFixed(2)} per bead`
                        })}
                      </div>
                    )}
                  </div>
                  
                  {/* Cost Breakdown */}
                  {placements.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-700">{t('costBreakdown', { default: 'Cost Breakdown' })}</div>
                      <div className="max-h-20 overflow-y-auto space-y-1">
                        {Object.entries(
                          placements.reduce((acc, placement) => {
                            const bead = beads.find(b => b.id === placement.beadId);
                            if (bead) {
                              const key = `${bead.name} (${bead.color})`;
                              acc[key] = (acc[key] || 0) + 1;
                            }
                            return acc;
                          }, {} as Record<string, number>)
                        ).map(([beadName, count]) => {
                          const bead = beads.find(b => `${b.name} (${b.color})` === beadName);
                          const totalCost = bead ? (bead.priceCents * count) / 100 : 0;
                          return (
                            <div key={beadName} className="flex justify-between text-xs">
                              <span className="truncate max-w-24">{count}× {beadName.split(' (')[0]}</span>
                              <span className="font-mono">€{totalCost.toFixed(2)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* Enhanced Action Section */}
                  <div className="border-t pt-4 space-y-3">
                    {placements.length === 0 ? (
                      <div className="text-center py-4">
                        <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <div className="text-sm text-gray-500">{t('addBeadsToStart', { default: 'Add beads to start creating your bracelet' })}</div>
                      </div>
                    ) : (
                      <>
                        <div className="text-sm font-medium text-gray-700 mb-3">
                          {t('nextSteps', { default: 'Ready to complete your design?' })}
                        </div>
                        
                        <PrimaryButton 
                          className="w-full group"
                          onClick={() => {
                            // Navigate to charm selection with current bead design
                            const searchParams = new URLSearchParams({
                              type: 'beads',
                              braceletSlug: braceletSlug,
                              beadSize: beadSize.toString(),
                              braceletLength: braceletLength.toString(),
                              beadDesign: JSON.stringify(placements)
                            });
                            // Get current locale from window location
                            const currentPath = window.location.pathname;
                            const locale = currentPath.split('/')[1]; // Extract locale from path like /nl/designer
                            window.location.href = `/${locale}/designer/charms?${searchParams.toString()}`;
                          }}
                        >
                          <span className="flex items-center justify-center gap-2">
                            <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                            </svg>
                            {t('addCharms', { default: 'Add Charms' })}
                          </span>
                        </PrimaryButton>
                    
                        <SecondaryButton 
                          className="w-full group"
                          onClick={() => {
                            // Add beads-only bracelet to cart
                            const beadDetails = placements.map(placement => {
                              const bead = beads.find(b => b.id === placement.beadId);
                              return {
                                id: placement.beadId,
                                name: bead?.name || 'Unknown Bead',
                                color: bead?.color || 'UNKNOWN',
                                colorHex: bead?.colorHex || undefined,
                                position: placement.position,
                                quantity: placement.quantity
                              };
                            });

                            addToCart({
                              type: 'bracelet',
                              name: `Custom Beads Bracelet`,
                              description: `${beadSize}mm beads bracelet with ${placements.length} beads`,
                              price: calculatePrice(),
                              quantity: 1,
                              details: {
                                braceletType: 'BEADS',
                                beads: beadDetails,
                                baseConfig: {
                                  beadSize: beadSize,
                                  length: braceletLength
                                }
                              }
                            });

                            // Redirect to cart
                            window.location.href = '/cart';
                          }}
                        >
                          <span className="flex items-center justify-center gap-2">
                            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                            </svg>
                            {t('completeWithoutCharms', { default: 'Complete without Charms' })}
                          </span>
                        </SecondaryButton>
                      </>
                    )}
                    
                    {/* Back button - always visible */}
                    <SecondaryButton 
                      className="w-full"
                      onClick={() => window.history.back()}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        {t('backToConfiguration', { default: 'Back to Configuration' })}
                      </span>
                    </SecondaryButton>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
}