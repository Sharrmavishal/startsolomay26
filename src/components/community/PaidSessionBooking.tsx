import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, MessageSquare, CheckCircle, XCircle, AlertCircle, DollarSign, CreditCard } from 'lucide-react';
import { supabase, auth } from '../../lib/supabase';
import { razorpayService } from '../../lib/payments/razorpay';
import { notificationService } from '../../lib/notifications/notificationService';

interface RateCard {
  id: string;
  session_type: string;
  session_type_label: string;
  price_per_hour: number;
  min_duration_minutes: number;
  max_duration_minutes: number;
  description: string | null;
}

interface Mentor {
  id: string;
  display_name: string;
  full_name: string;
  bio: string;
  industry: string;
  avatar_url: string | null;
  rate_cards: RateCard[];
}

const PaidSessionBooking: React.FC = () => {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [selectedRateCard, setSelectedRateCard] = useState<RateCard | null>(null);
  const [currentMemberId, setCurrentMemberId] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);
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
          alert('You need to be vetted to book paid mentor sessions.');
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
      
      // Load mentors with their active rate cards
      const { data: mentorsData, error: mentorsError } = await supabase
        .from('community_members')
        .select('id, display_name, full_name, bio, industry, avatar_url')
        .eq('role', 'mentor')
        .eq('vetting_status', 'vetted')
        .order('created_at', { ascending: false });

      if (mentorsError) throw mentorsError;

      // Load rate cards for each mentor
      const mentorsWithRateCards = await Promise.all(
        (mentorsData || []).map(async (mentor) => {
          const { data: rateCards } = await supabase
            .from('mentor_rate_cards')
            .select('*')
            .eq('mentor_id', mentor.id)
            .eq('is_active', true)
            .order('display_order', { ascending: true });

          return {
            ...mentor,
            rate_cards: rateCards || [],
          };
        })
      );

      // Only show mentors who have active rate cards
      setMentors(mentorsWithRateCards.filter(m => m.rate_cards.length > 0));
    } catch (error) {
      console.error('Error loading mentors:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = (rateCard: RateCard, durationMinutes: number): number => {
    const hours = durationMinutes / 60;
    return rateCard.price_per_hour * hours;
  };

  const handleBookSession = async () => {
    if (!selectedMentor || !selectedRateCard || !currentMemberId) return;

    if (!formData.scheduled_at) {
      alert('Please select a date and time for the session.');
      return;
    }

    if (formData.duration_minutes < selectedRateCard.min_duration_minutes || 
        formData.duration_minutes > selectedRateCard.max_duration_minutes) {
      alert(`Duration must be between ${selectedRateCard.min_duration_minutes} and ${selectedRateCard.max_duration_minutes} minutes.`);
      return;
    }

    try {
      setBooking(true);

      // Calculate pricing
      const basePrice = calculatePrice(selectedRateCard, formData.duration_minutes);
      
      // Get commission rate from admin settings
      const { data: settings } = await supabase
        .from('admin_settings')
        .select('value')
        .eq('key', 'session_commission_rate')
        .single();

      const commissionRate = settings ? parseFloat(settings.value as string) : 0.20; // Default 20%
      const commissionAmount = basePrice * commissionRate;
      const mentorPayout = basePrice - commissionAmount;

      // Create session record with pending payment
      const { data: session, error: sessionError } = await supabase
        .from('mentor_sessions')
        .insert({
          mentor_id: selectedMentor.id,
          mentee_id: currentMemberId,
          session_type: 'paid',
          scheduled_at: formData.scheduled_at,
          duration_minutes: formData.duration_minutes,
          timezone: formData.timezone,
          mentee_notes: formData.mentee_notes.trim() || null,
          price: basePrice,
          commission_rate: commissionRate,
          commission_amount: commissionAmount,
          mentor_payout: mentorPayout,
          payment_status: 'pending',
          status: 'pending',
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Get user info for payment
      const { data: { user } } = await auth.getUser();
      const { data: member } = await supabase
        .from('community_members')
        .select('full_name, email')
        .eq('id', currentMemberId)
        .single();

      // Initiate Razorpay payment
      await razorpayService.openCheckout({
        orderId: session.id,
        amount: basePrice * 100, // Convert to paise
        currency: 'INR',
        name: 'Start Solo',
        description: `Paid Session: ${selectedRateCard.session_type_label} with ${selectedMentor.display_name || selectedMentor.full_name}`,
        notes: {
          session_id: session.id,
          type: 'session',
        },
        prefill: {
          name: member?.full_name || user?.email?.split('@')[0] || '',
          email: member?.email || user?.email || '',
        },
        handler: async (response) => {
          // Payment successful - update session
          const { error: updateError } = await supabase
            .from('mentor_sessions')
            .update({
              payment_status: 'paid',
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              status: 'confirmed',
              confirmed_at: new Date().toISOString(),
            })
            .eq('id', session.id);

          if (updateError) {
            console.error('Error updating session:', updateError);
            alert('Payment successful but session update failed. Please contact support.');
          } else {
            // Send notifications
            const { data: menteeMember } = await supabase
              .from('community_members')
              .select('user_id')
              .eq('id', currentMemberId)
              .single();

            if (menteeMember?.user_id) {
              await notificationService.sendSessionBookingNotification(
                menteeMember.user_id,
                'paid',
                selectedMentor.display_name || selectedMentor.full_name,
                formData.scheduled_at,
                session.id
              );
              await notificationService.sendPaymentConfirmation(
                menteeMember.user_id,
                'session',
                `${selectedRateCard.session_type_label} with ${selectedMentor.display_name || selectedMentor.full_name}`,
                basePrice,
                response.razorpay_payment_id || 'pending'
              );
            }

            alert('Session booked successfully! The mentor will be notified.');
            navigate('/community');
          }
        },
        onError: (error) => {
          console.error('Payment error:', error);
          // Delete pending session if payment fails
          supabase
            .from('mentor_sessions')
            .delete()
            .eq('id', session.id);
          alert('Payment failed. Please try again.');
        },
      });
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
          <h1 className="text-3xl font-bold text-[#1D3A6B]">Book a Paid Mentor Session</h1>
          <p className="text-gray-600 mt-2">Get personalized guidance from experienced mentors</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedMentor && selectedRateCard ? (
          /* Booking Form */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setSelectedMentor(null);
                    setSelectedRateCard(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircle className="h-5 w-5 text-gray-600" />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-[#1D3A6B]">
                    Book {selectedRateCard.session_type_label} Session
                  </h2>
                  <p className="text-gray-600 mt-1">with {selectedMentor.display_name || selectedMentor.full_name}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">Session Pricing</span>
                </div>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>Rate: ₹{selectedRateCard.price_per_hour}/hour</p>
                  <p>Duration: {selectedRateCard.min_duration_minutes} - {selectedRateCard.max_duration_minutes} minutes</p>
                  {selectedRateCard.description && (
                    <p className="mt-2 italic">{selectedRateCard.description}</p>
                  )}
                </div>
              </div>

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
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  min={selectedRateCard.min_duration_minutes}
                  max={selectedRateCard.max_duration_minutes}
                  step="15"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || selectedRateCard.min_duration_minutes })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Between {selectedRateCard.min_duration_minutes} and {selectedRateCard.max_duration_minutes} minutes
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Total Amount:</span>
                  <span className="text-2xl font-bold text-[#1D3A6B]">
                    ₹{calculatePrice(selectedRateCard, formData.duration_minutes).toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  ({formData.duration_minutes} minutes × ₹{selectedRateCard.price_per_hour}/hour)
                </p>
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
                  className="flex-1 flex items-center justify-center gap-2 bg-[#1D3A6B] text-white px-6 py-3 rounded-lg hover:bg-[#152A4F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  <CreditCard className="h-5 w-5" />
                  {booking ? 'Processing...' : `Pay ₹${calculatePrice(selectedRateCard, formData.duration_minutes).toFixed(2)} & Book Session`}
                </button>
                <button
                  onClick={() => {
                    setSelectedMentor(null);
                    setSelectedRateCard(null);
                  }}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : selectedMentor ? (
          /* Rate Card Selection */
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
                  <h2 className="text-2xl font-bold text-[#1D3A6B]">
                    Select Session Type
                  </h2>
                  <p className="text-gray-600 mt-1">with {selectedMentor.display_name || selectedMentor.full_name}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedMentor.rate_cards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => setSelectedRateCard(card)}
                  className="border-2 border-gray-200 rounded-lg p-6 hover:border-[#1D3A6B] hover:shadow-md transition-all cursor-pointer"
                >
                  <h3 className="text-lg font-semibold text-[#1D3A6B] mb-2">{card.session_type_label}</h3>
                  {card.description && (
                    <p className="text-sm text-gray-600 mb-4">{card.description}</p>
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Price:</span>
                      <span className="text-lg font-bold text-[#1D3A6B]">₹{card.price_per_hour}/hour</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Duration:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {card.min_duration_minutes} - {card.max_duration_minutes} min
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Mentor List */
          <div className="space-y-6">
            {mentors.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <User className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Mentors Available</h3>
                <p className="text-gray-600">Mentors haven't set up their rate cards yet. Check back later!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mentors.map((mentor) => (
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

                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-2">
                        {mentor.rate_cards.length} session type{mentor.rate_cards.length !== 1 ? 's' : ''} available
                      </p>
                      <button
                        onClick={() => setSelectedMentor(mentor)}
                        className="w-full bg-[#1D3A6B] text-white px-4 py-2 rounded-lg hover:bg-[#152A4F] transition-colors font-medium"
                      >
                        View Rates & Book
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaidSessionBooking;

