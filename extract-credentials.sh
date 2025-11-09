#!/bin/bash

echo "🔑 Extracting Supabase Credentials for Project: jmvgnrwqcjtrudadxttq"
echo "================================================================"

# Using Supabase CLI to get project info
echo "Getting project information..."

# Try to get project details
supabase projects show --ref jmvgnrwqcjtrudadxttq 2>/dev/null || {
    echo "Attempting alternative method..."

    # If that doesn't work, let's construct the URLs and prompt for keys
    echo ""
    echo "📋 Your Project Details:"
    echo "Project URL: https://jmvgnrwqcjtrudadxttq.supabase.co"
    echo ""
    echo "🔑 To get your API keys:"
    echo "1. Go to: https://supabase.com/dashboard/project/jmvgnrwqcjtrudadxttq/settings/api"
    echo "2. Copy the 'anon public' and 'service_role' keys"
    echo ""

    # Create the URL and ask for keys
    echo "💾 Let's set up what we know:"

    # Update the API URL
    sed -i '' 's|NEXT_PUBLIC_SUPABASE_URL=.*|NEXT_PUBLIC_SUPABASE_URL=https://jmvgnrwqcjtrudadxttq.supabase.co|' /Users/mahendrabalal/Desktop/new_indoordogpark/.env.local

    echo "✅ Updated API URL in .env.local"
    echo ""
    echo "🔑 Please enter your API keys:"

    read -p "Anon Public Key: " anon_key
    read -p "Service Role Key: " service_key

    if [ ! -z "$anon_key" ]; then
        sed -i '' "s|NEXT_PUBLIC_SUPABASE_ANON_KEY=.*|NEXT_PUBLIC_SUPABASE_ANON_KEY=$anon_key|" /Users/mahendrabalal/Desktop/new_indoordogpark/.env.local
        echo "✅ Updated anon key"
    fi

    if [ ! -z "$service_key" ]; then
        sed -i '' "s|SUPABASE_SERVICE_ROLE_KEY=.*|SUPABASE_SERVICE_ROLE_KEY=$service_key|" /Users/mahendrabalal/Desktop/new_indoordogpark/.env.local
        echo "✅ Updated service role key"
    fi

    echo ""
    echo "🎉 Setup complete! Your .env.local has been updated."
    echo "🚀 Restart your dev server: npm run dev"
}