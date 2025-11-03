import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Briefcase, User, Award, Mail, MessageCircle, Calendar, Edit } from 'lucide-react';
import { supabase, auth } from '../../lib/supabase';
import type { CommunityMember } from '../../lib/supabase';
import BadgesDisplay from './BadgesDisplay';
import EditProfileForm from './EditProfileForm';

const MemberProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [member, setMember] = useState<CommunityMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadProfile();
    loadCurrentUser();
  }, [id]);

  const loadCurrentUser = async () => {
    const { data: { user } } = await auth.getUser();
    if (user) setCurrentUserId(user.id);
  };

  const loadProfile = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('community_members')
        .select('*')
        .eq('id', id)
        .eq('vetting_status', 'vetted')
        .single();

      if (error) throw error;
      setMember(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D3A6B]"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">This member profile doesn't exist or isn't available.</p>
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

  const isOwnProfile = currentUserId && member.user_id === currentUserId;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/community')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#1D3A6B] mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Community
          </button>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {member.avatar_url ? (
                <img
                  src={member.avatar_url}
                  alt={member.display_name || member.full_name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-[#1D3A6B] flex items-center justify-center text-white font-semibold text-4xl border-4 border-white shadow-lg">
                  {(member.display_name || member.full_name)[0].toUpperCase()}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-[#1D3A6B] mb-2">
                    {member.display_name || member.full_name}
                  </h1>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      member.role === 'mentor' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {member.role === 'mentor' ? 'Mentor' : 'Solopreneur'}
                    </span>
                    {member.points > 0 && (
                      <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                        <Award className="h-4 w-4" />
                        {member.points} points
                      </span>
                    )}
                    {member.badges && member.badges.length > 0 && (
                      <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                        <Award className="h-4 w-4 text-yellow-500" />
                        {member.badges.length} badge{member.badges.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio */}
              {member.bio && (
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {member.bio}
                </p>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {member.industry && (
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Industry</div>
                      <div className="text-sm font-medium text-gray-900">{member.industry}</div>
                    </div>
                  </div>
                )}
                {member.business_stage && (
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Business Stage</div>
                      <div className="text-sm font-medium text-gray-900">{member.business_stage}</div>
                    </div>
                  </div>
                )}
                {member.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Location</div>
                      <div className="text-sm font-medium text-gray-900">{member.location}</div>
                    </div>
                  </div>
                )}
                {member.course_completed && (
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-yellow-500" />
                    <div>
                      <div className="text-xs text-gray-500">Course Status</div>
                      <div className="text-sm font-medium text-green-600">Course Completed</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Skills */}
              {member.skills && member.skills.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Skills & Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-1 bg-blue-50 text-[#1D3A6B] rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              {member.social_links && Object.keys(member.social_links).length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Connect</h3>
                  <div className="flex flex-wrap gap-3">
                    {member.social_links.linkedin && (
                      <a
                        href={member.social_links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        LinkedIn
                      </a>
                    )}
                    {member.social_links.twitter && (
                      <a
                        href={member.social_links.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-600 text-sm"
                      >
                        Twitter
                      </a>
                    )}
                    {member.social_links.website && (
                      <a
                        href={member.social_links.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1D3A6B] hover:text-[#152A4F] text-sm"
                      >
                        Website
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              {isOwnProfile ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 bg-[#1D3A6B] text-white px-4 py-2 rounded-lg hover:bg-[#152A4F] transition-colors text-sm font-medium"
                  >
                    <Edit className="h-4 w-4" />
                    {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 bg-[#1D3A6B] text-white px-4 py-2 rounded-lg hover:bg-[#152A4F] transition-colors text-sm font-medium">
                    <MessageCircle className="h-4 w-4" />
                    Send Message
                  </button>
                  {member.role === 'mentor' && (
                    <button className="flex items-center gap-2 border-2 border-[#1D3A6B] text-[#1D3A6B] px-4 py-2 rounded-lg hover:bg-[#1D3A6B] hover:text-white transition-colors text-sm font-medium">
                      <Calendar className="h-4 w-4" />
                      Request Mentorship
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Section */}
      {isEditing && isOwnProfile && member && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <EditProfileForm
              memberId={member.id}
              onSave={() => {
                setIsEditing(false);
                loadProfile();
              }}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        </div>
      )}

      {/* Activity Section - Placeholder for future */}
      {!isEditing && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
            <h2 className="text-xl font-bold text-[#1D3A6B] mb-4">Badges & Achievements</h2>
            {member && <BadgesDisplay memberId={member.id} showAll={true} />}
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-[#1D3A6B] mb-4">Activity</h2>
            <p className="text-gray-600 text-sm">Member activity and posts will appear here soon.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberProfile;
