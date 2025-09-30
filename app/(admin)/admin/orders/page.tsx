"use client";

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/Common';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Button';

interface Order {
  id: string;
  orderNumber: string;
  customerEmail: string;
  customerName?: string;
  totalCents: number;
  currency: string;
  status: OrderStatus;
  paymentProvider?: string;
  paymentId?: string;
  shippingAddress?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

interface OrderItem {
  id: string;
  productType: string;
  productId: string;
  productName: string;
  quantity: number;
  priceCents: number;
}

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';

const ORDER_STATUSES: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-gray-100 text-gray-800',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const cleanupDuplicates = async () => {
    if (!confirm('Are you sure you want to cleanup duplicate orders? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/orders/cleanup-duplicates', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Cleanup completed! Removed ${result.deletedOrderIds.length} duplicate orders.`);
        fetchOrders(); // Refresh the orders list
      } else {
        const error = await response.json();
        alert(`Cleanup failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Failed to cleanup duplicates:', error);
      alert('Failed to cleanup duplicates. Please try again.');
    }
  };

  const filteredOrders = filterStatus === 'ALL' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const orderStats = ORDER_STATUSES.reduce((acc, status) => {
    acc[status] = orders.filter(o => o.status === status).length;
    return acc;
  }, {} as Record<OrderStatus, number>);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
            <p className="text-gray-600">Monitor and manage customer orders</p>
          </div>
          <div className="space-x-2">
            <SecondaryButton onClick={cleanupDuplicates}>
              🧹 Cleanup Duplicates
            </SecondaryButton>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                <p className="text-sm text-gray-500">Total Orders</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {orderStats.DELIVERED || 0}
                </p>
                <p className="text-sm text-gray-500">Delivered</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {(orderStats.PENDING || 0) + (orderStats.PROCESSING || 0)}
                </p>
                <p className="text-sm text-gray-500">In Progress</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  €{(orders.reduce((sum, o) => sum + o.totalCents, 0) / 100).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">Total Revenue</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterStatus('ALL')}
                className={`px-3 py-1 rounded-full text-sm ${
                  filterStatus === 'ALL'
                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                    : 'bg-gray-100 text-gray-700 border-gray-300'
                } border`}
              >
                All ({orders.length})
              </button>
              {ORDER_STATUSES.map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    filterStatus === status
                      ? 'bg-blue-100 text-blue-800 border-blue-300'
                      : 'bg-gray-100 text-gray-700 border-gray-300'
                  }`}
                >
                  {status} ({orderStats[status] || 0})
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">
              {filterStatus === 'ALL' ? 'All Orders' : `${filterStatus} Orders`}
            </h2>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  No orders found {filterStatus !== 'ALL' && `with status ${filterStatus}`}
                </p>
                <p className="text-sm text-gray-400">
                  Orders will appear here when customers make purchases
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Order #</th>
                      <th className="text-left py-3 px-4">Customer</th>
                      <th className="text-left py-3 px-4">Total</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Payment</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="font-mono text-blue-600 hover:text-blue-800"
                            >
                              {order.orderNumber}
                            </button>
                            {/* Show indicator for potential duplicates */}
                            {orders.filter(o => o.paymentId === order.paymentId).length > 1 && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-1 rounded" title="Potential duplicate">
                                DUP
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{order.customerName || 'Guest'}</p>
                            <p className="text-sm text-gray-500">{order.customerEmail}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          €{(order.totalCents / 100).toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${STATUS_COLORS[order.status]}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            <p>{order.paymentProvider || 'N/A'}</p>
                            {order.paymentId && (
                              <p className="text-gray-500 font-mono text-xs">{order.paymentId.substring(0, 12)}...</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className="text-sm px-2 py-1 border border-gray-300 rounded"
                          >
                            {ORDER_STATUSES.map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mock Orders Notice */}
        {orders.length === 0 && !loading && (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h3>
                <p className="text-gray-600 mb-4">
                  This page will show real customer orders once your store starts receiving purchases.
                  For now, you can manage your product inventory using the other admin sections.
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">
                    <strong>Note:</strong> Orders will be automatically created when customers complete checkout through Stripe.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Order Details</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Order Number</label>
                    <p className="font-mono">{selectedOrder.orderNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Status</label>
                    <span className={`px-2 py-1 rounded-full text-xs ${STATUS_COLORS[selectedOrder.status]}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Customer</label>
                    <p>{selectedOrder.customerName || 'Guest'}</p>
                    <p className="text-sm text-gray-500">{selectedOrder.customerEmail}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Total</label>
                    <p className="text-lg font-semibold">€{(selectedOrder.totalCents / 100).toFixed(2)}</p>
                  </div>
                </div>

                {/* Payment Info */}
                {selectedOrder.paymentProvider && (
                  <div>
                    <h4 className="font-medium mb-2">Payment Information</h4>
                    <div className="bg-gray-50 p-3 rounded">
                      <p><strong>Provider:</strong> {selectedOrder.paymentProvider}</p>
                      {selectedOrder.paymentId && (
                        <p><strong>Payment ID:</strong> <span className="font-mono">{selectedOrder.paymentId}</span></p>
                      )}
                    </div>
                  </div>
                )}

                {/* Shipping Address */}
                {selectedOrder.shippingAddress && (
                  <div>
                    <h4 className="font-medium mb-2">Shipping Address</h4>
                    <div className="bg-gray-50 p-3 rounded">
                      <p>{selectedOrder.shippingAddress}</p>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div>
                  <h4 className="font-medium mb-2">Items ({selectedOrder.items.length})</h4>
                  <div className="border rounded">
                    {selectedOrder.items.map((item, index) => (
                      <div key={item.id} className={`p-3 ${index > 0 ? 'border-t' : ''}`}>
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-sm text-gray-500">
                              {item.productType} • Quantity: {item.quantity}
                            </p>
                          </div>
                          <p className="font-semibold">€{(item.priceCents / 100).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div>
                    <h4 className="font-medium mb-2">Notes</h4>
                    <div className="bg-gray-50 p-3 rounded">
                      <p>{selectedOrder.notes}</p>
                    </div>
                  </div>
                )}

                {/* Update Status */}
                <div>
                  <h4 className="font-medium mb-2">Update Status</h4>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value as OrderStatus)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {ORDER_STATUSES.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <SecondaryButton onClick={() => setSelectedOrder(null)}>
                  Close
                </SecondaryButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}