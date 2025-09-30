"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Button";
import { LoadingSpinner, Alert, Card, CardContent, CardHeader } from "@/components/ui/Common";
import { addToCart } from "@/lib/cart";

// Types
interface Charm {
  id: string;
  sku: string;
  name: string;
  priceCents: number;
  widthMm: number;
  heightMm: number;
  anchorPoint: string | null;
  maxPerBracelet: number;
  stock: number;
  svg: string | null;
  imageUrl: string | null;
}

interface BeadPlacement {
  id: string;
  beadId: string;
  position: number;
  quantity: number;
}

interface Bead {
  id: string;
  color: string;
  colorHex?: string | null;
  name: string;
  priceCents: number;
  diameterMm: number;
  imageUrl?: string | null;
}

interface CharmPlacement {
  id: string;
  charmId: string;
  position: number; // Position on the bracelet
}

interface CharmonBeadsDesignerProps {
  braceletSlug: string;
  beadSize: number;
  braceletLength: number;
  beadDesign: BeadPlacement[];
}

export default function CharmonBeadsDesigner({ 
  braceletSlug, 
  beadSize, 
  braceletLength, 
  beadDesign 
}: CharmonBeadsDesignerProps) {
  // State
  const [charms, setCharms] = useState<Charm[]>([]);
  const [beads, setBeads] = useState<Bead[]>([]);
  const [charmPlacements, setCharmPlacements] = useState<CharmPlacement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draggedCharm, setDraggedCharm] = useState<Charm | null>(null);
  const [dragOverPosition, setDragOverPosition] = useState<number | null>(null);

  // Calculate available positions (between beads and at ends)
  const maxBeads = Math.floor(braceletLength / (beadSize + 1));
  const availableCharmPositions = maxBeads + 1; // Between each bead + at the ends

  // Load charms and beads on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load charms
        const charmsResponse = await fetch('/api/charms');
        if (!charmsResponse.ok) {
          throw new Error('Failed to load charms');
        }
        const charmsData = await charmsResponse.json();
        console.log('🎯 Loaded charms data:', charmsData);
        setCharms(charmsData); // Already filtered by API for active charms

        // Load beads for reference
        const beadsResponse = await fetch('/api/beads');
        if (!beadsResponse.ok) {
          throw new Error('Failed to load beads');
        }
        const beadsData = await beadsResponse.json();
        const filteredBeads = beadsData.filter((bead: Bead) => bead.diameterMm === beadSize);
        setBeads(filteredBeads);

      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load charms and beads');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [beadSize]);

  // Handle drag start from palette
  const handleDragStart = useCallback((charm: Charm) => {
    console.log('🎯 Starting drag with charm:', charm);
    setDraggedCharm(charm);
  }, []);

  // Handle drop on charm position
  const handleDrop = useCallback((position: number) => {
    console.log('🚀 Drop triggered at charm position:', position);
    
    if (draggedCharm) {
      const newPlacement: CharmPlacement = {
        id: `charm-placement-${Date.now()}`,
        charmId: draggedCharm.id,
        position
      };
      
      setCharmPlacements(prev => {
        // Remove any existing charm at this position
        const filtered = prev.filter(p => p.position !== position);
        const updated = [...filtered, newPlacement];
        console.log('✅ Updated charm placements:', updated);
        return updated;
      });
    }
    
    setDraggedCharm(null);
  }, [draggedCharm]);

  // Remove charm from bracelet
  const removeCharm = useCallback((placementId: string) => {
    setCharmPlacements(prev => prev.filter(p => p.id !== placementId));
  }, []);

  // Calculate total price (beads + charms)
  const calculateTotalPrice = () => {
    const beadCosts = beadDesign.reduce((total, placement) => {
      const bead = beads.find(b => b.id === placement.beadId);
      return total + (bead ? bead.priceCents * placement.quantity : 0);
    }, 0);
    
    const charmCosts = charmPlacements.reduce((total, placement) => {
      const charm = charms.find(c => c.id === placement.charmId);
      return total + (charm ? charm.priceCents : 0);
    }, 0);
    
    return (beadCosts + charmCosts) / 100; // Convert cents to euros
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
              Add Charms to Your Beads Bracelet
            </h1>
            <p className="text-gray-600">
              Drag charms to add them between your beads
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Charms Palette */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Charms Palette</h3>
                  <p className="text-sm text-gray-500">Available charms</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {charms.map((charm) => (
                      <div
                        key={charm.id}
                        className={`p-3 border-2 border-dashed rounded-lg cursor-grab active:cursor-grabbing transition-colors ${
                          draggedCharm?.id === charm.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                        draggable={true}
                        onDragStart={(e) => {
                          e.dataTransfer.effectAllowed = 'copy';
                          e.dataTransfer.setData('text/plain', charm.id);
                          handleDragStart(charm);
                        }}
                        onDragEnd={() => {
                          setDraggedCharm(null);
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          {charm.imageUrl ? (
                            <Image
                              src={charm.imageUrl}
                              alt={charm.name}
                              width={32}
                              height={32}
                              className="flex-shrink-0"
                              onError={(e) => {
                                console.log('Image failed to load for charm:', charm.name);
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                              {charm.name.charAt(0)}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{charm.name}</div>
                            <div className="text-xs text-gray-500">€{(charm.priceCents / 100).toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bracelet Canvas */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Bracelet with Beads & Charms</h3>
                  <p className="text-sm text-gray-500">
                    Your bead pattern with charm positions
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 rounded-lg p-6">
                    
                    {/* Bracelet Visualization */}
                    <div className="mb-6">
                      <div className="text-sm font-medium text-gray-700 mb-2">Complete Bracelet Preview</div>
                      <div className="relative w-full h-8 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 rounded-full opacity-50"></div>
                        
                        {/* Combined beads and charms */}
                        <div className="flex items-center space-x-1 relative z-10">
                          {Array.from({ length: Math.min(maxBeads, 15) }, (_, index) => {
                            const beadPlacement = beadDesign.find(p => p.position === index);
                            const bead = beadPlacement ? beads.find(b => b.id === beadPlacement.beadId) : null;
                            const charmPlacement = charmPlacements.find(p => p.position === index);
                            
                            return (
                              <div key={index} className="flex items-center space-x-1">
                                {/* Charm before bead */}
                                {charmPlacement && (
                                  <div className="w-2 h-4 bg-yellow-500 rounded-sm" />
                                )}
                                
                                {/* Bead */}
                                {beadPlacement && bead ? (
                                  <div className={`w-4 h-4 rounded-full border border-gray-400 ${
                                    bead.color === 'RED' ? 'bg-red-500' :
                                    bead.color === 'BLUE' ? 'bg-blue-500' :
                                    bead.color === 'YELLOW' ? 'bg-yellow-500' :
                                    bead.color === 'GREEN' ? 'bg-green-500' :
                                    bead.color === 'GOLD' ? 'bg-yellow-400' :
                                    'bg-gray-500'
                                  }`} />
                                ) : (
                                  <div className="w-2 h-2 bg-gray-300 rounded-full" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    
                    {/* Charm Drop Zones */}
                    <div className="space-y-4">
                      <div className="text-sm font-medium text-gray-700">Charm Positions</div>
                      <div className="grid grid-cols-6 gap-2">
                        {Array.from({ length: Math.min(availableCharmPositions, 18) }, (_, index) => {
                          const charmPlacement = charmPlacements.find(p => p.position === index);
                          const charm = charmPlacement ? charms.find(c => c.id === charmPlacement.charmId) : null;
                          
                          return (
                            <div
                              key={index}
                              className={`relative w-16 h-16 border-2 rounded-lg flex items-center justify-center transition-all duration-200 ${
                                dragOverPosition === index 
                                  ? 'border-blue-500 bg-blue-100 scale-110 shadow-lg' 
                                  : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                              } ${draggedCharm ? 'border-dashed hover:border-blue-300' : ''}`}
                              onDragOver={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setDragOverPosition(index);
                                return false;
                              }}
                              onDragEnter={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setDragOverPosition(index);
                                return false;
                              }}
                              onDragLeave={(e) => {
                                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                                  setDragOverPosition(null);
                                }
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDrop(index);
                                setDragOverPosition(null);
                                return false;
                              }}
                            >
                              {charmPlacement && charm ? (
                                <div className="relative">
                                  {charm.imageUrl ? (
                                    <Image
                                      src={charm.imageUrl}
                                      alt={charm.name}
                                      width={40}
                                      height={40}
                                      className="object-cover rounded-lg"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                  ) : (
                                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center text-white text-lg font-bold">
                                      {charm.name.charAt(0)}
                                    </div>
                                  )}
                                  <button
                                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                                    onClick={() => removeCharm(charmPlacement.id)}
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Design Summary */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Design Summary</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div><strong>Beads:</strong> {beadDesign.length}</div>
                    <div><strong>Charms:</strong> {charmPlacements.length}</div>
                    <div><strong>Bead Size:</strong> {beadSize}mm</div>
                    <div><strong>Length:</strong> {braceletLength}mm</div>
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
                    €{calculateTotalPrice().toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {beadDesign.length} beads + {charmPlacements.length} charms
                  </div>
                  
                  <PrimaryButton 
                    className="w-full"
                    onClick={() => {
                      // Prepare bead details
                      const beadDetails = beadDesign.map(placement => {
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

                      // Prepare charm details
                      const charmDetails = charmPlacements.map(placement => {
                        const charm = charms.find(c => c.id === placement.charmId);
                        return {
                          id: placement.charmId,
                          name: charm?.name || 'Unknown Charm',
                          position: placement.position
                        };
                      });

                      addToCart({
                        type: 'bracelet',
                        name: `Custom Beads & Charms Bracelet`,
                        description: `${beadSize}mm beads bracelet with ${beadDesign.length} beads and ${charmPlacements.length} charms`,
                        price: calculateTotalPrice(),
                        quantity: 1,
                        details: {
                          braceletType: 'BEADS',
                          beads: beadDetails,
                          charms: charmDetails,
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
                    Add to Cart
                  </PrimaryButton>
                  
                  <SecondaryButton 
                    className="w-full"
                    onClick={() => window.history.back()}
                  >
                    Back to Beads Designer
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