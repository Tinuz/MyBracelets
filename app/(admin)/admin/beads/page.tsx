"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/Common';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Button';
import ImageUpload from '@/components/admin/ImageUpload';
import ColorPicker from '@/components/admin/ColorPicker';

interface Bead {
  id: string;
  name: string;
  color: string;
  colorHex: string;
  priceCents: number;
  diameterMm: number;
  imageUrl: string;
  active: boolean;
  createdAt: string;
}

export default function AdminBeadsPage() {
  const [beads, setBeads] = useState<Bead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBead, setEditingBead] = useState<Bead | null>(null);
  const [filterColor, setFilterColor] = useState<string>('ALL');

  useEffect(() => {
    fetchBeads();
  }, []);

  const fetchBeads = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/beads', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBeads(data);
      }
    } catch (error) {
      console.error('Failed to fetch beads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (beadId: string) => {
    if (!confirm('Are you sure you want to delete this bead?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/beads/${beadId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setBeads(beads.filter(b => b.id !== beadId));
      }
    } catch (error) {
      console.error('Failed to delete bead:', error);
    }
  };

  const handleToggleActive = async (bead: Bead) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/beads/${bead.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          active: !bead.active
        })
      });

      if (response.ok) {
        setBeads(beads.map(b => 
          b.id === bead.id ? { ...b, active: !b.active } : b
        ));
      }
    } catch (error) {
      console.error('Failed to update bead:', error);
    }
  };

  const filteredBeads = filterColor === 'ALL' 
    ? beads 
    : beads.filter(bead => bead.color === filterColor);

  // Get unique colors from beads data
  const uniqueColors = Array.from(new Set(beads.map(bead => bead.color))).sort();
  
  const beadsByColor = uniqueColors.reduce((acc, color) => {
    acc[color] = beads.filter(b => b.color === color).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Beads Management</h1>
            <p className="text-gray-600">Manage your bead inventory</p>
          </div>
          <PrimaryButton onClick={() => setShowAddForm(true)}>
            Add New Bead
          </PrimaryButton>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{beads.length}</p>
                <p className="text-sm text-gray-500">Total Beads</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {beads.filter(b => b.active).length}
                </p>
                <p className="text-sm text-gray-500">Active</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {Object.keys(beadsByColor).filter(color => beadsByColor[color] > 0).length}
                </p>
                <p className="text-sm text-gray-500">Colors</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  €{(beads.reduce((sum, b) => sum + b.priceCents, 0) / 100 / beads.length || 0).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">Avg Price</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Color Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterColor('ALL')}
                className={`px-3 py-1 rounded-full text-sm ${
                  filterColor === 'ALL'
                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                    : 'bg-gray-100 text-gray-700 border-gray-300'
                } border`}
              >
                All ({beads.length})
              </button>
              {uniqueColors.map(color => (
                <button
                  key={color}
                  onClick={() => setFilterColor(color)}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    filterColor === color
                      ? 'bg-blue-100 text-blue-800 border-blue-300'
                      : 'bg-gray-100 text-gray-700 border-gray-300'
                  }`}
                >
                  {color} ({beadsByColor[color] || 0})
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Beads Grid */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">
              {filterColor === 'ALL' ? 'All Beads' : `${filterColor} Beads`}
            </h2>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : filteredBeads.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  No beads found {filterColor !== 'ALL' && `for color ${filterColor}`}
                </p>
                <PrimaryButton onClick={() => setShowAddForm(true)}>
                  Add Your First Bead
                </PrimaryButton>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredBeads.map((bead) => (
                  <div key={bead.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="relative aspect-square mb-3 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={bead.imageUrl}
                        alt={bead.name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">{bead.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          bead.active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {bead.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        <p>Color: <span className="font-medium">{bead.color}</span></p>
                        <p>Size: {bead.diameterMm}mm</p>
                        <p className="text-lg font-bold text-gray-900">
                          €{(bead.priceCents / 100).toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="flex space-x-2 pt-2">
                        <button
                          onClick={() => setEditingBead(bead)}
                          className="flex-1 text-blue-600 hover:text-blue-800 text-sm py-1 px-2 border border-blue-200 rounded hover:bg-blue-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleActive(bead)}
                          className="flex-1 text-yellow-600 hover:text-yellow-800 text-sm py-1 px-2 border border-yellow-200 rounded hover:bg-yellow-50"
                        >
                          {bead.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(bead.id)}
                          className="flex-1 text-red-600 hover:text-red-800 text-sm py-1 px-2 border border-red-200 rounded hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Form Modal */}
        {(showAddForm || editingBead) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">
                {editingBead ? 'Edit Bead' : 'Add New Bead'}
              </h3>
              
              <BeadForm
                bead={editingBead}
                onSave={(bead) => {
                  if (editingBead) {
                    setBeads(beads.map(b => b.id === bead.id ? bead : b));
                  } else {
                    setBeads([...beads, bead]);
                  }
                  setShowAddForm(false);
                  setEditingBead(null);
                }}
                onCancel={() => {
                  setShowAddForm(false);
                  setEditingBead(null);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

interface BeadFormProps {
  bead: Bead | null;
  onSave: (bead: Bead) => void;
  onCancel: () => void;
}

function BeadForm({ bead, onSave, onCancel }: BeadFormProps) {
  const [formData, setFormData] = useState({
    name: bead?.name || '',
    color: bead?.color || 'BLUE',
    colorHex: bead?.colorHex || '#3B82F6',
    priceCents: bead?.priceCents || 0,
    diameterMm: bead?.diameterMm || 8,
    imageUrl: bead?.imageUrl || '',
    active: bead?.active ?? true,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const url = bead 
        ? `/api/admin/beads/${bead.id}` 
        : '/api/admin/beads';
      
      const method = bead ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const savedBead = await response.json();
        onSave(savedBead);
      }
    } catch (error) {
      console.error('Failed to save bead:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Color
        </label>
        <ColorPicker
          label="Choose bead color"
          colorName={formData.color}
          colorHex={formData.colorHex}
          onColorChange={(colorName, colorHex) => 
            setFormData(prev => ({ 
              ...prev, 
              color: colorName, 
              colorHex: colorHex 
            }))
          }
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
            Diameter (mm)
          </label>
          <input
            type="number"
            value={formData.diameterMm}
            onChange={(e) => setFormData({ ...formData, diameterMm: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image
        </label>
        <ImageUpload
          category="beads"
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
          {loading ? 'Saving...' : (bead ? 'Update' : 'Create')}
        </PrimaryButton>
        <SecondaryButton type="button" onClick={onCancel}>
          Cancel
        </SecondaryButton>
      </div>
    </form>
  );
}