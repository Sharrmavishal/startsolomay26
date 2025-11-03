import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, MessageSquare, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import { supabase, auth } from '../../lib/supabase';
import { notificationService } from '../../lib/notifications/notificationService';

interface Mentor {
  id: string;
  display_name: string;
  full_name: string;
  bio: string;
  industry: string;
  avatar_url: string | null;
  free_sessions_per_month: number;
  free_sessions_used_this_month: number;
  free_sessions_reset_date: string;
}

const MentorSessionBooking: React.FC = () => {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [currentMemberId, setCurrentMemberId] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);
  const [activeTab, setActiveTab] = useState<'free' | 'paid'>('free');
  const [formData, setFormData] = useState({
    scheduled_at: '',
    duration_minutes: 60,
    timezone: 'Asia/Kolkata',
    mentee_notes: '',
  });

  useEffect(() => {
    loadCurrentMember();
    loadMentors();
  }, []);

  const loadCurrentMember = async () => {
    try {
      const { data: { user } } = await auth.getUser();
      if (!user) {
        navigate('/community');
        return;
      }

      const { data: member } = await supabase
        .from('community_members')
        .select('id, vetting_status')
        .eq('user_id', user.id)
        .maybeSingle();

      if (member) {
        if (member.vetting_status !== 'vetted') {
          alert('You need to be vetted to book mentor sessions.');
          navigate('/community');
          return;
        }
        setCurrentMemberId(member.id);
      }
    } catch (error) {
      console.error('Error loading member:', error);
    }
  };

  const loadMentors = async () => {
    try {
      setLoading(true);
      
      // Get current member ID first to exclude self
      const { data: { user } } = await auth.getUser();
      if (!user) return;
      
      const { data: currentMember } = await supabase
        .from('community_members')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      // Load mentors with free session availability, excluding self
      let query = supabase
        .from('community_members')
        .select('id, display_name, full_name, bio, industry, avatar_url, free_sessions_per_month, free_sessions_used_this_month, free_sessions_reset_date')
        .eq('role', 'mentor')
        .eq('vetting_status', 'vetted')
        .order('created_at', { ascending: false });
      
      // Exclude current user if they're a mentor
      if (currentMember) {
        query = query.neq('id', currentMember.id);
      }
      
      const { data, error } = await query;

      if (error) throw error;

      // Check and reset monthly limits if needed
      const today = new Date();
      const mentorsWithAvailability = await Promise.all(
        (data || []).map(async (mentor) => {
          const resetDate = mentor.free_sessions_reset_date 
            ? new Date(mentor.free_sessions_reset_date)
            : new Date(today.getFullYear(), today.getMonth(), 1);

          // If reset date has passed, reset the counter
          if (resetDate < today) {
            const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            await supabase
              .from('community_members')
              .update({
                free_sessions_used_this_month: 0,
                free_sessions_reset_date: firstOfMonth.toISOString().split('T')[0],
              })
              .eq('id', mentor.id);
            
            return {
              ...mentor,
              free_sessions_used_this_month: 0,
              free_sessions_reset_date: firstOfMonth.toISOString().split('T')[0],
            };
          }

          return mentor;
        })
      );

      setMentors(mentorsWithAvailability);
    } catch (error) {
      console.error('Error loading mentors:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAvailableFreeSessions = (mentor: Mentor): number => {
    const available = (mentor.free_sessions_per_month || 5) - (mentor.free_sessions_used_this_month || 0);
    return Math.max(0, available);
  };

  const handleBookSession = async () => {
    if (!selectedMentor || !currentMemberId) return;

    // Prevent booking with self
    if (selectedMentor.id === currentMemberId) {
      alert('You cannot book a session with yourself.');
      return;
    }

    const available = getAvailableFreeSessions(selectedMentor);
    if (available === 0) {
      alert('This mentor has no free sessions available this month.');
      return;
    }

    if (!formData.scheduled_at) {
      alert('Please select a date and time for the session.');
      return;
    }

    try {
      setBooking(true);

      // Create session record
      const { data: session, error: sessionError } = await supabase
        .from('mentor_sessions')
        .insert({
          mentor_id: selectedMentor.id,
          mentee_id: currentMemberId,
          session_type: 'free',
          scheduled_at: formData.scheduled_at,
          duration_minutes: formData.duration_minutes,
          timezone: formData.timezone,
          mentee_notes: formData.mentee_notes.trim() || null,
          status: 'pending',
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Update mentor's free session count
      await supabase
        .from('community_members')
        .update({
          free_sessions_used_this_month: (selectedMentor.free_sessions_used_this_month || 0) + 1,
        })
        .eq('id', selectedMentor.id);

      // Send notification to mentee
      const { data: menteeMember } = await supabase
        .from('community_members')
        .select('user_id')
        .eq('id', currentMemberId)
        .single();

      if (menteeMember?.user_id) {
        await notificationService.sendSessionBookingNotification(
          menteeMember.user_id,
          'free',
          selectedMentor.display_name || selectedMentor.full_name,
          formData.scheduled_at,
          session.id
        );
      }

      alert('Session booked successfully! The mentor will be notified and confirm the session.');
      setSelectedMentor(null);
      setFormData({
        scheduled_at: '',
        duration_minutes: 60,
        timezone: 'Asia/Kolkata',
        mentee_notes: '',
      });
      await loadMentors();
    } catch (error: any) {
      console.error('Error booking session:', error);
      alert(error.message || 'Failed to book session. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D3A6B]"></div>
          <p className="mt-4 text-gray-600">Loading mentors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-[#1D3A6B]">Book a Mentor Session</h1>
          <p className="text-gray-600 mt-2">Connect with experienced mentors for free 1:1 guidance</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-gray-200 mb-6">
          <button
            onClick={() => {
              setActiveTab('free');
              setSelectedMentor(null);
            }}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'free'
                ? 'border-[#1D3A6B] text-[#1D3A6B]'
                : 'border-transparent text-gray-600 hover:text-[#1D3A6B]'
            }`}
          >
            Free Sessions
          </button>
          <button
            onClick={() => navigate('/community/sessions/book-paid')}
            className="px-4 py-2 font-medium transition-colors border-b-2 border-transparent text-gray-600 hover:text-[#1D3A6B]"
          >
            Paid Sessions
          </button>
        </div>

        {selectedMentor ? (
          /* Booking Form */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedMentor(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircle className="h-5 w-5 text-gray-600" />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-[#1D3A6B]">Book Session with {selectedMentor.display_name || selectedMentor.full_name}</h2>
                  <p className="text-gray-600 mt-1">{selectedMentor.bio || 'Experienced mentor'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">Free Session Availability</span>
                </div>
                <p className="text-sm text-blue-800">
                  {getAvailableFreeSessions(selectedMentor) > 0 ? (
                    <>
                      {selectedMentor.display_name || selectedMentor.full_name} has <strong>{getAvailableFreeSessions(selectedMentor)} free session{getAvailableFreeSessions(selectedMentor) !== 1 ? 's' : ''}</strong> available this month.
                    </>
                  ) : (
                    <>
                      This mentor has no free sessions available this month. Sessions reset on the 1st of each month.
                    </>
                  )}
                </p>
              </div>

              {getAvailableFreeSessions(selectedMentor) > 0 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.scheduled_at}
                      onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="inline h-4 w-4 mr-1" />
                      Duration (minutes)
                    </label>
                    <select
                      value={formData.duration_minutes}
                      onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                    >
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">60 minutes</option>
                      <option value="90">90 minutes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MessageSquare className="inline h-4 w-4 mr-1" />
                      What would you like to discuss? (Optional)
                    </label>
                    <textarea
                      value={formData.mentee_notes}
                      onChange={(e) => setFormData({ ...formData, mentee_notes: e.target.value })}
                      rows={4}
                      placeholder="Briefly describe what you'd like help with..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                    />
                  </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleBookSession}
                  disabled={booking || !formData.scheduled_at}
                  className="flex items-center gap-2 bg-[#1D3A6B] text-white px-6 py-2 rounded-lg hover:bg-[#152A4F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="h-5 w-5" />
                  {booking ? 'Booking...' : 'Book Free Session'}
                </button>
                <button
                  onClick={() => {
                    setSelectedMentor(null);
                    setFormData({
                      scheduled_at: '',
                      duration_minutes: 60,
                      timezone: 'Asia/Kolkata',
                      mentee_notes: '',
                    });
                  }}
                  className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
                </>
              )}
            </div>
          </div>
        ) : (
          /* Mentor List */
          <div className="space-y-6">
            {mentors.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <User className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Mentors Available</h3>
                <p className="text-gray-600">Check back later for available mentors.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mentors.map((mentor) => {
                  const available = getAvailableFreeSessions(mentor);
                  return (
                    <div
                      key={mentor.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        {mentor.avatar_url ? (
                          <img
                            src={mentor.avatar_url}
                            alt={mentor.display_name || mentor.full_name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-[#1D3A6B] flex items-center justify-center text-white text-xl font-bold">
                            {(mentor.display_name || mentor.full_name)[0].toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-[#1D3A6B]">
                            {mentor.display_name || mentor.full_name}
                          </h3>
                          {mentor.industry && (
                            <p className="text-sm text-gray-600">{mentor.industry}</p>
                          )}
                        </div>
                      </div>

                      {mentor.bio && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{mentor.bio}</p>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="text-sm">
                          {available > 0 ? (
                            <span className="text-green-600 font-medium">
                              {available} free session{available !== 1 ? 's' : ''} available
                            </span>
                          ) : (
                            <span className="text-gray-500">No free sessions this month</span>
                          )}
                        </div>
                        <button
                          onClick={() => setSelectedMentor(mentor)}
                          disabled={available === 0}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            available > 0
                              ? 'bg-[#1D3A6B] text-white hover:bg-[#152A4F]'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          Book Session
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        
        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Note:</p>
              <p>Mentors may set their availability preferences. The mentor will confirm your requested time slot or suggest an alternative.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorSessionBooking;

