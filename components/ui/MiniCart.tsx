"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button, Badge } from '@/components/ui';
import { getCart, removeFromCart, updateCartItemQuantity } from '@/lib/cart';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  charms?: any[];
}

interface MiniCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MiniCart({ isOpen, onClose }: MiniCartProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadCartItems();
    }
  }, [isOpen]);

  const loadCartItems = () => {
    setIsLoading(true);
    try {
      const items = getCart();
      setCartItems(items);
    } catch (error) {
      console.error('Error loading cart items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
    loadCartItems();
    window.dispatchEvent(new Event('cart-updated'));
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(id);
    } else {
      updateCartItemQuantity(id, quantity);
      loadCartItems();
      window.dispatchEvent(new Event('cart-updated'));
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Mini Cart Panel */}
      <div className="fixed top-20 right-4 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-brand border border-primary-100 z-50 animate-in slide-in-from-right-2 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <div>
            <h3 className="font-display font-semibold text-lg text-neutral-900">
              Winkelwagen
            </h3>
            <p className="text-sm text-neutral-600">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-neutral-100 transition-colors duration-200"
            aria-label="Sluit winkelwagen"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-neutral-600">Laden...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-neutral-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-neutral-600 mb-4">Je winkelwagen is leeg</p>
              <Button 
                asChild 
                variant="primary" 
                size="sm"
                onClick={onClose}
              >
                <Link href="/bracelets">
                  Bekijk Collectie
                </Link>
              </Button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {cartItems.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center space-x-4 p-3 rounded-xl hover:bg-neutral-50 transition-colors duration-200"
                >
                  {/* Product Image */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-neutral-100">
                    {item.image ? (
                      <Image 
                        src={item.image} 
                        alt={item.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-neutral-900 truncate">{item.name}</h4>
                    <p className="text-sm text-neutral-600">€{item.price.toFixed(2)}</p>
                    {item.charms && item.charms.length > 0 && (
                      <p className="text-xs text-neutral-500">
                        {item.charms.length} charm{item.charms.length !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-lg border border-neutral-200 flex items-center justify-center hover:bg-neutral-100 transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-lg border border-neutral-200 flex items-center justify-center hover:bg-neutral-100 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1 rounded-lg hover:bg-error-50 hover:text-error-600 text-neutral-400 transition-colors"
                    aria-label="Verwijder item"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-neutral-100 bg-neutral-50 rounded-b-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium text-neutral-900">Subtotaal</span>
              <span className="font-display font-semibold text-lg text-neutral-900">
                €{subtotal.toFixed(2)}
              </span>
            </div>
            
            <div className="space-y-3">
              <Button 
                asChild 
                variant="primary" 
                size="default"
                className="w-full justify-center"
                onClick={onClose}
              >
                <Link href="/checkout">
                  Afrekenen
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                size="default"
                className="w-full justify-center"
                onClick={onClose}
              >
                <Link href="/cart">
                  Bekijk Winkelwagen
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}