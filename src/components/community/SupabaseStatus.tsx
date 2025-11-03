// Development-only component to check Supabase status
import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react';
import { supabase, auth } from '../../lib/supabase';

interface StatusCheck {
  name: string;
  status: 'checking' | 'success' | 'error';
  message: string;
}

const SupabaseStatus: React.FC = () => {
  const [checks, setChecks] = useState<StatusCheck[]>([
    { name: 'Environment Variables', status: 'checking', message: 'Checking...' },
    { name: 'Supabase Connection', status: 'checking', message: 'Connecting...' },
    { name: 'Database Tables', status: 'checking', message: 'Verifying...' },
    { name: 'Authentication', status: 'checking', message: 'Testing...' },
  ]);

  useEffect(() => {
    if (!import.meta.env.DEV) return; // Only show in development

    const runChecks = async () => {
      const results: StatusCheck[] = [];

      // Check 1: Environment Variables
      const hasUrl = !!import.meta.env.VITE_SUPABASE_URL;
      const hasKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY;
      results.push({
        name: 'Environment Variables',
        status: hasUrl && hasKey ? 'success' : 'error',
        message: hasUrl && hasKey 
          ? 'Environment variables loaded'
          : `Missing: ${!hasUrl ? 'VITE_SUPABASE_URL' : ''} ${!hasKey ? 'VITE_SUPABASE_ANON_KEY' : ''}`.trim(),
      });

      if (!hasUrl || !hasKey) {
        setChecks(results);
        return;
      }

      // Check 2: Supabase Connection
      try {
        const { error } = await supabase.from('community_badges').select('count').limit(1);
        if (error && error.code === '42P01') {
          results.push({
            name: 'Database Tables',
            status: 'error',
            message: 'Tables not found. Run migration: supabase/migrations/20250101000000_community_platform.sql',
          });
        } else if (error) {
          results.push({
            name: 'Supabase Connection',
            status: 'error',
            message: `Connection error: ${error.message}`,
          });
        } else {
          results.push({
            name: 'Supabase Connection',
            status: 'success',
            message: 'Connected successfully',
          });
          results.push({
            name: 'Database Tables',
            status: 'success',
            message: 'Tables exist and accessible',
          });
        }
      } catch (err: any) {
        results.push({
          name: 'Supabase Connection',
          status: 'error',
          message: `Failed: ${err.message}`,
        });
      }

      // Check 3: Authentication
      try {
        const { data: { session } } = await auth.getSession();
        results.push({
          name: 'Authentication',
          status: 'success',
          message: session ? 'Session active' : 'No active session (normal if not signed in)',
        });
      } catch (err: any) {
        results.push({
          name: 'Authentication',
          status: 'error',
          message: `Auth check failed: ${err.message}`,
        });
      }

      setChecks(results);
    };

    runChecks();
  }, []);

  if (!import.meta.env.DEV) {
    return null;
  }

  const allGood = checks.every(c => c.status === 'success' || (c.name === 'Authentication' && c.message.includes('No active session')));

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="font-semibold text-sm text-gray-900">Supabase Status</h3>
        {allGood ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
          <AlertCircle className="h-4 w-4 text-yellow-500" />
        )}
      </div>
      <div className="space-y-2">
        {checks.map((check, idx) => (
          <div key={idx} className="flex items-start gap-2 text-xs">
            {check.status === 'checking' && <Loader className="h-3 w-3 text-gray-400 animate-spin mt-0.5" />}
            {check.status === 'success' && <CheckCircle className="h-3 w-3 text-green-500 mt-0.5" />}
            {check.status === 'error' && <XCircle className="h-3 w-3 text-red-500 mt-0.5" />}
            <div className="flex-1">
              <div className="font-medium text-gray-900">{check.name}</div>
              <div className={`text-gray-600 ${check.status === 'error' ? 'text-red-600' : ''}`}>
                {check.message}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupabaseStatus;
