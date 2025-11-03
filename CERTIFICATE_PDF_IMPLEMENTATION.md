# Certificate PDF Generation - Implementation Plan

## Overview
Certificates are currently generated in the database (`course_certificates` table) but PDFs need to be created server-side for download and sharing.

## Current State
- ✅ Certificate data stored in database
- ✅ Certificate viewer component (`CertificateViewer.tsx`)
- ✅ Certificate auto-generation on course completion
- ❌ PDF generation (server-side)

## Recommended Approach

### Option 1: Supabase Edge Function (Recommended)
**Pros:**
- Serverless, scales automatically
- No additional infrastructure
- Integrated with Supabase

**Implementation:**
1. Create Supabase Edge Function: `generate-certificate-pdf`
2. Use `pdfkit` or `puppeteer` to generate PDF
3. Upload to Supabase Storage
4. Update `certificate_url` in database

**Dependencies:**
```javascript
// Edge Function dependencies
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
```

### Option 2: External Service (e.g., PDFShift, DocRaptor)
**Pros:**
- No server management
- High-quality PDF generation
- HTML to PDF conversion

**Cons:**
- Additional cost
- External dependency

### Option 3: Client-Side Generation (Not Recommended)
**Pros:**
- Simple implementation

**Cons:**
- Browser limitations
- Security concerns
- No server-side validation

## Implementation Steps (Option 1)

1. **Create Edge Function**
   - Path: `supabase/functions/generate-certificate-pdf/index.ts`
   - Accept certificate ID
   - Fetch certificate data from database
   - Generate PDF using template
   - Upload to Supabase Storage
   - Return PDF URL

2. **Update Certificate Schema**
   - Add `certificate_url` field (already exists)
   - Add `pdf_generated_at` timestamp

3. **Trigger PDF Generation**
   - On certificate creation (via trigger or Edge Function call)
   - Or on-demand when user requests download

4. **Template Design**
   - HTML template with certificate design
   - Include: Course name, student name, date, certificate number
   - Customizable per mentor/course

## Example Edge Function Structure

```typescript
// supabase/functions/generate-certificate-pdf/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { certificateId } = await req.json()
  
  // Fetch certificate data
  // Generate PDF using pdfkit or puppeteer
  // Upload to storage
  // Update certificate_url
  
  return new Response(JSON.stringify({ success: true, url: pdfUrl }))
})
```

## Files to Create
- `supabase/functions/generate-certificate-pdf/index.ts`
- `supabase/functions/generate-certificate-pdf/certificate-template.html`

## Next Steps
1. Set up Supabase Edge Functions
2. Install PDF generation library
3. Create HTML template
4. Test PDF generation
5. Integrate with certificate creation flow

## Notes
- PDF generation can be triggered async (background job)
- Consider caching generated PDFs
- Support custom certificate templates per mentor

