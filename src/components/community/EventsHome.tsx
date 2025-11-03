import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Video, ExternalLink, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface EventsHomeProps {
  currentMemberId?: string;
  vettingStatus?: string;
}

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
  is_featured: boolean;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  organizer?: {
    display_name: string | null;
    full_name: string;
    avatar_url: string | null;
  };
  registered_count?: number;
}

const EventsHome: React.FC<EventsHomeProps> = ({ currentMemberId, vettingStatus }) => {
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'live' | 'completed'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadEvents();
  }, [filter]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('community_events')
        .select(`
          *,
          organizer:community_members!community_events_organizer_id_fkey(display_name, full_name, avatar_url)
        `)
        .order('start_time', { ascending: true });

      if (filter === 'upcoming') {
        query = query.eq('status', 'upcoming').gte('start_time', new Date().toISOString());
      } else if (filter === 'live') {
        query = query.eq('status', 'live');
      } else if (filter === 'completed') {
        query = query.eq('status', 'completed');
      } else {
        // All - show upcoming and live
        query = query.in('status', ['upcoming', 'live']);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Get registration counts for each event
      const eventsWithCounts = await Promise.all(
        (data || []).map(async (event) => {
          const { count } = await supabase
            .from('event_registrations')
            .select('*', { count: 'exact', head: true })
            .eq('event_id', event.id)
            .eq('status', 'registered');

          return {
            ...event,
            registered_count: count || 0,
          };
        })
      );

      setEvents(eventsWithCounts);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
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

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      webinar: 'bg-blue-100 text-blue-800',
      workshop: 'bg-purple-100 text-purple-800',
      networking: 'bg-green-100 text-green-800',
      'q-and-a': 'bg-orange-100 text-orange-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const isUpcoming = (event: CommunityEvent) => {
    return new Date(event.start_time) > new Date();
  };

  const isLive = (event: CommunityEvent) => {
    const now = new Date();
    return new Date(event.start_time) <= now && new Date(event.end_time) >= now;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D3A6B]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1D3A6B]">Community Events</h2>
        <button
          onClick={() => navigate('/community/events/create')}
          className="bg-[#1D3A6B] text-white px-4 py-2 rounded-lg hover:bg-[#152A4F] transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Event
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex flex-wrap gap-2">
          {(['all', 'upcoming', 'live', 'completed'] as const).map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === filterOption
                  ? 'bg-[#1D3A6B] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            {filter === 'all' 
              ? 'No upcoming events scheduled. Check back soon!' 
              : `No ${filter} events found.`}
          </p>
          {filter === 'all' && (
            <button
              onClick={() => navigate('/community/events/create')}
              className="bg-[#1D3A6B] text-white px-6 py-2 rounded-lg hover:bg-[#152A4F] transition-colors"
            >
              Create First Event
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => navigate(`/community/events/${event.id}`)}
              formatDate={formatDate}
              formatTime={formatTime}
              getEventTypeLabel={getEventTypeLabel}
              getEventTypeColor={getEventTypeColor}
              isUpcoming={isUpcoming}
              isLive={isLive}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface EventCardProps {
  event: CommunityEvent;
  onClick: () => void;
  formatDate: (date: string) => string;
  formatTime: (date: string) => string;
  getEventTypeLabel: (type: string) => string;
  getEventTypeColor: (type: string) => string;
  isUpcoming: (event: CommunityEvent) => boolean;
  isLive: (event: CommunityEvent) => boolean;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onClick,
  formatDate,
  formatTime,
  getEventTypeLabel,
  getEventTypeColor,
  isUpcoming,
  isLive,
}) => {
  const now = new Date();
  const startDate = new Date(event.start_time);
  const endDate = new Date(event.end_time);
  const isPast = endDate < now;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow-sm border-2 transition-all cursor-pointer hover:shadow-md ${
        event.is_featured ? 'border-[#1D3A6B]' : 'border-gray-200'
      } ${isLive(event) ? 'ring-2 ring-green-500' : ''}`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {event.is_featured && (
                <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-medium">
                  Featured
                </span>
              )}
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getEventTypeColor(event.event_type)}`}>
                {getEventTypeLabel(event.event_type)}
              </span>
              {isLive(event) && (
                <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  Live Now
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-[#1D3A6B] mb-2">{event.title}</h3>
            {event.description && (
              <p className="text-gray-700 text-sm line-clamp-2 mb-4">{event.description}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(event.start_time)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>
              {formatTime(event.start_time)} - {formatTime(event.end_time)}
            </span>
          </div>
          {event.organizer && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>
                By {event.organizer.display_name || event.organizer.full_name}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>
              {event.registered_count || 0} {event.max_attendees ? `/ ${event.max_attendees}` : ''} registered
            </span>
          </div>
        </div>

        {event.meeting_link && isUpcoming(event) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <a
              href={event.meeting_link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 text-[#1D3A6B] hover:underline text-sm font-medium"
            >
              <Video className="h-4 w-4" />
              Join Meeting Link
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}

        {event.recording_url && isPast && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <a
              href={event.recording_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 text-[#1D3A6B] hover:underline text-sm font-medium"
            >
              <Video className="h-4 w-4" />
              Watch Recording
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsHome;
