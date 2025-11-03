import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Calendar, Clock, Users, Video } from 'lucide-react';
import { supabase, auth } from '../../lib/supabase';

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: 'webinar' as 'webinar' | 'workshop' | 'networking' | 'q-and-a',
    start_time: '',
    end_time: '',
    timezone: 'Asia/Kolkata',
    meeting_link: '',
    meeting_password: '',
    max_attendees: '',
    registration_deadline: '',
    ticket_price: '',
    commission_rate: '10',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to create an event');
      }

      // Get member ID
      const { data: member, error: memberError } = await supabase
        .from('community_members')
        .select('id, role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (memberError || !member) {
        throw new Error('Member profile not found. Please complete your profile first.');
      }

      // Check if user can create events (admin or mentor)
      if (member.role !== 'admin' && member.role !== 'mentor') {
        throw new Error('Only admins and mentors can create events.');
      }

      // Validate dates
      const startTime = new Date(formData.start_time);
      const endTime = new Date(formData.end_time);
      if (endTime <= startTime) {
        throw new Error('End time must be after start time');
      }

      const { data: event, error: insertError } = await supabase
        .from('community_events')
        .insert({
          organizer_id: member.id,
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          event_type: formData.event_type,
          start_time: formData.start_time,
          end_time: formData.end_time,
          timezone: formData.timezone,
          meeting_link: formData.meeting_link.trim() || null,
          meeting_password: formData.meeting_password.trim() || null,
          max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
          registration_deadline: formData.registration_deadline || null,
          ticket_price: formData.ticket_price ? parseFloat(formData.ticket_price) : 0,
          commission_rate: formData.commission_rate ? parseFloat(formData.commission_rate) : 10,
          registration_open: true,
          status: 'upcoming',
        })
        .select()
        .single();

      if (insertError) throw insertError;

      navigate(`/community/events/${event.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Set default times (next week, same time)
  const getDefaultStartTime = () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(14, 0, 0, 0); // 2 PM
    return nextWeek.toISOString().slice(0, 16);
  };

  const getDefaultEndTime = () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(15, 30, 0, 0); // 3:30 PM (1.5 hours)
    return nextWeek.toISOString().slice(0, 16);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-[#1D3A6B]">Create New Event</h1>
            <button
              onClick={() => navigate('/community')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Type *
              </label>
              <select
                value={formData.event_type}
                onChange={(e) => handleInputChange('event_type', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                required
              >
                <option value="webinar">Webinar</option>
                <option value="workshop">Workshop</option>
                <option value="networking">Networking</option>
                <option value="q-and-a">Q&A Session</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Introduction to Solopreneurship"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                required
                maxLength={200}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={6}
                placeholder="Describe what attendees will learn or discuss..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.start_time}
                  onChange={(e) => handleInputChange('start_time', e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline h-4 w-4 mr-1" />
                  End Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.end_time}
                  onChange={(e) => handleInputChange('end_time', e.target.value)}
                  min={formData.start_time || new Date().toISOString().slice(0, 16)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Video className="inline h-4 w-4 mr-1" />
                Meeting Link (Zoom/Google Meet)
              </label>
              <input
                type="url"
                value={formData.meeting_link}
                onChange={(e) => handleInputChange('meeting_link', e.target.value)}
                placeholder="https://zoom.us/j/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Password (if required)
                </label>
                <input
                  type="text"
                  value={formData.meeting_password}
                  onChange={(e) => handleInputChange('meeting_password', e.target.value)}
                  placeholder="Optional"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="inline h-4 w-4 mr-1" />
                  Max Attendees (optional)
                </label>
                <input
                  type="number"
                  value={formData.max_attendees}
                  onChange={(e) => handleInputChange('max_attendees', e.target.value)}
                  placeholder="Leave empty for unlimited"
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ticket Price (₹)
                </label>
                <input
                  type="number"
                  value={formData.ticket_price}
                  onChange={(e) => handleInputChange('ticket_price', e.target.value)}
                  placeholder="0 = Free event"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">Set to 0 for free events</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commission Rate (%)
                </label>
                <input
                  type="number"
                  value={formData.commission_rate}
                  onChange={(e) => handleInputChange('commission_rate', e.target.value)}
                  placeholder="10"
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">Platform commission percentage</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Deadline (optional)
              </label>
              <input
                type="datetime-local"
                value={formData.registration_deadline}
                onChange={(e) => handleInputChange('registration_deadline', e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/community')}
                className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.title.trim() || !formData.start_time || !formData.end_time}
                className="flex-1 bg-[#1D3A6B] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#152A4F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Event...' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
