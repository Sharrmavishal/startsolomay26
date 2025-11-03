# Quick Start: Notification Setup

## Step 1: Add Environment Variables

Add to `.env.local`:
```env
VITE_MAILGUN_API_KEY=your_key_here
VITE_MAILGUN_DOMAIN=your_domain_here
VITE_MAILGUN_FROM_EMAIL=noreply@startsolo.in
VITE_GUPSHUP_API_KEY=your_key_here
VITE_GUPSHUP_APP_NAME=your_app_name
VITE_APP_URL=https://startsolo.in
```

## Step 2: Run Database Migration

Run in Supabase SQL Editor:
```sql
-- Run migration: 20250113000000_scheduled_notifications.sql
```

## Step 3: Set Up Templates (Required for WhatsApp)

**See `MAILGUN_GUPSHUP_SETUP.md` for detailed template setup instructions.**

### Quick Checklist:
- [ ] Mailgun domain verified
- [ ] Gupshup account created
- [ ] 7 WhatsApp templates created and approved:
  - session_scheduled
  - session_reminder_24h
  - session_reminder_1h
  - session_reminder_15m
  - course_enrollment
  - payment_confirmation
  - course_completion

## Step 4: Set Up Scheduled Notifications Processor

**Option A: Supabase Cron (Recommended)**
- See `SCHEDULED_NOTIFICATIONS_SETUP.md`

**Option B: External Cron Service**
- Use cron-job.org or similar
- Call endpoint every 15 minutes

**Option C: Manual (Testing)**
- Run in Supabase SQL Editor periodically:
```sql
SELECT check_and_send_scheduled_notifications();
```

## Step 5: Test

1. Book a session → Check email/WhatsApp
2. Enroll in course → Check confirmation
3. Complete course → Check certificate notification

## Support Files

- `MAILGUN_GUPSHUP_SETUP.md` - Template setup guide
- `SCHEDULED_NOTIFICATIONS_SETUP.md` - Cron job setup
- `NOTIFICATION_SYSTEM.md` - Technical details
