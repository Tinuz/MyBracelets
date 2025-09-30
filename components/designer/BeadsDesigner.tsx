"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Button";
import { LoadingSpinner, Alert, Card, CardContent, CardHeader } from "@/components/ui/Common";
import { addToCart } from "@/lib/cart";
import { getColorClass } from "@/lib/colors";

// Helper function to get bead color style
const getBeadColor = (bead: Bead): { backgroundColor: string } | { className: string } => {
  if (bead.colorHex) {
    return { backgroundColor: bead.colorHex };
  }
  // Fallback to CSS class
  return { className: getColorClass(bead.color) };
};

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
  // State
  const [beads, setBeads] = useState<Bead[]>([]);
  const [placements, setPlacements] = useState<BeadPlacement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draggedBead, setDraggedBead] = useState<Bead | null>(null);
  const [draggedPlacement, setDraggedPlacement] = useState<BeadPlacement | null>(null);
  const [dragOverPosition, setDragOverPosition] = useState<number | null>(null);

  // Calculate how many beads fit on the bracelet
  const maxBeads = Math.floor(braceletLength / (beadSize + 1)); // +1 for spacing

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

  // Handle drag start from palette
  const handleDragStart = useCallback((bead: Bead) => {
    console.log('🎯 Starting drag from palette with bead:', bead);
    setDraggedBead(bead);
    setDraggedPlacement(null);
  }, []);

  // Handle drag start from canvas (existing bead)
  const handlePlacementDragStart = useCallback((placement: BeadPlacement) => {
    console.log('🎯 Starting drag from canvas with placement:', placement);
    setDraggedPlacement(placement);
    setDraggedBead(null);
  }, []);

  // Handle drop on canvas
  const handleDrop = useCallback((position: number) => {
    console.log('🚀 Drop triggered at position:', position);
    console.log('🚀 Dragged bead:', draggedBead);
    console.log('🚀 Dragged placement:', draggedPlacement);
    
    if (draggedBead) {
      // Add new bead
      const newPlacement: BeadPlacement = {
        id: `placement-${Date.now()}`,
        beadId: draggedBead.id,
        position,
        quantity: 1
      };
      
      console.log('✨ Creating new placement:', newPlacement);
      
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
  }, [draggedBead, draggedPlacement]);

  // Remove bead from canvas
  const removeBead = useCallback((placementId: string) => {
    setPlacements(prev => prev.filter(p => p.id !== placementId));
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
              Design Your Beads Bracelet
            </h1>
            <p className="text-gray-600">
              Drag beads from the palette to create your pattern
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Beads Palette */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Beads Palette</h3>
                  <p className="text-sm text-gray-500">{beadSize}mm beads</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {beads.map((bead) => (
                      <div
                        key={bead.id}
                        className={`p-3 border-2 border-dashed rounded-lg cursor-grab active:cursor-grabbing transition-colors ${
                          draggedBead?.id === bead.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                        draggable={true}
                        onDragStart={(e) => {
                          console.log('🎯 Palette drag start event:', e);
                          e.dataTransfer.effectAllowed = 'copy';
                          e.dataTransfer.setData('text/plain', bead.id);
                          e.dataTransfer.setData('application/json', JSON.stringify(bead));
                          handleDragStart(bead);
                        }}
                        onDragEnd={(e) => {
                          console.log('🎯 Palette drag end event:', e);
                          setDraggedBead(null);
                          setDraggedPlacement(null);
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <Image
                            src={bead.imageUrl || '/images/beads/default.svg'}
                            alt={bead.name}
                            width={32}
                            height={32}
                            className="flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{bead.name}</div>
                            <div className="text-xs text-gray-500">€{(bead.priceCents / 100).toFixed(2)}</div>
                          </div>
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
                  <h3 className="text-lg font-semibold">Bracelet Canvas</h3>
                  <p className="text-sm text-gray-500">
                    Drop beads here to create your pattern (max {maxBeads} beads)
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 rounded-lg p-6">
                    {/* Bracelet Canvas */}
                    <div className="relative">
                      {/* Bracelet visualization */}
                      <div className="mb-6">
                        <div className="text-sm font-medium text-gray-700 mb-2">Bracelet Preview</div>
                        <div className="relative w-full h-8 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                          {/* Chain/cord background */}
                          <div className="absolute inset-0 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 rounded-full opacity-50"></div>
                          
                          {/* Placed beads on bracelet */}
                          <div className="flex items-center space-x-1 relative z-10">
                            {Array.from({ length: Math.min(maxBeads, 20) }, (_, index) => {
                              const placement = placements.find(p => p.position === index);
                              const bead = placement ? beads.find(b => b.id === placement.beadId) : null;
                              
                              return (
                                <div key={index} className="relative">
                                  {placement && bead ? (
                                    <div 
                                      className={`w-4 h-4 rounded-full border border-gray-400${!bead.colorHex ? ` ${getColorClass(bead.color)}` : ''}`}
                                      style={bead.colorHex ? { backgroundColor: bead.colorHex } : {}}
                                    />
                                  ) : (
                                    <div className="w-2 h-2 bg-gray-300 rounded-full" />
                                  )}
                                </div>
                              );
                            })}
                            {placements.length > 20 && (
                              <span className="text-xs text-gray-500 ml-2">+{placements.length - 20} more</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Bead positions */}
                      <div 
                        className={`flex flex-wrap gap-1 min-h-[60px] p-2 bg-white rounded-lg border-2 border-dashed transition-colors ${
                          (draggedBead || draggedPlacement) 
                            ? 'border-blue-400 bg-blue-50' 
                            : 'border-gray-200'
                        }`}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('🎯 Canvas container drag over');
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('🚀 Canvas container drop - this should not happen, drop should be on individual positions');
                        }}
                      >
                        {Array.from({ length: maxBeads }, (_, index) => {
                          const placement = placements.find(p => p.position === index);
                          const bead = placement ? beads.find(b => b.id === placement.beadId) : null;
                          
                          return (
                            <div
                              key={index}
                              className={`relative w-16 h-16 border-2 rounded-full flex items-center justify-center transition-all duration-200 ${
                                dragOverPosition === index 
                                  ? 'border-blue-500 bg-blue-100 scale-110 shadow-lg' 
                                  : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                              } ${(draggedBead || draggedPlacement) ? 'border-dashed hover:border-blue-300' : ''}`}
                              onDragOver={(e) => {
                                console.log('🎯 Drag over position:', index);
                                e.preventDefault();
                                e.stopPropagation();
                                e.dataTransfer.dropEffect = draggedPlacement ? 'move' : 'copy';
                                setDragOverPosition(index);
                                return false;
                              }}
                              onDragEnter={(e) => {
                                console.log('🎯 Drag enter position:', index);
                                e.preventDefault();
                                e.stopPropagation();
                                setDragOverPosition(index);
                                return false;
                              }}
                              onDragLeave={(e) => {
                                console.log('🎯 Drag leave position:', index);
                                // Only clear if we're actually leaving this element and its children
                                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                                  setDragOverPosition(null);
                                }
                              }}
                              onDrop={(e) => {
                                console.log('🚀 DROP EVENT FIRED at position:', index);
                                console.log('🚀 Event details:', e);
                                e.preventDefault();
                                e.stopPropagation();
                                handleDrop(index);
                                setDragOverPosition(null);
                                return false;
                              }}
                            >
                              {placement && bead ? (
                                <div
                                  className="relative cursor-move"
                                  draggable={true}
                                  onDragStart={(e) => {
                                    e.stopPropagation();
                                    e.dataTransfer.effectAllowed = 'move';
                                    e.dataTransfer.setData('text/plain', placement.id);
                                    handlePlacementDragStart(placement);
                                  }}
                                  onDragEnd={(e) => {
                                    e.preventDefault();
                                    setDraggedBead(null);
                                    setDraggedPlacement(null);
                                  }}
                                >
                                  {/* Primary color display */}
                                  <div 
                                    className={`w-10 h-10 rounded-full border-2 border-gray-300 shadow-sm${!bead.colorHex ? ` ${getColorClass(bead.color)}` : ''}`}
                                    style={bead.colorHex ? { backgroundColor: bead.colorHex } : {}}
                                    title={`${bead.name} (${bead.color})`}
                                  />
                                  {/* Optional: Small image overlay if available */}
                                  {bead.imageUrl && (
                                    <Image
                                      src={bead.imageUrl}
                                      alt={bead.name}
                                      width={20}
                                      height={20}
                                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 object-cover"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                  )}
                                  <button
                                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                                    onClick={() => removeBead(placement.id)}
                                  >
                                    ×
                                  </button>
                                </div>
                              ) : (
                                <div className="text-gray-400 text-xs text-center">
                                  {index + 1}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      
                      {placements.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
                          Drop beads here to start designing
                        </div>
                      )}
                      
                      {/* Debug info */}
                      {(draggedBead || draggedPlacement) && (
                        <div className="absolute -bottom-8 left-0 text-xs text-blue-600">
                          Dragging: {draggedBead ? `${draggedBead.name}` : `Position ${draggedPlacement?.position}`}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Pattern Summary */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Pattern Summary</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div><strong>Beads Used:</strong> {placements.length}</div>
                    <div><strong>Max Capacity:</strong> {maxBeads}</div>
                    <div><strong>Bead Size:</strong> {beadSize}mm</div>
                    <div><strong>Length:</strong> {braceletLength}mm</div>
                    
                    {/* Debug: Show placed beads */}
                    {placements.length > 0 && (
                      <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                        <div className="font-medium">Placed Beads:</div>
                        {placements.map((placement, idx) => {
                          const bead = beads.find(b => b.id === placement.beadId);
                          return (
                            <div key={placement.id} className="text-xs">
                              {idx + 1}. Pos {placement.position}: {bead?.name || 'Unknown'}
                            </div>
                          );
                        })}
                      </div>
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
                    Based on {placements.length} beads
                  </div>
                  
                  {/* Option to add charms */}
                  <div className="border-t pt-3">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      Want to add charms to your bracelet?
                    </div>
                    <PrimaryButton 
                      className="w-full mb-2"
                      disabled={placements.length === 0}
                      onClick={() => {
                        // Navigate to charm selection with current bead design
                        const searchParams = new URLSearchParams({
                          type: 'beads',
                          braceletSlug: braceletSlug,
                          beadSize: beadSize.toString(),
                          braceletLength: braceletLength.toString(),
                          beadDesign: JSON.stringify(placements)
                        });
                        window.location.href = `/designer/charms?${searchParams.toString()}`;
                      }}
                    >
                      Add Charms
                    </PrimaryButton>
                    
                    <SecondaryButton 
                      className="w-full mb-2"
                      disabled={placements.length === 0}
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
                      Complete without Charms
                    </SecondaryButton>
                  </div>
                  
                  <SecondaryButton 
                    className="w-full"
                    onClick={() => window.history.back()}
                  >
                    Back to Configuration
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