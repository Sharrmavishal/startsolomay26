# Process Notifications - Edge Function Setup

## Overview

This Edge Function processes scheduled notifications (24h, 1h, 15m reminders) that are due to be sent.

**Status:** ✅ Function created - Ready to deploy

## What It Does

1. Fetches notifications scheduled for now or in the past
2. Sends emails via Mailgun
3. Sends WhatsApp via Gupshup (using templates if available)
4. Updates notification status (sent/failed)

## Setup Steps

### 1. Set Environment Variables

In Supabase Dashboard → Edge Functions → Settings → Secrets:

- `MAILGUN_API_KEY` - Your Mailgun API key
- `MAILGUN_DOMAIN` - Your Mailgun domain (e.g., `mg.startsolo.in`)
- `MAILGUN_FROM_EMAIL` - Sender email (e.g., `noreply@startsolo.in`)
- `GUPSHUP_API_KEY` - Your Gupshup API key
- `GUPSHUP_APP_NAME` - Your Gupshup app name

**Note:** `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are auto-provided.

### 2. Deploy Function

```bash
cd /Users/vishal/CascadeProjects/StartSolo_Website/startsolo-main
supabase functions deploy process-notifications
```

### 3. Set Up Cron Job

**Option A: Supabase Cron (Recommended)**

In Supabase Dashboard → Database → Cron Jobs:

```sql
-- Create cron job to run every 15 minutes
SELECT cron.schedule(
  'process_notifications',
  '*/15 * * * *', -- Every 15 minutes
  $$
  SELECT net.http_post(
    url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/process-notifications',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  ) AS request_id;
  $$
);
```

**Option B: External Cron Service (Easier)**

1. Use cron-job.org or similar
2. URL: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/process-notifications`
3. Headers: `Authorization: Bearer YOUR_ANON_KEY`
4. Schedule: Every 15 minutes
5. Method: POST

**Option C: Manual Testing**

```bash
curl -X POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/process-notifications' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json'
```

## Testing

1. Book a session 25 hours in the future
2. Check `notifications` table - should see 4 entries (1 immediate + 3 reminders)
3. Wait 1 hour → Run function manually → Check 24h reminder was sent
4. Check notification status in database

## Monitoring

Check notification status:
```sql
SELECT 
  type,
  status,
  scheduled_for,
  sent_at,
  failed_at,
  failure_reason
FROM notifications
WHERE scheduled_for <= NOW()
ORDER BY scheduled_for DESC
LIMIT 20;
```

## Troubleshooting

- **Notifications not sending**: Check cron job is running
- **Templates failing**: Verify Gupshup templates are approved
- **Email failures**: Check Mailgun domain verification
- **Function errors**: Check Edge Function logs in Supabase Dashboard

