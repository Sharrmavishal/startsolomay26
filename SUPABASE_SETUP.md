# Supabase Setup Guide for Start Solo Community Platform

This guide will help you set up Supabase for the Start Solo Community Platform.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Your Supabase project URL and anon key

## Step 1: Create Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in:
   - **Organization**: Select or create an organization
   - **Name**: `start-solo-community` (or your preferred name)
   - **Database Password**: Create a strong password (save this securely)
   - **Region**: Choose closest to your users (e.g., `Asia Pacific (Mumbai)`)
4. Click "Create new project"
5. Wait 2-3 minutes for project provisioning

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (long JWT token)

## Step 3: Configure Environment Variables

1. Create a `.env` file in the project root (copy from `.env.example` if it exists)
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Important**: Never commit `.env` to git (it's already in `.gitignore`)

## Step 4: Enable Authentication

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Enable **Email** provider (should be enabled by default)
3. Configure redirect URLs:
   - Go to **Authentication** → **URL Configuration**
   - Add to **Redirect URLs**:
     - `http://localhost:5173/community/auth/callback` (for local development)
     - `http://localhost:5174/community/auth/callback` (backup port)
     - `http://localhost:5175/community/auth/callback` (backup port)
     - `https://startsolo.in/community/auth/callback` (production)
     - `https://*.netlify.app/community/auth/callback` (Netlify previews - optional)
4. Configure email templates if needed:
   - Go to **Authentication** → **Email Templates**
   - Customize confirmation, magic link, and password reset emails with Start Solo branding

## Step 5: Run Database Migrations

You have two options:

### Option A: Using Supabase CLI (Recommended)

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```
   (Find project ref in Settings → General → Reference ID)

4. Run migrations:
   ```bash
   supabase db push
   ```

### Option B: Using Supabase Dashboard

1. Go to **SQL Editor** in Supabase dashboard
2. Click **New Query**
3. Copy the entire contents of `supabase/migrations/20250101000000_community_platform.sql`
4. Paste into the SQL Editor
5. Click **Run** (or press Cmd/Ctrl + Enter)
6. Wait for migration to complete (should take ~30 seconds)

## Step 6: Configure Row Level Security (RLS)

The migration file already includes RLS policies, but verify they're enabled:

1. Go to **Table Editor** in Supabase dashboard
2. Click on any table (e.g., `community_members`)
3. Check that **RLS** shows as "Enabled"

## Step 7: Set Up Storage (Optional - for profile images)

1. Go to **Storage** in Supabase dashboard
2. Create a new bucket:
   - **Name**: `community-avatars`
   - **Public**: Yes (for public profile images)
   - **File size limit**: 5MB
   - **Allowed MIME types**: `image/jpeg, image/png, image/webp`

3. Create storage policies:
   ```sql
   -- Allow authenticated users to upload their own avatar
   CREATE POLICY "Users can upload own avatar"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'community-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

   -- Allow public read access
   CREATE POLICY "Public avatar access"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'community-avatars');
   ```

## Step 8: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:5173/community`
3. Try signing up with a test email
4. Check Supabase dashboard → **Authentication** → **Users** to see if user was created
5. Check **Table Editor** → `community_members` to see if profile was created

## Step 9: Configure Production Environment

For Netlify deployment:

1. Go to Netlify dashboard → Your site → **Site settings** → **Environment variables**
2. Add:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
3. Redeploy your site

## Troubleshooting

### "Supabase URL or Anon Key not found" warning
- Check that `.env` file exists and has correct variable names
- Restart your dev server after adding/updating `.env`
- For production, ensure environment variables are set in Netlify

### Migration fails with "relation already exists"
- Some tables might already exist from previous runs
- Either drop existing tables or modify migration to use `CREATE TABLE IF NOT EXISTS` (already done)

### Authentication not working
- Verify Email provider is enabled in Supabase dashboard
- Check email templates are configured
- Verify redirect URLs match your domain

### RLS blocking queries
- Check that user is authenticated: `auth.uid() IS NOT NULL`
- Verify RLS policies match your use case
- Temporarily disable RLS for testing (not recommended for production)

## Next Steps

After setup is complete:
1. Create your first admin user (manually in Supabase or via migration)
2. Test member onboarding flow
3. Configure email templates with Start Solo branding
4. Set up monitoring and backups in Supabase dashboard

## Support

For Supabase-specific issues, check:
- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Supabase GitHub: https://github.com/supabase/supabase
