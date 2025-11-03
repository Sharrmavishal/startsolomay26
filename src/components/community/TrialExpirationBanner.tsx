import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface TrialExpirationBannerProps {
  memberId: string;
  onDismiss?: () => void;
}

const TrialExpirationBanner: React.FC<TrialExpirationBannerProps> = ({ memberId, onDismiss }) => {
  const [trialStatus, setTrialStatus] = useState<{
    expiresAt: string | null;
    isExpired: boolean;
    isInGracePeriod: boolean;
    daysRemaining: number | null;
  } | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    loadTrialStatus();
  }, [memberId]);

  const loadTrialStatus = async () => {
    try {
      const { data: member } = await supabase
        .from('community_members')
        .select('membership_expires_at, vetting_status')
        .eq('id', memberId)
        .single();

      if (!member) {
        return;
      }

      // Show banner for all non-vetted, non-admin members (pending, approved, rejected)
      if (member.vetting_status === 'vetted' || member.vetting_status === 'admin') {
        return; // No banner for vetted members/admins
      }

      if (!member.membership_expires_at) {
        // If expiration not set, show banner anyway (shouldn't happen, but handle gracefully)
        setTrialStatus({
          expiresAt: null,
          isExpired: false,
          isInGracePeriod: false,
          daysRemaining: null,
        });
        return;
      }

      const expiresAt = new Date(member.membership_expires_at);
      const now = new Date();
      const isExpired = expiresAt < now;
      
      // Check grace period (default 7 days)
      const { data: graceSetting } = await supabase
        .from('admin_settings')
        .select('value')
        .eq('key', 'trial_grace_period_days')
        .maybeSingle();
      
      const graceDays = graceSetting ? parseInt(graceSetting.value as string) : 7;
      const gracePeriodEnd = new Date(expiresAt.getTime() + graceDays * 24 * 60 * 60 * 1000);
      const isInGracePeriod = isExpired && now < gracePeriodEnd;
      
      const daysRemaining = isExpired 
        ? Math.ceil((gracePeriodEnd.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
        : Math.ceil((expiresAt.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));

      setTrialStatus({
        expiresAt: member.membership_expires_at,
        isExpired,
        isInGracePeriod,
        daysRemaining,
      });
    } catch (error) {
      console.error('Error loading trial status:', error);
    }
  };

  if (dismissed || !trialStatus) return null;

  const { expiresAt, isExpired, isInGracePeriod, daysRemaining } = trialStatus;

  // Always show banner for non-vetted members (regardless of expiration status)
  // This ensures users always see their trial status

  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) onDismiss();
  };

  return (
    <div className={`relative mb-4 rounded-lg border p-4 ${
      isExpired 
        ? 'bg-red-50 border-red-200' 
        : isInGracePeriod 
          ? 'bg-orange-50 border-orange-200'
          : 'bg-yellow-50 border-yellow-200'
    }`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className={`h-5 w-5 mt-0.5 ${
          isExpired ? 'text-red-600' : isInGracePeriod ? 'text-orange-600' : 'text-yellow-600'
        }`} />
        <div className="flex-1">
          <h3 className={`font-semibold mb-1 ${
            isExpired ? 'text-red-800' : isInGracePeriod ? 'text-orange-800' : 'text-yellow-800'
          }`}>
            {isExpired 
              ? `Trial Expired - ${daysRemaining !== null ? `${daysRemaining} days remaining in grace period` : 'Grace period expired'}`
              : isInGracePeriod
                ? `Trial Expired - ${daysRemaining !== null ? `${daysRemaining} days remaining in grace period` : 'Grace period expired'}`
                : daysRemaining !== null
                  ? `Trial Expires in ${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'}`
                  : 'Trial Period Active'
            }
          </h3>
          <p className={`text-sm mb-2 ${
            isExpired ? 'text-red-700' : isInGracePeriod ? 'text-orange-700' : 'text-yellow-700'
          }`}>
            {isExpired
              ? 'Your trial has expired. You can still view content for a limited time. Please complete your vetting process to continue accessing all features.'
              : isInGracePeriod
                ? 'Your trial has expired. You can still view content but cannot interact. Please complete your vetting process to restore full access.'
                : 'Complete your vetting process to continue accessing all features after your trial expires.'
            }
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Expires: {expiresAt ? new Date(expiresAt).toLocaleDateString() : 'Not set'}</span>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default TrialExpirationBanner;

