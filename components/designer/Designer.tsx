"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Button, { PrimaryButton, SecondaryButton } from "@/components/ui/Button";
import { LoadingSpinner, Alert, Card, CardContent, CardHeader } from "@/components/ui/Common";
import { addToCart } from "@/lib/cart";

// Types
interface Charm {
  id: string;
  name: string;
  priceCents: number;
  widthMm: number;
  heightMm: number;
  imageUrl?: string | null;
  svg?: string | null;
  maxPerBracelet: number;
  stock: number;
}

interface Bracelet {
  id: string;
  slug: string;
  name: string;
  svgPath: string;
  imageUrl?: string | null;
  lengthMm: number;
  basePriceCents: number;
}

interface Placement {
  id: string;
  charmId: string;
  t: number;
  offsetMm: number;
  rotationDeg: number;
  zIndex: number;
  quantity: number;
}

// Import config types
type BraceletType = 'CHAIN' | 'BEADS';
type MetalType = 'GOLD' | 'SILVER' | 'ROSE_GOLD' | 'WHITE_GOLD' | 'PLATINUM' | 'STAINLESS_STEEL';
type ChainType = 'CABLE' | 'CURB' | 'FIGARO' | 'ROPE' | 'BOX' | 'SNAKE' | 'HERRINGBONE' | 'BYZANTINE';
type BeadSize = 2.0 | 4.0 | 6.0;

interface BraceletConfig {
  braceletType: BraceletType;
  thickness: number;
  length: number;
  color: string;
  metalType?: MetalType;
  chainType?: ChainType;
  beadSize?: BeadSize;
}

interface DesignerProps {
  braceletSlug: string;
  config: BraceletConfig;
}

// Import BeadsDesigner for beads bracelets
import BeadsDesigner from './BeadsDesigner';

export default function Designer({ braceletSlug, config }: DesignerProps) {
  // Refs for SVG manipulation (must be declared before any conditional returns)
  const pathRef = useRef<SVGPathElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  
  // State
  const [bracelet, setBracelet] = useState<Bracelet | null>(null);
  const [charms, setCharms] = useState<Charm[]>([]);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [selectedCharm, setSelectedCharm] = useState<string | null>(null);
  const [draggedPlacement, setDraggedPlacement] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [designId, setDesignId] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    // Skip loading if this is a beads bracelet (handled by BeadsDesigner)
    if (braceletSlug === 'beads-bracelet') return;
    
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const [braceletRes, charmsRes] = await Promise.all([
          fetch(`/api/bracelets/${braceletSlug}`),
          fetch('/api/charms'),
        ]);

        if (!braceletRes.ok) {
          throw new Error('Bracelet not found');
        }

        if (!charmsRes.ok) {
          throw new Error('Failed to load charms');
        }

        const [braceletData, charmsData] = await Promise.all([
          braceletRes.json(),
          charmsRes.json(),
        ]);

        setBracelet(braceletData);
        setCharms(charmsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [braceletSlug]);

  // Calculate total price with discounts
  const pricing = useMemo(() => {
    if (!bracelet) return { subtotal: 0, discount: 0, total: 0, charmCount: 0 };

    const charmCosts = placements.reduce((acc, placement) => {
      const charm = charms.find(c => c.id === placement.charmId);
      return acc + (charm?.priceCents || 0) * placement.quantity;
    }, 0);

    const charmCount = placements.reduce((acc, p) => acc + p.quantity, 0);
    const subtotal = bracelet.basePriceCents + charmCosts;
    
    // Apply discounts
    let discountRate = 0;
    if (charmCount >= 10) discountRate = 0.1;
    else if (charmCount >= 5) discountRate = 0.05;
    
    const discount = Math.floor(subtotal * discountRate);
    const total = subtotal - discount;

    return { subtotal, discount, total, charmCount };
  }, [bracelet, charms, placements]);

  // Add charm to design
  const addCharm = useCallback((charmId: string) => {
    const charm = charms.find(c => c.id === charmId);
    if (!charm) return;

    const currentCount = placements.filter(p => p.charmId === charmId).reduce((acc, p) => acc + p.quantity, 0);
    if (currentCount >= charm.maxPerBracelet) {
      setError(`Maximum ${charm.maxPerBracelet} ${charm.name} charms allowed per bracelet`);
      return;
    }

    const newPlacement: Placement = {
      id: crypto.randomUUID(),
      charmId,
      t: 0.5, // Start in the middle
      offsetMm: 0,
      rotationDeg: 0,
      zIndex: placements.length,
      quantity: 1,
    };

    setPlacements(prev => [...prev, newPlacement]);
    setError(null);
  }, [charms, placements]);

  // Remove placement
  const removePlacement = useCallback((placementId: string) => {
    setPlacements(prev => prev.filter(p => p.id !== placementId));
  }, []);

  // Handle charm dragging along path
  const handlePointerMove = useCallback((placementId: string, event: React.PointerEvent<SVGGElement>) => {
    if (event.buttons !== 1 || !pathRef.current || !svgRef.current || !bracelet) return;

    const svg = svgRef.current;
    const path = pathRef.current;
    
    // Convert screen coordinates to SVG coordinates
    const pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    
    const svgPoint = pt.matrixTransform(ctm.inverse());
    
    // Find closest point on path
    const pathLength = path.getTotalLength();
    let bestT = 0;
    let bestDistance = Infinity;
    
    // Sample points along path to find closest
    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      const pathPoint = path.getPointAtLength(pathLength * t);
      const distance = Math.hypot(pathPoint.x - svgPoint.x, pathPoint.y - svgPoint.y);
      
      if (distance < bestDistance) {
        bestDistance = distance;
        bestT = t;
      }
    }
    
    // Calculate offset from path
    const pathPoint = path.getPointAtLength(pathLength * bestT);
    const nextPoint = path.getPointAtLength(Math.min(pathLength, pathLength * bestT + 1));
    
    // Calculate normal vector
    const tangent = {
      x: nextPoint.x - pathPoint.x,
      y: nextPoint.y - pathPoint.y,
    };
    const tangentLength = Math.hypot(tangent.x, tangent.y) || 1;
    const normal = {
      x: -tangent.y / tangentLength,
      y: tangent.x / tangentLength,
    };
    
    // Calculate signed offset
    const toPoint = {
      x: svgPoint.x - pathPoint.x,
      y: svgPoint.y - pathPoint.y,
    };
    const offsetPx = toPoint.x * normal.x + toPoint.y * normal.y;
    
    // Convert to millimeters
    const pxPerMm = pathLength / bracelet.lengthMm;
    const offsetMm = Math.max(-50, Math.min(50, offsetPx / pxPerMm));
    
    // Update placement
    setPlacements(prev =>
      prev.map(p =>
        p.id === placementId ? { ...p, t: bestT, offsetMm } : p
      )
    );
  }, [bracelet]);

  // Handle pointer down for dragging
  const handlePointerDown = useCallback((placementId: string, event: React.PointerEvent<SVGGElement>) => {
    event.preventDefault();
    setDraggedPlacement(placementId);
    (event.currentTarget as any).setPointerCapture(event.pointerId);
  }, []);

  // Handle pointer up
  const handlePointerUp = useCallback(() => {
    setDraggedPlacement(null);
  }, []);

  // Save design
  const saveDesign = useCallback(async () => {
    if (!bracelet) return;
    
    setSaving(true);
    setError(null);
    
    try {
      const response = await fetch('/api/designs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          braceletSlug,
          placements: placements.map(p => ({
            charmId: p.charmId,
            t: p.t,
            offsetMm: p.offsetMm,
            rotationDeg: p.rotationDeg,
            zIndex: p.zIndex,
            quantity: p.quantity,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save design');
      }

      const result = await response.json();
      setDesignId(result.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save design');
    } finally {
      setSaving(false);
    }
  }, [bracelet, braceletSlug, placements]);

  // Add to Cart
  const handleAddToCart = useCallback(() => {
    if (!bracelet || placements.length === 0) {
      setError('Please add at least one charm to your bracelet');
      return;
    }
    
    try {
      // Prepare charm details
      const charmDetails = placements.map(placement => {
        const charm = charms.find(c => c.id === placement.charmId);
        return {
          id: placement.charmId,
          name: charm?.name || 'Unknown Charm',
          position: placement.t,
          quantity: placement.quantity
        };
      });

      // Add chain bracelet to cart
      addToCart({
        type: 'bracelet',
        name: `${bracelet.name} Chain Bracelet`,
        description: `Custom chain bracelet with ${pricing.charmCount} charm${pricing.charmCount !== 1 ? 's' : ''}`,
        price: pricing.total / 100, // Convert from cents to euros
        quantity: 1,
        details: {
          braceletType: 'CHAIN',
          charms: charmDetails,
          baseConfig: {
            length: bracelet.lengthMm,
            metalType: 'SILVER', // Default metal type
            chainType: 'CABLE'   // Default chain type
          }
        }
      });

      // Redirect to cart
      window.location.href = '/cart';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to cart');
    }
  }, [bracelet, charms, placements, pricing]);

  // Check if this is a beads bracelet (after all hooks are declared)
  if (braceletSlug === 'beads-bracelet') {
    return (
      <BeadsDesigner 
        braceletSlug={braceletSlug} 
        beadSize={config.beadSize || 4.0} 
        braceletLength={config.length}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!bracelet) {
    return (
      <div className="p-6">
        <Alert variant="error">Bracelet not found</Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Designer Canvas */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">{bracelet.name}</h2>
                <p className="text-gray-600">Drag charms along the bracelet path to position them</p>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-lg p-4 relative">
                  <svg
                    ref={svgRef}
                    viewBox="0 0 1000 300"
                    className="w-full h-[400px] touch-none"
                    style={{ maxHeight: '400px' }}
                  >
                    {/* Background image as a separate image element if available */}
                    {bracelet.imageUrl && (
                      <image
                        href={bracelet.imageUrl}
                        x="0"
                        y="0"
                        width="1000"
                        height="300"
                        preserveAspectRatio="xMidYMid slice"
                        className="opacity-90"
                      />
                    )}
                    
                    {/* Bracelet path - just as stroke overlay when image is present */}
                    <path
                      ref={pathRef}
                      d={bracelet.svgPath}
                      fill="none"
                      stroke={bracelet.imageUrl ? "#8b5a2b" : "#d1d5db"}
                      strokeWidth={bracelet.imageUrl ? 3 : 6}
                      className="drop-shadow-sm"
                      style={bracelet.imageUrl ? { opacity: 0.7 } : {}}
                    />
                    
                    {/* Placed charms */}
                    {placements.map(placement => {
                      if (!pathRef.current || !bracelet) return null;
                      
                      const pathLength = pathRef.current.getTotalLength();
                      const pathPoint = pathRef.current.getPointAtLength(pathLength * placement.t);
                      const nextPoint = pathRef.current.getPointAtLength(Math.min(pathLength, pathLength * placement.t + 1));
                      
                      // Calculate position with offset
                      const tangent = {
                        x: nextPoint.x - pathPoint.x,
                        y: nextPoint.y - pathPoint.y,
                      };
                      const tangentLength = Math.hypot(tangent.x, tangent.y) || 1;
                      const normal = {
                        x: -tangent.y / tangentLength,
                        y: tangent.x / tangentLength,
                      };
                      
                      const pxPerMm = pathLength / bracelet.lengthMm;
                      const x = pathPoint.x + normal.x * (placement.offsetMm * pxPerMm);
                      const y = pathPoint.y + normal.y * (placement.offsetMm * pxPerMm);
                      
                      const charm = charms.find(c => c.id === placement.charmId);
                      if (!charm) return null;
                      
                      return (
                        <g
                          key={placement.id}
                          transform={`translate(${x},${y}) rotate(${placement.rotationDeg})`}
                          style={{ cursor: 'grab', zIndex: placement.zIndex }}
                          onPointerDown={(e) => handlePointerDown(placement.id, e)}
                          onPointerMove={(e) => handlePointerMove(placement.id, e)}
                          onPointerUp={handlePointerUp}
                          className="hover:drop-shadow-lg transition-all"
                        >
                          {charm.imageUrl ? (
                            <image
                              href={charm.imageUrl}
                              x="-20"
                              y="-20"
                              width="128"
                              height="128"
                              preserveAspectRatio="xMidYMid meet"
                            />
                          ) : charm.svg ? (
                            <g
                              dangerouslySetInnerHTML={{ __html: charm.svg }}
                              style={{ transform: 'scale(1.8)' }}
                            />
                          ) : (
                            <circle
                              r="12"
                              fill="#3b82f6"
                              stroke="#1e40af"
                              strokeWidth="2"
                            />
                          )}
                          
                          {/* Quantity indicator */}
                          {placement.quantity > 1 && (
                            <circle cx="18" cy="-18" r="10" fill="#ef4444">
                              <title>{placement.quantity}x</title>
                            </circle>
                          )}
                          
                          {/* Delete button on hover */}
                          <circle
                            cx="18"
                            cy="18"
                            r="8"
                            fill="#ef4444"
                            className="opacity-0 hover:opacity-100 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              removePlacement(placement.id);
                            }}
                          >
                            <title>Remove charm</title>
                          </circle>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Error Alert */}
            {error && (
              <Alert variant="error">
                {error}
              </Alert>
            )}
            
            {/* Charms */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Available Charms</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {charms.map(charm => (
                    <button
                      key={charm.id}
                      className="p-3 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                      onClick={() => addCharm(charm.id)}
                      disabled={charm.stock === 0}
                    >
                      <div className="flex items-center justify-center h-12 mb-2">
                        {charm.imageUrl ? (
                          <img 
                            src={charm.imageUrl} 
                            alt={charm.name}
                            className="w-10 h-10 object-contain"
                          />
                        ) : charm.svg ? (
                          <div dangerouslySetInnerHTML={{ __html: charm.svg }} />
                        ) : (
                          <div className="w-8 h-8 bg-blue-500 rounded-full" />
                        )}
                      </div>
                      <div className="text-sm font-medium">{charm.name}</div>
                      <div className="text-xs text-gray-500">
                        €{(charm.priceCents / 100).toFixed(2)}
                      </div>
                      {charm.stock === 0 && (
                        <div className="text-xs text-red-500 mt-1">Out of stock</div>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Order Summary</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Base bracelet:</span>
                  <span>€{(bracelet.basePriceCents / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Charms ({pricing.charmCount}):</span>
                  <span>€{((pricing.subtotal - bracelet.basePriceCents) / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>€{(pricing.subtotal / 100).toFixed(2)}</span>
                </div>
                {pricing.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({pricing.charmCount >= 10 ? '10%' : '5%'}):</span>
                    <span>-€{(pricing.discount / 100).toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>€{(pricing.total / 100).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="space-y-3">
                <PrimaryButton
                  className="w-full"
                  onClick={saveDesign}
                  disabled={saving || placements.length === 0}
                >
                  {saving ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Saving...
                    </>
                  ) : (
                    'Save Design'
                  )}
                </PrimaryButton>
                
                <SecondaryButton
                  className="w-full"
                  onClick={handleAddToCart}
                  disabled={placements.length === 0}
                >
                  Add to Cart
                </SecondaryButton>
                
                {placements.length > 0 && (
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => setPlacements([])}
                  >
                    Clear All Charms
                  </Button>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}