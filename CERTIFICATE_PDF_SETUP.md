# Certificate PDF Generation - Setup Guide

## Step 1: Create Storage Bucket

1. Go to your **Supabase Dashboard** → **Storage**
2. Click **"New bucket"**
3. Configure:
   - **Name:** `certificates`
   - **Public bucket:** ✅ **Yes** (check this)
   - **File size limit:** `50MB` (or as needed)
   - **Allowed MIME types:** `application/pdf`

4. Click **"Create bucket"**

## Step 2: Link Supabase Project

```bash
cd /Users/vishal/CascadeProjects/StartSolo_Website/startsolo-main

# Link to your Supabase project
supabase link --project-ref YOUR_PROJECT_REF
```

**Find your project ref:**
- Go to Supabase Dashboard → Settings → General
- Copy the "Reference ID"

## Step 3: Deploy Edge Function

```bash
# Deploy the function
supabase functions deploy generate-certificate-pdf
```

**First time setup:**
- You may need to login: `supabase login`
- Ensure you have permissions to deploy functions

## Step 4: Verify Deployment

Check in Supabase Dashboard:
- Go to **Edge Functions**
- You should see `generate-certificate-pdf` listed

## Step 5: Test Locally (Optional)

```bash
# Start Supabase locally
supabase start

# Get a certificate ID from your database, then:
curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/generate-certificate-pdf' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"certificateId":"YOUR_CERTIFICATE_ID"}' \
  --output certificate.pdf
```

## Environment Variables

The Edge Function automatically receives:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (has admin access)

**No manual setup needed** - Supabase provides these automatically.

## Troubleshooting

### Storage bucket not found
- Ensure bucket name is exactly `certificates`
- Check bucket is set to **Public**

### Function not found
- Verify deployment: `supabase functions list`
- Check you're linked to correct project: `supabase projects list`

### Permission errors
- Ensure Storage bucket has correct RLS policies
- Function uses service role key (bypasses RLS)

## Usage

Once deployed:
1. User completes course → Certificate created in database
2. User clicks "Generate PDF" → Edge Function called
3. PDF generated → Uploaded to Storage
4. Database updated → User can download PDF

**Cost:** $0 - All processing happens in Supabase!

