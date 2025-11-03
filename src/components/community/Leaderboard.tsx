import React, { useState, useEffect } from 'react';
import { Trophy, Award, TrendingUp, Medal, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface LeaderboardMember {
  id: string;
  display_name: string | null;
  full_name: string;
  avatar_url: string | null;
  points: number;
  badges_count: number;
  role: string;
}

const Leaderboard: React.FC = () => {
  const [members, setMembers] = useState<LeaderboardMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'all' | 'month' | 'week'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadLeaderboard();
  }, [timeframe]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      
      // For now, we'll show all-time leaderboard
      // In future, we can filter by activity date for week/month
      const { data, error } = await supabase
        .from('community_members')
        .select('id, display_name, full_name, avatar_url, points, badges, role')
        .eq('vetting_status', 'vetted')
        .order('points', { ascending: false })
        .limit(50);

      if (error) throw error;

      const formattedMembers = (data || []).map(member => ({
        id: member.id,
        display_name: member.display_name,
        full_name: member.full_name,
        avatar_url: member.avatar_url,
        points: member.points || 0,
        badges_count: member.badges?.length || 0,
        role: member.role,
      }));

      setMembers(formattedMembers);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-orange-600" />;
    return <span className="text-gray-500 font-semibold w-6 text-center">{rank}</span>;
  };

  const getRankBgColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-50 border-yellow-200';
    if (rank === 2) return 'bg-gray-50 border-gray-200';
    if (rank === 3) return 'bg-orange-50 border-orange-200';
    return 'bg-white border-gray-200';
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1D3A6B]">Community Leaderboard</h2>
        <div className="flex gap-2">
          {(['all', 'month', 'week'] as const).map((option) => (
            <button
              key={option}
              onClick={() => setTimeframe(option)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeframe === option
                  ? 'bg-[#1D3A6B] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option === 'all' ? 'All Time' : option === 'month' ? 'This Month' : 'This Week'}
            </button>
          ))}
        </div>
      </div>

      {members.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200 text-center">
          <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No rankings yet. Be the first to earn points!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {members.map((member, index) => {
              const rank = index + 1;
              return (
                <div
                  key={member.id}
                  onClick={() => navigate(`/community/members/${member.id}`)}
                  className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${getRankBgColor(rank)}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12">
                      {getRankIcon(rank)}
                    </div>
                    <div className="flex-1 flex items-center gap-4">
                      {member.avatar_url ? (
                        <img
                          src={member.avatar_url}
                          alt={member.display_name || member.full_name}
                          className="w-12 h-12 rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#1D3A6B] flex items-center justify-center text-white font-semibold">
                          {(member.display_name || member.full_name)[0].toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            {member.display_name || member.full_name}
                          </h3>
                          {member.role === 'mentor' && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-medium">
                              Mentor
                            </span>
                          )}
                          {member.role === 'admin' && (
                            <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs font-medium">
                              Admin
                            </span>
                          )}
                        </div>
                        {member.badges_count > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            <Award className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm text-gray-600">{member.badges_count} badges</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-[#1D3A6B]" />
                          <span className="text-2xl font-bold text-[#1D3A6B]">{member.points}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">points</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
