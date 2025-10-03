"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useTranslations } from 'next-intl';
import Image from 'next/image';
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

interface Chain {
  id: string;
  name: string;
  type: ChainType;
  description: string;
  priceCents: number;
  lengthMm: number;
  thickness: number;
  metalType: MetalType;
  imageUrl?: string | null;
  svgPath?: string | null;
  active: boolean;
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
  const t = useTranslations('designer');
  
  // Refs for SVG manipulation (must be declared before any conditional returns)
  const pathRef = useRef<SVGPathElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // State
  const [bracelet, setBracelet] = useState<Bracelet | null>(null);
  const [charms, setCharms] = useState<Charm[]>([]);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [selectedCharm, setSelectedCharm] = useState<string | null>(null);
  const [draggedPlacement, setDraggedPlacement] = useState<string | null>(null);
  const [hoveredPlacement, setHoveredPlacement] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [designId, setDesignId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [canvasScale, setCanvasScale] = useState(1);
  const [canvasPan, setCanvasPan] = useState({ x: 0, y: 0 });
  const [undoStack, setUndoStack] = useState<Placement[][]>([]);
  const [redoStack, setRedoStack] = useState<Placement[][]>([]);
  const [showGrid, setShowGrid] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(true);

  // Load initial data
  useEffect(() => {
    // Skip loading if this is a beads bracelet (handled by BeadsDesigner)
    if (braceletSlug === 'beads-bracelet') return;
    
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        // Determine if this is a chain or bracelet based on config
        const isChain = config.braceletType === 'CHAIN';
        const apiEndpoint = isChain ? `/api/chains/${braceletSlug}` : `/api/bracelets/${braceletSlug}`;

        console.log('🎯 Designer Debug Info:');
        console.log('  - braceletSlug:', braceletSlug);
        console.log('  - config.braceletType:', config.braceletType);
        console.log('  - isChain:', isChain);
        console.log('  - apiEndpoint:', apiEndpoint);
        console.log('  - full config:', config);

        const [braceletRes, charmsRes] = await Promise.all([
          fetch(apiEndpoint),
          fetch('/api/charms'),
        ]);

        if (!braceletRes.ok) {
          const errorText = await braceletRes.text();
          console.error(`Failed to load ${isChain ? 'chain' : 'bracelet'}:`, errorText);
          throw new Error(`${isChain ? 'Chain' : 'Bracelet'} not found`);
        }

        if (!charmsRes.ok) {
          throw new Error('Failed to load charms');
        }

        const [braceletData, charmsData] = await Promise.all([
          braceletRes.json(),
          charmsRes.json(),
        ]);

        // For chains, we need to adapt the data structure to match Bracelet interface
        if (isChain) {
          const chainData = {
            id: braceletData.id,
            slug: braceletData.id, // Use ID as slug for chains
            name: braceletData.name,
            svgPath: braceletData.svgPath || 'M 50 100 L 550 100', // Create a simple horizontal line path for chains
            imageUrl: braceletData.imageUrl,
            lengthMm: braceletData.lengthMm || config.length || 180, // Use chain length from DB, fallback to config, then default
            basePriceCents: braceletData.priceCents,
          };
          console.log('🔗 Chain data adapted:', chainData);
          console.log('🔗 Chain lengthMm from DB:', braceletData.lengthMm, 'config.length:', config.length);
          console.log('🎯 SVG Path details:', {
            svgPath: chainData.svgPath,
            originalPath: braceletData.svgPath,
            pathLength: chainData.svgPath ? chainData.svgPath.length : 'none'
          });
          setBracelet(chainData);
        } else {
          setBracelet(braceletData);
        }
        
        setCharms(charmsData);
      } catch (err) {
        console.error('Load data error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [braceletSlug, config]);

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

  // Enhanced charm dragging with mobile support and improved precision
  const handlePointerMove = useCallback((placementId: string, event: React.PointerEvent<SVGGElement> | React.TouchEvent<SVGGElement>) => {
    if (!pathRef.current || !svgRef.current || !bracelet || !isDragging || draggedPlacement !== placementId) return;

    event.preventDefault();
    event.stopPropagation();

    const svg = svgRef.current;
    const path = pathRef.current;
    
    // Get coordinates based on event type (mouse or touch)
    let clientX: number, clientY: number;
    if ('touches' in event && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else if ('clientX' in event) {
      // Check if actually dragging for pointer events
      if ('buttons' in event && event.buttons !== 1) return;
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
      return;
    }

    // Convert screen coordinates to SVG coordinates with canvas transforms
    const rect = svg.getBoundingClientRect();
    const scaleX = 1000 / rect.width;
    const scaleY = 300 / rect.height;
    
    const svgX = ((clientX - rect.left) * scaleX - canvasPan.x) / canvasScale;
    const svgY = ((clientY - rect.top) * scaleY - canvasPan.y) / canvasScale;
    
    // Find closest point on path with improved accuracy
    const pathLength = path.getTotalLength();
    if (pathLength === 0) {
      console.warn('⚠️ SVG path has zero length, using fallback positioning');
      return { bestT: 0.5, bestDistance: 0 };
    }
    
    let bestT = 0;
    let bestDistance = Infinity;
    
    // Use adaptive sampling for better performance on mobile
    const sampleCount = window.innerWidth < 768 ? 50 : 200;
    for (let i = 0; i <= sampleCount; i++) {
      const t = i / sampleCount;
      try {
        const pathPoint = path.getPointAtLength(pathLength * t);
        const distance = Math.hypot(pathPoint.x - svgX, pathPoint.y - svgY);
        
        if (distance < bestDistance) {
          bestDistance = distance;
          bestT = t;
        }
      } catch (error) {
        console.warn('⚠️ Error sampling path point:', error);
        continue;
      }
    }

    // Snap to grid if enabled
    if (snapToGrid) {
      const gridSize = 0.1; // 10% intervals
      bestT = Math.round(bestT / gridSize) * gridSize;
    }

    // Calculate perpendicular offset with improved precision
    let pathPoint, nextPoint;
    try {
      pathPoint = path.getPointAtLength(pathLength * bestT);
      const tangentLength = Math.min(pathLength * 0.01, 5); // Adaptive tangent length
      const nextT = Math.min(1, bestT + tangentLength / pathLength);
      nextPoint = path.getPointAtLength(pathLength * nextT);
    } catch (error) {
      console.warn('⚠️ Error calculating path points:', error);
      // Use fallback positioning for chains
      const fallbackX = 50 + (bestT * 500); // Simple horizontal positioning
      pathPoint = { x: fallbackX, y: 100 };
      nextPoint = { x: fallbackX + 1, y: 100 };
    }
    
    const tangent = {
      x: nextPoint.x - pathPoint.x,
      y: nextPoint.y - pathPoint.y,
    };
    const tangentLen = Math.hypot(tangent.x, tangent.y) || 1;
    const normal = {
      x: -tangent.y / tangentLen,
      y: tangent.x / tangentLen,
    };
    
    const offset = {
      x: svgX - pathPoint.x,
      y: svgY - pathPoint.y,
    };
    
    // Calculate offset in mm with bounds checking
    const pxPerMm = pathLength / bracelet.lengthMm;
    let offsetMm = (offset.x * normal.x + offset.y * normal.y) / pxPerMm;
    
    // Limit offset to reasonable bounds
    offsetMm = Math.max(-20, Math.min(20, offsetMm));

    // Update placement with improved state management
    setPlacements(prev =>
      prev.map(p =>
        p.id === placementId ? { ...p, t: bestT, offsetMm } : p
      )
    );
  }, [bracelet, isDragging, draggedPlacement, canvasScale, canvasPan, snapToGrid]);

  // Enhanced drag & drop with mobile support and snap-to functionality
  const saveStateForUndo = useCallback(() => {
    setUndoStack(prev => [...prev.slice(-19), [...placements]]);
    setRedoStack([]);
  }, [placements]);

  const undo = useCallback(() => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      setRedoStack(prev => [placements, ...prev.slice(0, 19)]);
      setUndoStack(prev => prev.slice(0, -1));
      setPlacements(previousState);
    }
  }, [undoStack, placements]);

  const redo = useCallback(() => {
    if (redoStack.length > 0) {
      const nextState = redoStack[0];
      setUndoStack(prev => [...prev, placements]);
      setRedoStack(prev => prev.slice(1));
      setPlacements(nextState);
    }
  }, [redoStack, placements]);

  // Enhanced pointer down with state tracking
  const handlePointerDown = useCallback((placementId: string, event: React.PointerEvent<SVGGElement> | React.TouchEvent<SVGGElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    saveStateForUndo();
    setDraggedPlacement(placementId);
    setIsDragging(true);
    
    // Store initial drag offset for smoother dragging
    let clientX: number, clientY: number;
    if ('touches' in event && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else if ('clientX' in event) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
      return;
    }
    
    const svg = svgRef.current;
    if (svg) {
      const rect = svg.getBoundingClientRect();
      setDragOffset({
        x: clientX - rect.left,
        y: clientY - rect.top
      });
    }

    if ('setPointerCapture' in event.currentTarget && 'pointerId' in event) {
      (event.currentTarget as any).setPointerCapture((event as any).pointerId);
    }
  }, [saveStateForUndo]);

  // Enhanced pointer up with cleanup
  const handlePointerUp = useCallback((event?: React.PointerEvent<SVGGElement> | React.TouchEvent<SVGGElement>) => {
    setDraggedPlacement(null);
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    
    if (event && 'releasePointerCapture' in event.currentTarget && 'pointerId' in event) {
      try {
        (event.currentTarget as any).releasePointerCapture((event as any).pointerId);
      } catch (e) {
        // Ignore errors in pointer capture release
      }
    }
  }, []);

  // Zoom and pan functionality
  const handleZoom = useCallback((delta: number, centerX: number, centerY: number) => {
    const newScale = Math.max(0.5, Math.min(3, canvasScale + delta));
    const scaleFactor = newScale / canvasScale;
    
    setCanvasScale(newScale);
    setCanvasPan(prev => ({
      x: centerX - (centerX - prev.x) * scaleFactor,
      y: centerY - (centerY - prev.y) * scaleFactor
    }));
  }, [canvasScale]);

  const handleWheel = useCallback((event: React.WheelEvent) => {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      const delta = -event.deltaY * 0.001;
      const rect = svgRef.current?.getBoundingClientRect();
      if (rect) {
        handleZoom(delta, event.clientX - rect.left, event.clientY - rect.top);
      }
    }
  }, [handleZoom]);

  const resetView = useCallback(() => {
    setCanvasScale(1);
    setCanvasPan({ x: 0, y: 0 });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target && (event.target as HTMLElement).tagName === 'INPUT') return;
      
      if ((event.metaKey || event.ctrlKey)) {
        switch (event.key.toLowerCase()) {
          case 'z':
            event.preventDefault();
            if (event.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case 'y':
            event.preventDefault();
            redo();
            break;
          case '0':
            event.preventDefault();
            resetView();
            break;
        }
      }
      
      switch (event.key) {
        case 'g':
          setShowGrid(prev => !prev);
          break;
        case 's':
          setSnapToGrid(prev => !prev);
          break;
        case 'Delete':
        case 'Backspace':
          if (draggedPlacement) {
            removePlacement(draggedPlacement);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, resetView, draggedPlacement, removePlacement]);

  // Handle pointer up
  const handlePointerUpOriginal = useCallback(() => {
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
          
          {/* Enhanced Designer Canvas */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold">{bracelet.name}</h2>
                    <p className="text-gray-600">Drag charms along the bracelet path to position them</p>
                  </div>
                  
                  {/* Canvas Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={undo}
                      disabled={undoStack.length === 0}
                      className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Undo (Cmd+Z)"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={redo}
                      disabled={redoStack.length === 0}
                      className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Redo (Cmd+Shift+Z)"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                      </svg>
                    </button>
                    
                    <div className="h-4 w-px bg-gray-300" />
                    
                    <button
                      onClick={() => setShowGrid(prev => !prev)}
                      className={`p-2 transition-colors ${showGrid ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900'}`}
                      title="Toggle Grid (G)"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={() => setSnapToGrid(prev => !prev)}
                      className={`p-2 transition-colors ${snapToGrid ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900'}`}
                      title="Snap to Grid (S)"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </button>
                    
                    <div className="h-4 w-px bg-gray-300" />
                    
                    <button
                      onClick={resetView}
                      className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                      title="Reset View (Cmd+0)"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Canvas Info Bar */}
                <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>Zoom: {Math.round(canvasScale * 100)}%</span>
                    <span>Charms: {placements.length}</span>
                    {draggedPlacement && <span className="text-blue-600">Moving charm...</span>}
                  </div>
                  <div className="flex items-center space-x-2">
                    {showGrid && <span className="text-blue-600">Grid On</span>}
                    {snapToGrid && <span className="text-blue-600">Snap On</span>}
                  </div>
                </div>
                
                <div 
                  ref={containerRef}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 relative overflow-hidden shadow-inner"
                  style={{ touchAction: 'none' }}
                >
                  <svg
                    ref={svgRef}
                    viewBox={`${-canvasPan.x} ${-canvasPan.y} ${1000 / canvasScale} ${300 / canvasScale}`}
                    className="w-full h-[400px] md:h-[500px] touch-none cursor-grab active:cursor-grabbing"
                    style={{ 
                      maxHeight: '500px',
                      filter: `drop-shadow(0 4px 6px rgb(0 0 0 / 0.1))` 
                    }}
                    onWheel={handleWheel}
                  >
                    {/* Definitions for gradients and patterns */}
                    <defs>
                      <linearGradient id="braceletGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#d97706" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
                      </linearGradient>
                      
                      <filter id="charmShadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.3"/>
                      </filter>
                      
                      <filter id="charmGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                        <feMerge> 
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Grid overlay */}
                    {showGrid && (
                      <g opacity="0.3">
                        {Array.from({ length: 11 }, (_, i) => (
                          <line
                            key={`v-${i}`}
                            x1={i * 100}
                            y1="0"
                            x2={i * 100}
                            y2="300"
                            stroke="#6b7280"
                            strokeWidth="0.5"
                            strokeDasharray="2,2"
                          />
                        ))}
                        {Array.from({ length: 4 }, (_, i) => (
                          <line
                            key={`h-${i}`}
                            x1="0"
                            y1={i * 75}
                            x2="1000"
                            y2={i * 75}
                            stroke="#6b7280"
                            strokeWidth="0.5"
                            strokeDasharray="2,2"
                          />
                        ))}
                      </g>
                    )}

                    {/* Background image with enhanced rendering */}
                    {bracelet.imageUrl && (
                      <g>
                        <image
                          href={bracelet.imageUrl}
                          x="0"
                          y="0"
                          width="1000"
                          height="300"
                          preserveAspectRatio="xMidYMid slice"
                          className="opacity-90"
                        />
                        {/* Overlay for better contrast */}
                        <rect
                          x="0"
                          y="0"
                          width="1000"
                          height="300"
                          fill="url(#braceletGradient)"
                          opacity="0.1"
                        />
                      </g>
                    )}
                    
                    {/* Enhanced bracelet path */}
                    <path
                      ref={pathRef}
                      d={bracelet.svgPath}
                      fill="none"
                      stroke={bracelet.imageUrl ? "#8b5a2b" : "url(#braceletGradient)"}
                      strokeWidth={bracelet.imageUrl ? 4 : 8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="none"
                      className="transition-all duration-200"
                      style={{ 
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                        opacity: bracelet.imageUrl ? 0.8 : 1
                      }}
                    />
                    
                    {/* Path markers for visual reference */}
                    {!bracelet.imageUrl && pathRef.current && (
                      <g opacity="0.4">
                        {Array.from({ length: 21 }, (_, i) => {
                          const t = i / 20;
                          const point = pathRef.current!.getPointAtLength(pathRef.current!.getTotalLength() * t);
                          return (
                            <circle
                              key={`marker-${i}`}
                              cx={point.x}
                              cy={point.y}
                              r="2"
                              fill="#6b7280"
                            />
                          );
                        })}
                      </g>
                    )}
                    
                    {/* Enhanced placed charms with improved interactions */}
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

                      const isDragged = draggedPlacement === placement.id;
                      const isHovered = hoveredPlacement === placement.id;
                      
                      return (
                        <g key={placement.id}>
                          {/* Charm connection line to path */}
                          {(isDragged || isHovered) && Math.abs(placement.offsetMm) > 2 && (
                            <line
                              x1={pathPoint.x}
                              y1={pathPoint.y}
                              x2={x}
                              y2={y}
                              stroke="#3b82f6"
                              strokeWidth="1"
                              strokeDasharray="3,3"
                              opacity="0.6"
                            />
                          )}
                          
                          {/* Charm group */}
                          <g
                            transform={`translate(${x},${y}) rotate(${placement.rotationDeg}) scale(${isDragged ? 1.1 : isHovered ? 1.05 : 1})`}
                            style={{ 
                              cursor: isDragged ? 'grabbing' : 'grab',
                              transformOrigin: 'center'
                            }}
                            className={`transition-all duration-200 ${isDragged ? 'drop-shadow-xl' : 'hover:drop-shadow-lg'}`}
                            onPointerDown={(e) => handlePointerDown(placement.id, e)}
                            onPointerMove={(e) => handlePointerMove(placement.id, e)}
                            onPointerUp={handlePointerUp}
                            onPointerEnter={() => setHoveredPlacement(placement.id)}
                            onPointerLeave={() => setHoveredPlacement(null)}
                            onTouchStart={(e) => handlePointerDown(placement.id, e)}
                            onTouchMove={(e) => handlePointerMove(placement.id, e)}
                            onTouchEnd={() => handlePointerUp()}
                          >
                            {/* Selection/hover ring */}
                            {(isDragged || isHovered) && (
                              <circle
                                r="28"
                                fill="none"
                                stroke={isDragged ? "#3b82f6" : "#6b7280"}
                                strokeWidth="2"
                                strokeDasharray="4,2"
                                opacity="0.7"
                                className={isDragged ? "animate-pulse" : ""}
                              />
                            )}
                            
                            {/* Charm visual */}
                            {charm.imageUrl ? (
                              <image
                                href={charm.imageUrl}
                                x="-20"
                                y="-20"
                                width="40"
                                height="40"
                                preserveAspectRatio="xMidYMid meet"
                                filter={isDragged ? "url(#charmGlow)" : "url(#charmShadow)"}
                              />
                            ) : charm.svg ? (
                              <g
                                dangerouslySetInnerHTML={{ __html: charm.svg }}
                                style={{ 
                                  transform: 'scale(2)',
                                  filter: isDragged ? "url(#charmGlow)" : "url(#charmShadow)"
                                }}
                              />
                            ) : (
                              <circle
                                r="15"
                                fill={isDragged ? "#3b82f6" : "#6366f1"}
                                stroke="#1e40af"
                                strokeWidth="2"
                                filter="url(#charmShadow)"
                              />
                            )}
                            
                            {/* Quantity indicator */}
                            {placement.quantity > 1 && (
                              <g transform="translate(20, -20)">
                                <circle
                                  r="8"
                                  fill="#ef4444"
                                  stroke="#fff"
                                  strokeWidth="2"
                                />
                                <text
                                  x="0"
                                  y="0"
                                  textAnchor="middle"
                                  dominantBaseline="central"
                                  fill="white"
                                  fontSize="10"
                                  fontWeight="bold"
                                >
                                  {placement.quantity}
                                </text>
                              </g>
                            )}
                            
                            {/* Delete button for hovered/selected charms */}
                            {(isDragged || isHovered) && (
                              <g transform="translate(22, -22)">
                                <circle
                                  r="8"
                                  fill="#ef4444"
                                  stroke="#fff"
                                  strokeWidth="2"
                                  className="cursor-pointer hover:fill-red-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removePlacement(placement.id);
                                  }}
                                />
                                <text
                                  x="0"
                                  y="0"
                                  textAnchor="middle"
                                  dominantBaseline="central"
                                  fill="white"
                                  fontSize="10"
                                  fontWeight="bold"
                                  className="pointer-events-none"
                                >
                                  ×
                                </text>
                              </g>
                            )}
                          </g>
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
                      <div className="flex items-center justify-center h-12 mb-2 relative">
                        {charm.imageUrl ? (
                          <div className="relative w-10 h-10">
                            <Image 
                              src={charm.imageUrl} 
                              alt={charm.name}
                              fill
                              sizes="40px"
                              className="object-contain"
                            />
                          </div>
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