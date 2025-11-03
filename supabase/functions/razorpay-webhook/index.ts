import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Verify Razorpay webhook signature
// Razorpay uses HMAC SHA256 with the raw body string
async function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    // Use Web Crypto API for HMAC
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(payload);
    
    // Import key for HMAC
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    // Sign the payload
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, messageData);
    
    // Convert to hex string
    const computedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    // Constant-time comparison
    return computedSignature === signature.toLowerCase();
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get webhook secret from environment
    const razorpayWebhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET');
    if (!razorpayWebhookSecret) {
      throw new Error('RAZORPAY_WEBHOOK_SECRET not configured');
    }

    // Get signature from headers
    const signature = req.headers.get('X-Razorpay-Signature');
    if (!signature) {
      throw new Error('Missing webhook signature');
    }

    // Get request body
    const body = await req.text();
    
    // Verify signature
    const isValid = await verifyWebhookSignature(body, signature, razorpayWebhookSecret);
    if (!isValid) {
      console.error('Invalid webhook signature');
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse webhook payload
    const payload = JSON.parse(body);
    const event = payload.event;
    const payment = payload.payload?.payment?.entity;

    if (!event || !payment) {
      return new Response(
        JSON.stringify({ error: 'Invalid webhook payload' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Handle different payment events
    switch (event) {
      case 'payment.captured':
        await handlePaymentCaptured(supabase, payment);
        break;
      
      case 'payment.failed':
        await handlePaymentFailed(supabase, payment);
        break;
      
      case 'payment.refunded':
        await handlePaymentRefunded(supabase, payment);
        break;
      
      default:
        console.log(`Unhandled event: ${event}`);
    }

    return new Response(
      JSON.stringify({ success: true, event }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Handle successful payment
async function handlePaymentCaptured(supabase: any, payment: any) {
  const paymentId = payment.id;
  const orderId = payment.order_id;
  const amount = payment.amount / 100; // Convert from paise to rupees
  const notes = payment.notes || {};

  // Determine payment type from notes
  const paymentType = notes.type || (notes.course_id ? 'course' : notes.session_id ? 'session' : notes.event_id ? 'event' : notes.product_id ? 'event_product' : null);
  const itemId = notes.course_id || notes.session_id || notes.event_id || notes.product_id;

  if (!itemId) {
    // Fallback: Try to find by order_id (which might be enrollment/session/registration ID)
    console.log('No item ID in notes, trying to find by order_id:', orderId);
    
    // Try course enrollment first
    const { data: enrollmentByOrder } = await supabase
      .from('course_enrollments')
      .select('id, course_id, student_id')
      .eq('id', orderId)
      .maybeSingle();
    
    if (enrollmentByOrder) {
      const paymentType = 'course';
      const itemId = enrollmentByOrder.course_id;
      
      // Continue with course payment handling
      const { data: course } = await supabase
        .from('mentor_courses')
        .select('commission_rate')
        .eq('id', itemId)
        .single();

      const commissionRate = course?.commission_rate || 15;
      const commissionAmount = (amount * commissionRate) / 100;
      const mentorPayout = amount - commissionAmount;

      await supabase
        .from('course_enrollments')
        .update({
          payment_status: 'paid',
          payment_amount: amount,
          commission_amount: commissionAmount,
          mentor_payout: mentorPayout,
          enrollment_status: 'active',
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
        })
        .eq('id', enrollmentByOrder.id);

      const { data: member } = await supabase
        .from('community_members')
        .select('user_id')
        .eq('id', enrollmentByOrder.student_id)
        .single();

      if (member?.user_id) {
        const { data: courseData } = await supabase
          .from('mentor_courses')
          .select('title')
          .eq('id', itemId)
          .single();

        await supabase.from('notifications').insert({
          user_id: member.user_id,
          type: 'payment_confirmation',
          title: `Payment Confirmed: ${courseData?.title || 'Course'}`,
          message: `Your payment of ₹${amount.toFixed(2)} has been confirmed. Transaction ID: ${paymentId}`,
          channel: 'both',
          status: 'pending',
          metadata: {
            type: 'course',
            amount,
            transactionId: paymentId,
            itemId,
          },
        });
      }
      return;
    }
    
    // Try mentor session
    const { data: sessionByOrder } = await supabase
      .from('mentor_sessions')
      .select('id, mentee_id, commission_rate')
      .eq('id', orderId)
      .maybeSingle();
    
    if (sessionByOrder) {
      const commissionRate = sessionByOrder.commission_rate || 20;
      const commissionAmount = (amount * commissionRate) / 100;
      const mentorPayout = amount - commissionAmount;

      await supabase
        .from('mentor_sessions')
        .update({
          payment_status: 'paid',
          commission_amount: commissionAmount,
          mentor_payout: mentorPayout,
          status: 'confirmed',
          confirmed_at: new Date().toISOString(),
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
        })
        .eq('id', sessionByOrder.id);

      const { data: member } = await supabase
        .from('community_members')
        .select('user_id')
        .eq('id', sessionByOrder.mentee_id)
        .single();

      if (member?.user_id) {
        await supabase.from('notifications').insert({
          user_id: member.user_id,
          type: 'payment_confirmation',
          title: 'Session Payment Confirmed',
          message: `Your payment of ₹${amount.toFixed(2)} for the mentor session has been confirmed. Transaction ID: ${paymentId}`,
          channel: 'both',
          status: 'pending',
          metadata: {
            type: 'session',
            amount,
            transactionId: paymentId,
            itemId: sessionByOrder.id,
          },
        });
      }
      return;
    }
    
    // Try event registration
    const { data: registrationByOrder } = await supabase
      .from('event_registrations')
      .select('id, event_id, member_id')
      .eq('id', orderId)
      .maybeSingle();
    
    if (registrationByOrder) {
      const { data: event } = await supabase
        .from('community_events')
        .select('ticket_price, commission_rate')
        .eq('id', registrationByOrder.event_id)
        .single();

      const commissionRate = event?.commission_rate || 10; // Default 10% for events
      const commissionAmount = (amount * commissionRate) / 100;
      const organizerPayout = amount - commissionAmount;

      await supabase
        .from('event_registrations')
        .update({
          payment_status: 'paid',
          payment_amount: amount,
          commission_amount: commissionAmount,
          organizer_payout: organizerPayout,
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
        })
        .eq('id', registrationByOrder.id);

      const { data: member } = await supabase
        .from('community_members')
        .select('user_id')
        .eq('id', registrationByOrder.member_id)
        .single();

      if (member?.user_id) {
        const { data: eventData } = await supabase
          .from('community_events')
          .select('title')
          .eq('id', registrationByOrder.event_id)
          .single();

        await supabase.from('notifications').insert({
          user_id: member.user_id,
          type: 'payment_confirmation',
          title: `Payment Confirmed: ${eventData?.title || 'Event'}`,
          message: `Your payment of ₹${amount.toFixed(2)} has been confirmed. Transaction ID: ${paymentId}`,
          channel: 'both',
          status: 'pending',
          metadata: {
            type: 'event',
            amount,
            transactionId: paymentId,
            itemId: registrationByOrder.event_id,
          },
        });
      }
      return;
    }
    
    // Try event product purchase
    const { data: purchaseByOrder } = await supabase
      .from('event_product_purchases')
      .select('id, product_id, buyer_id')
      .eq('id', orderId)
      .maybeSingle();
    
    if (purchaseByOrder) {
      const { data: product } = await supabase
        .from('event_products')
        .select('commission_rate')
        .eq('id', purchaseByOrder.product_id)
        .single();

      const commissionRate = product?.commission_rate || 10;
      const commissionAmount = (amount * commissionRate) / 100;
      const mentorPayout = amount - commissionAmount;

      await supabase
        .from('event_product_purchases')
        .update({
          payment_status: 'paid',
          payment_amount: amount,
          commission_amount: commissionAmount,
          mentor_payout: mentorPayout,
          purchase_status: 'active',
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
        })
        .eq('id', purchaseByOrder.id);

      const { data: member } = await supabase
        .from('community_members')
        .select('user_id')
        .eq('id', purchaseByOrder.buyer_id)
        .single();

      if (member?.user_id) {
        const { data: productData } = await supabase
          .from('event_products')
          .select('product_name')
          .eq('id', purchaseByOrder.product_id)
          .single();

        await supabase.from('notifications').insert({
          user_id: member.user_id,
          type: 'payment_confirmation',
          title: `Payment Confirmed: ${productData?.product_name || 'Product'}`,
          message: `Your payment of ₹${amount.toFixed(2)} has been confirmed. Transaction ID: ${paymentId}`,
          channel: 'both',
          status: 'pending',
          metadata: {
            type: 'event_product',
            amount,
            transactionId: paymentId,
            itemId: purchaseByOrder.product_id,
          },
        });
      }
      return;
    }
    
    console.error('No item ID found in payment notes and order_id lookup failed');
    return;
  }

  try {
    if (paymentType === 'course') {
      // Update course enrollment
      const { data: enrollment } = await supabase
        .from('course_enrollments')
        .select('student_id, course_id')
        .eq('course_id', itemId)
        .eq('razorpay_payment_id', paymentId)
        .maybeSingle();

      if (enrollment) {
        // Get course for commission calculation
        const { data: course } = await supabase
          .from('mentor_courses')
          .select('commission_rate')
          .eq('id', itemId)
          .single();

        const commissionRate = course?.commission_rate || 15;
        const commissionAmount = (amount * commissionRate) / 100;
        const mentorPayout = amount - commissionAmount;

        await supabase
          .from('course_enrollments')
          .update({
            payment_status: 'paid',
            payment_amount: amount,
            commission_amount: commissionAmount,
            mentor_payout: mentorPayout,
            enrollment_status: 'active',
          })
          .eq('id', enrollment.id);

        // Send notification
        const { data: member } = await supabase
          .from('community_members')
          .select('user_id')
          .eq('id', enrollment.student_id)
          .single();

        if (member?.user_id) {
          const { data: courseData } = await supabase
            .from('mentor_courses')
            .select('title')
            .eq('id', itemId)
            .single();

          // Queue notification
          await supabase.from('notifications').insert({
            user_id: member.user_id,
            type: 'payment_confirmation',
            title: `Payment Confirmed: ${courseData?.title || 'Course'}`,
            message: `Your payment of ₹${amount.toFixed(2)} has been confirmed. Transaction ID: ${paymentId}`,
            channel: 'both',
            status: 'pending',
            metadata: {
              type: 'course',
              amount,
              transactionId: paymentId,
              itemId,
            },
          });
        }
      }
    } else if (paymentType === 'session') {
      // Update mentor session
      const { data: session } = await supabase
        .from('mentor_sessions')
        .select('mentee_id, commission_rate')
        .eq('id', itemId)
        .eq('razorpay_payment_id', paymentId)
        .maybeSingle();

      if (session) {
        const commissionRate = session.commission_rate || 20;
        const commissionAmount = (amount * commissionRate) / 100;
        const mentorPayout = amount - commissionAmount;

        await supabase
          .from('mentor_sessions')
          .update({
            payment_status: 'paid',
            commission_amount: commissionAmount,
            mentor_payout: mentorPayout,
            status: 'confirmed',
            confirmed_at: new Date().toISOString(),
          })
          .eq('id', itemId);

        // Send notification
        const { data: member } = await supabase
          .from('community_members')
          .select('user_id')
          .eq('id', session.mentee_id)
          .single();

        if (member?.user_id) {
          await supabase.from('notifications').insert({
            user_id: member.user_id,
            type: 'payment_confirmation',
            title: 'Session Payment Confirmed',
            message: `Your payment of ₹${amount.toFixed(2)} for the mentor session has been confirmed. Transaction ID: ${paymentId}`,
            channel: 'both',
            status: 'pending',
            metadata: {
              type: 'session',
              amount,
              transactionId: paymentId,
              itemId,
            },
          });
        }
      }
    } else if (paymentType === 'event') {
      // Update event registration
      const { data: registration } = await supabase
        .from('event_registrations')
        .select('member_id, event_id')
        .eq('event_id', itemId)
        .eq('razorpay_payment_id', paymentId)
        .maybeSingle();

      if (registration) {
        // Get event for commission calculation
        const { data: event } = await supabase
          .from('community_events')
          .select('commission_rate')
          .eq('id', itemId)
          .single();

        const commissionRate = event?.commission_rate || 10; // Default 10% for events
        const commissionAmount = (amount * commissionRate) / 100;
        const organizerPayout = amount - commissionAmount;

        await supabase
          .from('event_registrations')
          .update({
            payment_status: 'paid',
            payment_amount: amount,
            commission_amount: commissionAmount,
            organizer_payout: organizerPayout,
          })
          .eq('id', registration.id);

        // Send notification
        const { data: member } = await supabase
          .from('community_members')
          .select('user_id')
          .eq('id', registration.member_id)
          .single();

        if (member?.user_id) {
          const { data: eventData } = await supabase
            .from('community_events')
            .select('title')
            .eq('id', itemId)
            .single();

          await supabase.from('notifications').insert({
            user_id: member.user_id,
            type: 'payment_confirmation',
            title: `Payment Confirmed: ${eventData?.title || 'Event'}`,
            message: `Your payment of ₹${amount.toFixed(2)} has been confirmed. Transaction ID: ${paymentId}`,
            channel: 'both',
            status: 'pending',
            metadata: {
              type: 'event',
              amount,
              transactionId: paymentId,
              itemId,
            },
          });
        }
      }
    } else if (paymentType === 'event_product') {
      // Update event product purchase
      const { data: purchase } = await supabase
        .from('event_product_purchases')
        .select('buyer_id, product_id, event_id')
        .eq('product_id', itemId)
        .eq('razorpay_payment_id', paymentId)
        .maybeSingle();

      if (purchase) {
        // Get product for commission calculation
        const { data: product } = await supabase
          .from('event_products')
          .select('commission_rate')
          .eq('id', itemId)
          .single();

        const commissionRate = product?.commission_rate || 10; // Default 10% for event products
        const commissionAmount = (amount * commissionRate) / 100;
        const mentorPayout = amount - commissionAmount;

        await supabase
          .from('event_product_purchases')
          .update({
            payment_status: 'paid',
            payment_amount: amount,
            commission_amount: commissionAmount,
            mentor_payout: mentorPayout,
            purchase_status: 'active',
          })
          .eq('id', purchase.id);

        // Send notification
        const { data: member } = await supabase
          .from('community_members')
          .select('user_id')
          .eq('id', purchase.buyer_id)
          .single();

        if (member?.user_id) {
          const { data: productData } = await supabase
            .from('event_products')
            .select('product_name')
            .eq('id', itemId)
            .single();

          await supabase.from('notifications').insert({
            user_id: member.user_id,
            type: 'payment_confirmation',
            title: `Payment Confirmed: ${productData?.product_name || 'Product'}`,
            message: `Your payment of ₹${amount.toFixed(2)} has been confirmed. Transaction ID: ${paymentId}`,
            channel: 'both',
            status: 'pending',
            metadata: {
              type: 'event_product',
              amount,
              transactionId: paymentId,
              itemId,
            },
          });
        }
      }
    }
  } catch (error: any) {
    console.error('Error handling payment captured:', error);
    throw error;
  }
}

// Handle failed payment
async function handlePaymentFailed(supabase: any, payment: any) {
  const paymentId = payment.id;
  const orderId = payment.order_id;
  const errorDescription = payment.error_description || 'Payment failed';
  const notes = payment.notes || {};

  const paymentType = notes.type || (notes.course_id ? 'course' : notes.session_id ? 'session' : notes.event_id ? 'event' : notes.product_id ? 'event_product' : null);
  const itemId = notes.course_id || notes.session_id || notes.event_id || notes.product_id;

  if (!itemId) return;

  try {
    // Update payment status to failed
    if (paymentType === 'course') {
      await supabase
        .from('course_enrollments')
        .update({
          payment_status: 'failed',
        })
        .eq('razorpay_payment_id', paymentId)
        .or(`razorpay_order_id.eq.${orderId}`);

      // Find enrollment to send notification
      const { data: enrollment } = await supabase
        .from('course_enrollments')
        .select('student_id, course_id')
        .eq('course_id', itemId)
        .eq('razorpay_payment_id', paymentId)
        .maybeSingle();

      if (enrollment) {
        const { data: member } = await supabase
          .from('community_members')
          .select('user_id')
          .eq('id', enrollment.student_id)
          .single();

        if (member?.user_id) {
          await supabase.from('notifications').insert({
            user_id: member.user_id,
            type: 'payment_failed',
            title: 'Payment Failed',
            message: `Your payment failed: ${errorDescription}. Please try again or contact support.`,
            channel: 'both',
            status: 'pending',
            metadata: {
              type: 'course',
              transactionId: paymentId,
              error: errorDescription,
              itemId,
            },
          });
        }
      }
    } else if (paymentType === 'session') {
      await supabase
        .from('mentor_sessions')
        .update({
          payment_status: 'failed',
        })
        .eq('razorpay_payment_id', paymentId)
        .or(`razorpay_order_id.eq.${orderId}`);

      const { data: session } = await supabase
        .from('mentor_sessions')
        .select('mentee_id')
        .eq('id', itemId)
        .maybeSingle();

      if (session) {
        const { data: member } = await supabase
          .from('community_members')
          .select('user_id')
          .eq('id', session.mentee_id)
          .single();

        if (member?.user_id) {
          await supabase.from('notifications').insert({
            user_id: member.user_id,
            type: 'payment_failed',
            title: 'Session Payment Failed',
            message: `Your payment failed: ${errorDescription}. Please try again or contact support.`,
            channel: 'both',
            status: 'pending',
            metadata: {
              type: 'session',
              transactionId: paymentId,
              error: errorDescription,
              itemId,
            },
          });
        }
      }
    } else if (paymentType === 'event') {
      await supabase
        .from('event_registrations')
        .update({
          payment_status: 'failed',
        })
        .eq('razorpay_payment_id', paymentId)
        .or(`razorpay_order_id.eq.${orderId}`);

      const { data: registration } = await supabase
        .from('event_registrations')
        .select('member_id, event_id')
        .eq('event_id', itemId)
        .maybeSingle();

      if (registration) {
        const { data: member } = await supabase
          .from('community_members')
          .select('user_id')
          .eq('id', registration.member_id)
          .single();

        if (member?.user_id) {
          await supabase.from('notifications').insert({
            user_id: member.user_id,
            type: 'payment_failed',
            title: 'Event Payment Failed',
            message: `Your payment failed: ${errorDescription}. Please try again or contact support.`,
            channel: 'both',
            status: 'pending',
            metadata: {
              type: 'event',
              transactionId: paymentId,
              error: errorDescription,
              itemId,
            },
          });
        }
      }
    } else if (paymentType === 'event_product') {
      await supabase
        .from('event_product_purchases')
        .update({
          payment_status: 'failed',
        })
        .eq('razorpay_payment_id', paymentId)
        .or(`razorpay_order_id.eq.${orderId}`);

      const { data: purchase } = await supabase
        .from('event_product_purchases')
        .select('buyer_id, product_id')
        .eq('product_id', itemId)
        .maybeSingle();

      if (purchase) {
        const { data: member } = await supabase
          .from('community_members')
          .select('user_id')
          .eq('id', purchase.buyer_id)
          .single();

        if (member?.user_id) {
          await supabase.from('notifications').insert({
            user_id: member.user_id,
            type: 'payment_failed',
            title: 'Product Payment Failed',
            message: `Your payment failed: ${errorDescription}. Please try again or contact support.`,
            channel: 'both',
            status: 'pending',
            metadata: {
              type: 'event_product',
              transactionId: paymentId,
              error: errorDescription,
              itemId,
            },
          });
        }
      }
    }
  } catch (error: any) {
    console.error('Error handling payment failed:', error);
    throw error;
  }
}

// Handle refund
async function handlePaymentRefunded(supabase: any, payment: any) {
  const paymentId = payment.id;
  const refundId = payment.refund?.id;
  const refundAmount = (payment.refund?.amount || 0) / 100; // Convert from paise
  const notes = payment.notes || {};

  const paymentType = notes.type || (notes.course_id ? 'course' : notes.session_id ? 'session' : notes.event_id ? 'event' : notes.product_id ? 'event_product' : null);
  const itemId = notes.course_id || notes.session_id || notes.event_id || notes.product_id;

  if (!itemId) return;

  try {
    // Update payment status to refunded
    if (paymentType === 'course') {
      await supabase
        .from('course_enrollments')
        .update({
          payment_status: 'refunded',
        })
        .eq('razorpay_payment_id', paymentId);

      const { data: enrollment } = await supabase
        .from('course_enrollments')
        .select('student_id, course_id')
        .eq('course_id', itemId)
        .eq('razorpay_payment_id', paymentId)
        .maybeSingle();

      if (enrollment) {
        const { data: member } = await supabase
          .from('community_members')
          .select('user_id')
          .eq('id', enrollment.student_id)
          .single();

        if (member?.user_id) {
          await supabase.from('notifications').insert({
            user_id: member.user_id,
            type: 'payment_refunded',
            title: 'Payment Refunded',
            message: `Your payment of ₹${refundAmount.toFixed(2)} has been refunded. Refund ID: ${refundId}`,
            channel: 'both',
            status: 'pending',
            metadata: {
              type: 'course',
              refundAmount,
              refundId,
              transactionId: paymentId,
              itemId,
            },
          });
        }
      }
    } else if (paymentType === 'session') {
      await supabase
        .from('mentor_sessions')
        .update({
          payment_status: 'refunded',
        })
        .eq('razorpay_payment_id', paymentId);

      const { data: session } = await supabase
        .from('mentor_sessions')
        .select('mentee_id')
        .eq('id', itemId)
        .maybeSingle();

      if (session) {
        const { data: member } = await supabase
          .from('community_members')
          .select('user_id')
          .eq('id', session.mentee_id)
          .single();

        if (member?.user_id) {
          await supabase.from('notifications').insert({
            user_id: member.user_id,
            type: 'payment_refunded',
            title: 'Session Payment Refunded',
            message: `Your payment of ₹${refundAmount.toFixed(2)} has been refunded. Refund ID: ${refundId}`,
            channel: 'both',
            status: 'pending',
            metadata: {
              type: 'session',
              refundAmount,
              refundId,
              transactionId: paymentId,
              itemId,
            },
          });
        }
      }
    } else if (paymentType === 'event') {
      await supabase
        .from('event_registrations')
        .update({
          payment_status: 'refunded',
        })
        .eq('razorpay_payment_id', paymentId);

      const { data: registration } = await supabase
        .from('event_registrations')
        .select('member_id, event_id')
        .eq('event_id', itemId)
        .maybeSingle();

      if (registration) {
        const { data: member } = await supabase
          .from('community_members')
          .select('user_id')
          .eq('id', registration.member_id)
          .single();

        if (member?.user_id) {
          await supabase.from('notifications').insert({
            user_id: member.user_id,
            type: 'payment_refunded',
            title: 'Event Payment Refunded',
            message: `Your payment of ₹${refundAmount.toFixed(2)} has been refunded. Refund ID: ${refundId}`,
            channel: 'both',
            status: 'pending',
            metadata: {
              type: 'event',
              refundAmount,
              refundId,
              transactionId: paymentId,
              itemId,
            },
          });
        }
      }
    } else if (paymentType === 'event_product') {
      await supabase
        .from('event_product_purchases')
        .update({
          payment_status: 'refunded',
          purchase_status: 'refunded',
        })
        .eq('razorpay_payment_id', paymentId);

      const { data: purchase } = await supabase
        .from('event_product_purchases')
        .select('buyer_id, product_id')
        .eq('product_id', itemId)
        .eq('razorpay_payment_id', paymentId)
        .maybeSingle();

      if (purchase) {
        const { data: member } = await supabase
          .from('community_members')
          .select('user_id')
          .eq('id', purchase.buyer_id)
          .single();

        if (member?.user_id) {
          await supabase.from('notifications').insert({
            user_id: member.user_id,
            type: 'payment_refunded',
            title: 'Product Payment Refunded',
            message: `Your payment of ₹${refundAmount.toFixed(2)} has been refunded. Refund ID: ${refundId}`,
            channel: 'both',
            status: 'pending',
            metadata: {
              type: 'event_product',
              refundAmount,
              refundId,
              transactionId: paymentId,
              itemId,
            },
          });
        }
      }
    }

