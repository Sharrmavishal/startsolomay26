import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { PDFDocument, rgb, StandardFonts } from 'https://esm.sh/pdf-lib@1.17.1'

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
    const { certificateId } = await req.json()

    if (!certificateId) {
      return new Response(
        JSON.stringify({ error: 'Certificate ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Fetch certificate data
    const { data: certificate, error: certError } = await supabase
      .from('course_certificates')
      .select(`
        *,
        course:mentor_courses(title, description),
        student:community_members!student_id(display_name, full_name),
        enrollment:course_enrollments(*)
      `)
      .eq('id', certificateId)
      .single()

    if (certError || !certificate) {
      throw new Error(`Certificate not found: ${certError?.message}`)
    }

    // Generate PDF using pdf-lib
    const pdfBytes = await generateCertificatePDF(certificate)
    
    // Upload to Supabase Storage
    const fileName = `certificate-${certificate.certificate_number}.pdf`
    const bucketName = 'certificates'
    
    // Upload PDF to storage
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, pdfBytes, {
        contentType: 'application/pdf',
        upsert: true, // Overwrite if exists
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      // If bucket doesn't exist, we'll just return the PDF
      // User needs to create the bucket first
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName)

    const certificateUrl = urlData?.publicUrl || ''

    // Update certificate URL in database
    if (certificateUrl) {
      await supabase
        .from('course_certificates')
        .update({ certificate_url: certificateUrl })
        .eq('id', certificateId)
    }

    // Return PDF as response
    return new Response(pdfBytes, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    })

  } catch (error) {
    console.error('Error generating certificate PDF:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function generateCertificatePDF(certificate: any): Promise<Uint8Array> {
  const studentName = certificate.student?.display_name || certificate.student?.full_name || 'Student'
  const courseTitle = certificate.course?.title || 'Course'
  const certificateNumber = certificate.certificate_number || ''
  const issuedDate = new Date(certificate.issued_at).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Create PDF document (A4 landscape)
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([842, 595]) // A4 landscape in points (297mm x 210mm)
  const { width, height } = page.getSize()

  // Colors
  const primaryColor = rgb(0.1137, 0.2275, 0.4196) // #1D3A6B
  const textColor = rgb(0.2, 0.2, 0.2)
  const lightGray = rgb(0.6, 0.6, 0.6)

  // Load fonts
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique)

  // Draw border
  page.drawRectangle({
    x: 40,
    y: 40,
    width: width - 80,
    height: height - 80,
    borderColor: primaryColor,
    borderWidth: 6,
  })

  // Inner border
  page.drawRectangle({
    x: 70,
    y: 70,
    width: width - 140,
    height: height - 140,
    borderColor: primaryColor,
    borderWidth: 2,
  })

  // Title
  page.drawText('CERTIFICATE OF COMPLETION', {
    x: width / 2,
    y: height - 150,
    size: 42,
    font: helveticaBold,
    color: primaryColor,
    align: 'center',
  })

  // Subtitle
  page.drawText('This is to certify that', {
    x: width / 2,
    y: height - 220,
    size: 20,
    font: helveticaFont,
    color: textColor,
    align: 'center',
  })

  // Student name (centered, underlined)
  const nameY = height - 290
  const nameWidth = helveticaBold.widthOfTextAtSize(studentName, 36)
  page.drawText(studentName, {
    x: width / 2,
    y: nameY,
    size: 36,
    font: helveticaBold,
    color: primaryColor,
    align: 'center',
  })

  // Underline for name
  page.drawLine({
    start: { x: (width - nameWidth) / 2 - 20, y: nameY - 10 },
    end: { x: (width + nameWidth) / 2 + 20, y: nameY - 10 },
    thickness: 2,
    color: primaryColor,
  })

  // Course completion text
  page.drawText('has successfully completed', {
    x: width / 2,
    y: height - 360,
    size: 18,
    font: helveticaFont,
    color: textColor,
    align: 'center',
  })

  // Course title
  page.drawText(courseTitle, {
    x: width / 2,
    y: height - 400,
    size: 24,
    font: helveticaBold,
    color: primaryColor,
    align: 'center',
  })

  // Date
  page.drawText(`Issued on ${issuedDate}`, {
    x: width / 2,
    y: height - 470,
    size: 14,
    font: helveticaFont,
    color: lightGray,
    align: 'center',
  })

  // Certificate number
  page.drawText(`Certificate Number: ${certificateNumber}`, {
    x: width / 2,
    y: height - 500,
    size: 12,
    font: helveticaOblique,
    color: lightGray,
    align: 'center',
  })

  // Seal/Footer
  page.drawText('Start Solo Community', {
    x: width / 2,
    y: 100,
    size: 14,
    font: helveticaBold,
    color: primaryColor,
    align: 'center',
  })

  // Save PDF
  const pdfBytes = await pdfDoc.save()
  return pdfBytes
}
