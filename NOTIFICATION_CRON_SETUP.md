# Notification Cron Setup - Manual Steps

## Prerequisites

1. **Mailgun Domain Verified** ✅
   - Domain must be verified in Mailgun dashboard
   - DNS records configured

2. **Gupshup Account Ready** ✅
   - API key available
   - Templates approved (if using templates)

## Step 1: Deploy Edge Function via Dashboard

1. Go to **Supabase Dashboard** → **Edge Functions**
2. Click **"Create a new function"**
3. **Function name:** `process-notifications`
4. **Runtime:** Deno (default)

5. **Copy the code from:** `supabase/functions/process-notifications/index.ts`

6. **Copy dependencies from:** `supabase/functions/process-notifications/deno.json`
   - In Dashboard, go to **Settings** tab for the function
   - Add import: `@supabase/supabase-js`: `jsr:@supabase/supabase-js@2`

7. Click **"Deploy"**

## Step 2: Set Environment Variables (Secrets)

In Supabase Dashboard → Edge Functions → Settings → Secrets:

Add these secrets:
- `MAILGUN_API_KEY` - Your Mailgun API key
- `MAILGUN_DOMAIN` - Your Mailgun domain (e.g., `mg.startsolo.in`)
- `MAILGUN_FROM_EMAIL` - Sender email (e.g., `noreply@startsolo.in`)
- `GUPSHUP_API_KEY` - Your Gupshup API key (optional if not using WhatsApp)
- `GUPSHUP_APP_NAME` - Your Gupshup app name (optional)

**Note:** `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are auto-provided.

## Step 3: Set Up Cron Job

### Option A: External Cron Service (Easier - Recommended)

**Using cron-job.org:**

1. Go to https://cron-job.org (or similar service)
2. Create account/login
3. Create new cron job:
   - **URL:** `https://mwjwhhujuunfjurkeuwd.supabase.co/functions/v1/process-notifications`
   - **Method:** POST
   - **Headers:** 
     - `Authorization`: `Bearer YOUR_ANON_KEY`
     - `Content-Type`: `application/json`
   - **Body:** `{}`
   - **Schedule:** Every 15 minutes (`*/15 * * * *`)

**Using EasyCron:**

1. Go to https://www.easycron.com
2. Create account/login
3. Similar setup as above

### Option B: Supabase pg_cron (Advanced)

**Note:** Requires pg_cron extension enabled. May not be available on Free plan.

In Supabase Dashboard → SQL Editor:

```sql
-- Enable pg_cron extension (if available)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create cron job
SELECT cron.schedule(
  'process_notifications',
  '*/15 * * * *', -- Every 15 minutes
  $$
  SELECT net.http_post(
    url := 'https://mwjwhhujuunfjurkeuwd.supabase.co/functions/v1/process-notifications',
    headers := jsonb_build_object(
      'Authorization', 'Bearer YOUR_ANON_KEY',
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  ) AS request_id;
  $$
);
```

**Note:** Replace `YOUR_ANON_KEY` with your actual Supabase anon key from Dashboard → Settings → API.

## Step 4: Verify Deployment

Function URL: `https://mwjwhhujuunfjurkeuwd.supabase.co/functions/v1/process-notifications`

Test manually:
```bash
curl -X POST 'https://mwjwhhujuunfjurkeuwd.supabase.co/functions/v1/process-notifications' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json'
```

Expected response:
```json
{
  "processed": 0,
  "sent": 0,
  "failed": 0,
  "message": "No notifications to process"
}
```

## Step 5: Test End-to-End

1. **Book a session** 25 hours in the future
2. **Check notifications table:**
   ```sql
   SELECT * FROM notifications 
   WHERE recipient_id = 'YOUR_MEMBER_ID'
   ORDER BY scheduled_for;
   ```
   Should see 4 entries:
   - 1 immediate confirmation
   - 1 reminder at 24h before
   - 1 reminder at 1h before
   - 1 reminder at 15m before

3. **Wait 1 hour** (or manually trigger function)
4. **Check notification status:**
   ```sql
   SELECT type, status, scheduled_for, sent_at, failed_at
   FROM notifications
   WHERE scheduled_for <= NOW()
   ORDER BY scheduled_for DESC;
   ```

## Monitoring

**Check notification status:**
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

**Check cron job status** (if using pg_cron):
```sql
SELECT * FROM cron.job;
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;
```

## Troubleshooting

- **Notifications not sending:** Check cron job is running
- **Email failures:** Check Mailgun domain verification and DNS
- **WhatsApp failures:** Verify Gupshup templates are approved
- **Function errors:** Check Edge Function logs in Supabase Dashboard
- **Cron not triggering:** Verify cron service is running and URL is correct

## Notes

- Cron runs every 15 minutes - notifications are sent within 15 minutes of scheduled time
- Failed notifications are logged with `failure_reason`
- Retry logic can be added later for failed notifications
- Free plan may have rate limits on cron jobs

