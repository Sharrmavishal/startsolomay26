import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, X, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AvailabilitySlot {
  id: string;
  available_date: string;
  start_time: string;
  end_time: string;
  timezone: string;
  is_booked: boolean;
}

interface MentorAvailabilityProps {
  mentorId: string | null;
}

const MentorAvailability: React.FC<MentorAvailabilityProps> = ({ mentorId }) => {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSlot, setNewSlot] = useState({
    available_date: '',
    start_time: '',
    end_time: '',
    timezone: 'Asia/Kolkata',
  });

  useEffect(() => {
    if (mentorId) {
      loadAvailability();
    }
  }, [mentorId]);

  const loadAvailability = async () => {
    if (!mentorId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mentor_availability')
        .select('*')
        .eq('mentor_id', mentorId)
        .gte('available_date', new Date().toISOString().split('T')[0])
        .order('available_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;
      setSlots((data as AvailabilitySlot[]) || []);
    } catch (error) {
      console.error('Error loading availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlot = async () => {
    if (!mentorId || !newSlot.available_date || !newSlot.start_time || !newSlot.end_time) {
      alert('Please fill all fields');
      return;
    }

    if (newSlot.end_time <= newSlot.start_time) {
      alert('End time must be after start time');
      return;
    }

    try {
      const { error } = await supabase
        .from('mentor_availability')
        .insert({
          mentor_id: mentorId,
          available_date: newSlot.available_date,
          start_time: newSlot.start_time,
          end_time: newSlot.end_time,
          timezone: newSlot.timezone,
          is_booked: false,
        });

      if (error) throw error;

      setNewSlot({
        available_date: '',
        start_time: '',
        end_time: '',
        timezone: 'Asia/Kolkata',
      });
      setShowAddForm(false);
      await loadAvailability();
    } catch (error: any) {
      console.error('Error adding availability:', error);
      alert(error.message || 'Failed to add availability slot');
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    if (!confirm('Are you sure you want to delete this availability slot?')) return;

    try {
      const { error } = await supabase
        .from('mentor_availability')
        .delete()
        .eq('id', slotId);

      if (error) throw error;
      await loadAvailability();
    } catch (error) {
      console.error('Error deleting availability:', error);
      alert('Failed to delete availability slot');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Group slots by date
  const groupedSlots = slots.reduce((acc, slot) => {
    if (!acc[slot.available_date]) {
      acc[slot.available_date] = [];
    }
    acc[slot.available_date].push(slot);
    return acc;
  }, {} as Record<string, AvailabilitySlot[]>);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D3A6B]"></div>
        <p className="mt-2 text-gray-600">Loading availability...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1D3A6B]">Availability Calendar</h2>
          <p className="text-gray-600 text-sm mt-1">Set your available time slots for sessions</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-[#1D3A6B] text-white px-4 py-2 rounded-lg hover:bg-[#152A4F] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Availability
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-[#1D3A6B] mb-4">Add Availability Slot</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Date
              </label>
              <input
                type="date"
                value={newSlot.available_date}
                onChange={(e) => setNewSlot({ ...newSlot, available_date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
                Start Time
              </label>
              <input
                type="time"
                value={newSlot.start_time}
                onChange={(e) => setNewSlot({ ...newSlot, start_time: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
                End Time
              </label>
              <input
                type="time"
                value={newSlot.end_time}
                onChange={(e) => setNewSlot({ ...newSlot, end_time: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleAddSlot}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Slot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Availability List */}
      {Object.keys(groupedSlots).length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Availability Set</h3>
          <p className="text-gray-600 mb-4">Add availability slots to let mentees know when you're available.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedSlots).map(([date, dateSlots]) => (
            <div key={date} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-[#1D3A6B] mb-4">{formatDate(date)}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {dateSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      slot.is_booked
                        ? 'bg-gray-50 border-gray-300'
                        : 'bg-green-50 border-green-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className={`h-4 w-4 ${slot.is_booked ? 'text-gray-500' : 'text-green-600'}`} />
                      <span className={`text-sm font-medium ${slot.is_booked ? 'text-gray-600' : 'text-green-800'}`}>
                        {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                      </span>
                      {slot.is_booked && (
                        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded">Booked</span>
                      )}
                    </div>
                    {!slot.is_booked && (
                      <button
                        onClick={() => handleDeleteSlot(slot.id)}
                        className="p-1 hover:bg-red-100 rounded transition-colors"
                        title="Delete slot"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MentorAvailability;

