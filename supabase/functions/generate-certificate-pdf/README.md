# Certificate PDF Generation - Edge Function Setup

## Implementation

**Status:** ✅ Complete - Uses free `pdf-lib` library

The Edge Function generates PDFs programmatically using `pdf-lib`, which is:
- ✅ **100% Free** - No API costs
- ✅ **Works in Deno** - Compatible with Supabase Edge Functions
- ✅ **No external dependencies** - All processing happens in Supabase

## Features

- Generates professional certificate PDFs
- Uploads to Supabase Storage
- Updates database with certificate URL
- Returns PDF as download

## Setup Steps

### 1. Create Storage Bucket

In Supabase Dashboard → Storage:
- Create bucket: `certificates`
- Set to **Public**
- Allowed MIME types: `application/pdf`

### 2. Link Supabase Project

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

### 3. Deploy Function

```bash
supabase functions deploy generate-certificate-pdf
```

### 4. Test Locally

```bash
# Start Supabase locally
supabase start

# Invoke function
curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/generate-certificate-pdf' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"certificateId":"YOUR_CERTIFICATE_ID"}' \
  --output certificate.pdf
```

## Usage

Call from frontend:
```typescript
const response = await fetch(
  `${supabaseUrl}/functions/v1/generate-certificate-pdf`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ certificateId }),
  }
)

const blob = await response.blob()
const url = URL.createObjectURL(blob)
// Open PDF or download
```

## Environment Variables

Auto-provided by Supabase:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Notes

- PDF is generated in A4 landscape format
- Certificate includes: Student name, course title, date, certificate number
- Automatically uploaded to Storage and database updated
- Free to use - no external API costs
