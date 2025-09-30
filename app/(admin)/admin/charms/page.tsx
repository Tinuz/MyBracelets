"use client";

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/Common';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Button';
import ImageUpload from '@/components/admin/ImageUpload';

interface Charm {
  id: string;
  sku: string;
  name: string;
  description: string;
  priceCents: number;
  widthMm: number;
  heightMm: number;
  anchorPoint: string;
  maxPerBracelet: number;
  stock: number;
  imageUrl: string;
  active: boolean;
  createdAt: string;
}

export default function AdminCharmsPage() {
  const [charms, setCharms] = useState<Charm[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCharm, setEditingCharm] = useState<Charm | null>(null);

  useEffect(() => {
    fetchCharms();
  }, []);

  const fetchCharms = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/charms', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCharms(data);
      }
    } catch (error) {
      console.error('Failed to fetch charms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (charmId: string) => {
    if (!confirm('Are you sure you want to delete this charm?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/charms/${charmId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setCharms(charms.filter(c => c.id !== charmId));
      }
    } catch (error) {
      console.error('Failed to delete charm:', error);
    }
  };

  const handleToggleActive = async (charm: Charm) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/charms/${charm.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          active: !charm.active
        })
      });

      if (response.ok) {
        setCharms(charms.map(c => 
          c.id === charm.id ? { ...c, active: !c.active } : c
        ));
      }
    } catch (error) {
      console.error('Failed to update charm:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Charms Management</h1>
            <p className="text-gray-600">Manage your charm inventory</p>
          </div>
          <PrimaryButton onClick={() => setShowAddForm(true)}>
            Add New Charm
          </PrimaryButton>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{charms.length}</p>
                <p className="text-sm text-gray-500">Total Charms</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {charms.filter(c => c.active).length}
                </p>
                <p className="text-sm text-gray-500">Active</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {charms.filter(c => c.stock < 5).length}
                </p>
                <p className="text-sm text-gray-500">Low Stock</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  €{(charms.reduce((sum, c) => sum + c.priceCents, 0) / 100 / charms.length || 0).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">Avg Price</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charms Table */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">All Charms</h2>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : charms.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No charms found</p>
                <PrimaryButton onClick={() => setShowAddForm(true)}>
                  Add Your First Charm
                </PrimaryButton>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Image</th>
                      <th className="text-left py-3 px-4">SKU</th>
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Dimensions</th>
                      <th className="text-left py-3 px-4">Price</th>
                      <th className="text-left py-3 px-4">Stock</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {charms.map((charm) => (
                      <tr key={charm.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <img
                            src={charm.imageUrl}
                            alt={charm.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-sm text-gray-600">{charm.sku}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{charm.name}</p>
                            <p className="text-sm text-gray-500">{charm.description}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            <span>{charm.widthMm}×{charm.heightMm}mm</span>
                            <p className="text-xs text-gray-500">{charm.anchorPoint}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          €{(charm.priceCents / 100).toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            <span className={`${charm.stock < 5 ? 'text-red-600' : 'text-gray-900'}`}>
                              {charm.stock}
                            </span>
                            <p className="text-xs text-gray-500">Max: {charm.maxPerBracelet}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            charm.active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {charm.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setEditingCharm(charm)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleToggleActive(charm)}
                              className="text-yellow-600 hover:text-yellow-800 text-sm"
                            >
                              {charm.active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDelete(charm.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Form Modal */}
        {(showAddForm || editingCharm) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingCharm ? 'Edit Charm' : 'Add New Charm'}
              </h3>
              
              <CharmForm
                charm={editingCharm}
                onSave={(charm) => {
                  if (editingCharm) {
                    setCharms(charms.map(c => c.id === charm.id ? charm : c));
                  } else {
                    setCharms([...charms, charm]);
                  }
                  setShowAddForm(false);
                  setEditingCharm(null);
                }}
                onCancel={() => {
                  setShowAddForm(false);
                  setEditingCharm(null);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

interface CharmFormProps {
  charm: Charm | null;
  onSave: (charm: Charm) => void;
  onCancel: () => void;
}

function CharmForm({ charm, onSave, onCancel }: CharmFormProps) {
  const [formData, setFormData] = useState({
    sku: charm?.sku || '',
    name: charm?.name || '',
    description: charm?.description || '',
    priceCents: charm?.priceCents || 0,
    widthMm: charm?.widthMm || 10,
    heightMm: charm?.heightMm || 10,
    anchorPoint: charm?.anchorPoint || 'center',
    maxPerBracelet: charm?.maxPerBracelet || 1,
    stock: charm?.stock || 0,
    imageUrl: charm?.imageUrl || '',
    active: charm?.active ?? true,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const url = charm 
        ? `/api/admin/charms/${charm.id}` 
        : '/api/admin/charms';
      
      const method = charm ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const savedCharm = await response.json();
        onSave(savedCharm);
      }
    } catch (error) {
      console.error('Failed to save charm:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SKU
          </label>
          <input
            type="text"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., CHARM-001"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price (€)
          </label>
          <input
            type="number"
            step="0.01"
            value={(formData.priceCents / 100).toFixed(2)}
            onChange={(e) => setFormData({ 
              ...formData, 
              priceCents: Math.round(parseFloat(e.target.value) * 100)
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stock
          </label>
          <input
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Width (mm)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.widthMm}
            onChange={(e) => setFormData({ ...formData, widthMm: parseFloat(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Height (mm)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.heightMm}
            onChange={(e) => setFormData({ ...formData, heightMm: parseFloat(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Anchor Point
          </label>
          <select
            value={formData.anchorPoint}
            onChange={(e) => setFormData({ ...formData, anchorPoint: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="center">Center</option>
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Max per Bracelet
        </label>
        <input
          type="number"
          value={formData.maxPerBracelet}
          onChange={(e) => setFormData({ ...formData, maxPerBracelet: parseInt(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image
        </label>
        <ImageUpload
          category="charms"
          currentImageUrl={formData.imageUrl}
          onImageUploaded={(imageUrl) => setFormData({ ...formData, imageUrl })}
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={formData.active}
          onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
          className="mr-2"
        />
        <label className="text-sm font-medium text-gray-700">
          Active
        </label>
      </div>

      <div className="flex space-x-4 pt-4">
        <PrimaryButton type="submit" disabled={loading}>
          {loading ? 'Saving...' : (charm ? 'Update' : 'Create')}
        </PrimaryButton>
        <SecondaryButton type="button" onClick={onCancel}>
          Cancel
        </SecondaryButton>
      </div>
    </form>
  );
}