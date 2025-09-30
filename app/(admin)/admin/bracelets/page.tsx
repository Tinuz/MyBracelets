"use client";

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/Common';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Button';
import ImageUpload from '@/components/admin/ImageUpload';
import MultipleImageUpload from '@/components/admin/MultipleImageUpload';

interface Bracelet {
  id: string;
  slug: string;
  name: string;
  description: string;
  svgPath?: string;
  imageUrl?: string;
  imageUrl2?: string;
  imageUrl3?: string;
  lengthMm: number;
  basePriceCents: number;
  braceletType: 'CHAIN' | 'BEADS';
  thickness?: number;
  color?: string;
  metalType?: string;
  chainType?: string;
  stock: number;
  featured: boolean;
  active: boolean;
  createdAt: string;
}

const BRACELET_TYPES = ['CHAIN', 'BEADS'];
const METAL_TYPES = ['GOLD', 'SILVER', 'ROSE_GOLD', 'WHITE_GOLD', 'PLATINUM', 'STAINLESS_STEEL'];
const CHAIN_TYPES = ['CABLE', 'CURB', 'FIGARO', 'ROPE', 'BOX', 'SNAKE', 'HERRINGBONE', 'BYZANTINE'];

export default function AdminBraceletsPage() {
  const [bracelets, setBracelets] = useState<Bracelet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBracelet, setEditingBracelet] = useState<Bracelet | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');

  useEffect(() => {
    fetchBracelets();
  }, []);

  const fetchBracelets = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/bracelets', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBracelets(data);
      }
    } catch (error) {
      console.error('Failed to fetch bracelets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (braceletId: string) => {
    if (!confirm('Are you sure you want to delete this bracelet?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/bracelets/${braceletId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setBracelets(bracelets.filter(b => b.id !== braceletId));
      }
    } catch (error) {
      console.error('Failed to delete bracelet:', error);
    }
  };

  const handleToggleActive = async (bracelet: Bracelet) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/bracelets/${bracelet.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          active: !bracelet.active
        })
      });

      if (response.ok) {
        setBracelets(bracelets.map(b => 
          b.id === bracelet.id ? { ...b, active: !b.active } : b
        ));
      }
    } catch (error) {
      console.error('Failed to update bracelet:', error);
    }
  };

  const filteredBracelets = filterType === 'ALL' 
    ? bracelets 
    : bracelets.filter(bracelet => bracelet.braceletType === filterType);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bracelets Management</h1>
            <p className="text-gray-600">Manage your bracelet types and configurations</p>
          </div>
          <PrimaryButton onClick={() => setShowAddForm(true)}>
            Add New Bracelet
          </PrimaryButton>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{bracelets.length}</p>
                <p className="text-sm text-gray-500">Total Bracelets</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {bracelets.filter(b => b.active).length}
                </p>
                <p className="text-sm text-gray-500">Active</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {bracelets.filter(b => b.braceletType === 'CHAIN').length}
                </p>
                <p className="text-sm text-gray-500">Chain Types</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {bracelets.filter(b => b.braceletType === 'BEADS').length}
                </p>
                <p className="text-sm text-gray-500">Bead Types</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Type Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-3 py-1 rounded-full text-sm ${
                  filterType === 'ALL'
                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                    : 'bg-gray-100 text-gray-700 border-gray-300'
                } border`}
              >
                All ({bracelets.length})
              </button>
              {BRACELET_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    filterType === type
                      ? 'bg-blue-100 text-blue-800 border-blue-300'
                      : 'bg-gray-100 text-gray-700 border-gray-300'
                  }`}
                >
                  {type} ({bracelets.filter(b => b.braceletType === type).length})
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bracelets Table */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">
              {filterType === 'ALL' ? 'All Bracelets' : `${filterType} Bracelets`}
            </h2>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : filteredBracelets.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  No bracelets found {filterType !== 'ALL' && `for type ${filterType}`}
                </p>
                <PrimaryButton onClick={() => setShowAddForm(true)}>
                  Add Your First Bracelet
                </PrimaryButton>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Images</th>
                      <th className="text-left py-3 px-4">Product</th>
                      <th className="text-left py-3 px-4">Type</th>
                      <th className="text-left py-3 px-4">Price</th>
                      <th className="text-left py-3 px-4">Stock</th>
                      <th className="text-left py-3 px-4">Specifications</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBracelets.map((bracelet) => (
                      <tr key={bracelet.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex space-x-1">
                            {[bracelet.imageUrl, bracelet.imageUrl2, bracelet.imageUrl3].map((imageUrl, index) => (
                              imageUrl ? (
                                <img
                                  key={index}
                                  src={imageUrl}
                                  alt={`${bracelet.name} ${index + 1}`}
                                  className="w-8 h-8 object-cover rounded border"
                                />
                              ) : (
                                <div key={index} className="w-8 h-8 bg-gray-100 rounded border flex items-center justify-center">
                                  <span className="text-gray-400 text-xs">{index + 1}</span>
                                </div>
                              )
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{bracelet.name}</p>
                            <p className="text-sm text-gray-500">/{bracelet.slug}</p>
                            {bracelet.description && (
                              <p className="text-xs text-gray-400 mt-1 truncate max-w-xs">
                                {bracelet.description}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col space-y-1">
                            <span className={`px-2 py-1 rounded-full text-xs text-center ${
                              bracelet.braceletType === 'CHAIN' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              {bracelet.braceletType}
                            </span>
                            {bracelet.featured && (
                              <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 text-center">
                                Featured
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium">€{(bracelet.basePriceCents / 100).toFixed(2)}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            <span className={`font-medium ${
                              bracelet.stock === 0 ? 'text-red-600' : 
                              bracelet.stock < 10 ? 'text-yellow-600' : 'text-green-600'
                            }`}>
                              {bracelet.stock}
                            </span>
                            <span className="text-gray-500"> units</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm space-y-1">
                            <div>{bracelet.lengthMm}mm length</div>
                            {bracelet.thickness && <div>{bracelet.thickness}mm thick</div>}
                            {bracelet.color && <div>{bracelet.color}</div>}
                            {bracelet.metalType && <div className="text-xs text-gray-500">{bracelet.metalType.replace(/_/g, ' ')}</div>}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            bracelet.active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {bracelet.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col space-y-1">
                            <button
                              onClick={() => setEditingBracelet(bracelet)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleToggleActive(bracelet)}
                              className="text-yellow-600 hover:text-yellow-800 text-sm"
                            >
                              {bracelet.active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDelete(bracelet.id)}
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
        {(showAddForm || editingBracelet) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-6xl w-full p-8 max-h-[95vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">
                  {editingBracelet ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingBracelet(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <BraceletForm
                bracelet={editingBracelet}
                onSave={(bracelet) => {
                  if (editingBracelet) {
                    setBracelets(bracelets.map(b => b.id === bracelet.id ? bracelet : b));
                  } else {
                    setBracelets([...bracelets, bracelet]);
                  }
                  setShowAddForm(false);
                  setEditingBracelet(null);
                }}
                onCancel={() => {
                  setShowAddForm(false);
                  setEditingBracelet(null);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

interface BraceletFormProps {
  bracelet: Bracelet | null;
  onSave: (bracelet: Bracelet) => void;
  onCancel: () => void;
}

function BraceletForm({ bracelet, onSave, onCancel }: BraceletFormProps) {
  const [formData, setFormData] = useState({
    slug: bracelet?.slug || '',
    name: bracelet?.name || '',
    description: bracelet?.description || '',
    svgPath: bracelet?.svgPath || '',
    imageUrl: bracelet?.imageUrl || '',
    imageUrl2: bracelet?.imageUrl2 || '',
    imageUrl3: bracelet?.imageUrl3 || '',
    lengthMm: bracelet?.lengthMm || 180,
    basePriceCents: bracelet?.basePriceCents || 0,
    braceletType: bracelet?.braceletType || 'CHAIN' as 'CHAIN' | 'BEADS',
    thickness: bracelet?.thickness || 2.0,
    color: bracelet?.color || '',
    metalType: bracelet?.metalType || '',
    chainType: bracelet?.chainType || '',
    stock: bracelet?.stock || 0,
    featured: bracelet?.featured ?? false,
    active: bracelet?.active ?? true,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const url = bracelet 
        ? `/api/admin/bracelets/${bracelet.id}` 
        : '/api/admin/bracelets';
      
      const method = bracelet ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const savedBracelet = await response.json();
        onSave(savedBracelet);
      }
    } catch (error) {
      console.error('Failed to save bracelet:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Elegant Gold Chain Bracelet"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug (URL-friendly name)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., elegant-gold-chain-bracelet"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Describe your bracelet's features, materials, and style..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bracelet Type
            </label>
            <select
              value={formData.braceletType}
              onChange={(e) => setFormData({ ...formData, braceletType: e.target.value as 'CHAIN' | 'BEADS' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {BRACELET_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Images */}
        <div className="bg-white p-6 rounded-lg border">
          <MultipleImageUpload
            images={{
              imageUrl: formData.imageUrl,
              imageUrl2: formData.imageUrl2,
              imageUrl3: formData.imageUrl3
            }}
            onImagesChange={(images) => setFormData({ ...formData, ...images })}
            disabled={loading}
          />
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing & Inventory</h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={(formData.basePriceCents / 100).toFixed(2)}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  basePriceCents: Math.round(parseFloat(e.target.value) * 100)
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Length (mm)
              </label>
              <input
                type="number"
                value={formData.lengthMm}
                onChange={(e) => setFormData({ ...formData, lengthMm: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Specifications</h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thickness (mm)
              </label>
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  {[1.5, 2.0, 2.5, 3.0, 3.5, 4.0].map((thickness) => (
                    <button
                      key={thickness}
                      type="button"
                      className={`p-2 border rounded text-sm transition-colors ${
                        formData.thickness === thickness
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData({ ...formData, thickness })}
                    >
                      {thickness}mm
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  step="0.1"
                  value={formData.thickness}
                  onChange={(e) => setFormData({ ...formData, thickness: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Custom thickness..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {['Gold', 'Silver', 'Rose Gold', 'White Gold'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`p-2 border rounded text-sm transition-colors ${
                        formData.color.toLowerCase() === color.toLowerCase()
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData({ ...formData, color })}
                    >
                      {color}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Custom color..."
                />
              </div>
            </div>
          </div>

          {formData.braceletType === 'CHAIN' && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Metal Type
                </label>
                <select
                  value={formData.metalType}
                  onChange={(e) => setFormData({ ...formData, metalType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Metal Type</option>
                  {METAL_TYPES.map(type => (
                    <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chain Type
                </label>
                <select
                  value={formData.chainType}
                  onChange={(e) => setFormData({ ...formData, chainType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Chain Type</option>
                  {CHAIN_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Technical Details (Optional) */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Technical Details (Optional)</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SVG Path
            </label>
            <textarea
              value={formData.svgPath}
              onChange={(e) => setFormData({ ...formData, svgPath: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="SVG path for technical representation (optional)"
            />
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Settings</h3>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="mr-2"
              />
              <label className="text-sm font-medium text-gray-700">
                Featured Product
              </label>
              <span className="text-xs text-gray-500 ml-2">(Show prominently on homepage)</span>
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
              <span className="text-xs text-gray-500 ml-2">(Available for purchase)</span>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex space-x-4 pt-4">
          <PrimaryButton type="submit" disabled={loading}>
            {loading ? 'Saving...' : (bracelet ? 'Update Bracelet' : 'Create Bracelet')}
          </PrimaryButton>
          <SecondaryButton type="button" onClick={onCancel}>
            Cancel
          </SecondaryButton>
        </div>
      </form>
    </div>
  );
}