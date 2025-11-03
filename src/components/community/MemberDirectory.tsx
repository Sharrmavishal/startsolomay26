import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin, Briefcase, User, Award, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { CommunityMember } from '../../lib/supabase';

interface MemberDirectoryProps {
  currentMemberId?: string;
}

const MemberDirectory: React.FC<MemberDirectoryProps> = ({ currentMemberId }) => {
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterIndustry, setFilterIndustry] = useState<string>('all');
  const [filterStage, setFilterStage] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadMembers();
  }, [filterRole, filterIndustry, filterStage]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('community_members')
        .select('*')
        .eq('vetting_status', 'vetted') // Only show vetted members
        .order('created_at', { ascending: false });

      // Apply filters
      if (filterRole !== 'all') {
        query = query.eq('role', filterRole);
      }
      if (filterIndustry !== 'all') {
        query = query.eq('industry', filterIndustry);
      }
      if (filterStage !== 'all') {
        query = query.eq('business_stage', filterStage);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(member => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (member.display_name || member.full_name).toLowerCase().includes(query) ||
      member.bio?.toLowerCase().includes(query) ||
      member.industry?.toLowerCase().includes(query) ||
      member.skills?.some(skill => skill.toLowerCase().includes(query))
    );
  });

  // Comprehensive industry and stage options (will be admin-controlled later)
  const allIndustries = [
    'Technology', 'E-commerce', 'Consulting', 'Education', 'Healthcare',
    'Finance', 'Marketing', 'Food & Beverage', 'Fashion', 'Services',
    'Real Estate', 'Media & Entertainment', 'Travel & Tourism', 'Fitness & Wellness',
    'Beauty & Personal Care', 'Legal Services', 'Architecture & Design', 'Other'
  ];
  
  const allStages = [
    'Ideation', 'Validation', 'MVP Development', 'Early Traction',
    'Scaling', 'Established'
  ];

  // Get unique industries/stages from members, plus add all options for filtering
  const memberIndustries = Array.from(new Set(members.map(m => m.industry).filter(Boolean))).sort();
  const memberStages = Array.from(new Set(members.map(m => m.business_stage).filter(Boolean))).sort();
  
  // Combine member data with all options (for when admin adds new options)
  const industries = [...new Set([...allIndustries, ...memberIndustries])].sort();
  const stages = [...new Set([...allStages, ...memberStages])].sort();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D3A6B]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, bio, skills, or industry..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline h-4 w-4 mr-1" />
                Role
              </label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="solopreneur">Solopreneurs</option>
                <option value="mentor">Mentors</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
              <select
                value={filterIndustry}
                onChange={(e) => setFilterIndustry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
              >
                <option value="all">All Industries</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Stage</label>
              <select
                value={filterStage}
                onChange={(e) => setFilterStage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
              >
                <option value="all">All Stages</option>
                {stages.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredMembers.length} of {members.length} members
      </div>

      {/* Members Grid */}
      {filteredMembers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No members found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onClick={() => navigate(`/community/members/${member.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface MemberCardProps {
  member: CommunityMember;
  onClick: () => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start gap-4 mb-4">
        {member.avatar_url ? (
          <img
            src={member.avatar_url}
            alt={member.display_name || member.full_name}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-[#1D3A6B] flex items-center justify-center text-white font-semibold text-xl">
            {(member.display_name || member.full_name)[0].toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[#1D3A6B] text-lg truncate">
            {member.display_name || member.full_name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              member.role === 'mentor' 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {member.role === 'mentor' ? 'Mentor' : 'Solopreneur'}
            </span>
            {member.points > 0 && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                <Award className="h-3 w-3" />
                {member.points} pts
              </span>
            )}
          </div>
        </div>
      </div>

      {member.bio && (
        <p className="text-sm text-gray-700 mb-4 line-clamp-2">
          {member.bio}
        </p>
      )}

      <div className="space-y-2">
        {member.industry && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Briefcase className="h-3 w-3" />
            <span>{member.industry}</span>
          </div>
        )}
        {member.location && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <MapPin className="h-3 w-3" />
            <span>{member.location}</span>
          </div>
        )}
        {member.business_stage && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <User className="h-3 w-3" />
            <span>{member.business_stage}</span>
          </div>
        )}
      </div>

      {member.skills && member.skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1">
          {member.skills.slice(0, 3).map((skill, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
            >
              {skill}
            </span>
          ))}
          {member.skills.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 text-gray-500 text-xs">
              +{member.skills.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default MemberDirectory;
