import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  lessonId: string
  enrollmentId: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { lessonId, enrollmentId }: RequestBody = await req.json()

    if (!lessonId || !enrollmentId) {
      return new Response(
        JSON.stringify({ error: 'lessonId and enrollmentId are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration not found')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get user from token
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get member ID
    const { data: member, error: memberError } = await supabase
      .from('community_members')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (memberError || !member) {
      return new Response(
        JSON.stringify({ error: 'Member profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify enrollment
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('course_enrollments')
      .select('id, course_id, student_id, enrollment_status')
      .eq('id', enrollmentId)
      .eq('student_id', member.id)
      .single()

    if (enrollmentError || !enrollment) {
      return new Response(
        JSON.stringify({ error: 'Enrollment not found or access denied' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (enrollment.enrollment_status !== 'active') {
      return new Response(
        JSON.stringify({ error: 'Enrollment is not active' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get lesson details
    const { data: lesson, error: lessonError } = await supabase
      .from('course_lessons')
      .select('id, course_id, content_type, storage_path, storage_bucket, is_uploaded_content')
      .eq('id', lessonId)
      .eq('course_id', enrollment.course_id)
      .single()

    if (lessonError || !lesson) {
      return new Response(
        JSON.stringify({ error: 'Lesson not found or does not belong to enrolled course' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if content is uploaded (requires signed URL)
    if (!lesson.is_uploaded_content || !lesson.storage_path || !lesson.storage_bucket) {
      return new Response(
        JSON.stringify({ error: 'Content is not stored in secure storage' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate signed URL (expires in 1 hour)
    const expiresIn = 3600 // 1 hour in seconds
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from(lesson.storage_bucket)
      .createSignedUrl(lesson.storage_path, expiresIn)

    if (signedUrlError || !signedUrlData) {
      return new Response(
        JSON.stringify({ error: 'Failed to generate signed URL', details: signedUrlError?.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Log access (using service role to bypass RLS)
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const userAgent = req.headers.get('user-agent') || 'unknown'

    await supabase.rpc('log_content_access', {
      p_lesson_id: lessonId,
      p_enrollment_id: enrollmentId,
      p_student_id: member.id,
      p_access_type: 'view',
      p_signed_url_used: true,
      p_ip_address: clientIP,
      p_user_agent: userAgent,
    })

    // Return signed URL
    return new Response(
      JSON.stringify({
        signedUrl: signedUrlData.signedUrl,
        expiresIn: expiresIn,
        accessType: lesson.content_type,
        expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error generating signed URL:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

