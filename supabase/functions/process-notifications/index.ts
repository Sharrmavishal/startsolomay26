import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get Mailgun and Gupshup credentials from environment
    const mailgunApiKey = Deno.env.get('MAILGUN_API_KEY') ?? ''
    const mailgunDomain = Deno.env.get('MAILGUN_DOMAIN') ?? ''
    const mailgunFromEmail = Deno.env.get('MAILGUN_FROM_EMAIL') ?? 'noreply@startsolo.in'
    const gupshupApiKey = Deno.env.get('GUPSHUP_API_KEY') ?? ''
    const gupshupAppName = Deno.env.get('GUPSHUP_APP_NAME') ?? ''

    // Get notifications ready to send
    const { data: notifications, error } = await supabase
      .rpc('process_scheduled_notifications')

    if (error) {
      throw new Error(`Failed to fetch notifications: ${error.message}`)
    }

    if (!notifications || notifications.length === 0) {
      return new Response(
        JSON.stringify({ processed: 0, message: 'No notifications to process' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let processed = 0
    let sent = 0
    let failed = 0

    // Process each notification
    for (const notification of notifications) {
      try {
        // Get member details
        const { data: member } = await supabase
          .from('community_members')
          .select('email, full_name, phone, user_id')
          .eq('user_id', notification.user_id)
          .single()

        if (!member) {
          throw new Error('Member profile not found')
        }

        const email = member.email || ''
        const name = member.full_name || email?.split('@')[0] || 'User'
        const phone = member.phone || ''

        let emailSent = false
        let whatsappSent = false
        const errors: string[] = []

        // Send email if channel includes email
        if ((notification.channel === 'email' || notification.channel === 'both') && email && mailgunApiKey && mailgunDomain) {
          try {
            emailSent = await sendMailgunEmail({
              apiKey: mailgunApiKey,
              domain: mailgunDomain,
              fromEmail: mailgunFromEmail,
              to: email,
              toName: name,
              subject: notification.title,
              message: notification.message,
            })
          } catch (err: any) {
            errors.push(`Email: ${err.message}`)
          }
        }

        // Send WhatsApp if channel includes whatsapp
        if ((notification.channel === 'whatsapp' || notification.channel === 'both') && phone && gupshupApiKey && gupshupAppName) {
          try {
            const templateInfo = getWhatsAppTemplate(notification.notification_type, notification.metadata)
            whatsappSent = await sendGupshupWhatsApp({
              apiKey: gupshupApiKey,
              appName: gupshupAppName,
              to: phone,
              message: notification.message,
              templateName: templateInfo.templateName,
              templateParams: templateInfo.params,
            })
          } catch (err: any) {
            errors.push(`WhatsApp: ${err.message}`)
          }
        }

        // Determine success
        const success = (notification.channel === 'email' && emailSent) ||
                        (notification.channel === 'whatsapp' && whatsappSent) ||
                        (notification.channel === 'both' && (emailSent || whatsappSent))

        // Update notification status
        await supabase
          .from('notifications')
          .update({
            status: success ? 'sent' : 'failed',
            sent_at: success ? new Date().toISOString() : null,
            failed_at: success ? null : new Date().toISOString(),
            failure_reason: errors.length > 0 ? errors.join('; ') : null,
          })
          .eq('id', notification.notification_id)

        processed++
        if (success) sent++
        else failed++

      } catch (err: any) {
        console.error(`Error processing notification ${notification.notification_id}:`, err)
        
        // Mark as failed
        await supabase
          .from('notifications')
          .update({
            status: 'failed',
            failed_at: new Date().toISOString(),
            failure_reason: err.message,
          })
          .eq('id', notification.notification_id)
        
        processed++
        failed++
      }
    }

    return new Response(
      JSON.stringify({
        processed,
        sent,
        failed,
        message: `Processed ${processed} notifications (${sent} sent, ${failed} failed)`,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    console.error('Error processing notifications:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Helper: Send email via Mailgun
async function sendMailgunEmail(data: {
  apiKey: string
  domain: string
  fromEmail: string
  to: string
  toName: string
  subject: string
  message: string
}): Promise<boolean> {
  const formData = new FormData()
  formData.append('from', `${data.fromEmail} <${data.fromEmail}>`)
  formData.append('to', `${data.toName} <${data.to}>`)
  formData.append('subject', data.subject)
  formData.append('html', formatEmailMessage(data.message))

  const response = await fetch(
    `https://api.mailgun.net/v3/${data.domain}/messages`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`api:${data.apiKey}`)}`,
      },
      body: formData,
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Mailgun error: ${error}`)
  }

  return true
}

// Helper: Send WhatsApp via Gupshup
async function sendGupshupWhatsApp(data: {
  apiKey: string
  appName: string
  to: string
  message: string
  templateName?: string
  templateParams?: Record<string, string>
}): Promise<boolean> {
  const phone = data.to.replace(/[^0-9]/g, '') // Remove non-digits
  
  if (data.templateName && data.templateParams) {
    // Use template API
    const params = Object.values(data.templateParams).join('|')
    const url = `https://api.gupshup.io/sm/api/v1/msg`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'apikey': data.apiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        channel: 'whatsapp',
        source: data.appName,
        destination: phone,
        message: JSON.stringify({
          type: 'template',
          template: {
            name: data.templateName,
            params: params,
          },
        }),
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Gupshup template error: ${error}`)
    }
  } else {
    // Use plain text API
    const url = `https://api.gupshup.io/sm/api/v1/msg`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'apikey': data.apiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        channel: 'whatsapp',
        source: data.appName,
        destination: phone,
        message: data.message,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Gupshup error: ${error}`)
    }
  }

  return true
}

// Helper: Format email message
function formatEmailMessage(message: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1D3A6B; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Start Solo Community</h1>
        </div>
        <div class="content">
          ${message.replace(/\n/g, '<br>')}
        </div>
        <div class="footer">
          <p>This is an automated notification from Start Solo Community.</p>
        </div>
      </div>
    </body>
    </html>
  `.trim()
}

// Helper: Get WhatsApp template info
function getWhatsAppTemplate(notificationType: string, metadata?: Record<string, any>): {
  templateName?: string
  params?: Record<string, string>
} {
  const templateMap: Record<string, { template: string | ((meta?: Record<string, any>) => string); params: (metadata?: Record<string, any>) => Record<string, string> }> = {
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
        const reminderType = meta?.reminderType || ''
        if (reminderType === '24h') return 'session_reminder_24h'
        if (reminderType === '1h') return 'session_reminder_1h'
        if (reminderType === '15m') return 'session_reminder_15m'
        return 'session_reminder_24h'
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
  }

  const templateInfo = templateMap[notificationType]
  if (templateInfo) {
    const templateName = typeof templateInfo.template === 'function'
      ? templateInfo.template(metadata)
      : templateInfo.template
    return {
      templateName,
      params: templateInfo.params(metadata),
    }
  }

  return {}
}
