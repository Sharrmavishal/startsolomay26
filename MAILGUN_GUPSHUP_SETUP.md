# Mailgun & Gupshup Template Setup Guide

## ⚠️ Important: Templates Must Be Pre-Approved

Before notifications can be sent, you need to set up and approve templates in both Mailgun and Gupshup.

---

## 📧 Mailgun Email Templates

### Setup Steps:

1. **Log into Mailgun Dashboard**: https://app.mailgun.com/

2. **Verify Your Domain** (if not already done):
   - Go to **Sending** → **Domains**
   - Add domain: `startsolo.in`
   - Add DNS records (MX, TXT, CNAME) provided by Mailgun
   - Wait for verification (usually 24-48 hours)

3. **Email Templates** (Optional but Recommended):
   - Mailgun allows sending HTML emails directly (no template approval needed)
   - However, you can create templates in **Sending** → **Templates** for consistency
   - Templates help maintain branding and reduce code duplication

### Email Template Examples:

**Course Enrollment Template:**
- Subject: `You've enrolled in: {{course_title}}`
- HTML: [See notificationService.ts for HTML structure]

**Session Booking Template:**
- Subject: `Session Scheduled with {{mentor_name}}`
- HTML: [Includes session details and date/time]

**Payment Confirmation Template:**
- Subject: `Payment Confirmed: {{item_name}}`
- HTML: [Includes transaction ID and amount]

**Note**: Email templates in Mailgun are optional. The current code sends HTML directly.

---

## 💬 Gupshup WhatsApp Templates

### ⚠️ CRITICAL: WhatsApp Templates MUST Be Pre-Approved

WhatsApp Business API requires all message templates to be pre-approved before sending. You cannot send free-form messages.

### Setup Steps:

1. **Log into Gupshup Dashboard**: https://www.gupshup.io/

2. **Create WhatsApp Templates**:
   - Go to **Templates** → **Create Template**
   - Select **WhatsApp** as channel
   - Choose template category: **MARKETING** or **UTILITY**

3. **Required Templates to Create**:

#### Template 1: Session Scheduled
```
Template Name: session_scheduled
Category: UTILITY
Language: English (en)
Content:
Your {{mentor_name}} mentor session has been scheduled for {{session_date}}.
Type: {{session_type}}

Session ID: {{session_id}}
```

#### Template 2: Session Reminder (24h)
```
Template Name: session_reminder_24h
Category: UTILITY
Language: English (en)
Content:
Reminder: Your session with {{mentor_name}} is tomorrow at {{session_date}}.
Please ensure you're available.
```

#### Template 3: Session Reminder (1h)
```
Template Name: session_reminder_1h
Category: UTILITY
Language: English (en)
Content:
Reminder: Your session with {{mentor_name}} starts in 1 hour at {{session_date}}.
Please join on time.
```

#### Template 4: Session Reminder (15m)
```
Template Name: session_reminder_15m
Category: UTILITY
Language: English (en)
Content:
Reminder: Your session with {{mentor_name}} starts in 15 minutes at {{session_date}}.
Please be ready to join.
```

#### Template 5: Course Enrollment
```
Template Name: course_enrollment
Category: UTILITY
Language: English (en)
Content:
Congratulations! You've enrolled in {{course_title}}.
Start learning: {{course_url}}
```

#### Template 6: Payment Confirmation
```
Template Name: payment_confirmation
Category: UTILITY
Language: English (en)
Content:
Payment confirmed: ₹{{amount}} for {{item_name}}
Transaction ID: {{transaction_id}}
```

#### Template 7: Course Completion
```
Template Name: course_completion
Category: UTILITY
Language: English (en)
Content:
🎉 Congratulations! You completed {{course_title}}.
View certificate: {{certificate_url}}
```

4. **Submit Templates for Approval**:
   - After creating each template, click **Submit for Approval**
   - Wait for WhatsApp approval (usually 24-48 hours)
   - Status will show **Approved** when ready

5. **Template Variables**:
   - Variables are enclosed in `{{variable_name}}`
   - Must match exactly what you send in the API call
   - Max 1024 characters per template

### Template Approval Requirements:

- **UTILITY Category**: For transactional messages (bookings, confirmations)
- **MARKETING Category**: For promotional messages (requires opt-in)
- Templates must follow WhatsApp Business Policy
- No promotional content in UTILITY templates
- Must include business name

---

## 🔧 Code Updates Needed

After templates are approved, update `notificationService.ts`:

1. **Add template names** to the `sendWhatsApp()` method
2. **Map notification types** to template names
3. **Format variables** according to template structure

Example mapping:
```typescript
const templateMap = {
  'session_scheduled': 'session_scheduled',
  'session_reminder': (metadata) => {
    if (metadata.reminderType === '24h') return 'session_reminder_24h';
    if (metadata.reminderType === '1h') return 'session_reminder_1h';
    if (metadata.reminderType === '15m') return 'session_reminder_15m';
  },
  'course_enrollment': 'course_enrollment',
  'payment_confirmation': 'payment_confirmation',
  'course_completion': 'course_completion',
};
```

---

## 📋 Checklist Before Going Live

### Mailgun:
- [ ] Domain verified (`startsolo.in`)
- [ ] DNS records added
- [ ] Domain status: Active
- [ ] API key added to `.env.local`
- [ ] Test email sent successfully

### Gupshup:
- [ ] Account created
- [ ] WhatsApp Business API connected
- [ ] All 7 templates created
- [ ] All templates submitted for approval
- [ ] All templates show "Approved" status
- [ ] API key added to `.env.local`
- [ ] App name configured
- [ ] Test message sent successfully

### Application:
- [ ] `.env.local` file has all required keys
- [ ] Phone numbers added to `community_members` table (format: +91XXXXXXXXXX)
- [ ] Notification service tested
- [ ] Scheduled notifications function tested

---

## 🚀 Testing After Setup

1. **Test Email**: Book a free session → Check email inbox
2. **Test WhatsApp**: Book a session → Check WhatsApp
3. **Test Reminders**: Schedule a session 25 hours in future → Check reminders arrive at 24h, 1h, 15m before

---

## 📞 Support

- **Mailgun Support**: https://www.mailgun.com/support/
- **Gupshup Support**: https://www.gupshup.io/developer/docs
- **WhatsApp Business API Docs**: https://developers.facebook.com/docs/whatsapp

---

## ⚠️ Important Notes

1. **WhatsApp Template Approval**: Can take 24-48 hours. Start early!
2. **Phone Number Format**: Must include country code (e.g., +91XXXXXXXXXX)
3. **Rate Limits**: 
   - Mailgun: 1000 emails/day on free tier
   - Gupshup: Varies by plan
4. **Template Changes**: Any changes require re-approval
5. **Scheduled Notifications**: Need cron job or Edge Function to process (see next section)

