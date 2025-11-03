import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, DollarSign, Clock, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface RateCard {
  id: string;
  session_type: string;
  session_type_label: string;
  price_per_hour: number;
  min_duration_minutes: number;
  max_duration_minutes: number;
  description: string | null;
  is_active: boolean;
  display_order: number;
}

interface RateCardManagementProps {
  mentorId: string | null;
}

const RateCardManagement: React.FC<RateCardManagementProps> = ({ mentorId }) => {
  const [rateCards, setRateCards] = useState<RateCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    session_type: '',
    session_type_label: '',
    price_per_hour: '',
    min_duration_minutes: 30,
    max_duration_minutes: 60,
    description: '',
    is_active: true,
    display_order: 0,
  });

  useEffect(() => {
    if (mentorId) {
      loadRateCards();
    }
  }, [mentorId]);

  const loadRateCards = async () => {
    if (!mentorId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mentor_rate_cards')
        .select('*')
        .eq('mentor_id', mentorId)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRateCards(data || []);
    } catch (error) {
      console.error('Error loading rate cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!mentorId) return;

    try {
      if (!formData.session_type || !formData.session_type_label || !formData.price_per_hour) {
        alert('Please fill in all required fields');
        return;
      }

      if (parseFloat(formData.price_per_hour) < 0) {
        alert('Price must be positive');
        return;
      }

      if (formData.max_duration_minutes < formData.min_duration_minutes) {
        alert('Max duration must be greater than or equal to min duration');
        return;
      }

      if (editingId) {
        // Update existing
        const { error } = await supabase
          .from('mentor_rate_cards')
          .update({
            session_type_label: formData.session_type_label.trim(),
            price_per_hour: parseFloat(formData.price_per_hour),
            min_duration_minutes: formData.min_duration_minutes,
            max_duration_minutes: formData.max_duration_minutes,
            description: formData.description.trim() || null,
            is_active: formData.is_active,
            display_order: formData.display_order,
          })
          .eq('id', editingId);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from('mentor_rate_cards')
          .insert({
            mentor_id: mentorId,
            session_type: formData.session_type.trim().toLowerCase().replace(/\s+/g, '-'),
            session_type_label: formData.session_type_label.trim(),
            price_per_hour: parseFloat(formData.price_per_hour),
            min_duration_minutes: formData.min_duration_minutes,
            max_duration_minutes: formData.max_duration_minutes,
            description: formData.description.trim() || null,
            is_active: formData.is_active,
            display_order: formData.display_order,
          });

        if (error) throw error;
      }

      setShowAddForm(false);
      setEditingId(null);
      setFormData({
        session_type: '',
        session_type_label: '',
        price_per_hour: '',
        min_duration_minutes: 30,
        max_duration_minutes: 60,
        description: '',
        is_active: true,
        display_order: 0,
      });
      await loadRateCards();
    } catch (error: any) {
      console.error('Error saving rate card:', error);
      if (error.code === '23505') {
        alert('A rate card with this session type already exists');
      } else {
        alert(error.message || 'Failed to save rate card');
      }
    }
  };

  const handleEdit = (card: RateCard) => {
    setEditingId(card.id);
    setFormData({
      session_type: card.session_type,
      session_type_label: card.session_type_label,
      price_per_hour: card.price_per_hour.toString(),
      min_duration_minutes: card.min_duration_minutes,
      max_duration_minutes: card.max_duration_minutes,
      description: card.description || '',
      is_active: card.is_active,
      display_order: card.display_order,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this rate card?')) return;

    try {
      const { error } = await supabase
        .from('mentor_rate_cards')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadRateCards();
    } catch (error: any) {
      console.error('Error deleting rate card:', error);
      alert(error.message || 'Failed to delete rate card');
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('mentor_rate_cards')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      await loadRateCards();
    } catch (error: any) {
      console.error('Error toggling rate card:', error);
      alert(error.message || 'Failed to update rate card');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D3A6B]"></div>
        <p className="mt-2 text-gray-600">Loading rate cards...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1D3A6B]">Rate Cards</h2>
          <p className="text-gray-600 text-sm mt-1">Set pricing for different types of paid sessions</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              session_type: '',
              session_type_label: '',
              price_per_hour: '',
              min_duration_minutes: 30,
              max_duration_minutes: 60,
              description: '',
              is_active: true,
              display_order: rateCards.length,
            });
            setShowAddForm(true);
          }}
          className="flex items-center gap-2 bg-[#1D3A6B] text-white px-4 py-2 rounded-lg hover:bg-[#152A4F] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Rate Card
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#1D3A6B]">
              {editingId ? 'Edit Rate Card' : 'Add New Rate Card'}
            </h3>
            <button
              onClick={() => {
                setShowAddForm(false);
                setEditingId(null);
                setFormData({
                  session_type: '',
                  session_type_label: '',
                  price_per_hour: '',
                  min_duration_minutes: 30,
                  max_duration_minutes: 60,
                  description: '',
                  is_active: true,
                  display_order: 0,
                });
              }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            {!editingId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Type (Internal) *
                </label>
                <input
                  type="text"
                  value={formData.session_type}
                  onChange={(e) => setFormData({ ...formData, session_type: e.target.value })}
                  placeholder="e.g., strategy, technical, business"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">Used internally (lowercase, no spaces)</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Type Label (Display Name) *
              </label>
              <input
                type="text"
                value={formData.session_type_label}
                onChange={(e) => setFormData({ ...formData, session_type_label: e.target.value })}
                placeholder="e.g., Business Strategy, Technical Review"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="inline h-4 w-4 mr-1" />
                  Price per Hour (₹) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price_per_hour}
                  onChange={(e) => setFormData({ ...formData, price_per_hour: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline h-4 w-4 mr-1" />
                  Min Duration (minutes)
                </label>
                <input
                  type="number"
                  min="15"
                  step="15"
                  value={formData.min_duration_minutes}
                  onChange={(e) => setFormData({ ...formData, min_duration_minutes: parseInt(e.target.value) || 15 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline h-4 w-4 mr-1" />
                  Max Duration (minutes)
                </label>
                <input
                  type="number"
                  min="15"
                  step="15"
                  value={formData.max_duration_minutes}
                  onChange={(e) => setFormData({ ...formData, max_duration_minutes: parseInt(e.target.value) || 60 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Describe what this session type covers..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-[#1D3A6B] border-gray-300 rounded focus:ring-[#1D3A6B]"
                />
                <span className="text-sm font-medium text-gray-700">Active (visible to students)</span>
              </label>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-[#1D3A6B] text-white px-6 py-2 rounded-lg hover:bg-[#152A4F] transition-colors"
              >
                <Save className="h-4 w-4" />
                {editingId ? 'Update' : 'Create'} Rate Card
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingId(null);
                }}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {rateCards.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <DollarSign className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Rate Cards Yet</h3>
          <p className="text-gray-600 mb-4">Create your first rate card to start offering paid sessions</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 bg-[#1D3A6B] text-white px-6 py-2 rounded-lg hover:bg-[#152A4F] transition-colors"
          >
            <Plus className="h-5 w-5" />
            Create First Rate Card
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Session Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price/Hour
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rateCards.map((card) => (
                <tr key={card.id} className={card.is_active ? '' : 'opacity-60'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{card.session_type_label}</div>
                      {card.description && (
                        <div className="text-xs text-gray-500 mt-1">{card.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-[#1D3A6B]">₹{card.price_per_hour}/hr</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {card.min_duration_minutes} - {card.max_duration_minutes} min
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        card.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {card.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleActive(card.id, card.is_active)}
                        className={`${
                          card.is_active
                            ? 'text-orange-600 hover:text-orange-900'
                            : 'text-green-600 hover:text-green-900'
                        }`}
                        title={card.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {card.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleEdit(card)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(card.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RateCardManagement;

