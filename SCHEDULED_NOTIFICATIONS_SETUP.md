# Scheduled Notifications Processing Guide

## Overview

The notification system automatically schedules reminders (24h, 1h, 15m before sessions) but needs a background process to actually send them when they're due.

## Option 1: Supabase Edge Function (Recommended)

### Setup Steps:

1. **Create Edge Function**:
   ```bash
   supabase functions new process-notifications
   ```

2. **Create Function Code** (`supabase/functions/process-notifications/index.ts`):
   ```typescript
   import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
   import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

   serve(async (req) => {
     const supabase = createClient(
       Deno.env.get('SUPABASE_URL') ?? '',
       Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
     )

     // Get notifications ready to send
     const { data: notifications, error } = await supabase
       .rpc('process_scheduled_notifications')

     if (error) {
       return new Response(JSON.stringify({ error: error.message }), {
         headers: { 'Content-Type': 'application/json' },
         status: 500,
       })
     }

     // Process each notification
     for (const notif of notifications || []) {
       // Call your notification service to send
       // This would need to be adapted to your notification service
       await sendNotification(notif)
     }

     return new Response(
       JSON.stringify({ processed: notifications?.length || 0 }),
       { headers: { 'Content-Type': 'application/json' } }
     )
   })
   ```

3. **Deploy Function**:
   ```bash
   supabase functions deploy process-notifications
   ```

4. **Set up Cron Job** (Supabase Dashboard):
   - Go to Database → Cron Jobs
   - Create new cron job:
     - Name: `process_notifications`
     - Schedule: `*/15 * * * *` (every 15 minutes)
     - SQL: `SELECT cron.schedule('process_notifications', '*/15 * * * *', 'SELECT process_scheduled_notifications();');`

## Option 2: External Cron Job (Simpler)

### Setup Steps:

1. **Create a simple API endpoint** (can be added to your existing backend):
   ```javascript
   // Example: Netlify serverless function
   // netlify/functions/process-notifications.js
   
   exports.handler = async (event, context) => {
     const { createClient } = require('@supabase/supabase-js')
     
     const supabase = createClient(
       process.env.SUPABASE_URL,
       process.env.SUPABASE_SERVICE_ROLE_KEY
     )
     
     // Get notifications ready to send
     const { data: notifications } = await supabase
       .rpc('check_and_send_scheduled_notifications')
     
     // Process notifications...
     
     return {
       statusCode: 200,
       body: JSON.stringify({ processed: notifications?.length || 0 })
     }
   }
   ```

2. **Set up Cron Job** (using a service like cron-job.org):
   - URL: `https://your-site.com/.netlify/functions/process-notifications`
   - Schedule: Every 15 minutes
   - Method: GET

## Option 3: Manual Processing (For Testing)

You can manually trigger processing:

```sql
-- Run this query in Supabase SQL Editor
SELECT check_and_send_scheduled_notifications();
```

Or call the function from your application:

```typescript
const { data, error } = await supabase.rpc('check_and_send_scheduled_notifications');
```

## Testing

1. **Book a session** 25 hours in the future
2. **Wait 1 hour** → Check database for 24h reminder notification
3. **Wait 23 more hours** → Check for 1h reminder
4. **Wait 45 more minutes** → Check for 15m reminder

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

- **Notifications not sending**: Check if cron job is running
- **Templates failing**: Verify Gupshup templates are approved
- **Email failures**: Check Mailgun domain verification
- **Rate limits**: Implement delays between sends

