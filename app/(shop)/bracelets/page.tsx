'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/Common'
import { PrimaryButton, SecondaryButton } from '@/components/ui/Button'

interface Bracelet {
  id: string
  slug: string
  name: string
  description?: string
  basePriceCents: number
  imageUrl?: string | null
  imageUrl2?: string | null
  imageUrl3?: string | null
  svgPath: string
  lengthMm: number
  braceletType: 'CHAIN' | 'BEADS'
  thickness?: number
  color?: string
  metalType?: string
  chainType?: string
  stock: number
  featured: boolean
  active: boolean
}

export default function BraceletsPage() {
  const [bracelets, setBracelets] = useState<Bracelet[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredBracelets, setFilteredBracelets] = useState<Bracelet[]>([]);
  const [filters, setFilters] = useState({
    type: 'ALL',
    priceRange: 'ALL',
    availability: 'ALL',
    sortBy: 'FEATURED'
  });

  useEffect(() => {
    fetchBracelets();
  }, []);

  useEffect(() => {
    filterAndSortBracelets();
  }, [bracelets, filters]);

  const fetchBracelets = async () => {
    try {
      const res = await fetch('/api/bracelets');
      if (res.ok) {
        const data = await res.json();
        setBracelets(data);
      }
    } catch (error) {
      console.error('Error fetching bracelets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortBracelets = () => {
    let filtered = [...bracelets];

    // Filter by type
    if (filters.type !== 'ALL') {
      filtered = filtered.filter(b => b.braceletType === filters.type);
    }

    // Filter by price range
    if (filters.priceRange !== 'ALL') {
      const [min, max] = filters.priceRange.split('-').map(p => parseInt(p) * 100);
      filtered = filtered.filter(b => {
        if (max) {
          return b.basePriceCents >= min && b.basePriceCents <= max;
        }
        return b.basePriceCents >= min;
      });
    }

    // Filter by availability
    if (filters.availability === 'IN_STOCK') {
      filtered = filtered.filter(b => b.stock > 0);
    } else if (filters.availability === 'OUT_OF_STOCK') {
      filtered = filtered.filter(b => b.stock === 0);
    }

    // Sort
    switch (filters.sortBy) {
      case 'FEATURED':
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return a.basePriceCents - b.basePriceCents;
        });
        break;
      case 'PRICE_LOW':
        filtered.sort((a, b) => a.basePriceCents - b.basePriceCents);
        break;
      case 'PRICE_HIGH':
        filtered.sort((a, b) => b.basePriceCents - a.basePriceCents);
        break;
      case 'NAME':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFilteredBracelets(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-8"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white rounded-lg h-96"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Bracelet Collection
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our curated selection of premium bracelets. Each piece is crafted with care and available for immediate purchase or custom design.
          </p>
        </div>

        {/* Filters & Sorting */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="ALL">All Types</option>
                  <option value="CHAIN">Chain Bracelets</option>
                  <option value="BEADS">Bead Bracelets</option>
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="ALL">All Prices</option>
                  <option value="0-50">Under €50</option>
                  <option value="50-100">€50 - €100</option>
                  <option value="100-200">€100 - €200</option>
                  <option value="200">€200+</option>
                </select>
              </div>

              {/* Availability Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                <select
                  value={filters.availability}
                  onChange={(e) => setFilters({...filters, availability: e.target.value})}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="ALL">All Items</option>
                  <option value="IN_STOCK">In Stock</option>
                  <option value="OUT_OF_STOCK">Out of Stock</option>
                </select>
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="FEATURED">Featured First</option>
                <option value="PRICE_LOW">Price: Low to High</option>
                <option value="PRICE_HIGH">Price: High to Low</option>
                <option value="NAME">Name A-Z</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredBracelets.length} of {bracelets.length} bracelets
          </div>
        </div>

        {/* Products Grid */}
        {filteredBracelets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No bracelets found matching your criteria.</p>
            <SecondaryButton onClick={() => setFilters({type: 'ALL', priceRange: 'ALL', availability: 'ALL', sortBy: 'FEATURED'})}>
              Clear Filters
            </SecondaryButton>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {filteredBracelets.map((bracelet) => (
              <Card key={bracelet.slug} hover className="overflow-hidden relative group">
                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 space-y-2">
                  {bracelet.featured && (
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      ⭐ Featured
                    </span>
                  )}
                  {bracelet.stock === 0 && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Out of Stock
                    </span>
                  )}
                  {bracelet.stock > 0 && bracelet.stock <= 5 && (
                    <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Low Stock
                    </span>
                  )}
                </div>

                {/* Image Gallery */}
                <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden group">
                  <ProductImageGallery
                    images={[bracelet.imageUrl, bracelet.imageUrl2, bracelet.imageUrl3].filter((img): img is string => Boolean(img))}
                    svgPath={bracelet.svgPath}
                    name={bracelet.name}
                  />
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {bracelet.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          bracelet.braceletType === 'CHAIN' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {bracelet.braceletType}
                        </span>
                        {bracelet.color && (
                          <span className="text-xs text-gray-500">{bracelet.color}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gray-900">
                        €{(bracelet.basePriceCents / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {bracelet.description && (
                    <p className="text-sm text-gray-600 mb-3" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {bracelet.description}
                    </p>
                  )}

                  <div className="text-sm text-gray-500 space-y-1">
                    <div>Length: {bracelet.lengthMm}mm</div>
                    {bracelet.thickness && <div>Thickness: {bracelet.thickness}mm</div>}
                    <div className={`font-medium ${
                      bracelet.stock === 0 ? 'text-red-600' : 
                      bracelet.stock <= 5 ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {bracelet.stock === 0 ? 'Out of Stock' : 
                       bracelet.stock <= 5 ? `Only ${bracelet.stock} left` : 
                       `${bracelet.stock} in stock`}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <PrimaryButton 
                      className="w-full"
                      disabled={bracelet.stock === 0}
                      asChild
                    >
                      <Link href={`/designer/${bracelet.slug}`}>
                        {bracelet.stock === 0 ? 'Out of Stock' : 'Customize & Buy'}
                      </Link>
                    </PrimaryButton>
                    
                    <SecondaryButton 
                      className="w-full text-sm"
                      asChild
                    >
                      <Link href={`/bracelets/${bracelet.slug}`}>
                        View Details
                      </Link>
                    </SecondaryButton>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-white rounded-xl p-8 shadow-sm text-center">
          <h2 className="text-2xl font-bold mb-4">Need Help Choosing?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our bracelet experts are here to help you find the perfect piece. Contact us for personalized recommendations or custom designs.
          </p>
          <div className="flex justify-center gap-4">
            <PrimaryButton asChild>
              <Link href="/contact">Contact Us</Link>
            </PrimaryButton>
            <SecondaryButton asChild>
              <Link href="/#how-it-works">How It Works</Link>
            </SecondaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}

// Product Image Gallery Component
function ProductImageGallery({ images, svgPath, name }: { 
  images: string[], 
  svgPath: string, 
  name: string 
}) {
  const [currentImage, setCurrentImage] = useState(0);
  const validImages = images;

  if (validImages.length === 0) {
    // Fallback to SVG
    return (
      <svg 
        viewBox="0 0 1000 300" 
        className="w-full h-full p-4"
      >
        <path
          d={svgPath}
          fill="none"
          stroke="#d1d5db"
          strokeWidth={12}
          strokeLinecap="round"
          className="drop-shadow-sm"
        />
      </svg>
    );
  }

  return (
    <div className="relative w-full h-full">
      <img 
        src={validImages[currentImage]!} 
        alt={`${name} ${currentImage + 1}`}
        className="w-full h-full object-cover transition-opacity duration-300"
      />
      
      {validImages.length > 1 && (
        <>
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {validImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentImage(index);
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImage ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              setCurrentImage((prev) => (prev - 1 + validImages.length) % validImages.length);
            }}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ‹
          </button>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              setCurrentImage((prev) => (prev + 1) % validImages.length);
            }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}