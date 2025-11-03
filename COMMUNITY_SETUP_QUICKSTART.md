# Start Solo Community - Quick Start Guide

## ✅ What's Already Done

1. **Database Schema**: Complete migration file created (`supabase/migrations/20250101000000_community_platform.sql`)
2. **Supabase Client**: Configured and ready (`src/lib/supabase.ts`)
3. **Authentication System**: Login, signup, magic links all implemented
4. **Auth Components**: AuthGuard, LoginModal, AuthCallback, MemberOnboarding
5. **Community Page**: Basic structure with profile loading
6. **Routes**: `/community` and `/community/auth/callback` configured

## 🚀 Next Steps (Do These Now)

### 1. Run Database Migration (REQUIRED)

**Option A: Via Supabase Dashboard** (Easiest)
1. Go to your Supabase project: https://app.supabase.com
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open file: `supabase/migrations/20250101000000_community_platform.sql`
5. Copy ALL contents (entire file)
6. Paste into SQL Editor
7. Click **Run** (or press Cmd/Ctrl + Enter)
8. Wait ~30 seconds for completion
9. Verify: Go to **Table Editor** - you should see tables like `community_members`, `community_posts`, etc.

**Option B: Via CLI** (If you have Supabase CLI installed)
```bash
supabase link --project-ref your-project-ref
supabase db push
```

### 2. Configure Auth Redirect URLs (REQUIRED)

1. In Supabase dashboard → **Authentication** → **URL Configuration**
2. Under **Redirect URLs**, add:
   ```
   http://localhost:5173/community/auth/callback
   http://localhost:5174/community/auth/callback
   http://localhost:5175/community/auth/callback
   https://startsolo.in/community/auth/callback
   ```
3. Click **Save**

### 3. Test the Setup

1. **Start your dev server**:
   ```bash
   npm run dev
   ```

2. **Navigate to**: http://localhost:5173/community (or whatever port shows)

3. **Check the status widget** (bottom-right corner):
   - ✅ Green checkmarks = Everything working
   - ⚠️ Yellow/Red = See error messages

4. **Test Sign Up**:
   - Click "Sign Up" tab
   - Enter email and password
   - If email confirmation is required, check your email
   - Complete the onboarding form

5. **Test Magic Link**:
   - Click "Magic Link" tab
   - Enter your email
   - Check email for magic link
   - Click link → Should redirect to `/community/auth/callback` → Then to `/community`

## 🔍 Verification Checklist

After setup, verify:

- [ ] Database migration ran successfully (no errors in SQL Editor)
- [ ] Tables visible in Supabase **Table Editor**
- [ ] Redirect URLs configured in **Authentication → URL Configuration**
- [ ] Dev server starts without errors
- [ ] Status widget shows all green checkmarks (on `/community` page)
- [ ] Can sign up new user
- [ ] Can sign in with email/password
- [ ] Magic link email arrives and works
- [ ] Onboarding form appears for new users
- [ ] Profile created in `community_members` table (check Supabase dashboard)

## 🐛 Common Issues

### "Supabase URL or Anon Key not found"
- **Fix**: Restart dev server after adding `.env` file
- **Verify**: Check `.env` has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### "Tables not found" error
- **Fix**: Run the migration (Step 1 above)
- **Verify**: Check Supabase dashboard → Table Editor

### "Permission denied" or RLS errors
- **Fix**: Migration includes RLS policies, but verify:
  - Go to Supabase → Table Editor → Click any table → Check "RLS" shows "Enabled"

### Magic link redirects to wrong URL
- **Fix**: Add correct redirect URLs in Supabase dashboard (Step 2 above)
- **Note**: URL must match exactly (including `/community/auth/callback`)

### Auth callback not working
- **Check**: Browser console for errors
- **Verify**: Redirect URL matches what's configured in Supabase
- **Test**: Try password login first (simpler flow)

## 📝 Environment Variables Reminder

Your `.env` file should have:
```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important**: 
- Never commit `.env` to git (it's in `.gitignore`)
- For Netlify production: Add these as environment variables in Netlify dashboard

## 🎯 What Works Now

Once setup is complete:
- ✅ User sign up and sign in (email/password + magic link)
- ✅ Profile creation (onboarding flow)
- ✅ Session management (persistent login)
- ✅ Protected routes (AuthGuard)
- ✅ Database structure ready for all community features

## 🚧 What's Coming Next (Phase 2)

After Phase 1 is tested:
- Member directory and profiles
- Discussion forums
- Post creation and comments
- Real-time updates

## 📞 Need Help?

- Check `SUPABASE_SETUP.md` for detailed setup instructions
- Supabase docs: https://supabase.com/docs
- Check browser console for specific error messages
- Check Supabase dashboard → Logs for server-side errors
