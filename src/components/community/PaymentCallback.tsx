import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { supabase, auth } from '../../lib/supabase';

/**
 * Payment Callback Handler
 * Handles Razorpay payment redirects and updates payment status
 */
const PaymentCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { type, id } = useParams<{ type: 'course' | 'session'; id: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing payment...');

  useEffect(() => {
    handlePaymentCallback();
  }, []);

  const handlePaymentCallback = async () => {
    try {
      // Get payment details from URL
      const paymentId = searchParams.get('razorpay_payment_id');
      const orderId = searchParams.get('razorpay_order_id');
      const signature = searchParams.get('razorpay_signature');

      if (!paymentId || !orderId) {
        setStatus('error');
        setMessage('Payment details not found. Please contact support if payment was deducted.');
        setTimeout(() => navigate('/community'), 5000);
        return;
      }

      const { data: { user } } = await auth.getUser();
      if (!user) {
        setStatus('error');
        setMessage('Please sign in to complete payment verification.');
        setTimeout(() => navigate('/community'), 3000);
        return;
      }

      // Verify payment based on type
      if (type === 'course' && id) {
        await verifyCoursePayment(id, paymentId, orderId, signature);
      } else if (type === 'session' && id) {
        await verifySessionPayment(id, paymentId, orderId, signature);
      } else {
        setStatus('error');
        setMessage('Invalid payment type or ID.');
        setTimeout(() => navigate('/community'), 3000);
      }
    } catch (error: any) {
      console.error('Payment callback error:', error);
      setStatus('error');
      setMessage(error.message || 'Payment verification failed. Please contact support.');
      setTimeout(() => navigate('/community'), 5000);
    }
  };

  const verifyCoursePayment = async (
    courseId: string,
    paymentId: string,
    orderId: string,
    signature: string | null
  ) => {
    try {
      const { data: member } = await supabase
        .from('community_members')
        .select('id')
        .eq('user_id', (await auth.getUser()).data.user?.id)
        .single();

      if (!member) throw new Error('Member profile not found');

      // Get enrollment record
      const { data: enrollment, error: fetchError } = await supabase
        .from('course_enrollments')
        .select('*, mentor_courses(*)')
        .eq('course_id', courseId)
        .eq('student_id', member.id)
        .single();

      if (fetchError) {
        // Enrollment might not exist yet, create it
        const { data: course } = await supabase
          .from('mentor_courses')
          .select('commission_rate, price')
          .eq('id', courseId)
          .single();

        if (!course) throw new Error('Course not found');

        const commissionRate = course.commission_rate || 15;
        const amount = course.price;
        const commissionAmount = (amount * commissionRate) / 100;
        const mentorPayout = amount - commissionAmount;

        const { error: insertError } = await supabase
          .from('course_enrollments')
          .insert({
            course_id: courseId,
            student_id: member.id,
            payment_status: 'paid',
            payment_amount: amount,
            commission_amount: commissionAmount,
            mentor_payout: mentorPayout,
            razorpay_order_id: orderId,
            razorpay_payment_id: paymentId,
            razorpay_signature: signature || '',
            enrollment_status: 'active',
          });

        if (insertError) throw insertError;
      } else {
        // Update existing enrollment
        const { error: updateError } = await supabase
          .from('course_enrollments')
          .update({
            payment_status: 'paid',
            razorpay_order_id: orderId,
            razorpay_payment_id: paymentId,
            razorpay_signature: signature || '',
            enrollment_status: 'active',
          })
          .eq('id', enrollment.id);

        if (updateError) throw updateError;
      }

      setStatus('success');
      setMessage('Payment successful! You have been enrolled in the course.');
      setTimeout(() => navigate(`/community/courses/${courseId}`), 3000);
    } catch (error: any) {
      throw new Error(`Course payment verification failed: ${error.message}`);
    }
  };

  const verifySessionPayment = async (
    sessionId: string,
    paymentId: string,
    orderId: string,
    signature: string | null
  ) => {
    try {
      const { data: session, error: fetchError } = await supabase
        .from('mentor_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (fetchError) throw new Error('Session not found');

      const commissionRate = session.commission_rate || 20;
      const amount = session.price || 0;
      const commissionAmount = (amount * commissionRate) / 100;
      const mentorPayout = amount - commissionAmount;

      const { error: updateError } = await supabase
        .from('mentor_sessions')
        .update({
          payment_status: 'paid',
          commission_amount: commissionAmount,
          mentor_payout: mentorPayout,
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: signature || '',
          status: 'confirmed',
          confirmed_at: new Date().toISOString(),
        })
        .eq('id', sessionId);

      if (updateError) throw updateError;

      setStatus('success');
      setMessage('Payment successful! Your session has been confirmed.');
      setTimeout(() => navigate(`/community/sessions/${sessionId}`), 3000);
    } catch (error: any) {
      throw new Error(`Session payment verification failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
        {status === 'loading' && (
          <>
            <Loader className="h-16 w-16 text-[#1D3A6B] animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">Redirecting...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => navigate('/community')}
              className="bg-[#1D3A6B] text-white px-6 py-2 rounded-lg hover:bg-[#152A4F] transition-colors"
            >
              Back to Community
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentCallback;

