#!/bin/bash

# Deploy Edge Functions for StartSolo Community Platform

set -e

echo "🚀 Starting deployment..."

PROJECT_REF="<your-project-ref>"

# Check if logged in
if ! supabase projects list &> /dev/null; then
    echo ""
    echo "🔐 Please login to Supabase:"
    echo ""
    echo "Option 1: Get access token from https://supabase.com/dashboard/account/tokens"
    echo "Then run: export SUPABASE_ACCESS_TOKEN=your_token_here"
    echo ""
    echo "Option 2: Run in terminal: supabase login"
    echo ""
    read -p "Press Enter after logging in..."
fi

echo ""
echo "🔗 Linking to project $PROJECT_REF..."
supabase link --project-ref "$PROJECT_REF"

echo ""
echo "📦 Step 1: Create Storage Bucket"
echo "⚠️  MANUAL STEP REQUIRED:"
echo "   1. Go to Supabase Dashboard → Storage"
echo "   2. Click 'New bucket'"
echo "   3. Name: certificates"
echo "   4. Public: Yes"
echo "   5. File size limit: 50MB"
echo "   6. Allowed MIME types: application/pdf"
echo ""
read -p "Press Enter after creating the bucket..."

echo ""
echo "📤 Step 2: Deploying generate-certificate-pdf function..."
supabase functions deploy generate-certificate-pdf

echo ""
echo "📤 Step 3: Deploying process-notifications function..."
supabase functions deploy process-notifications

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Add environment variables to Edge Functions (Dashboard → Edge Functions → Settings):"
echo "      - MAILGUN_API_KEY"
echo "      - MAILGUN_DOMAIN"
echo "      - MAILGUN_FROM_EMAIL"
echo "      - GUPSHUP_API_KEY (optional for now)"
echo "      - GUPSHUP_APP_NAME (optional for now)"
echo ""
echo "   2. Set up cron job for notifications (see supabase/functions/process-notifications/README.md)"
echo ""
echo "   3. Wait for DNS verification (24-48 hours)"
echo ""
echo "🎉 Done!"
