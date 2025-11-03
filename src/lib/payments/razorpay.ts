// Razorpay Payment Integration Service
// Handles payment creation, verification, and webhook processing

interface RazorpayOrderOptions {
  amount: number; // Amount in paise (e.g., 19900 for ₹199)
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
  customer?: {
    name?: string;
    email?: string;
    contact?: string;
  };
}

interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface PaymentVerificationResult {
  success: boolean;
  orderId?: string;
  paymentId?: string;
  error?: string;
}

class RazorpayService {
  private keyId: string;
  private baseUrl: string;

  constructor() {
    // Get Razorpay key from environment or use default
    this.keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || '';
    this.baseUrl = import.meta.env.VITE_RAZORPAY_BASE_URL || 'https://api.razorpay.com/v1';
    
    if (!this.keyId) {
      console.warn('⚠️ Razorpay Key ID not found. Please set VITE_RAZORPAY_KEY_ID in your .env file.');
    }
  }

  /**
   * Create a Razorpay order
   * Note: In production, this should be done server-side for security
   * For now, we'll use Razorpay's checkout API
   */
  async createOrder(options: RazorpayOrderOptions): Promise<string> {
    // For client-side, we'll use Razorpay Checkout
    // In production, create orders via backend API
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return orderId;
  }

  /**
   * Initialize Razorpay checkout
   */
  async openCheckout(options: {
    orderId: string;
    amount: number;
    currency?: string;
    name: string;
    description: string;
    notes?: Record<string, string>;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    handler: (response: RazorpayPaymentResponse) => Promise<void>;
    onError?: (error: any) => void;
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      // Load Razorpay script if not already loaded
      const scriptId = 'razorpay-checkout-script';
      let script = document.getElementById(scriptId) as HTMLScriptElement;

      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          this.initiateCheckout(options, resolve, reject);
        };
        script.onerror = () => {
          reject(new Error('Failed to load Razorpay checkout script'));
        };
        document.head.appendChild(script);
      } else {
        this.initiateCheckout(options, resolve, reject);
      }
    });
  }

  private initiateCheckout(
    options: {
      orderId: string;
      amount: number;
      currency?: string;
      name: string;
      description: string;
      notes?: Record<string, string>;
      prefill?: {
        name?: string;
        email?: string;
        contact?: string;
      };
      handler: (response: RazorpayPaymentResponse) => Promise<void>;
      onError?: (error: any) => void;
    },
    resolve: () => void,
    reject: (error: any) => void
  ) {
    const Razorpay = (window as any).Razorpay;
    if (!Razorpay) {
      reject(new Error('Razorpay SDK not loaded'));
      return;
    }

    const razorpayOptions: any = {
      key: this.keyId,
      amount: options.amount,
      currency: options.currency || 'INR',
      name: options.name,
      description: options.description,
      order_id: options.orderId,
      prefill: options.prefill || {},
      handler: async (response: RazorpayPaymentResponse) => {
        try {
          await options.handler(response);
          resolve();
        } catch (error) {
          if (options.onError) {
            options.onError(error);
          }
          reject(error);
        }
      },
      modal: {
        ondismiss: () => {
          // User closed the modal
          resolve();
        },
      },
      theme: {
        color: '#1D3A6B',
      },
    };

    // Add notes if provided (Razorpay Checkout supports notes in options)
    if (options.notes) {
      razorpayOptions.notes = options.notes;
    }

    const razorpay = new Razorpay(razorpayOptions);
    razorpay.open();
  }

  /**
   * Verify payment signature
   * Note: In production, this should be done server-side
   */
  verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string
  ): boolean {
    // Signature verification should be done server-side for security
    // This is a placeholder
    console.warn('Payment signature verification should be done server-side');
    return true;
  }

  /**
   * Format amount to paise (multiply by 100)
   */
  formatAmount(rupees: number): number {
    return Math.round(rupees * 100);
  }

  /**
   * Format amount from paise to rupees (divide by 100)
   */
  formatAmountFromPaise(paise: number): number {
    return paise / 100;
  }

  /**
   * Create payment for course bundle enrollment
   */
  async createBundlePayment(
    bundleId: string,
    bundleTitle: string,
    amount: number,
    promoCode: string | null,
    studentDetails: {
      name: string;
      email: string;
      contact?: string;
    }
  ): Promise<void> {
    const orderId = await this.createOrder({
      amount: this.formatAmount(amount),
      currency: 'INR',
      receipt: `bundle_${bundleId}_${Date.now()}`,
      notes: {
        bundle_id: bundleId,
        type: 'course_bundle',
        promo_code: promoCode || '',
      },
      customer: {
        name: studentDetails.name,
        email: studentDetails.email,
        contact: studentDetails.contact,
      },
    });

    await this.openCheckout({
      orderId,
      amount: this.formatAmount(amount),
      currency: 'INR',
      name: 'Start Solo',
      description: `Course Bundle: ${bundleTitle}${promoCode ? ` (${promoCode})` : ''}`,
      prefill: {
        name: studentDetails.name,
        email: studentDetails.email,
        contact: studentDetails.contact,
      },
      handler: async (response) => {
        // Store payment details and enrollments in database
        await this.saveBundlePayment(bundleId, response, amount, promoCode);
      },
      onError: (error) => {
        console.error('Payment error:', error);
        alert('Payment failed. Please try again.');
      },
    });
  }

  /**
   * Save bundle payment to database and enroll in all courses
   */
  private async saveBundlePayment(
    bundleId: string,
    paymentResponse: RazorpayPaymentResponse,
    amount: number,
    promoCode: string | null
  ): Promise<void> {
    const { supabase, auth } = await import('../supabase');
    
    try {
      const { data: { user } } = await auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get student member ID
      const { data: member } = await supabase
        .from('community_members')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!member) throw new Error('Member profile not found');

      // Get bundle and courses
      const { data: bundle } = await supabase
        .from('course_bundles')
        .select('*')
        .eq('id', bundleId)
        .single();

      if (!bundle) throw new Error('Bundle not found');

      // Verify promo code if provided
      if (promoCode && bundle.promo_code !== promoCode.toUpperCase()) {
        throw new Error('Invalid promo code');
      }

      // Get bundle items
      const { data: bundleItems } = await supabase
        .from('course_bundle_items')
        .select('course_id, mentor_courses(id, commission_rate)')
        .eq('bundle_id', bundleId);

      if (!bundleItems || bundleItems.length === 0) {
        throw new Error('Bundle has no courses');
      }

      // Calculate total commission and payout per course
      const courses = bundleItems.map((item: any) => ({
        courseId: item.course_id,
        commissionRate: item.mentor_courses.commission_rate || 15,
      }));

      // For bundles, commission is calculated per course
      // Total commission = sum of commissions for all courses
      // Total payout = sum of payouts for all courses
      let totalCommission = 0;
      let totalPayout = 0;

      // Calculate per-course amounts (split bundle price proportionally)
      const totalOriginalPrice = courses.reduce((sum, c) => {
        // We'll need to get actual course prices
        return sum;
      }, 0);

      // For simplicity, split bundle amount equally among courses
      const perCourseAmount = amount / courses.length;

      // Create enrollments for each course in bundle
      const enrollments = await Promise.all(
        courses.map(async (course) => {
          const commissionAmount = (perCourseAmount * course.commissionRate) / 100;
          const mentorPayout = perCourseAmount - commissionAmount;
          
          totalCommission += commissionAmount;
          totalPayout += mentorPayout;

          return {
            course_id: course.courseId,
            student_id: member.id,
            bundle_id: bundleId,
            payment_status: 'paid',
            payment_amount: perCourseAmount,
            commission_amount: commissionAmount,
            mentor_payout: mentorPayout,
            razorpay_order_id: paymentResponse.razorpay_order_id,
            razorpay_payment_id: paymentResponse.razorpay_payment_id,
            razorpay_signature: paymentResponse.razorpay_signature,
            enrollment_status: 'active',
          };
        })
      );

      // Insert enrollments
      const { error } = await supabase
        .from('course_enrollments')
        .insert(enrollments);

      if (error) throw error;

      // Redirect to success page
      window.location.href = `/community/bundles/${bundleId}/enrollment-success`;
    } catch (error: any) {
      console.error('Error saving bundle payment:', error);
      throw error;
    }
  }

  /**
   * Verify and apply promo code for bundle
   */
  async verifyPromoCode(
    bundleId: string,
    promoCode: string
  ): Promise<{ valid: boolean; discount?: number; finalPrice?: number; error?: string }> {
    const { supabase } = await import('../supabase');
    
    try {
      const { data: bundle, error } = await supabase
        .from('course_bundles')
        .select('*')
        .eq('id', bundleId)
        .eq('is_active', true)
        .single();

      if (error || !bundle) {
        return { valid: false, error: 'Bundle not found' };
      }

      if (bundle.discount_type !== 'promo_code') {
        return { valid: false, error: 'This bundle does not use promo codes' };
      }

      if (bundle.promo_code?.toUpperCase() !== promoCode.toUpperCase()) {
        return { valid: false, error: 'Invalid promo code' };
      }

      // Get bundle total price
      const { data: items } = await supabase
        .from('course_bundle_items')
        .select('course_id, mentor_courses(price)')
        .eq('bundle_id', bundleId);

      if (!items || items.length === 0) {
        return { valid: false, error: 'Bundle has no courses' };
      }

      const totalPrice = items.reduce((sum: number, item: any) => {
        return sum + parseFloat(item.mentor_courses.price.toString());
      }, 0);

      // Calculate discount (for promo_code type, discount_value is still used)
      let discountAmount = 0;
      if (bundle.discount_type === 'percentage') {
        discountAmount = totalPrice * (bundle.discount_value / 100);
      } else if (bundle.discount_type === 'fixed_amount') {
        discountAmount = Math.min(bundle.discount_value, totalPrice);
      }

      const finalPrice = Math.max(totalPrice - discountAmount, 0);

      return {
        valid: true,
        discount: discountAmount,
        finalPrice: finalPrice,
      };
    } catch (error: any) {
      console.error('Error verifying promo code:', error);
      return { valid: false, error: error.message || 'Failed to verify promo code' };
    }
  }

  /**
   * Create payment for course enrollment
   */
  async createCoursePayment(
    courseId: string,
    courseTitle: string,
    amount: number,
    studentDetails: {
      name: string;
      email: string;
      contact?: string;
    }
  ): Promise<void> {
    const orderId = await this.createOrder({
      amount: this.formatAmount(amount),
      currency: 'INR',
      receipt: `course_${courseId}_${Date.now()}`,
      notes: {
        course_id: courseId,
        type: 'course_enrollment',
      },
      customer: {
        name: studentDetails.name,
        email: studentDetails.email,
        contact: studentDetails.contact,
      },
    });

    await this.openCheckout({
      orderId,
      amount: this.formatAmount(amount),
      currency: 'INR',
      name: 'Start Solo',
      description: `Course Enrollment: ${courseTitle}`,
      prefill: {
        name: studentDetails.name,
        email: studentDetails.email,
        contact: studentDetails.contact,
      },
      handler: async (response) => {
        // Store payment details in database
        await this.saveCoursePayment(courseId, response, amount);
      },
      onError: (error) => {
        console.error('Payment error:', error);
        alert('Payment failed. Please try again.');
      },
    });
  }

  /**
   * Create payment for mentor session
   */
  async createSessionPayment(
    sessionId: string,
    sessionTitle: string,
    amount: number,
    menteeDetails: {
      name: string;
      email: string;
      contact?: string;
    }
  ): Promise<void> {
    const orderId = await this.createOrder({
      amount: this.formatAmount(amount),
      currency: 'INR',
      receipt: `session_${sessionId}_${Date.now()}`,
      notes: {
        session_id: sessionId,
        type: 'mentor_session',
      },
      customer: {
        name: menteeDetails.name,
        email: menteeDetails.email,
        contact: menteeDetails.contact,
      },
    });

    await this.openCheckout({
      orderId,
      amount: this.formatAmount(amount),
      currency: 'INR',
      name: 'Start Solo',
      description: `Mentor Session: ${sessionTitle}`,
      prefill: {
        name: menteeDetails.name,
        email: menteeDetails.email,
        contact: menteeDetails.contact,
      },
      handler: async (response) => {
        // Store payment details in database
        await this.saveSessionPayment(sessionId, response, amount);
      },
      onError: (error) => {
        console.error('Payment error:', error);
        alert('Payment failed. Please try again.');
      },
    });
  }

  /**
   * Save course payment to database
   */
  private async saveCoursePayment(
    courseId: string,
    paymentResponse: RazorpayPaymentResponse,
    amount: number
  ): Promise<void> {
    const { supabase, auth } = await import('../supabase');
    
    try {
      const { data: { user } } = await auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get student member ID
      const { data: member } = await supabase
        .from('community_members')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!member) throw new Error('Member profile not found');

      // Get course and commission rate
      const { data: course } = await supabase
        .from('mentor_courses')
        .select('commission_rate')
        .eq('id', courseId)
        .single();

      const commissionRate = course?.commission_rate || 15; // Default 15%
      const commissionAmount = (amount * commissionRate) / 100;
      const mentorPayout = amount - commissionAmount;

      // Update or create enrollment with payment details
      const { error } = await supabase
        .from('course_enrollments')
        .upsert({
          course_id: courseId,
          student_id: member.id,
          payment_status: 'paid',
          payment_amount: amount,
          commission_amount: commissionAmount,
          mentor_payout: mentorPayout,
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
          enrollment_status: 'active',
        }, {
          onConflict: 'course_id,student_id',
        });

      if (error) throw error;

      // Redirect to success page or show success message
      window.location.href = `/community/courses/${courseId}/enrollment-success`;
    } catch (error: any) {
      console.error('Error saving course payment:', error);
      throw error;
    }
  }

  /**
   * Save session payment to database
   */
  private async saveSessionPayment(
    sessionId: string,
    paymentResponse: RazorpayPaymentResponse,
    amount: number
  ): Promise<void> {
    const { supabase, auth } = await import('../supabase');
    
    try {
      const { data: { user } } = await auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get mentee member ID
      const { data: member } = await supabase
        .from('community_members')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!member) throw new Error('Member profile not found');

      // Get session and commission rate
      const { data: session } = await supabase
        .from('mentor_sessions')
        .select('commission_rate')
        .eq('id', sessionId)
        .single();

      const commissionRate = session?.commission_rate || 20; // Default 20%
      const commissionAmount = (amount * commissionRate) / 100;
      const mentorPayout = amount - commissionAmount;

      // Update session with payment details
      const { error } = await supabase
        .from('mentor_sessions')
        .update({
          payment_status: 'paid',
          commission_amount: commissionAmount,
          mentor_payout: mentorPayout,
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
          status: 'confirmed',
          confirmed_at: new Date().toISOString(),
        })
        .eq('id', sessionId);

      if (error) throw error;

      // Redirect to success page or show success message
      window.location.href = `/community/sessions/${sessionId}/success`;
    } catch (error: any) {
      console.error('Error saving session payment:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const razorpayService = new RazorpayService();
export default razorpayService;

