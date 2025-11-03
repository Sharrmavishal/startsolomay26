# Certificate PDF Deployment - Manual Steps

## Step 1: Create Storage Bucket

1. Go to **Supabase Dashboard** → **Storage**
2. Click **"New bucket"**
3. Configure:
   - **Name:** `certificates`
   - **Public bucket:** ✅ **Yes** (check this)
   - **File size limit:** `50MB`
   - **Allowed MIME types:** `application/pdf`
4. Click **"Create bucket"**

## Step 2: Deploy Edge Function via Dashboard

1. Go to **Supabase Dashboard** → **Edge Functions**
2. Click **"Create a new function"**
3. **Function name:** `generate-certificate-pdf`
4. **Runtime:** Deno (default)

5. **Copy the code from:** `supabase/functions/generate-certificate-pdf/index.ts`

6. **Copy dependencies from:** `supabase/functions/generate-certificate-pdf/deno.json`
   - In Dashboard, go to **Settings** tab for the function
   - Add imports:
     - `@supabase/supabase-js`: `jsr:@supabase/supabase-js@2`
     - `pdf-lib`: `https://esm.sh/pdf-lib@1.17.1`

7. Click **"Deploy"**

## Step 3: Verify Deployment

- Function should appear in Edge Functions list
- Function URL: `https://<your-project-id>.supabase.co/functions/v1/generate-certificate-pdf`

## Step 4: Test (Optional)

Get a certificate ID from database, then test:
```bash
curl -X POST 'https://<your-project-id>.supabase.co/functions/v1/generate-certificate-pdf' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"certificateId":"YOUR_CERTIFICATE_ID"}' \
  --output certificate.pdf
```

## Done ✅

Function is ready. Users can generate PDFs from CertificateViewer component.

