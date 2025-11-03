import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, supabase } from '../../lib/supabase';
import LoginModal from './LoginModal';

interface AuthGuardProps {
  children: React.ReactNode;
  requireVetted?: boolean; // If true, requires vetted status
  requireAdmin?: boolean; // If true, requires admin role
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireVetted = false,
  requireAdmin = false 
}) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('AuthGuard: useEffect triggered');
    const checkAuth = async () => {
      console.log('AuthGuard: Starting auth check');
      try {
        // First check for session
        const { data: { session }, error: sessionError } = await auth.getSession();
        
        console.log('AuthGuard: Session check result', { session: !!session, error: sessionError });
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setAuthenticated(false);
          setShowLogin(true);
          setLoading(false);
          return;
        }
        
        if (!session) {
          console.log('AuthGuard: No session, showing login');
          setAuthenticated(false);
          setShowLogin(true);
          setLoading(false);
          return;
        }

        // If vetted or admin requirements, check member status
        if (requireVetted || requireAdmin) {
          try {
            const { data: member, error: memberError } = await supabase
              .from('community_members')
              .select('vetting_status, role')
              .eq('user_id', session.user.id)
              .maybeSingle(); // Use maybeSingle to avoid errors

            if (memberError && memberError.code !== 'PGRST116') {
              console.error('Member lookup error:', memberError);
              // On error, allow authenticated users through (let CommunityPage handle it)
              setAuthenticated(true);
              setLoading(false);
              return;
            }

            if (!member) {
              // No profile yet, but authenticated - allow through (onboarding will handle)
              setAuthenticated(true);
              setLoading(false);
              return;
            }

            if (requireAdmin && member.role !== 'admin') {
              setAuthenticated(false);
              setShowLogin(true);
              setLoading(false);
              return;
            }

            if (requireVetted && member.vetting_status !== 'vetted') {
              // Allow access but show pending message (will be handled by CommunityPage)
              setAuthenticated(true);
            } else {
              setAuthenticated(true);
            }
          } catch (err) {
            console.error('Error checking member status:', err);
            // On error, allow authenticated users through
            setAuthenticated(true);
          }
        } else {
          setAuthenticated(true);
        }
        
        console.log('AuthGuard: Auth check complete');
        setLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        // On error, still show login modal instead of blocking
        setAuthenticated(false);
        setShowLogin(true);
        setLoading(false);
      }
    };

    checkAuth();

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.warn('Auth check taking too long, forcing login modal');
      setLoading(false);
      setAuthenticated(false);
      setShowLogin(true);
    }, 10000); // 10 second timeout

    // Listen for auth state changes
    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      clearTimeout(timeoutId);
      if (event === 'SIGNED_IN' && session) {
        setAuthenticated(true);
        setShowLogin(false);
        // Reload page to refresh member data
        window.location.reload();
      } else if (event === 'SIGNED_OUT') {
        setAuthenticated(false);
        setShowLogin(true);
      } else if (event === 'TOKEN_REFRESHED' && session) {
        setAuthenticated(true);
      }
    });

    return () => {
      clearTimeout(timeoutId);
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [requireVetted, requireAdmin]);

  if (loading) {
    console.log('AuthGuard: Loading state');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D3A6B]"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    console.log('AuthGuard: Not authenticated, showing login modal');
    return (
      <>
        <LoginModal 
          isOpen={showLogin} 
          onClose={() => {
            setShowLogin(false);
            navigate('/');
          }}
          onSuccess={() => {
            setAuthenticated(true);
            setShowLogin(false);
          }}
        />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-4">Please sign in to access the community.</p>
          </div>
        </div>
      </>
    );
  }

  console.log('AuthGuard: Authenticated, rendering children');
  return <>{children}</>;
};

export default AuthGuard;
