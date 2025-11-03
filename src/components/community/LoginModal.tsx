import React, { useState } from 'react';
import { X, Mail, Lock, Loader } from 'lucide-react';
import { auth, supabase } from '../../lib/supabase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialMode?: 'login' | 'signup' | 'magic-link';
}

const LoginModal: React.FC<LoginModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'magic-link' | 'forgot-password'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'magic-link') {
        const redirectUrl = `${window.location.origin}/community/auth/callback`;
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: redirectUrl,
          },
        });
        if (error) throw error;
        setSuccess('Check your email for the magic link!');
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 2000);
      } else if (mode === 'signup') {
        if (!fullName.trim()) {
          setError('Full name is required');
          setLoading(false);
          return;
        }
        const { data, error } = await auth.signUp(email, password, { full_name: fullName });
        if (error) throw error;
        
        if (data.user && !data.session) {
          // Email confirmation required
          setSuccess('Please check your email to confirm your account. Once confirmed, you can sign in.');
          // Don't close modal yet, let them know to check email
        } else if (data.session) {
          // Session created, account ready
          setSuccess('Account created successfully!');
          setTimeout(() => {
            onSuccess?.();
            onClose();
          }, 1500);
        } else {
          setSuccess('Account created! Please sign in.');
          setTimeout(() => {
            setMode('login');
            setSuccess(null);
          }, 2000);
        }
      } else if (mode === 'forgot-password') {
        // Password reset
        const redirectUrl = `${window.location.origin}/community/auth/reset-password`;
        const { error } = await auth.resetPassword(email, redirectUrl);
        if (error) throw error;
        setSuccess('Check your email for a password reset link!');
        setTimeout(() => {
          setMode('login');
          setSuccess(null);
        }, 3000);
      } else {
        // Login
        const { error } = await auth.signIn(email, password);
        if (error) throw error;
        setSuccess('Signed in successfully!');
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 500);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setError(null);
    setSuccess(null);
    setMode('login');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#1D3A6B]">
            {mode === 'signup' ? 'Create Account' : mode === 'magic-link' ? 'Sign In' : mode === 'forgot-password' ? 'Reset Password' : 'Welcome Back'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Mode Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            <button
              onClick={() => {
                setMode('login');
                setError(null);
                setSuccess(null);
              }}
              className={`px-4 py-2 font-medium transition-colors ${
                mode === 'login'
                  ? 'text-[#1D3A6B] border-b-2 border-[#1D3A6B]'
                  : 'text-gray-600 hover:text-[#1D3A6B]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setError(null);
                setSuccess(null);
              }}
              className={`px-4 py-2 font-medium transition-colors ${
                mode === 'signup'
                  ? 'text-[#1D3A6B] border-b-2 border-[#1D3A6B]'
                  : 'text-gray-600 hover:text-[#1D3A6B]'
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => {
                setMode('magic-link');
                setError(null);
                setSuccess(null);
              }}
              className={`px-4 py-2 font-medium transition-colors ${
                mode === 'magic-link'
                  ? 'text-[#1D3A6B] border-b-2 border-[#1D3A6B]'
                  : 'text-gray-600 hover:text-[#1D3A6B]'
              }`}
            >
              Magic Link
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {mode !== 'magic-link' && mode !== 'forgot-password' && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                    placeholder={mode === 'signup' ? 'Min. 8 characters' : 'Enter your password'}
                    required
                    minLength={mode === 'signup' ? 8 : undefined}
                  />
                </div>
                {mode === 'signup' && (
                  <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters</p>
                )}
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot-password');
                      setError(null);
                      setSuccess(null);
                    }}
                    className="mt-2 text-sm text-[#1D3A6B] hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
            )}

            {mode === 'magic-link' && (
              <p className="text-sm text-gray-600">
                We'll send you a secure link to sign in without a password.
              </p>
            )}

            {mode === 'forgot-password' && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                    setSuccess(null);
                  }}
                  className="text-sm text-[#1D3A6B] hover:underline"
                >
                  Back to Sign In
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1D3A6B] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#152A4F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  {mode === 'magic-link' ? 'Sending...' : mode === 'signup' ? 'Creating Account...' : mode === 'forgot-password' ? 'Sending...' : 'Signing In...'}
                </>
              ) : (
                mode === 'magic-link' ? 'Send Magic Link' : mode === 'signup' ? 'Create Account' : mode === 'forgot-password' ? 'Send Reset Link' : 'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              By {mode === 'signup' ? 'creating an account' : 'signing in'}, you agree to our{' '}
              <a href="/policies/terms" className="text-[#1D3A6B] hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/policies/privacy" className="text-[#1D3A6B] hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
