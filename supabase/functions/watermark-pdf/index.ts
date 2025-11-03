import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { PDFDocument, rgb, StandardFonts } from 'npm:pdf-lib@1.17.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  lessonId: string
  enrollmentId: string
  storagePath: string
  bucket: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { lessonId, enrollmentId, storagePath, bucket }: RequestBody = await req.json()

    if (!lessonId || !enrollmentId || !storagePath || !bucket) {
      return new Response(
        JSON.stringify({ error: 'lessonId, enrollmentId, storagePath, and bucket are required' }),
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

    // Get enrollment and student info
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('course_enrollments')
      .select(`
        id,
        student_id,
        enrollment_status,
        student:community_members!student_id(display_name, full_name, email)
      `)
      .eq('id', enrollmentId)
      .single()

    if (enrollmentError || !enrollment) {
      return new Response(
        JSON.stringify({ error: 'Enrollment not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (enrollment.enrollment_status !== 'active') {
      return new Response(
        JSON.stringify({ error: 'Enrollment is not active' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Download original PDF from storage
    const { data: pdfData, error: downloadError } = await supabase.storage
      .from(bucket)
      .download(storagePath)

    if (downloadError || !pdfData) {
      return new Response(
        JSON.stringify({ error: 'Failed to download PDF', details: downloadError?.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const pdfBytes = await pdfData.arrayBuffer()
    const pdfDoc = await PDFDocument.load(pdfBytes)

    // Get fonts
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    // Get student info
    const studentName = enrollment.student?.display_name || enrollment.student?.full_name || 'Student'
    const studentEmail = enrollment.student?.email || ''

    // Add watermark to each page
    const pages = pdfDoc.getPages()
    pages.forEach((page) => {
      const { width, height } = page.getSize()

      // Semi-transparent watermark text
      const watermarkText = `${studentName} | ${enrollmentId} | ${new Date().toISOString()}`
      
      // Rotate text diagonally across page
      page.drawText(watermarkText, {
        x: width / 4,
        y: height / 2,
        size: 12,
        font: font,
        color: rgb(0.7, 0.7, 0.7), // Light gray
        opacity: 0.3,
        rotate: { angleRadians: -0.785 }, // -45 degrees
      })

      // Add footer watermark
      page.drawText(`Enrollment ID: ${enrollmentId.substring(0, 8)}...`, {
        x: 20,
        y: 20,
        size: 8,
        font: font,
        color: rgb(0.5, 0.5, 0.5),
        opacity: 0.5,
      })
    })

    // Save watermarked PDF
    const watermarkedPdfBytes = await pdfDoc.save()

    // Return watermarked PDF
    return new Response(watermarkedPdfBytes, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="watermarked-${lessonId}.pdf"`,
      },
    })

  } catch (error) {
    console.error('Error watermarking PDF:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

