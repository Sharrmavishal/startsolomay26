// Utility to test Supabase connection
import { supabase } from '../lib/supabase';

export const testSupabaseConnection = async (): Promise<{
  success: boolean;
  message: string;
  error?: any;
}> => {
  try {
    // Test 1: Check if Supabase client is initialized
    if (!supabase) {
      return {
        success: false,
        message: 'Supabase client not initialized. Check environment variables.',
      };
    }

    // Test 2: Try a simple query to verify connection
    const { data, error } = await supabase
      .from('community_badges')
      .select('count')
      .limit(1);

    if (error) {
      // Check if it's a table not found error (migration not run)
      if (error.code === '42P01') {
        return {
          success: false,
          message: 'Database tables not found. Please run the migration: supabase/migrations/20250101000000_community_platform.sql',
          error: error.message,
        };
      }
      // Check if it's an RLS policy issue
      if (error.code === '42501') {
        return {
          success: false,
          message: 'Permission denied. RLS policies may need adjustment.',
          error: error.message,
        };
      }
      return {
        success: false,
        message: `Supabase connection error: ${error.message}`,
        error: error.message,
      };
    }

    return {
      success: true,
      message: 'Supabase connection successful! All systems ready.',
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Failed to connect to Supabase: ${err.message}`,
      error: err,
    };
  }
};

// Call this on app load in development
if (import.meta.env.DEV) {
  testSupabaseConnection().then((result) => {
    if (result.success) {
      console.log('✅ Supabase:', result.message);
    } else {
      console.warn('⚠️ Supabase:', result.message);
      if (result.error) {
        console.error('Error details:', result.error);
      }
    }
  });
}
