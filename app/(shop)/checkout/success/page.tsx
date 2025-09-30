"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PrimaryButton } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Common';
import { clearCart } from '@/lib/cart';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        // Clear cart after successful payment
        clearCart();
        
        // First try to fetch existing order
        let response = await fetch(`/api/orders/by-session/${sessionId}`);
        
        if (response.ok) {
          const order = await response.json();
          setOrderDetails({
            sessionId: sessionId,
            orderNumber: order.orderNumber,
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('nl-NL'),
            totalAmount: order.totalCents,
            orderStatus: order.status,
          });
        } else {
          // If order doesn't exist, create it from the session
          try {
            const createResponse = await fetch('/api/orders/create-from-session', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ sessionId }),
            });

            if (createResponse.ok) {
              const { order } = await createResponse.json();
              setOrderDetails({
                sessionId: sessionId,
                orderNumber: order.orderNumber,
                estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('nl-NL'),
                totalAmount: order.totalCents,
                orderStatus: order.status,
              });
            } else {
              throw new Error('Failed to create order');
            }
          } catch (createError) {
            console.error('Failed to create order:', createError);
            // Fallback to basic details
            setOrderDetails({
              sessionId: sessionId,
              orderNumber: `Processing...`,
              estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('nl-NL'),
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch order details:', error);
        // Fallback to basic details
        setOrderDetails({
          sessionId: sessionId,
          orderNumber: `ORD-${Date.now()}`,
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('nl-NL'),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your order. Your custom bracelet is being prepared.
          </p>

          {/* Order Details */}
          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-xl font-semibold">Order Details</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-500">Order Number:</span>
                  <div className="font-mono">{orderDetails.orderNumber}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Status:</span>
                  <div className="capitalize">{orderDetails.orderStatus || 'Confirmed'}</div>
                </div>
              </div>
              
              {orderDetails.totalAmount && (
                <div className="border-t pt-4">
                  <div className="text-sm text-gray-500 mb-1">Total Amount:</div>
                  <div className="text-lg font-bold text-green-600">
                    €{(orderDetails.totalAmount / 100).toFixed(2)}
                  </div>
                </div>
              )}
              
              <div className="border-t pt-4">
                <div className="text-sm text-gray-500 mb-1">Estimated Delivery:</div>
                <div className="font-semibold">{orderDetails.estimatedDelivery}</div>
              </div>
            </CardContent>
          </Card>

          {/* What's Next */}
          <Card className="mb-8">
            <CardHeader>
              <h3 className="text-lg font-semibold">What's Next?</h3>
            </CardHeader>
            <CardContent className="space-y-3 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">1</span>
                </div>
                <div>
                  <div className="font-medium">Order Confirmation</div>
                  <div className="text-sm text-gray-500">You'll receive an email confirmation shortly</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">2</span>
                </div>
                <div>
                  <div className="font-medium">Handcrafted Creation</div>
                  <div className="text-sm text-gray-500">Your bracelet will be carefully handmade</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">3</span>
                </div>
                <div>
                  <div className="font-medium">Shipping & Delivery</div>
                  <div className="text-sm text-gray-500">Tracked shipping to your address</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-4">
            <PrimaryButton 
              onClick={() => window.location.href = '/'}
              className="w-full sm:w-auto"
            >
              Create Another Bracelet
            </PrimaryButton>
            
            <div>
              <button 
                onClick={() => window.print()}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                Print Order Confirmation
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-12 p-6 bg-gray-100 rounded-lg">
            <h4 className="font-semibold mb-2">Need Help?</h4>
            <p className="text-sm text-gray-600">
              If you have any questions about your order, please contact us at{' '}
              <a href="mailto:support@laninabracelets.com" className="text-blue-600 hover:text-blue-700">
                support@laninabracelets.com
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}