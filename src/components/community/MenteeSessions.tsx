import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, MessageSquare, CheckCircle, XCircle, DollarSign, Star } from 'lucide-react';
import { supabase, auth } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import SessionFeedback from './SessionFeedback';

interface Session {
  id: string;
  mentor_id: string;
  session_type: string;
  scheduled_at: string;
  duration_minutes: number;
  mentee_notes: string | null;
  price: number | null;
  payment_status: string;
  status: string;
  confirmed_at: string | null;
  completed_at: string | null;
  mentee_feedback_rating: number | null;
  mentee_feedback_text: string | null;
  mentor_feedback_rating: number | null;
  mentor_feedback_text: string | null;
  community_members: {
    display_name: string;
    full_name: string;
    avatar_url: string | null;
    email: string;
  };
}

const MenteeSessions: React.FC = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMemberId, setCurrentMemberId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    loadCurrentMember();
  }, []);

  useEffect(() => {
    if (currentMemberId) {
      loadSessions();
    }
  }, [currentMemberId, filter]);

  const loadCurrentMember = async () => {
    try {
      const { data: { user } } = await auth.getUser();
      if (!user) {
        navigate('/community');
        return;
      }

      const { data: member } = await supabase
        .from('community_members')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (member) {
        setCurrentMemberId(member.id);
      }
    } catch (error) {
      console.error('Error loading member:', error);
    }
  };

  const loadSessions = async () => {
    if (!currentMemberId) return;

    try {
      setLoading(true);
      let query = supabase
        .from('mentor_sessions')
        .select(`
          id,
          mentor_id,
          session_type,
          scheduled_at,
          duration_minutes,
          mentee_notes,
          price,
          payment_status,
          status,
          confirmed_at,
          completed_at,
          mentee_feedback_rating,
          mentee_feedback_text,
          mentor_feedback_rating,
          mentor_feedback_text,
          community_members!mentor_id (
            display_name,
            full_name,
            avatar_url,
            email
          )
        `)
        .eq('mentee_id', currentMemberId)
        .order('scheduled_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSessions((data as Session[]) || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata',
    });
  };

  const getStatusBadge = (status: string, paymentStatus: string) => {
    const statusColors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
        {paymentStatus === 'paid' && status !== 'cancelled' && (
          <CheckCircle className="h-3 w-3 ml-1" />
        )}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D3A6B]"></div>
        <p className="mt-2 text-gray-600">Loading sessions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1D3A6B]">My Sessions</h2>
          <p className="text-gray-600 text-sm mt-1">View and manage your mentor sessions</p>
        </div>
        <div className="flex gap-2">
          {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-[#1D3A6B] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Sessions Found</h3>
          <p className="text-gray-600 mb-4">You don't have any {filter !== 'all' ? filter : ''} sessions yet.</p>
          <button
            onClick={() => navigate('/community/sessions/book')}
            className="bg-[#1D3A6B] text-white px-6 py-2 rounded-lg hover:bg-[#152A4F] transition-colors"
          >
            Book a Session
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    {session.community_members.avatar_url ? (
                      <img
                        src={session.community_members.avatar_url}
                        alt={session.community_members.display_name || session.community_members.full_name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#1D3A6B] flex items-center justify-center text-white font-bold">
                        {(session.community_members.display_name || session.community_members.full_name)[0].toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#1D3A6B]">
                        Session with {session.community_members.display_name || session.community_members.full_name}
                      </h3>
                      <p className="text-sm text-gray-600">{session.community_members.email}</p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(session.status, session.payment_status)}
                      {session.price && (
                        <div className="mt-2 text-sm font-semibold text-[#1D3A6B]">
                          ₹{session.price.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDateTime(session.scheduled_at)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{session.duration_minutes} minutes</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="h-4 w-4" />
                      <span>{session.session_type === 'paid' ? 'Paid Session' : 'Free Session'}</span>
                    </div>
                  </div>

                  {session.mentee_notes && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-700 mb-1">Your Notes:</p>
                          <p className="text-sm text-gray-600">{session.mentee_notes}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {session.status === 'completed' && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      {session.mentor_feedback_rating && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Mentor Feedback</h4>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  className={`text-lg ${
                                    star <= (session.mentor_feedback_rating || 0)
                                      ? 'text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            {session.mentor_feedback_text && (
                              <p className="text-sm text-gray-700 mt-2 italic">{session.mentor_feedback_text}</p>
                            )}
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Your Feedback</h4>
                        <SessionFeedback
                          sessionId={session.id}
                          userRole="mentee"
                          onSubmit={loadSessions}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenteeSessions;

