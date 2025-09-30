"use client";

import React, { useState, useEffect } from "react";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Common";
import Image from "next/image";
import { stripePromise } from '@/lib/stripe';
import { getCartColorClass } from '@/lib/colors';

interface CartItem {
  id: string;
  type: 'bracelet';
  name: string;
  description: string;
  price: number;
  quantity: number;
  details: {
    braceletType: 'CHAIN' | 'BEADS';
    beads?: Array<{
      id: string;
      name: string;
      color: string;
      colorHex?: string;
      position: number;
      quantity: number;
    }>;
    charms?: Array<{
      id: string;
      name: string;
      position: number;
    }>;
    baseConfig?: {
      metalType?: string;
      chainType?: string;
      thickness?: number;
      length?: number;
    };
  };
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('bracelet-cart');
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        setCartItems(items);
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
    setLoading(false);
  }, []);

  const removeItem = (itemId: string) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('bracelet-cart', JSON.stringify(updatedCart));
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    const updatedCart = cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('bracelet-cart', JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('bracelet-cart');
  };

  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const proceedToCheckout = async () => {
    if (cartItems.length === 0) return;
    
    setCheckoutLoading(true);
    
    try {
      // Create checkout session
      const response = await fetch('/api/checkout/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItems }),
      });

      const { url, error } = await response.json();

      if (error) {
        console.error('Checkout error:', error);
        alert('Something went wrong. Please try again.');
        return;
      }

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
            <p className="text-gray-600">
              {cartItems.length === 0 
                ? 'Your cart is empty' 
                : `${cartItems.length} item${cartItems.length > 1 ? 's' : ''} in your cart`
              }
            </p>
          </div>

          {cartItems.length === 0 ? (
            // Empty Cart
            <div className="text-center py-12">
              <div className="mb-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m9.5-6v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Start designing your perfect bracelet!</p>
              <PrimaryButton onClick={() => window.location.href = '/'}>
                Start Shopping
              </PrimaryButton>
            </div>
          ) : (
            // Cart with Items
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {item.name}
                          </h3>
                          <p className="text-gray-600 mb-4">{item.description}</p>
                          
                          {/* Item Details */}
                          <div className="space-y-2 text-sm text-gray-500">
                            <div><strong>Type:</strong> {item.details.braceletType === 'BEADS' ? 'Beads Bracelet' : 'Chain Bracelet'}</div>
                            
                            {item.details.beads && item.details.beads.length > 0 && (
                              <div>
                                <strong>Beads:</strong> {item.details.beads.length} beads
                                <div className="flex items-center space-x-1 mt-1">
                                  {item.details.beads.slice(0, 5).map((bead, idx) => (
                                    <div 
                                      key={idx}
                                      className={`w-3 h-3 rounded-full border${!bead.colorHex ? ` ${getCartColorClass(bead.color)}` : ''}`}
                                      style={bead.colorHex ? { backgroundColor: bead.colorHex } : {}}
                                    />
                                  ))}
                                  {item.details.beads.length > 5 && (
                                    <span className="text-xs">+{item.details.beads.length - 5} more</span>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {item.details.charms && item.details.charms.length > 0 && (
                              <div><strong>Charms:</strong> {item.details.charms.length} charm{item.details.charms.length > 1 ? 's' : ''}</div>
                            )}
                            
                            {item.details.baseConfig && (
                              <div>
                                <strong>Configuration:</strong> 
                                {item.details.baseConfig.metalType && ` ${item.details.baseConfig.metalType}`}
                                {item.details.baseConfig.chainType && ` ${item.details.baseConfig.chainType} chain`}
                                {item.details.baseConfig.length && ` ${item.details.baseConfig.length}mm`}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="ml-6 text-right">
                          <div className="text-lg font-semibold text-gray-900 mb-4">
                            €{item.price.toFixed(2)}
                          </div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2 mb-4">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                            >
                              +
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                        
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-6">
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Order Summary</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>€{calculateTotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Shipping</span>
                        <span>€5.00</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Total</span>
                          <span>€{(calculateTotal() + 5).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <PrimaryButton 
                      className="w-full"
                      onClick={proceedToCheckout}
                      disabled={checkoutLoading}
                    >
                      {checkoutLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        'Proceed to Checkout'
                      )}
                    </PrimaryButton>
                    
                    <SecondaryButton 
                      className="w-full"
                      onClick={() => window.location.href = '/'}
                    >
                      Continue Shopping
                    </SecondaryButton>
                    
                    <button 
                      onClick={clearCart}
                      className="w-full text-center text-sm text-red-500 hover:text-red-700 py-2"
                    >
                      Clear Cart
                    </button>
                    
                  </CardContent>
                </Card>
              </div>
              
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}