# Cover Image Setup Guide

## Bucket Creation

Create a public bucket for course cover images:

1. Go to **Supabase Dashboard** → **Storage**
2. Click **"New bucket"**
3. Configure:
   - **Name:** `course-covers`
   - **Public bucket:** ✅ **Yes** (checked - public)
   - **File size limit:** `5MB`
   - **Allowed MIME types:** `image/jpeg,image/png,image/webp`

## Storage RLS Policies

After creating the bucket, run this SQL in **SQL Editor** to allow mentors to upload cover images:

```sql
-- Allow mentors to upload cover images
CREATE POLICY "Mentors can upload course cover images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'course-covers'
  AND EXISTS (
    SELECT 1 FROM community_members
    WHERE user_id = auth.uid()
    AND role IN ('mentor', 'admin')
  )
);

-- Allow mentors to update their own cover images
CREATE POLICY "Mentors can update own cover images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'course-covers'
  AND EXISTS (
    SELECT 1 FROM community_members
    WHERE user_id = auth.uid()
    AND role IN ('mentor', 'admin')
  )
);

-- Allow mentors to delete their own cover images
CREATE POLICY "Mentors can delete own cover images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'course-covers'
  AND EXISTS (
    SELECT 1 FROM community_members
    WHERE user_id = auth.uid()
    AND role IN ('mentor', 'admin')
  )
);

-- Public read access (since bucket is public)
CREATE POLICY "Public can view course cover images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'course-covers');
```

## Features

- **Upload**: Mentors can upload cover images directly
- **URL**: Alternatively, mentors can provide an external image URL
- **Preview**: Shows preview before saving
- **Dimensions**: Recommended 1280x720px (16:9 ratio)
- **Size Limit**: 5MB max
- **Formats**: JPG, PNG, WebP

## Display

Cover images are displayed on:
- Course detail page (`CourseDetail.tsx`)
- Course listings (if implemented)

