import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// These will be set via environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase URL or Anon Key not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
} else {
  console.log('✅ Supabase client initialized');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Auth helpers
export const auth = {
  // Sign up with email and password
  signUp: async (email: string, password: string, metadata?: { full_name?: string }, captchaToken?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata || {},
        captchaToken: captchaToken,
      },
    });
    return { data, error };
  },

  // Sign in with email and password
  signIn: async (email: string, password: string, captchaToken?: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        captchaToken: captchaToken,
      },
    });
    return { data, error };
  },

  // Sign in with magic link (passwordless)
  signInWithMagicLink: async (email: string, redirectTo?: string, captchaToken?: string) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo || `${window.location.origin}/community/auth/callback`,
        captchaToken: captchaToken,
      },
    });
    return { data, error };
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current session
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    return { data, error };
  },

  // Get current user
  getUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    return { data, error };
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },

  // Reset password
  resetPassword: async (email: string, redirectTo?: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo || `${window.location.origin}/community/auth/reset-password`,
    });
    return { data, error };
  },

  // Update password
  updatePassword: async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { data, error };
  },
};

// Database types (will be generated from Supabase schema)
export type MemberRole = 'solopreneur' | 'mentor' | 'admin';
export type VettingStatus = 'pending' | 'approved' | 'rejected' | 'vetted';
export type PostCategory = 'getting-started' | 'business-strategy' | 'marketing' | 'funding' | 'success-stories' | 'general' | 'q-and-a';

// Community Members
export interface CommunityMember {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  role: MemberRole;
  vetting_status: VettingStatus;
  vetting_notes: string | null;
  vetting_date: string | null;
  vetting_admin_id: string | null;
  industry: string | null;
  business_stage: string | null;
  location: string | null;
  skills: string[];
  social_links: Record<string, string>;
  points: number;
  badges: string[];
  has_course_access: boolean;
  course_completed: boolean;
  course_completion_date: string | null;
  profile_completeness: number;
  last_active_at: string | null;
  membership_expires_at: string | null;
  trial_extension_count: number | null;
  trial_extension_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

// Community Posts
export interface CommunityPost {
  id: string;
  author_id: string;
  category: PostCategory;
  title: string;
  content: string;
  content_html: string | null;
  upvotes: number;
  views: number;
  reply_count: number;
  bookmarked_count: number;
  tags: string[];
  is_pinned: boolean;
  is_locked: boolean;
  best_answer_id: string | null;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

// Community Comments
export interface CommunityComment {
  id: string;
  post_id: string;
  author_id: string;
  parent_comment_id: string | null;
  content: string;
  content_html: string | null;
  upvotes: number;
  is_best_answer: boolean;
  created_at: string;
  updated_at: string;
  edited_at: string | null;
}

// Community Events
export interface CommunityEvent {
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
}

// Legacy quiz lead interface (keeping for backward compatibility)
export interface QuizLead {
  name: string;
  email: string;
  quiz_stage: string;
  quiz_persona: string;
  quiz_score: number;
  opt_in: boolean;
}

export const saveQuizLead = async (lead: QuizLead) => {
  console.log('Supabase integration active. Quiz lead can be saved to database:', lead);
  // TODO: Implement actual database save if needed
  return Promise.resolve([{ id: 'mock-id', ...lead }]);
};