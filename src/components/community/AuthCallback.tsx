import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { supabase, auth } from '../../lib/supabase';

// Import test utility in development
if (import.meta.env.DEV) {
  import('../../utils/testSupabase');
}

const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Completing authentication...');

  useEffect(() => {
    handleAuthCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAuthCallback = async () => {
    try {
      // Check for error in URL
      const error = searchParams.get('error') || new URLSearchParams(window.location.hash.substring(1)).get('error');
      const errorDescription = searchParams.get('error_description') || new URLSearchParams(window.location.hash.substring(1)).get('error_description');

      if (error) {
        setStatus('error');
        setMessage(errorDescription || 'Authentication failed. Please try again.');
        setTimeout(() => {
          navigate('/community');
        }, 3000);
        return;
      }

      // Wait a moment for Supabase to process the hash fragment
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check session (Supabase automatically processes the hash and creates session)
      const { data: { session }, error: sessionError } = await auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        setStatus('error');
        setMessage(sessionError.message || 'Failed to establish session. Please try signing in again.');
        setTimeout(() => {
          navigate('/community');
        }, 3000);
        return;
      }

      if (!session) {
        // No session found - might need to wait or retry
        setMessage('Waiting for authentication...');
        setTimeout(async () => {
          const { data: { session: retrySession } } = await auth.getSession();
          if (retrySession) {
            setStatus('success');
            setMessage('Authentication successful! Redirecting...');
            setTimeout(() => navigate('/community'), 1000);
          } else {
            setStatus('error');
            setMessage('No authentication found. Redirecting to sign in...');
            setTimeout(() => navigate('/community'), 2000);
          }
        }, 2000);
        return;
      }

      // Session exists - check if profile exists
      try {
        const { data: member, error: memberError } = await supabase
          .from('community_members')
          .select('id')
          .eq('user_id', session.user.id)
          .single();

        if (memberError && memberError.code !== 'PGRST116') {
          // Error other than "not found" - log but continue
          console.warn('Error checking member profile:', memberError);
        }

        setStatus('success');
        setMessage(member ? 'Welcome back! Redirecting...' : 'Setting up your profile...');
        
        setTimeout(() => {
          navigate('/community');
        }, 1500);
      } catch (err) {
        // On any error checking profile, just redirect (onboarding will handle)
        console.warn('Profile check error:', err);
        setStatus('success');
        setMessage('Authentication successful! Redirecting...');
        setTimeout(() => {
          navigate('/community');
        }, 1500);
      }
    } catch (err: any) {
      console.error('Auth callback error:', err);
      setStatus('error');
      setMessage(err.message || 'An unexpected error occurred. Please try again.');
      setTimeout(() => {
        navigate('/community');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <Loader className="h-12 w-12 text-[#1D3A6B] animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Authenticating...</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Success!</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Failed</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => navigate('/community')}
              className="bg-[#1D3A6B] text-white px-6 py-2 rounded-lg hover:bg-[#152A4F] transition-colors"
            >
              Go to Community
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
