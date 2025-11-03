import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { auth } from '../lib/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await auth.getSession();
        if (sessionError) {
          setError(sessionError.message);
          setLoading(false);
          return;
        }
        setUser(session?.user ?? null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === 'SIGNED_OUT') {
        setError(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      const { error } = await auth.signOut();
      if (error) throw error;
      setUser(null);
      return { error: null };
    } catch (err: any) {
      setError(err.message);
      return { error: err };
    }
  };

  return {
    user,
    loading,
    error,
    signOut,
    isAuthenticated: !!user,
  };
};
