import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Users, Video, ExternalLink, MapPin, CheckCircle, XCircle, Package, ShoppingCart } from 'lucide-react';
import { supabase, auth } from '../../lib/supabase';
import { razorpayService } from '../../lib/payments/razorpay';
import EventProductManagement from './EventProductManagement';

interface CommunityEvent {
  id: string;
  organizer_id: string;
  title: string;
  description: string | null;
  event_type: 'webinar' | 'workshop' | 'networking' | 'q-and-a';
  start_time: string;
  end_time: string;
  timezone: string;
  meeting_link: string | null;
  meeting_id: string | null;
  meeting_password: string | null;
  recording_url: string | null;
  max_attendees: number | null;
  current_attendees: number;
  registration_open: boolean;
  registration_deadline: string | null;
  ticket_price: number;
  commission_rate: number;
  is_featured: boolean;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  organizer?: {
    display_name: string | null;
    full_name: string;
    avatar_url: string | null;
  };
}

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<CommunityEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [currentMemberId, setCurrentMemberId] = useState<string | null>(null);
  const [vettingStatus, setVettingStatus] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [myPurchases, setMyPurchases] = useState<Set<string>>(new Set());
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [currentMemberRole, setCurrentMemberRole] = useState<string | null>(null);

  useEffect(() => {
    loadEvent();
    loadCurrentMember();
  }, [id]);

  useEffect(() => {
    if (event && currentMemberId) {
      loadProducts();
      loadMyPurchases();
      setIsOrganizer(event.organizer_id === currentMemberId);
    }
  }, [event, currentMemberId]);

  const loadCurrentMember = async () => {
    try {
      const { data: { user } } = await auth.getUser();
      if (!user) return;

      const { data: member } = await supabase
        .from('community_members')
        .select('id, vetting_status, role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (member) {
        setCurrentMemberId(member.id);
        setVettingStatus(member.vetting_status);
        setCurrentMemberRole(member.role);
        checkRegistration(member.id);
      }
    } catch (error) {
      console.error('Error loading member:', error);
    }
  };

  const checkRegistration = async (memberId: string) => {
    if (!id) return;
    try {
      const { data } = await supabase
        .from('event_registrations')
        .select('id, payment_status')
        .eq('event_id', id)
        .eq('member_id', memberId)
        .eq('status', 'registered')
        .maybeSingle();

      setIsRegistered(!!data);
      setPaymentStatus(data?.payment_status || null);
    } catch (error) {
      console.error('Error checking registration:', error);
    }
  };

  const loadProducts = async () => {
    if (!id) return;
    try {
      const { data, error } = await supabase
        .from('event_products')
        .select('*')
        .eq('event_id', id)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const loadMyPurchases = async () => {
    if (!id || !currentMemberId) return;
    try {
      const { data, error } = await supabase
        .from('event_product_purchases')
        .select('product_id')
        .eq('event_id', id)
        .eq('buyer_id', currentMemberId)
        .eq('payment_status', 'paid');

      if (error) throw error;
      setMyPurchases(new Set((data || []).map(p => p.product_id)));
    } catch (error) {
      console.error('Error loading purchases:', error);
    }
  };

  const handlePurchaseProduct = async (product: any) => {
    if (!id || !currentMemberId) return;

    try {
      // Check if already purchased
      if (myPurchases.has(product.id)) {
        alert('You have already purchased this product.');
        return;
      }

      // Get admin settings for commission
      const { data: settings } = await supabase
        .from('admin_settings')
        .select('value')
        .eq('key', 'event_product_commission_rate')
        .single();

      const commissionRate = settings ? parseFloat(settings.value as string) : product.commission_rate || 10;
      const commissionAmount = (product.price * commissionRate) / 100;
      const mentorPayout = product.price - commissionAmount;

      // Create purchase record with pending payment
      const { data: purchaseData, error: purchaseError } = await supabase
        .from('event_product_purchases')
        .insert({
          product_id: product.id,
          event_id: id,
          buyer_id: currentMemberId,
          payment_status: 'pending',
          payment_amount: product.price,
          commission_amount: commissionAmount,
          mentor_payout: mentorPayout,
          purchase_status: 'active',
        })
        .select()
        .single();

      if (purchaseError) throw purchaseError;

      // Get user info for payment
      const { data: { user } } = await auth.getUser();
      const { data: member } = await supabase
        .from('community_members')
        .select('full_name, email')
        .eq('id', currentMemberId)
        .single();

      // Initiate Razorpay payment
      await razorpayService.openCheckout({
        orderId: purchaseData.id,
        amount: product.price * 100, // Convert to paise
        currency: 'INR',
        name: 'Start Solo',
        description: `Product: ${product.product_name}`,
        notes: {
          product_id: product.id,
          event_id: id,
          type: 'event_product',
        },
        prefill: {
          name: member?.full_name || user?.email?.split('@')[0] || '',
          email: member?.email || user?.email || '',
        },
        handler: async (response) => {
          // Payment successful - update purchase
          const { error: updateError } = await supabase
            .from('event_product_purchases')
            .update({
              payment_status: 'paid',
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
            .eq('id', purchaseData.id);

          if (updateError) {
            console.error('Error updating purchase:', updateError);
            alert('Payment successful but purchase update failed. Please contact support.');
          } else {
            setMyPurchases(new Set([...myPurchases, product.id]));
            alert('Purchase successful! You now have access to this product.');
          }
        },
        onError: (error) => {
          console.error('Payment error:', error);
          // Delete pending purchase if payment fails
          supabase
            .from('event_product_purchases')
            .delete()
            .eq('id', purchaseData.id);
          alert('Payment failed. Please try again.');
        },
      });
    } catch (error: any) {
      console.error('Error purchasing product:', error);
      alert(error.message || 'Failed to purchase product. Please try again.');
    }
  };

  const handleRSVP = async () => {
    if (!id || !currentMemberId || !event) return;

    // Prevent double-click
    if (registering) return;

    try {
      setRegistering(true);

      if (isRegistered) {
        // Cancel registration
        const { error } = await supabase
          .from('event_registrations')
          .update({ status: 'cancelled' })
          .eq('event_id', id)
          .eq('member_id', currentMemberId);

        if (error) throw error;
        setIsRegistered(false);
        setPaymentStatus(null);
      } else {
        // Check if event is paid
        const isPaidEvent = event.ticket_price > 0;

        if (isPaidEvent) {
          // Paid event - create registration with pending payment
          const { data: existing } = await supabase
            .from('event_registrations')
            .select('id')
            .eq('event_id', id)
            .eq('member_id', currentMemberId)
            .maybeSingle();

          let registrationId: string;
          if (existing) {
            registrationId = existing.id;
            // Update existing registration
            const commissionRate = event.commission_rate || 10;
            const commissionAmount = (event.ticket_price * commissionRate) / 100;
            const organizerPayout = event.ticket_price - commissionAmount;

            await supabase
              .from('event_registrations')
              .update({
                status: 'registered',
                payment_status: 'pending',
                payment_amount: event.ticket_price,
                commission_amount: commissionAmount,
                organizer_payout: organizerPayout,
              })
              .eq('id', registrationId);
          } else {
            // Create new registration
            const commissionRate = event.commission_rate || 10;
            const commissionAmount = (event.ticket_price * commissionRate) / 100;
            const organizerPayout = event.ticket_price - commissionAmount;

            const { data: registration, error: regError } = await supabase
              .from('event_registrations')
              .insert({
                event_id: id,
                member_id: currentMemberId,
                status: 'registered',
                payment_status: 'pending',
                payment_amount: event.ticket_price,
                commission_amount: commissionAmount,
                organizer_payout: organizerPayout,
              })
              .select()
              .single();

            if (regError) throw regError;
            registrationId = registration.id;
          }

          // Get user info for payment
          const { data: { user } } = await auth.getUser();
          const { data: member } = await supabase
            .from('community_members')
            .select('full_name, email')
            .eq('id', currentMemberId)
            .single();

          // Initiate Razorpay payment
          await razorpayService.openCheckout({
            orderId: registrationId,
            amount: event.ticket_price * 100, // Convert to paise
            currency: 'INR',
            name: 'Start Solo',
            description: `Event Registration: ${event.title}`,
            notes: {
              event_id: id,
              type: 'event',
            },
            prefill: {
              name: member?.full_name || user?.email?.split('@')[0] || '',
              email: member?.email || user?.email || '',
            },
            handler: async (response) => {
              // Payment successful - update registration
              const { error: updateError } = await supabase
                .from('event_registrations')
                .update({
                  payment_status: 'paid',
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                })
                .eq('id', registrationId);

              if (updateError) {
                console.error('Error updating registration:', updateError);
                alert('Payment successful but registration update failed. Please contact support.');
              } else {
                setIsRegistered(true);
                setPaymentStatus('paid');
                alert('Registration successful! You are now registered for this event.');
              }
            },
            onError: (error) => {
              console.error('Payment error:', error);
              // Delete pending registration if payment fails
              supabase
                .from('event_registrations')
                .delete()
                .eq('id', registrationId);
              alert('Payment failed. Please try again.');
            },
          });
        } else {
          // Free event - register directly
          const { data: existing } = await supabase
            .from('event_registrations')
            .select('id')
            .eq('event_id', id)
            .eq('member_id', currentMemberId)
            .maybeSingle();

          if (existing) {
            // Already registered, just update status if needed
            const { error } = await supabase
              .from('event_registrations')
              .update({ status: 'registered', payment_status: 'paid' })
              .eq('id', existing.id);

            if (error) throw error;
            setIsRegistered(true);
            setPaymentStatus('paid');
          } else {
            // New registration
            const { error } = await supabase
              .from('event_registrations')
              .insert({
                event_id: id,
                member_id: currentMemberId,
                status: 'registered',
                payment_status: 'paid',
              });

            if (error) {
              // Handle duplicate key error gracefully
              if (error.code === '23505') { // Unique violation
                setIsRegistered(true);
                setPaymentStatus('paid');
              } else {
                throw error;
              }
            } else {
              setIsRegistered(true);
              setPaymentStatus('paid');
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Error updating RSVP:', error);
      if (error.code !== '23505') {
        alert(error.message || 'Failed to update registration. Please try again.');
      } else {
        setIsRegistered(true);
      }
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D3A6B]"></div>
          <p className="mt-4 text-gray-600">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-4">This event doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/community')}
            className="bg-[#1D3A6B] text-white px-6 py-2 rounded-lg hover:bg-[#152A4F] transition-colors"
          >
            Back to Community
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getEventTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      webinar: 'Webinar',
      workshop: 'Workshop',
      networking: 'Networking',
      'q-and-a': 'Q&A Session',
    };
    return labels[type] || type;
  };

  const isUpcoming = new Date(event.start_time) > new Date();
  const isLive = new Date(event.start_time) <= new Date() && new Date(event.end_time) >= new Date();
  const isPast = new Date(event.end_time) < new Date();
  const isFull = event.max_attendees && event.current_attendees >= event.max_attendees;
  const canRegister = event.registration_open && !isPast && !isFull && (!event.registration_deadline || new Date(event.registration_deadline) > new Date());

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/community')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#1D3A6B] mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Community
          </button>

          {/* Event Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              {event.is_featured && (
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  Featured Event
                </span>
              )}
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {getEventTypeLabel(event.event_type)}
              </span>
              {isLive && (
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  Live Now
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-[#1D3A6B] mb-4">{event.title}</h1>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-xs text-gray-500">Date</div>
                  <div className="text-sm font-medium text-gray-900">{formatDate(event.start_time)}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-xs text-gray-500">Time</div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatTime(event.start_time)} - {formatTime(event.end_time)}
                  </div>
                </div>
              </div>
              {event.organizer && (
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Organizer</div>
                    <div className="text-sm font-medium text-gray-900">
                      {event.organizer.display_name || event.organizer.full_name}
                    </div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-xs text-gray-500">Attendees</div>
                  <div className="text-sm font-medium text-gray-900">
                    {event.current_attendees} {event.max_attendees ? `/ ${event.max_attendees}` : ''} registered
                  </div>
                </div>
              </div>
              {event.ticket_price > 0 && (
                <div className="flex items-center gap-3">
                  <div>
                    <div className="text-xs text-gray-500">Ticket Price</div>
                    <div className="text-sm font-medium text-gray-900">
                      ₹{event.ticket_price.toFixed(2)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RSVP Button */}
            {currentMemberId && (
              <div className="mb-6">
                {vettingStatus === 'vetted' && canRegister ? (
                  <>
                    {isRegistered ? (
                      paymentStatus === 'paid' ? (
                        <button
                          onClick={handleRSVP}
                          disabled={registering}
                          className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {registering ? (
                            'Processing...'
                          ) : (
                            <>
                              <CheckCircle className="h-5 w-5" />
                              Registered - Cancel Registration
                            </>
                          )}
                        </button>
                      ) : paymentStatus === 'pending' ? (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <p className="text-yellow-800 text-sm">
                            Payment pending. Please complete payment to confirm your registration.
                          </p>
                        </div>
                      ) : null
                    ) : (
                      <button
                        onClick={handleRSVP}
                        disabled={registering}
                        className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-[#1D3A6B] text-white hover:bg-[#152A4F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {registering ? (
                          'Processing...'
                        ) : event.ticket_price > 0 ? (
                          <>
                            <Calendar className="h-5 w-5" />
                            Register for ₹{event.ticket_price.toFixed(2)}
                          </>
                        ) : (
                          <>
                            <Calendar className="h-5 w-5" />
                            Register for Event
                          </>
                        )}
                      </button>
                    )}
                  </>
                ) : vettingStatus === 'approved' ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                      You have view-only access. Contact an admin to be upgraded to vetted status for full access, including event registration.
                    </p>
                  </div>
                ) : vettingStatus !== 'vetted' && vettingStatus !== 'approved' ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                      You need to be vetted to register for events. Your application is pending review.
                    </p>
                  </div>
                ) : isFull ? (
                  <div className="flex items-center gap-2 text-gray-600">
                    <XCircle className="h-5 w-5 text-red-500" />
                    <span>Event is full</span>
                  </div>
                ) : isPast ? (
                  <div className="flex items-center gap-2 text-gray-600">
                    <XCircle className="h-5 w-5" />
                    <span>Event has ended</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-600">
                    <XCircle className="h-5 w-5" />
                    <span>Registration closed</span>
                  </div>
                )}
              </div>
            )}

            {/* Meeting Link */}
            {event.meeting_link && (isUpcoming || isLive) && (
              <div className="mb-6">
                <a
                  href={event.meeting_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  <Video className="h-5 w-5" />
                  {isLive ? 'Join Live Event' : 'Join Meeting'}
                  <ExternalLink className="h-4 w-4" />
                </a>
                {event.meeting_password && (
                  <p className="mt-2 text-sm text-gray-600">
                    Password: <span className="font-mono">{event.meeting_password}</span>
                  </p>
                )}
              </div>
            )}

            {/* Recording */}
            {event.recording_url && isPast && (
              <div className="mb-6">
                <a
                  href={event.recording_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#1D3A6B] text-white px-6 py-3 rounded-lg hover:bg-[#152A4F] transition-colors font-semibold"
                >
                  <Video className="h-5 w-5" />
                  Watch Recording
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Event Description */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-[#1D3A6B] mb-4">About This Event</h2>
          {event.description ? (
            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
              {event.description}
            </div>
          ) : (
            <p className="text-gray-600">No description provided.</p>
          )}
        </div>

        {/* Products Management (for organizers) */}
        {isOrganizer && currentMemberRole === 'mentor' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
            <EventProductManagement eventId={id!} mentorId={currentMemberId!} />
          </div>
        )}

        {/* Products Display (for attendees) */}
        {products.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
            <h2 className="text-xl font-bold text-[#1D3A6B] mb-4 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Event Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">{product.product_name}</h3>
                  {product.description && (
                    <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-[#1D3A6B]">₹{product.price.toFixed(2)}</span>
                    {myPurchases.has(product.id) ? (
                      <span className="flex items-center gap-2 text-green-600 text-sm font-medium">
                        <CheckCircle className="h-4 w-4" />
                        Purchased
                      </span>
                    ) : currentMemberId && vettingStatus === 'vetted' ? (
                      <button
                        onClick={() => handlePurchaseProduct(product)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#1D3A6B] text-white rounded-lg hover:bg-[#152A4F] transition-colors text-sm font-medium"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Buy Now
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetail;
