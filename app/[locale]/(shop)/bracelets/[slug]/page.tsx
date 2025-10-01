'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Common';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Button';

interface Bracelet {
  id: string;
  slug: string;
  name: string;
  description?: string;
  basePriceCents: number;
  imageUrl?: string | null;
  imageUrl2?: string | null;
  imageUrl3?: string | null;
  svgPath: string;
  lengthMm: number;
  braceletType: 'CHAIN' | 'BEADS';
  thickness?: number;
  color?: string;
  metalType?: string;
  chainType?: string;
  stock: number;
  featured: boolean;
  active: boolean;
}

export default function BraceletDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [bracelet, setBracelet] = useState<Bracelet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchBracelet();
  }, [slug]);

  const fetchBracelet = async () => {
    try {
      const res = await fetch(`/api/bracelets/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setBracelet(data);
      } else if (res.status === 404) {
        setError('Bracelet not found');
      } else {
        setError('Failed to load bracelet');
      }
    } catch (error) {
      console.error('Error fetching bracelet:', error);
      setError('Failed to load bracelet');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !bracelet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Bracelet Not Found'}
          </h1>
          <p className="text-gray-600 mb-6">
            The bracelet you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <SecondaryButton asChild>
            <Link href="/bracelets">Back to Bracelets</Link>
          </SecondaryButton>
        </div>
      </div>
    );
  }

  const images = [bracelet.imageUrl, bracelet.imageUrl2, bracelet.imageUrl3]
    .filter((img): img is string => Boolean(img));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-gray-700">Home</Link></li>
            <li>›</li>
            <li><Link href="/bracelets" className="hover:text-gray-700">Bracelets</Link></li>
            <li>›</li>
            <li className="text-gray-900 font-medium">{bracelet.name}</li>
          </ol>
        </nav>

        <div className="grid md:grid-cols-2 gap-12 mb-12">
          
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-sm">
              {images.length > 0 ? (
                <img
                  src={images[selectedImage]}
                  alt={`${bracelet.name} ${selectedImage + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <svg 
                    viewBox="0 0 1000 300" 
                    className="w-3/4 h-3/4"
                  >
                    <path
                      d={bracelet.svgPath}
                      fill="none"
                      stroke="#d1d5db"
                      strokeWidth={12}
                      strokeLinecap="round"
                      className="drop-shadow-sm"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="flex space-x-3">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${bracelet.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{bracelet.name}</h1>
                {bracelet.featured && (
                  <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    ⭐ Featured
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  bracelet.braceletType === 'CHAIN' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {bracelet.braceletType} BRACELET
                </span>
                {bracelet.color && (
                  <span className="text-sm text-gray-600">{bracelet.color}</span>
                )}
              </div>

              <div className="text-4xl font-bold text-gray-900 mb-4">
                €{(bracelet.basePriceCents / 100).toFixed(2)}
              </div>

              <div className={`text-lg font-medium mb-6 ${
                bracelet.stock === 0 ? 'text-red-600' : 
                bracelet.stock <= 5 ? 'text-orange-600' : 'text-green-600'
              }`}>
                {bracelet.stock === 0 ? '❌ Out of Stock' : 
                 bracelet.stock <= 5 ? `⚠️ Only ${bracelet.stock} left in stock` : 
                 `✅ In Stock (${bracelet.stock} available)`}
              </div>
            </div>

            {/* Description */}
            {bracelet.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{bracelet.description}</p>
              </div>
            )}

            {/* Specifications */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Specifications</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Length:</span>
                  <span className="ml-2 text-gray-600">{bracelet.lengthMm}mm</span>
                </div>
                {bracelet.thickness && (
                  <div>
                    <span className="font-medium text-gray-900">Thickness:</span>
                    <span className="ml-2 text-gray-600">{bracelet.thickness}mm</span>
                  </div>
                )}
                {bracelet.metalType && (
                  <div>
                    <span className="font-medium text-gray-900">Metal:</span>
                    <span className="ml-2 text-gray-600">{bracelet.metalType.replace(/_/g, ' ')}</span>
                  </div>
                )}
                {bracelet.chainType && (
                  <div>
                    <span className="font-medium text-gray-900">Chain Style:</span>
                    <span className="ml-2 text-gray-600">{bracelet.chainType}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-6">
              <PrimaryButton 
                className="w-full text-lg py-4"
                disabled={bracelet.stock === 0}
                asChild
              >
                <Link href={`/designer/${bracelet.slug}`}>
                  {bracelet.stock === 0 ? 'Out of Stock' : 'Customize This Bracelet'}
                </Link>
              </PrimaryButton>
              
              <div className="grid grid-cols-2 gap-3">
                <SecondaryButton asChild>
                  <Link href="/bracelets">← Back to Collection</Link>
                </SecondaryButton>
                <SecondaryButton asChild>
                  <Link href="/contact">Ask a Question</Link>
                </SecondaryButton>
              </div>
            </div>

            {/* Additional Info */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-3 gap-6 text-center text-sm">
                <div>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-blue-600">🚚</span>
                  </div>
                  <span className="font-medium">Free Shipping</span>
                  <p className="text-gray-500 mt-1">On orders over €50</p>
                </div>
                <div>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-green-600">🔄</span>
                  </div>
                  <span className="font-medium">Easy Returns</span>
                  <p className="text-gray-500 mt-1">30-day return policy</p>
                </div>
                <div>
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-purple-600">💎</span>
                  </div>
                  <span className="font-medium">Premium Quality</span>
                  <p className="text-gray-500 mt-1">Crafted to last</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <RelatedProducts currentBraceletId={bracelet.id} braceletType={bracelet.braceletType} />
      </div>
    </div>
  );
}

// Related Products Component
function RelatedProducts({ currentBraceletId, braceletType }: { 
  currentBraceletId: string;
  braceletType: 'CHAIN' | 'BEADS';
}) {
  const [relatedBracelets, setRelatedBracelets] = useState<Bracelet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRelatedBracelets();
  }, [currentBraceletId, braceletType]);

  const fetchRelatedBracelets = async () => {
    try {
      const res = await fetch('/api/bracelets');
      if (res.ok) {
        const allBracelets = await res.json();
        const related = allBracelets
          .filter((b: Bracelet) => b.id !== currentBraceletId && b.braceletType === braceletType)
          .slice(0, 4);
        setRelatedBracelets(related);
      }
    } catch (error) {
      console.error('Error fetching related bracelets:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || relatedBracelets.length === 0) {
    return null;
  }

  return (
    <div className="border-t pt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">You Might Also Like</h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedBracelets.map((bracelet) => (
          <Card key={bracelet.slug} hover className="overflow-hidden">
            <Link href={`/bracelets/${bracelet.slug}`}>
              <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                {bracelet.imageUrl ? (
                  <img
                    src={bracelet.imageUrl}
                    alt={bracelet.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg viewBox="0 0 1000 300" className="w-3/4 h-3/4">
                      <path
                        d={bracelet.svgPath}
                        fill="none"
                        stroke="#d1d5db"
                        strokeWidth={12}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                )}
                
                {bracelet.featured && (
                  <span className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Featured
                  </span>
                )}
              </div>
              
              <CardHeader className="pb-2">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {bracelet.name}
                </h3>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    €{(bracelet.basePriceCents / 100).toFixed(2)}
                  </span>
                  <span className={`text-sm ${
                    bracelet.stock === 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {bracelet.stock === 0 ? 'Out of Stock' : 'In Stock'}
                  </span>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}