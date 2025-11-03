// Notification Service
// Handles queuing and sending notifications via Email (Mailgun) and WhatsApp (Gupshup)

import { supabase } from '../supabase';

export interface NotificationData {
  userId: string;
  type: string;
  title: string;
  message: string;
  channel: 'email' | 'whatsapp' | 'both';
  metadata?: Record<string, any>;
  scheduledFor?: Date;
}

export interface NotificationResult {
  success: boolean;
  notificationId?: string;
  error?: string;
}

class NotificationService {
  private mailgunApiKey: string;
  private mailgunDomain: string;
  private mailgunFromEmail: string;
  private gupshupApiKey: string;
  private gupshupAppName: string;
  private baseUrl: string;

  constructor() {
    // Get API keys from environment variables
    this.mailgunApiKey = import.meta.env.VITE_MAILGUN_API_KEY || '';
    this.mailgunDomain = import.meta.env.VITE_MAILGUN_DOMAIN || '';
    this.mailgunFromEmail = import.meta.env.VITE_MAILGUN_FROM_EMAIL || 'noreply@startsolo.in';
    this.gupshupApiKey = import.meta.env.VITE_GUPSHUP_API_KEY || '';
    this.gupshupAppName = import.meta.env.VITE_GUPSHUP_APP_NAME || '';
    this.baseUrl = import.meta.env.VITE_APP_URL || 'https://startsolo.in';

    if (!this.mailgunApiKey || !this.mailgunDomain) {
      console.warn('⚠️ Mailgun credentials not found. Email notifications will be queued only.');
    }
    if (!this.gupshupApiKey || !this.gupshupAppName) {
      console.warn('⚠️ Gupshup credentials not found. WhatsApp notifications will be queued only.');
    }
  }

  /**
   * Queue a notification in the database
   */
  async queueNotification(data: NotificationData): Promise<NotificationResult> {
    try {
      const { data: notification, error } = await supabase
        .from('notifications')
        .insert({
          user_id: data.userId,
          type: data.type,
          title: data.title,
          message: data.message,
          channel: data.channel,
          metadata: data.metadata || {},
          scheduled_for: data.scheduledFor?.toISOString() || new Date().toISOString(),
          status: 'pending',
          notification_date: new Date().toISOString().split('T')[0],
        })
        .select()
        .single();

      if (error) throw error;

      // Try to send immediately if credentials are available
      // In production, this should be handled by a background job/Edge Function
      // For now, we'll attempt immediate send but errors won't block the queue operation
      if (this.mailgunApiKey || this.gupshupApiKey) {
        // Attempt to send notification asynchronously
        this.sendNotification(notification.id).catch(err => {
          console.error('Error sending notification:', err);
          // Notification remains queued for retry
        });
      }

      return {
        success: true,
        notificationId: notification.id,
      };
    } catch (error: any) {
      console.error('Error queuing notification:', error);
      return {
        success: false,
        error: error.message || 'Failed to queue notification',
      };
    }
  }

  /**
   * Send a notification (called by background job or immediately)
   * Note: In production, this should be handled by a Supabase Edge Function or backend service
   */
  async sendNotification(notificationId: string): Promise<boolean> {
    try {
      // Get notification from database
      const { data: notification, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .eq('id', notificationId)
        .single();

      if (fetchError || !notification) {
        throw new Error('Notification not found');
      }

      if (notification.status !== 'pending') {
        return true; // Already processed
      }

      // Get member details
      const { data: member } = await supabase
        .from('community_members')
        .select('email, full_name, phone, user_id')
        .eq('user_id', notification.user_id)
        .single();

      if (!member) {
        throw new Error('Member profile not found');
      }

      // Get user email from auth (this only works for current user, so for other users we rely on member.email)
      const { data: { user } } = await supabase.auth.getUser();
      const email = member.email || user?.email;
      const name = member.full_name || email?.split('@')[0] || 'User';
      const phone = member.phone;

      let emailSent = false;
      let whatsappSent = false;
      let errors: string[] = [];

      // Send email if channel includes email
      if ((notification.channel === 'email' || notification.channel === 'both') && email) {
        try {
          emailSent = await this.sendEmail({
            to: email,
            toName: name,
            subject: notification.title,
            html: this.formatEmailMessage(notification.message, notification.metadata),
          });
        } catch (err: any) {
          errors.push(`Email: ${err.message}`);
        }
      }

      // Send WhatsApp if channel includes whatsapp
      if ((notification.channel === 'whatsapp' || notification.channel === 'both')) {
        if (phone) {
          try {
            // Map notification type to template name (if templates are set up)
            const templateInfo = this.getWhatsAppTemplate(notification.type, notification.metadata);
            
            whatsappSent = await this.sendWhatsApp({
              to: phone,
              message: this.formatWhatsAppMessage(notification.message, notification.metadata),
              templateName: templateInfo.templateName,
              templateParams: templateInfo.params,
            });
          } catch (err: any) {
            errors.push(`WhatsApp: ${err.message}`);
          }
        } else {
          errors.push('WhatsApp: Phone number not found');
        }
      }

      // Update notification status
      const success = (notification.channel === 'email' && emailSent) ||
                      (notification.channel === 'whatsapp' && whatsappSent) ||
                      (notification.channel === 'both' && (emailSent || whatsappSent));

      await supabase
        .from('notifications')
        .update({
          status: success ? 'sent' : 'failed',
          sent_at: success ? new Date().toISOString() : null,
          failed_at: success ? null : new Date().toISOString(),
          failure_reason: errors.length > 0 ? errors.join('; ') : null,
        })
        .eq('id', notificationId);

      return success;
    } catch (error: any) {
      console.error('Error sending notification:', error);
      
      // Update notification as failed
      await supabase
        .from('notifications')
        .update({
          status: 'failed',
          failed_at: new Date().toISOString(),
          failure_reason: error.message,
        })
        .eq('id', notificationId);

      return false;
    }
  }

  /**
   * Send email via Mailgun
   */
  private async sendEmail(data: {
    to: string;
    toName: string;
    subject: string;
    html: string;
  }): Promise<boolean> {
    if (!this.mailgunApiKey || !this.mailgunDomain) {
      console.warn('Mailgun not configured. Email notification queued only.');
      return false;
    }

    try {
      // Use Mailgun API
      const formData = new FormData();
      formData.append('from', `${this.mailgunFromEmail} <${this.mailgunFromEmail}>`);
      formData.append('to', `${data.toName} <${data.to}>`);
      formData.append('subject', data.subject);
      formData.append('html', data.html);

      const response = await fetch(
        `https://api.mailgun.net/v3/${this.mailgunDomain}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(`api:${this.mailgunApiKey}`)}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Mailgun error: ${error}`);
      }

      return true;
    } catch (error: any) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  /**
   * Send WhatsApp message via Gupshup
   * Note: Requires pre-approved templates in Gupshup dashboard
   */
  private async sendWhatsApp(data: {
    to: string;
    message: string;
    templateName?: string;
    templateParams?: Record<string, string>;
  }): Promise<boolean> {
    if (!this.gupshupApiKey || !this.gupshupAppName) {
      console.warn('Gupshup not configured. WhatsApp notification queued only.');
      return false;
    }

    try {
      // Format phone number (remove + and spaces)
      const phoneNumber = data.to.replace(/[+\s]/g, '');

      // If template name provided, use template API, otherwise use text message
      if (data.templateName && data.templateParams) {
        // Template-based message (for approved templates)
        // Format params as key:value pairs separated by |
        const paramsArray = Object.entries(data.templateParams).map(([key, value]) => `${key}:${value}`);
        const paramsString = paramsArray.join('|');

        const response = await fetch('https://api.gupshup.io/sm/api/v1/template/msg', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'apikey': this.gupshupApiKey,
          },
          body: new URLSearchParams({
            channel: 'whatsapp',
            source: this.gupshupAppName,
            destination: phoneNumber,
            template: data.templateName,
            'src.name': this.gupshupAppName,
            params: paramsString,
          }),
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(`Gupshup template error: ${error}`);
        }
      } else {
        // Plain text message (for testing, but templates are preferred)
        const response = await fetch('https://api.gupshup.io/sm/api/v1/msg', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'apikey': this.gupshupApiKey,
          },
          body: new URLSearchParams({
            channel: 'whatsapp',
            source: this.gupshupAppName,
            destination: phoneNumber,
            message: data.message,
            'src.name': this.gupshupAppName,
          }),
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(`Gupshup error: ${error}`);
        }
      }

      return true;
    } catch (error: any) {
      console.error('Error sending WhatsApp:', error);
      throw error;
    }
  }

  /**
   * Get user's phone number from profile
   */
  private async getUserPhoneNumber(userId: string): Promise<string | null> {
    try {
      const { data: member } = await supabase
        .from('community_members')
        .select('phone')
        .eq('user_id', userId)
        .single();

      return member?.phone || null;
    } catch (error) {
      console.error('Error fetching phone number:', error);
      return null;
    }
  }

  /**
   * Format email message with HTML
   */
  private formatEmailMessage(message: string, metadata?: Record<string, any>): string {
    let html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1D3A6B; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; padding: 12px 24px; background: #1D3A6B; color: white; text-decoration: none; border-radius: 4px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Start Solo</h1>
            </div>
            <div class="content">
              ${message.replace(/\n/g, '<br>')}
              ${metadata?.actionUrl ? `<a href="${metadata.actionUrl}" class="button">${metadata.actionText || 'View Details'}</a>` : ''}
            </div>
            <div class="footer">
              <p>This is an automated message from Start Solo Community Platform.</p>
              <p>© ${new Date().getFullYear()} Start Solo. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return html;
  }

  /**
   * Format WhatsApp message (plain text, max 4096 chars)
   */
  private formatWhatsAppMessage(message: string, metadata?: Record<string, any>): string {
    let text = message;
    
    if (metadata?.actionUrl) {
      text += `\n\n${metadata.actionText || 'View Details'}: ${metadata.actionUrl}`;
    }

    // Truncate if too long
    if (text.length > 4096) {
      text = text.substring(0, 4090) + '...';
    }

    return text;
  }

  /**
   * Map notification type to Gupshup template name and parameters
   * Returns template name and params, or empty if using plain text
   */
  private getWhatsAppTemplate(
    notificationType: string,
    metadata?: Record<string, any>
  ): { templateName?: string; params?: Record<string, string> } {
    // Template mapping - update these to match your approved Gupshup templates
    const templateMap: Record<string, { template: string; params: (metadata?: Record<string, any>) => Record<string, string> }> = {
      'session_scheduled': {
        template: 'session_scheduled',
        params: (meta) => ({
          mentor_name: meta?.mentorName || 'Mentor',
          session_date: meta?.scheduledAt ? new Date(meta.scheduledAt).toLocaleString('en-IN') : 'TBD',
          session_type: meta?.sessionType || 'session',
          session_id: meta?.sessionId || '',
        }),
      },
      'session_reminder': {
        template: (meta) => {
          const reminderType = meta?.reminderType || '';
          if (reminderType === '24h') return 'session_reminder_24h';
          if (reminderType === '1h') return 'session_reminder_1h';
          if (reminderType === '15m') return 'session_reminder_15m';
          return 'session_reminder_24h'; // Default
        },
        params: (meta) => ({
          mentor_name: meta?.mentorName || 'Mentor',
          session_date: meta?.scheduledAt ? new Date(meta.scheduledAt).toLocaleString('en-IN') : 'TBD',
        }),
      },
      'course_enrollment': {
        template: 'course_enrollment',
        params: (meta) => ({
          course_title: meta?.courseTitle || 'Course',
          course_url: meta?.actionUrl || '',
        }),
      },
      'payment_confirmation': {
        template: 'payment_confirmation',
        params: (meta) => ({
          amount: meta?.amount?.toFixed(2) || '0.00',
          item_name: meta?.itemName || 'Item',
          transaction_id: meta?.transactionId || '',
        }),
      },
      'course_completion': {
        template: 'course_completion',
        params: (meta) => ({
          course_title: meta?.courseTitle || 'Course',
          certificate_url: meta?.actionUrl || '',
        }),
      },
    };

    const templateInfo = templateMap[notificationType];
    if (templateInfo) {
      const templateName = typeof templateInfo.template === 'function' 
        ? templateInfo.template(metadata) 
        : templateInfo.template;
      
      return {
        templateName,
        params: templateInfo.params(metadata),
      };
    }

    // No template found - use plain text
    return {};
  }

  /**
   * Helper: Send welcome notification
   */
  async sendWelcomeNotification(userId: string, userName: string): Promise<NotificationResult> {
    return this.queueNotification({
      userId,
      type: 'welcome',
      title: 'Welcome to Start Solo Community! 🎉',
      message: `Hi ${userName},\n\nWelcome to the Start Solo Community! We're excited to have you join our community of solopreneurs.\n\nGet started by exploring courses, booking mentor sessions, and connecting with fellow entrepreneurs.`,
      channel: 'both',
      metadata: {
        actionUrl: `${this.baseUrl}/community`,
        actionText: 'Visit Community',
      },
    });
  }

  /**
   * Helper: Send course enrollment notification
   */
  async sendCourseEnrollmentNotification(
    userId: string,
    courseTitle: string,
    courseId: string
  ): Promise<NotificationResult> {
    return this.queueNotification({
      userId,
      type: 'course_enrollment',
      title: `You've enrolled in: ${courseTitle}`,
      message: `Congratulations! You've successfully enrolled in "${courseTitle}".\n\nStart learning right away and track your progress as you complete lessons.`,
      channel: 'both',
      metadata: {
        courseId,
        courseTitle,
        actionUrl: `${this.baseUrl}/community/courses/${courseId}`,
        actionText: 'Start Learning',
      },
    });
  }

  /**
   * Helper: Send session booking notification + auto-schedule reminders
   */
  async sendSessionBookingNotification(
    userId: string,
    sessionType: 'free' | 'paid',
    mentorName: string,
    scheduledAt: string,
    sessionId: string
  ): Promise<NotificationResult> {
    const scheduledDate = new Date(scheduledAt).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    // Send immediate confirmation
    const confirmation = await this.queueNotification({
      userId,
      type: 'session_scheduled',
      title: `Session Scheduled with ${mentorName}`,
      message: `Your ${sessionType} mentor session with ${mentorName} has been scheduled for ${scheduledDate}.\n\nYou'll receive reminders 24 hours, 1 hour, and 15 minutes before the session.`,
      channel: 'both',
      metadata: {
        sessionId,
        sessionType,
        mentorName,
        scheduledAt,
      },
      scheduledFor: new Date(),
    });

    // Auto-schedule reminders: 24h, 1h, and 15m before session
    const sessionTime = new Date(scheduledAt);
    const reminders = [
      { 
        hours: 24, 
        title: `Reminder: Session with ${mentorName} Tomorrow`,
        message: `Your mentor session with ${mentorName} is scheduled for tomorrow at ${scheduledDate}. Please ensure you're available.`,
      },
      { 
        hours: 1, 
        title: `Reminder: Session with ${mentorName} in 1 Hour`,
        message: `Your mentor session with ${mentorName} starts in 1 hour at ${scheduledDate}. Please join on time.`,
      },
      { 
        minutes: 15, 
        title: `Reminder: Session with ${mentorName} in 15 Minutes`,
        message: `Your mentor session with ${mentorName} starts in 15 minutes at ${scheduledDate}. Please be ready to join.`,
      },
    ];

    for (const reminder of reminders) {
      const reminderTime = new Date(sessionTime);
      if (reminder.hours) {
        reminderTime.setHours(reminderTime.getHours() - reminder.hours);
      } else if (reminder.minutes) {
        reminderTime.setMinutes(reminderTime.getMinutes() - reminder.minutes);
      }

      // Only schedule if reminder time is in the future
      if (reminderTime > new Date()) {
        await this.queueNotification({
          userId,
          type: 'session_reminder',
          title: reminder.title,
          message: reminder.message,
          channel: 'both',
          metadata: {
            sessionId,
            mentorName,
            scheduledAt,
            reminderType: reminder.hours ? `${reminder.hours}h` : `${reminder.minutes}m`,
          },
          scheduledFor: reminderTime,
        });
      }
    }

    return confirmation;
  }

  /**
   * Helper: Send session reminder
   */
  async sendSessionReminder(
    userId: string,
    mentorName: string,
    scheduledAt: string,
    sessionId: string
  ): Promise<NotificationResult> {
    const scheduledDate = new Date(scheduledAt).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    return this.queueNotification({
      userId,
      type: 'session_reminder',
      title: `Reminder: Session with ${mentorName} Tomorrow`,
      message: `Reminder: Your mentor session with ${mentorName} is scheduled for ${scheduledDate}.\n\nPlease ensure you're available at the scheduled time.`,
      channel: 'both',
      metadata: {
        sessionId,
        mentorName,
        scheduledAt,
      },
    });
  }

  /**
   * Helper: Send payment confirmation
   */
  async sendPaymentConfirmation(
    userId: string,
    type: 'course' | 'session',
    itemName: string,
    amount: number,
    transactionId: string
  ): Promise<NotificationResult> {
    return this.queueNotification({
      userId,
      type: 'payment_confirmation',
      title: `Payment Confirmed: ${itemName}`,
      message: `Your payment of ₹${amount.toFixed(2)} for ${itemName} has been confirmed.\n\nTransaction ID: ${transactionId}\n\nThank you for your purchase!`,
      channel: 'both',
      metadata: {
        type,
        itemName,
        amount,
        transactionId,
      },
    });
  }

  /**
   * Helper: Send course completion notification
   */
  async sendCourseCompletionNotification(
    userId: string,
    courseTitle: string,
    certificateId: string,
    courseId: string
  ): Promise<NotificationResult> {
    return this.queueNotification({
      userId,
      type: 'course_completion',
      title: `🎉 Congratulations! You completed ${courseTitle}`,
      message: `Amazing work! You've successfully completed "${courseTitle}".\n\nYour certificate of completion is ready. Download it to showcase your achievement!`,
      channel: 'both',
      metadata: {
        courseId,
        courseTitle,
        certificateId,
        actionUrl: `${this.baseUrl}/community/certificates/${certificateId}`,
        actionText: 'View Certificate',
      },
    });
  }

  /**
   * Helper: Send payment failure notification
   */
  async sendPaymentFailureNotification(
    userId: string,
    type: 'course' | 'session',
    itemName: string,
    transactionId: string,
    errorMessage?: string
  ): Promise<NotificationResult> {
    return this.queueNotification({
      userId,
      type: 'payment_failed',
      title: `Payment Failed: ${itemName}`,
      message: `Unfortunately, your payment for ${itemName} could not be processed.${errorMessage ? `\n\nError: ${errorMessage}` : ''}\n\nTransaction ID: ${transactionId}\n\nPlease try again or contact support if the issue persists.`,
      channel: 'both',
      metadata: {
        type,
        itemName,
        transactionId,
        errorMessage,
      },
    });
  }

  /**
   * Helper: Send refund notification
   */
  async sendRefundNotification(
    userId: string,
    type: 'course' | 'session',
    itemName: string,
    refundAmount: number,
    refundId: string,
    transactionId: string
  ): Promise<NotificationResult> {
    return this.queueNotification({
      userId,
      type: 'payment_refunded',
      title: `Refund Processed: ${itemName}`,
      message: `Your refund of ₹${refundAmount.toFixed(2)} for ${itemName} has been processed.\n\nRefund ID: ${refundId}\nTransaction ID: ${transactionId}\n\nThe refund will be credited to your account within 5-7 business days.`,
      channel: 'both',
      metadata: {
        type,
        itemName,
        refundAmount,
        refundId,
        transactionId,
      },
    });
  }

  /**
   * Helper: Send vetting status update notification
   */
  async sendVettingStatusNotification(
    userId: string,
    status: 'pending' | 'approved' | 'vetted' | 'rejected' | 'suspended',
    role: string,
    adminNotes?: string,
    rejectionReason?: string
  ): Promise<NotificationResult> {
    let title: string;
    let message: string;
    let actionUrl: string;
    let actionText: string;

    switch (status) {
      case 'approved':
        title = '✅ Your Application Has Been Approved!';
        message = `Great news! Your application to join the Start Solo Community has been approved.\n\nYou now have view-only access to the community. You can browse courses, view posts, and explore resources.\n\nTo get full access (ability to post, comment, and register for events), you'll need to complete the vetting process.`;
        actionUrl = `${this.baseUrl}/community`;
        actionText = 'Visit Community';
        break;
      
      case 'vetted':
        title = '🎉 Welcome! You Have Full Community Access';
        message = `Congratulations! You've been fully vetted and now have complete access to the Start Solo Community.\n\nYou can now:\n• Create posts and engage with the community\n• Comment on discussions\n• Register for events\n• Book mentor sessions\n• Enroll in courses\n\nWe're excited to have you as part of our community!`;
        actionUrl = `${this.baseUrl}/community`;
        actionText = 'Explore Community';
        break;
      
      case 'rejected':
        title = 'Application Status Update';
        message = `Thank you for your interest in joining the Start Solo Community.\n\nUnfortunately, your application has not been approved at this time.${rejectionReason ? `\n\nReason: ${rejectionReason}` : ''}\n\nIf you have any questions, please feel free to reach out to our support team.`;
        actionUrl = `${this.baseUrl}/community`;
        actionText = 'Learn More';
        break;
      
      case 'suspended':
        title = 'Account Status Update';
        message = `Your account has been temporarily suspended.\n\n${adminNotes ? `Reason: ${adminNotes}` : 'Please contact support for more information.'}\n\nIf you believe this is an error, please contact our support team.`;
        actionUrl = `${this.baseUrl}/community`;
        actionText = 'Contact Support';
        break;
      
      case 'pending':
      default:
        title = 'Application Received';
        message = `Your application to join the Start Solo Community has been received and is under review.\n\nWe'll notify you once your application has been processed. This usually takes 24-48 hours.`;
        actionUrl = `${this.baseUrl}/community`;
        actionText = 'View Status';
        break;
    }

    return this.queueNotification({
      userId,
      type: 'vetting_status_update',
      title,
      message,
      channel: 'both',
      metadata: {
        status,
        role,
        adminNotes,
        rejectionReason,
        actionUrl,
        actionText,
      },
    });
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
export default notificationService;

