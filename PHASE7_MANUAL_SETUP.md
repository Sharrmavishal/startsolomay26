# Manual Setup Steps for Phase 7: Secure Course Content Hosting

## Step 1: Run Database Migration

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Click **"New Query"**
3. Copy the entire contents of `supabase/migrations/20251102000000_course_content_security.sql`
4. Paste and click **"Run"**
5. Verify success (should see "Success. No rows returned")

## Step 2: Create Storage Buckets

**⚠️ IMPORTANT: Free Plan Limitation**
- Supabase Free plan has a **50MB total storage limit** across all buckets (not per bucket)
- File size limits below reflect this constraint
- **Update bucket limits and frontend code when upgrading to Pro plan**

1. Go to **Supabase Dashboard** → **Storage**
2. Click **"New bucket"** (repeat for each bucket):

### Bucket 1: course-pdfs
- **Name:** `course-pdfs`
- **Public bucket:** ❌ **No** (unchecked - private)
- **File size limit:** `50MB` (Free plan: shared across all buckets)
- **Allowed MIME types:** `application/pdf`

### Bucket 2: course-audio
- **Name:** `course-audio`
- **Public bucket:** ❌ **No** (unchecked - private)
- **File size limit:** `50MB` (Free plan: shared across all buckets)
- **Allowed MIME types:** `audio/mpeg, audio/mp3, audio/wav, audio/ogg, audio/webm`

### Bucket 3: course-videos
- **Name:** `course-videos`
- **Public bucket:** ❌ **No** (unchecked - private)
- **File size limit:** `50MB` (Free plan: shared across all buckets)
- **Allowed MIME types:** `video/mp4, video/webm, video/ogg, video/quicktime`

### Bucket 4: course-files
- **Name:** `course-files`
- **Public bucket:** ❌ **No** (unchecked - private)
- **File size limit:** `50MB` (Free plan: shared across all buckets)
- **Allowed MIME types:** `application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document`

**Note:** When upgrading to Pro plan, update bucket limits to:
- PDFs: 50MB per file
- Audio: 100MB per file
- Videos: 500MB per file
- Files: 50MB per file
Also update `src/lib/storage/courseContent.ts` `getFileSizeLimit()` method.

## Step 3: Create Storage RLS Policies

After buckets are created, run this SQL in **SQL Editor**:

```sql
-- Policy 1: Upload - Only mentors creating courses can upload
CREATE POLICY "Mentors can upload course content"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id IN ('course-pdfs', 'course-audio', 'course-videos', 'course-files')
  AND EXISTS (
    SELECT 1 FROM mentor_courses mc
    JOIN community_members cm ON mc.mentor_id = cm.id
    WHERE cm.user_id = auth.uid()
    AND (storage.foldername(name))[1] = mc.id::text
  )
);

-- Policy 2: Download - Only enrolled students can access
CREATE POLICY "Enrolled students can access content"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id IN ('course-pdfs', 'course-audio', 'course-videos', 'course-files')
  AND EXISTS (
    SELECT 1 FROM course_enrollments ce
    JOIN course_lessons cl ON (storage.foldername(name))[1] = cl.course_id::text
    WHERE ce.student_id IN (
      SELECT id FROM community_members WHERE user_id = auth.uid()
    )
    AND ce.enrollment_status = 'active'
    AND cl.id::text = (storage.foldername(name))[3]
  )
);

-- Policy 3: Delete - Only mentors can delete their own content
CREATE POLICY "Mentors can delete own course content"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id IN ('course-pdfs', 'course-audio', 'course-videos', 'course-files')
  AND EXISTS (
    SELECT 1 FROM mentor_courses mc
    JOIN community_members cm ON mc.mentor_id = cm.id
    WHERE cm.user_id = auth.uid()
    AND (storage.foldername(name))[1] = mc.id::text
  )
);

-- Policy 4: Admin - Full access
CREATE POLICY "Admins have full access to course content"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id IN ('course-pdfs', 'course-audio', 'course-videos', 'course-files')
  AND EXISTS (
    SELECT 1 FROM community_members
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);
```

## Step 4: Deploy Edge Functions

After SQL is run, deploy the Edge Functions:

```bash
# Login to Supabase (if not already)
supabase login

# Link project (if not already linked)
supabase link --project-ref YOUR_PROJECT_REF

# Deploy functions
supabase functions deploy get-course-content-url
supabase functions deploy watermark-pdf
```

## Verification Checklist

- [ ] Migration SQL ran successfully
- [ ] All 4 storage buckets created (private)
- [ ] Storage RLS policies created
- [ ] Edge Functions deployed
- [ ] Test file upload in CreateCourse component
- [ ] Test signed URL access in CourseDetail component

## Troubleshooting

**If migration fails:**
- Check if columns already exist (migration uses `IF NOT EXISTS`)
- Check if tables already exist

**If storage policies fail:**
- Ensure buckets are created first
- Check bucket names match exactly (case-sensitive)

**If Edge Functions fail:**
- Ensure Supabase CLI is installed and logged in
- Verify project is linked correctly
- Check function code for syntax errors

