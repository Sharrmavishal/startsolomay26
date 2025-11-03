import React, { useState, useEffect } from 'react';
import { Plus, X, Edit2, Trash2, Package } from 'lucide-react';
import { supabase, auth } from '../../lib/supabase';

interface EventProduct {
  id: string;
  event_id: string;
  mentor_id: string;
  product_name: string;
  description: string | null;
  price: number;
  commission_rate: number;
  is_active: boolean;
  display_order: number;
  purchase_count: number;
}

interface EventProductManagementProps {
  eventId: string;
  mentorId: string;
}

const EventProductManagement: React.FC<EventProductManagementProps> = ({ eventId, mentorId }) => {
  const [products, setProducts] = useState<EventProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    product_name: '',
    description: '',
    price: '',
    commission_rate: '',
  });

  useEffect(() => {
    loadProducts();
    loadDefaultCommissionRate();
  }, [eventId]);

  const loadDefaultCommissionRate = async () => {
    const { data } = await supabase
      .from('admin_settings')
      .select('value')
      .eq('key', 'event_product_commission_rate')
      .single();

    if (data && !formData.commission_rate) {
      setFormData(prev => ({ ...prev, commission_rate: data.value as string }));
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('event_products')
        .select('*')
        .eq('event_id', eventId)
        .eq('mentor_id', mentorId)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.product_name || !formData.price) {
      alert('Please fill in product name and price');
      return;
    }

    try {
      const price = parseFloat(formData.price);
      const commissionRate = parseFloat(formData.commission_rate || '10');
      const commissionAmount = (price * commissionRate) / 100;
      const mentorPayout = price - commissionAmount;

      if (editingId) {
        const { error } = await supabase
          .from('event_products')
          .update({
            product_name: formData.product_name.trim(),
            description: formData.description.trim() || null,
            price,
            commission_rate: commissionRate,
            commission_amount: commissionAmount,
            mentor_payout: mentorPayout,
          })
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const maxOrder = products.length > 0 ? Math.max(...products.map(p => p.display_order)) : 0;
        
        const { error } = await supabase
          .from('event_products')
          .insert({
            event_id: eventId,
            mentor_id: mentorId,
            product_name: formData.product_name.trim(),
            description: formData.description.trim() || null,
            price,
            commission_rate: commissionRate,
            commission_amount: commissionAmount,
            mentor_payout: mentorPayout,
            display_order: maxOrder + 1,
          });

        if (error) throw error;
      }

      setShowAddForm(false);
      setEditingId(null);
      setFormData({ product_name: '', description: '', price: '', commission_rate: '' });
      loadProducts();
      loadDefaultCommissionRate();
    } catch (error: any) {
      console.error('Error saving product:', error);
      alert(error.message || 'Failed to save product');
    }
  };

  const handleEdit = (product: EventProduct) => {
    setEditingId(product.id);
    setFormData({
      product_name: product.product_name,
      description: product.description || '',
      price: product.price.toString(),
      commission_rate: product.commission_rate.toString(),
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('event_products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadProducts();
    } catch (error: any) {
      console.error('Error deleting product:', error);
      alert(error.message || 'Failed to delete product');
    }
  };

  const handleToggleActive = async (product: EventProduct) => {
    try {
      const { error } = await supabase
        .from('event_products')
        .update({ is_active: !product.is_active })
        .eq('id', product.id);

      if (error) throw error;
      loadProducts();
    } catch (error: any) {
      console.error('Error toggling product:', error);
      alert(error.message || 'Failed to update product');
    }
  };

  if (loading) {
    return <div className="text-center py-4 text-gray-500">Loading products...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#1D3A6B] flex items-center gap-2">
          <Package className="h-5 w-5" />
          Event Products (Add-ons)
        </h3>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            if (showAddForm) {
              setEditingId(null);
              setFormData({ product_name: '', description: '', price: '', commission_rate: '' });
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#1D3A6B] text-white rounded-lg hover:bg-[#152A4F] transition-colors"
        >
          <Plus className="h-4 w-4" />
          {showAddForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
          <h4 className="font-semibold text-gray-900">
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.product_name}
              onChange={(e) => setFormData(prev => ({ ...prev, product_name: e.target.value }))}
              placeholder="e.g., Exclusive Resource Pack"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what buyers will get..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Commission Rate (%)
              </label>
              <input
                type="number"
                value={formData.commission_rate}
                onChange={(e) => setFormData(prev => ({ ...prev, commission_rate: e.target.value }))}
                placeholder="10"
                min="0"
                max="100"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Platform commission percentage</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#1D3A6B] text-white rounded-lg hover:bg-[#152A4F] transition-colors"
            >
              {editingId ? 'Update' : 'Add'} Product
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setEditingId(null);
                setFormData({ product_name: '', description: '', price: '', commission_rate: '' });
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {products.length === 0 && !showAddForm ? (
        <div className="text-center py-8 text-gray-500">
          <Package className="h-12 w-12 mx-auto mb-2 text-gray-400" />
          <p>No products added yet.</p>
          <p className="text-sm">Add products that attendees can purchase during this event.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {products.map((product) => (
            <div
              key={product.id}
              className={`flex items-center justify-between p-4 border rounded-lg ${
                product.is_active ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900">{product.product_name}</h4>
                  {!product.is_active && (
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">Inactive</span>
                  )}
                </div>
                {product.description && (
                  <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                )}
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>₹{product.price.toFixed(2)}</span>
                  <span>Commission: {product.commission_rate}%</span>
                  <span>Purchases: {product.purchase_count}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleActive(product)}
                  className={`px-3 py-1 rounded text-sm ${
                    product.is_active
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {product.is_active ? 'Active' : 'Inactive'}
                </button>
                <button
                  onClick={() => handleEdit(product)}
                  className="p-2 text-gray-600 hover:text-[#1D3A6B] hover:bg-gray-100 rounded transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventProductManagement;

