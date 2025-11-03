import React, { useState, useEffect } from 'react';
import { Award, Trophy, Star, Target, Zap, Heart } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Badge {
  id: string;
  badge_key: string;
  badge_name: string;
  badge_description: string | null;
  badge_icon_url: string | null;
  category: 'engagement' | 'achievement' | 'milestone' | 'special';
  points_required: number;
  earned_at?: string;
}

interface BadgesDisplayProps {
  memberId: string;
  showAll?: boolean;
}

const BadgesDisplay: React.FC<BadgesDisplayProps> = ({ memberId, showAll = false }) => {
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([]);
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBadges();
  }, [memberId]);

  const loadBadges = async () => {
    try {
      setLoading(true);

      // Load all badges
      const { data: badgesData, error: badgesError } = await supabase
        .from('community_badges')
        .select('*')
        .eq('is_active', true)
        .order('points_required', { ascending: true });

      if (badgesError) throw badgesError;

      // Load member's earned badges
      const { data: earnedData, error: earnedError } = await supabase
        .from('member_badges')
        .select('badge_id, earned_at, community_badges(*)')
        .eq('member_id', memberId);

      if (earnedError) throw earnedError;

      const earnedBadgeIds = new Set((earnedData || []).map((eb: any) => eb.badge_id));
      
      const formattedAllBadges = (badgesData || []).map((badge: any) => ({
        id: badge.id,
        badge_key: badge.badge_key,
        badge_name: badge.badge_name,
        badge_description: badge.badge_description,
        badge_icon_url: badge.badge_icon_url,
        category: badge.category,
        points_required: badge.points_required,
      }));

      const formattedEarnedBadges = (earnedData || []).map((eb: any) => ({
        ...eb.community_badges,
        earned_at: eb.earned_at,
      }));

      setAllBadges(formattedAllBadges);
      setEarnedBadges(formattedEarnedBadges);

      if (showAll) {
        // Merge earned badges with all badges, marking earned ones
        const merged = formattedAllBadges.map((badge) => {
          const earned = formattedEarnedBadges.find((eb: any) => eb.id === badge.id);
          return earned ? { ...badge, earned_at: earned.earned_at } : badge;
        });
        setAllBadges(merged);
      }
    } catch (error) {
      console.error('Error loading badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      engagement: <Heart className="h-5 w-5" />,
      achievement: <Trophy className="h-5 w-5" />,
      milestone: <Star className="h-5 w-5" />,
      special: <Zap className="h-5 w-5" />,
    };
    return icons[category] || <Award className="h-5 w-5" />;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      engagement: 'bg-pink-100 text-pink-800 border-pink-200',
      achievement: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      milestone: 'bg-blue-100 text-blue-800 border-blue-200',
      special: 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1D3A6B]"></div>
      </div>
    );
  }

  const badgesToShow = showAll ? allBadges : earnedBadges;

  if (badgesToShow.length === 0) {
    return (
      <div className="text-center py-8">
        <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">
          {showAll ? 'No badges available yet.' : 'No badges earned yet. Start engaging to earn your first badge!'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showAll && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {badgesToShow.map((badge) => {
            const isEarned = !!badge.earned_at;
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isEarned
                    ? getCategoryColor(badge.category)
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 ${isEarned ? 'text-[#1D3A6B]' : 'text-gray-400'}`}>
                    {badge.badge_icon_url ? (
                      <img src={badge.badge_icon_url} alt={badge.badge_name} className="w-10 h-10" />
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center">
                        {getCategoryIcon(badge.category)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold ${isEarned ? 'text-gray-900' : 'text-gray-500'}`}>
                        {badge.badge_name}
                      </h3>
                      {isEarned && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                          Earned
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${isEarned ? 'text-gray-700' : 'text-gray-500'}`}>
                      {badge.badge_description}
                    </p>
                    {badge.points_required > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Requires {badge.points_required} points
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!showAll && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {badgesToShow.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-lg border-2 text-center ${getCategoryColor(badge.category)}`}
            >
              {badge.badge_icon_url ? (
                <img
                  src={badge.badge_icon_url}
                  alt={badge.badge_name}
                  className="w-12 h-12 mx-auto mb-2"
                />
              ) : (
                <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                  {getCategoryIcon(badge.category)}
                </div>
              )}
              <h3 className="font-semibold text-sm mb-1">{badge.badge_name}</h3>
              {badge.earned_at && (
                <p className="text-xs opacity-75">
                  Earned {new Date(badge.earned_at).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BadgesDisplay;
