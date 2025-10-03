"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/Common';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Button';
import ImageUpload from '@/components/admin/ImageUpload';
import ChainModal from '@/components/ui/ChainModal';

interface Chain {
  id: string;
  name: string;
  type: string;
  description: string;
  priceCents: number;
  lengthMm: number;
  thickness: number;
  metalType: string;
  imageUrl?: string;
  svgPath?: string;
  active: boolean;
  createdAt: string;
}

const CHAIN_TYPES = ['CABLE', 'CURB', 'FIGARO', 'ROPE', 'BOX', 'SNAKE', 'HERRINGBONE', 'BYZANTINE'];
const METAL_TYPES = ['GOLD', 'SILVER', 'ROSE_GOLD', 'WHITE_GOLD', 'PLATINUM', 'STAINLESS_STEEL'];

export default function AdminChainsPage() {
  const [chains, setChains] = useState<Chain[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingChain, setEditingChain] = useState<Chain | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');

  useEffect(() => {
    fetchChains();
  }, []);

  const fetchChains = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/chains', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setChains(data);
      }
    } catch (error) {
      console.error('Failed to fetch chains:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChain = (chain: Chain) => {
    if (editingChain) {
      setChains(chains.map(c => c.id === chain.id ? chain : c));
      setEditingChain(null);
    } else {
      setChains([chain, ...chains]);
    }
    setShowAddForm(false);
  };

  const handleToggleActive = async (chain: Chain) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/chains/${chain.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...chain, active: !chain.active })
      });

      if (response.ok) {
        const updatedChain = await response.json();
        setChains(chains.map(c => c.id === chain.id ? updatedChain : c));
      }
    } catch (error) {
      console.error('Failed to toggle chain status:', error);
    }
  };

  const handleDelete = async (chainId: string) => {
    if (confirm('Are you sure you want to delete this chain?')) {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`/api/admin/chains/${chainId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          setChains(chains.filter(c => c.id !== chainId));
        }
      } catch (error) {
        console.error('Failed to delete chain:', error);
      }
    }
  };

  const filteredChains = filterType === 'ALL' 
    ? chains 
    : chains.filter(chain => chain.type === filterType);

  // Get unique types from chains data
  const uniqueTypes = Array.from(new Set(chains.map(chain => chain.type))).sort();
  
  const chainsByType = uniqueTypes.reduce((acc, type) => {
    acc[type] = chains.filter(c => c.type === type).length;
    return acc;
  }, {} as Record<string, number>);

  // Calculate statistics
  const activeChains = chains.filter(c => c.active).length;
  const avgPrice = chains.length > 0 
    ? (chains.reduce((sum, c) => sum + c.priceCents, 0) / chains.length / 100).toFixed(2)
    : '0.00';

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chains Management</h1>
            <p className="text-gray-600">Manage your chain types and configurations</p>
          </div>
          <PrimaryButton onClick={() => setShowAddForm(true)}>
            Add New Chain
          </PrimaryButton>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{chains.length}</div>
                <p className="text-sm text-gray-500">Total Chains</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{activeChains}</div>
                <p className="text-sm text-gray-500">Active</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{uniqueTypes.length}</div>
                <p className="text-sm text-gray-500">Chain Types</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">€{avgPrice}</div>
                <p className="text-sm text-gray-500">Avg Price</p>
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
                All ({chains.length})
              </button>
              {uniqueTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    filterType === type
                      ? 'bg-blue-100 text-blue-800 border-blue-300'
                      : 'bg-gray-100 text-gray-700 border-gray-300'
                  }`}
                >
                  {type} ({chainsByType[type] || 0})
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chains Table */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">All Chains</h2>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : chains.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No chains found</p>
                <PrimaryButton onClick={() => setShowAddForm(true)}>
                  Add Your First Chain
                </PrimaryButton>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Image</th>
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Type</th>
                      <th className="text-left py-3 px-4">Metal</th>
                      <th className="text-left py-3 px-4">Length</th>
                      <th className="text-left py-3 px-4">Thickness</th>
                      <th className="text-left py-3 px-4">Price</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredChains.map((chain) => (
                      <tr key={chain.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          {chain.imageUrl ? (
                            <div className="relative w-12 h-12 rounded overflow-hidden">
                              <Image
                                src={chain.imageUrl}
                                alt={chain.name}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-xs text-gray-500">No Image</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{chain.name}</p>
                            <p className="text-sm text-gray-500">{chain.description}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                            {chain.type}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-600">
                            {chain.metalType.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4">{chain.lengthMm}mm</td>
                        <td className="py-3 px-4">{chain.thickness}mm</td>
                        <td className="py-3 px-4">
                          €{(chain.priceCents / 100).toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            chain.active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {chain.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setEditingChain(chain)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleToggleActive(chain)}
                              className="text-yellow-600 hover:text-yellow-800 text-sm"
                            >
                              {chain.active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDelete(chain.id)}
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

        {/* Add/Edit Form */}
        {(showAddForm || editingChain) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl max-h-[90vh] overflow-auto">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingChain ? 'Edit Chain' : 'Add New Chain'}
                </h3>
                <ChainForm
                  chain={editingChain}
                  onSave={handleSaveChain}
                  onCancel={() => {
                    setShowAddForm(false);
                    setEditingChain(null);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

interface ChainFormProps {
  chain: Chain | null;
  onSave: (chain: Chain) => void;
  onCancel: () => void;
}

function ChainForm({ chain, onSave, onCancel }: ChainFormProps) {
  const [formData, setFormData] = useState({
    name: chain?.name || '',
    type: chain?.type || 'CABLE',
    description: chain?.description || '',
    priceCents: chain?.priceCents || 0,
    lengthMm: chain?.lengthMm || 180,
    thickness: chain?.thickness || 2.0,
    metalType: chain?.metalType || 'GOLD',
    imageUrl: chain?.imageUrl || '',
    svgPath: chain?.svgPath || '',
    active: chain?.active ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const url = chain 
        ? `/api/admin/chains/${chain.id}` 
        : '/api/admin/chains';
      
      const method = chain ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const savedChain = await response.json();
        onSave(savedChain);
      }
    } catch (error) {
      console.error('Failed to save chain:', error);
    } finally {
      setLoading(false);
    }
  };

  const chainTypeOptions = [
    { value: 'CABLE', label: 'Cable Chain', description: 'Classic oval links' },
    { value: 'CURB', label: 'Curb Chain', description: 'Flat interlocking links' },
    { value: 'FIGARO', label: 'Figaro Chain', description: 'Alternating link pattern' },
    { value: 'ROPE', label: 'Rope Chain', description: 'Twisted rope design' },
    { value: 'BOX', label: 'Box Chain', description: 'Square box links' },
    { value: 'SNAKE', label: 'Snake Chain', description: 'Smooth flexible design' },
    { value: 'HERRINGBONE', label: 'Herringbone', description: 'Flat chevron pattern' },
    { value: 'BYZANTINE', label: 'Byzantine', description: 'Intricate woven links' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name and Type */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chain Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="e.g., Premium Cable Chain"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chain Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            {chainTypeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Describe the chain style and characteristics..."
        />
      </div>

      {/* Length Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Chain Length
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { mm: 160, label: '16cm - Tight fit', description: 'Perfect for wrist size 128-144mm' },
            { mm: 180, label: '18cm - Standard', description: 'Perfect for wrist size 144-162mm' },
            { mm: 200, label: '20cm - Comfortable', description: 'Perfect for wrist size 160-180mm' },
            { mm: 220, label: '22cm - Loose fit', description: 'Perfect for wrist size 176-198mm' }
          ].map((option) => (
            <button
              key={option.mm}
              type="button"
              onClick={() => setFormData({ ...formData, lengthMm: option.mm })}
              className={`p-3 border rounded-lg text-left transition-all ${
                formData.lengthMm === option.mm
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              title={option.description}
            >
              <div className="font-medium text-sm">{option.label}</div>
              <div className="text-xs text-gray-500 mt-1">{option.mm}mm</div>
            </button>
          ))}
        </div>
      </div>

      {/* Price and Thickness */}
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
            Thickness (mm)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.thickness}
            onChange={(e) => setFormData({ ...formData, thickness: parseFloat(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      {/* Metal Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Metal Type
        </label>
        <div className="grid grid-cols-3 gap-2">
          {METAL_TYPES.map((metal) => (
            <button
              key={metal}
              type="button"
              className={`p-2 border rounded text-sm transition-colors ${
                formData.metalType === metal
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setFormData({ ...formData, metalType: metal })}
            >
              {metal.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Chain Image
        </label>
        <ImageUpload
          category="chains"
          currentImageUrl={formData.imageUrl}
          onImageUploaded={(imageUrl) => setFormData({ ...formData, imageUrl })}
        />
      </div>

      {/* SVG Path */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          SVG Path (Optional)
        </label>
        <textarea
          value={formData.svgPath}
          onChange={(e) => setFormData({ ...formData, svgPath: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="SVG path for chain pattern visualization..."
        />
      </div>

      {/* Active Status */}
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

      {/* Form Actions */}
      <div className="flex space-x-4 pt-4">
        <PrimaryButton type="submit" disabled={loading}>
          {loading ? 'Saving...' : (chain ? 'Update' : 'Create')}
        </PrimaryButton>
        <SecondaryButton type="button" onClick={onCancel}>
          Cancel
        </SecondaryButton>
      </div>

      {/* Chain Preview Modal */}
      <ChainModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        chainType={formData.type}
        imagePath={formData.imageUrl || `/images/chains/${formData.type.toLowerCase()}-chain.svg`}
      />
    </form>
  );
}