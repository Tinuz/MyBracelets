"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LoadingSpinner, Alert } from "@/components/ui/Common";
import CharmonBeadsDesigner from "@/components/designer/CharmonBeadsDesigner";

interface BeadPlacement {
  id: string;
  beadId: string;
  position: number;
  quantity: number;
}

function CharmonDesignerContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [beadDesign, setBeadDesign] = useState<BeadPlacement[]>([]);

  // Extract parameters
  const type = searchParams.get('type');
  const braceletSlug = searchParams.get('braceletSlug');
  const beadSize = searchParams.get('beadSize');
  const braceletLength = searchParams.get('braceletLength');
  const beadDesignParam = searchParams.get('beadDesign');

  useEffect(() => {
    try {
      setLoading(true);
      
      // Validate required parameters
      if (!type || !braceletSlug || !beadSize || !braceletLength) {
        throw new Error('Missing required parameters');
      }

      // Parse bead design if provided
      if (beadDesignParam) {
        const parsedDesign = JSON.parse(beadDesignParam);
        setBeadDesign(parsedDesign);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error loading charm designer:', err);
      setError('Failed to load charm designer');
      setLoading(false);
    }
  }, [type, braceletSlug, beadSize, braceletLength, beadDesignParam]);

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

  if (type !== 'beads' || !braceletSlug || !beadSize || !braceletLength) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Alert variant="error">Invalid parameters for charm selection</Alert>
      </div>
    );
  }

  return (
    <CharmonBeadsDesigner
      braceletSlug={braceletSlug}
      beadSize={parseInt(beadSize)}
      braceletLength={parseInt(braceletLength)}
      beadDesign={beadDesign}
    />
  );
}

export default function CharmonDesignerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    }>
      <CharmonDesignerContent />
    </Suspense>
  );
}