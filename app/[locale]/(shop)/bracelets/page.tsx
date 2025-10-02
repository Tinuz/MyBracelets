'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/Common'
import { PrimaryButton, SecondaryButton } from '@/components/ui/Button'
import { useTranslations, useLocale } from 'next-intl'

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
  const t = useTranslations('bracelets');
  const locale = useLocale();
  
  const [bracelets, setBracelets] = useState<Bracelet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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
    fetchBracelets();
  }, []);

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

  // Advanced filtering and searching with useMemo for performance
  const filteredBracelets = useMemo(() => {
    let filtered = [...bracelets];

    // Search functionality
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(b => 
        b.name.toLowerCase().includes(query) ||
        b.description?.toLowerCase().includes(query) ||
        b.braceletType.toLowerCase().includes(query) ||
        b.color?.toLowerCase().includes(query) ||
        b.metalType?.toLowerCase().includes(query) ||
        b.chainType?.toLowerCase().includes(query)
      );
    }

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
      case 'NEWEST':
        // Assuming there's a createdAt field in the future
        filtered.reverse();
        break;
    }

    return filtered;
  }, [bracelets, filters, searchQuery]);

  const clearAllFilters = useCallback(() => {
    setFilters({
      type: 'ALL',
      priceRange: 'ALL', 
      availability: 'ALL',
      sortBy: 'FEATURED'
    });
    setSearchQuery('');
  }, []);

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
        
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
            </svg>
            {bracelets.length} Unique Designs Available
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
            Premium Bracelet Collection
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover handcrafted excellence in every piece. From elegant chains to vibrant bead patterns, 
            each bracelet tells a story. Customize to perfection or choose from our curated designs.
          </p>
        </div>

        {/* Advanced Search & Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
          {/* Search Bar */}
          <div className="p-6 border-b border-gray-100">
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Search by name, type, material, color..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Filters & Controls */}
          <div className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Filter Pills */}
              <div className="flex flex-wrap gap-3 items-center">
                {/* Type Filter */}
                <div className="relative">
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({...filters, type: e.target.value})}
                    className="appearance-none bg-gray-50 border border-gray-200 rounded-full px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                  >
                    <option value="ALL">All Types</option>
                    <option value="CHAIN">Chain Bracelets</option>
                    <option value="BEADS">Bead Bracelets</option>
                  </select>
                  <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Price Range Filter */}
                <div className="relative">
                  <select
                    value={filters.priceRange}
                    onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                    className="appearance-none bg-gray-50 border border-gray-200 rounded-full px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                  >
                    <option value="ALL">All Prices</option>
                    <option value="0-50">Under €50</option>
                    <option value="50-100">€50 - €100</option>
                    <option value="100-200">€100 - €200</option>
                    <option value="200">€200+</option>
                  </select>
                  <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Availability Filter */}
                <div className="relative">
                  <select
                    value={filters.availability}
                    onChange={(e) => setFilters({...filters, availability: e.target.value})}
                    className="appearance-none bg-gray-50 border border-gray-200 rounded-full px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                  >
                    <option value="ALL">All Items</option>
                    <option value="IN_STOCK">In Stock</option>
                    <option value="OUT_OF_STOCK">Out of Stock</option>
                  </select>
                  <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Clear Filters Button */}
                {(filters.type !== 'ALL' || filters.priceRange !== 'ALL' || filters.availability !== 'ALL' || searchQuery) && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              {/* Right Side Controls */}
              <div className="flex items-center gap-3">
                {/* Sort Options */}
                <div className="relative">
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                  >
                    <option value="FEATURED">Featured First</option>
                    <option value="PRICE_LOW">Price: Low to High</option>
                    <option value="PRICE_HIGH">Price: High to Low</option>
                    <option value="NAME">Name A-Z</option>
                    <option value="NEWEST">Newest First</option>
                  </select>
                  <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredBracelets.length}</span> of <span className="font-semibold text-gray-900">{bracelets.length}</span> bracelets
                {searchQuery && (
                  <span className="ml-2">
                    for "<span className="font-medium text-blue-600">{searchQuery}</span>"
                  </span>
                )}
              </div>
              {filteredBracelets.length > 0 && (
                <div className="text-sm text-gray-500">
                  Average price: <span className="font-semibold">€{(filteredBracelets.reduce((sum, b) => sum + b.basePriceCents, 0) / filteredBracelets.length / 100).toFixed(0)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Empty State or Products Grid */}
        {filteredBracelets.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No bracelets found</h3>
              <p className="text-gray-500 mb-6">
                We couldn't find any bracelets matching your search criteria. Try adjusting your filters or search terms.
              </p>
              <div className="space-y-3">
                <SecondaryButton onClick={clearAllFilters} className="w-full">
                  Clear All Filters
                </SecondaryButton>
                <div className="text-sm text-gray-400">
                  or
                </div>
                <PrimaryButton asChild className="w-full">
                  <Link href={`/${locale}/designer`}>Create Custom Bracelet</Link>
                </PrimaryButton>
              </div>
            </div>
          </div>
        ) : (
          <div className={`mb-12 ${
            viewMode === 'grid' 
              ? 'grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-4'
          }`}>
            {filteredBracelets.map((bracelet: Bracelet) => (
              viewMode === 'grid' ? (
                <Card key={bracelet.slug} hover className="overflow-hidden relative group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  {/* Enhanced Badges */}
                  <div className="absolute top-3 left-3 z-10 space-y-2">
                    {bracelet.featured && (
                      <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        ⭐ Featured
                      </span>
                    )}
                    {bracelet.stock === 0 && (
                      <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        Out of Stock
                      </span>
                    )}
                    {bracelet.stock > 0 && bracelet.stock <= 5 && (
                      <span className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        Only {bracelet.stock} Left
                      </span>
                    )}
                  </div>

                  {/* Enhanced Image Gallery */}
                  <div className="h-72 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-150 relative overflow-hidden">
                    <ProductImageGallery
                      images={[bracelet.imageUrl, bracelet.imageUrl2, bracelet.imageUrl3].filter((img): img is string => Boolean(img))}
                      svgPath={bracelet.svgPath}
                      name={bracelet.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {bracelet.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            bracelet.braceletType === 'CHAIN' 
                              ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                              : 'bg-purple-100 text-purple-800 border border-purple-200'
                          }`}>
                            {bracelet.braceletType === 'CHAIN' ? 'Chain' : 'Beads'}
                          </span>
                          {bracelet.color && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                              {bracelet.color}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                          €{(bracelet.basePriceCents / 100).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">Starting price</div>
                      </div>
                    </div>

                    {bracelet.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                        {bracelet.description}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
                      <div className="flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                        </svg>
                        {bracelet.lengthMm}mm length
                      </div>
                      {bracelet.thickness && (
                        <div className="flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                          </svg>
                          {bracelet.thickness}mm thick
                        </div>
                      )}
                    </div>

                    <div className={`text-sm font-semibold mb-4 ${
                      bracelet.stock === 0 ? 'text-red-600' : 
                      bracelet.stock <= 5 ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {bracelet.stock === 0 ? 'Out of Stock' : 
                       bracelet.stock <= 5 ? `Only ${bracelet.stock} remaining` : 
                       'In Stock'}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <PrimaryButton 
                        className="w-full font-semibold"
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
              ) : (
                // List View
                <Card key={bracelet.slug} hover className="overflow-hidden relative group transition-all duration-300">
                  <div className="flex">
                    {/* List Image */}
                    <div className="w-32 h-32 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden flex-shrink-0">
                      <ProductImageGallery
                        images={[bracelet.imageUrl, bracelet.imageUrl2, bracelet.imageUrl3].filter((img): img is string => Boolean(img))}
                        svgPath={bracelet.svgPath}
                        name={bracelet.name}
                      />
                    </div>
                    
                    {/* List Content */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {bracelet.name}
                            </h3>
                            <div className="flex items-center gap-2">
                              {bracelet.featured && (
                                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">
                                  ⭐ Featured
                                </span>
                              )}
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                bracelet.braceletType === 'CHAIN' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                {bracelet.braceletType}
                              </span>
                            </div>
                          </div>
                          
                          {bracelet.description && (
                            <p className="text-gray-600 mb-3 line-clamp-2">
                              {bracelet.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <span>Length: {bracelet.lengthMm}mm</span>
                            {bracelet.thickness && <span>Thickness: {bracelet.thickness}mm</span>}
                            {bracelet.color && <span>Color: {bracelet.color}</span>}
                          </div>
                          
                          <div className={`text-sm font-semibold ${
                            bracelet.stock === 0 ? 'text-red-600' : 
                            bracelet.stock <= 5 ? 'text-orange-600' : 'text-green-600'
                          }`}>
                            {bracelet.stock === 0 ? 'Out of Stock' : 
                             bracelet.stock <= 5 ? `Only ${bracelet.stock} left` : 
                             'In Stock'}
                          </div>
                        </div>
                        
                        <div className="text-right ml-6">
                          <div className="text-3xl font-bold text-gray-900 mb-2">
                            €{(bracelet.basePriceCents / 100).toFixed(2)}
                          </div>
                          <div className="space-y-2">
                            <PrimaryButton 
                              disabled={bracelet.stock === 0}
                              asChild
                              className="w-full min-w-[140px]"
                            >
                              <Link href={`/${locale}/designer/${bracelet.slug}`}>
                                {bracelet.stock === 0 ? 'Out of Stock' : 'Customize'}
                              </Link>
                            </PrimaryButton>
                            <SecondaryButton 
                              asChild
                              className="w-full text-sm"
                            >
                              <Link href={`/${locale}/bracelets/${bracelet.slug}`}>
                                Details
                              </Link>
                            </SecondaryButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )
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
              <Link href={`/${locale}/contact`}>Contact Us</Link>
            </PrimaryButton>
            <SecondaryButton asChild>
              <Link href={`/${locale}/#how-it-works`}>How It Works</Link>
            </SecondaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Product Image Gallery Component
function ProductImageGallery({ images, svgPath, name }: { 
  images: string[], 
  svgPath: string, 
  name: string 
}) {
  const [currentImage, setCurrentImage] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const validImages = images;

  if (validImages.length === 0) {
    // Enhanced SVG fallback with animations
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <svg 
          viewBox="0 0 1000 300" 
          className="w-full h-auto max-w-[200px] opacity-60 group-hover:opacity-80 transition-opacity"
        >
          <defs>
            <linearGradient id="braceletGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9CA3AF" />
              <stop offset="50%" stopColor="#6B7280" />
              <stop offset="100%" stopColor="#9CA3AF" />
            </linearGradient>
          </defs>
          <path
            d={svgPath}
            fill="none"
            stroke="url(#braceletGradient)"
            strokeWidth={16}
            strokeLinecap="round"
            className="drop-shadow-sm animate-pulse"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Main Image */}
      <div className="relative w-full h-full">
        <img 
          src={validImages[currentImage]!} 
          alt={`${name} ${currentImage + 1}`}
          className={`w-full h-full object-cover transition-all duration-500 ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
        />
        
        {/* Loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
        )}
      </div>
      
      {validImages.length > 1 && (
        <>
          {/* Image Indicators */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            {validImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentImage(index);
                  setImageLoaded(false);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                  index === currentImage 
                    ? 'bg-white shadow-lg scale-125' 
                    : 'bg-white/60 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
          
          {/* Navigation Arrows */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCurrentImage((prev) => (prev - 1 + validImages.length) % validImages.length);
              setImageLoaded(false);
            }}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-9 h-9 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCurrentImage((prev) => (prev + 1) % validImages.length);
              setImageLoaded(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-9 h-9 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Image Counter */}
          <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
            {currentImage + 1}/{validImages.length}
          </div>
        </>
      )}
    </div>
  );
}