#!/bin/bash

echo "🚀 Auto Supabase Setup Script"
echo "=============================="
echo ""

# Check if already linked
if supabase status > /dev/null 2>&1; then
    echo "✅ Supabase project is already linked!"
    echo ""
    echo "📋 Getting your credentials..."

    # Get status and extract credentials
    status_output=$(supabase status)

    # Extract values
    api_url=$(echo "$status_output" | grep "API URL" | awk '{print $3}')
    anon_key=$(echo "$status_output" | grep "anon key" | awk '{print $3}')
    service_key=$(echo "$status_output" | grep "service_role" | awk '{print $3}')

    echo ""
    echo "🔑 Found Credentials:"
    echo "API URL: $api_url"
    echo "Anon Key: ${anon_key:0:20}..."
    echo "Service Key: ${service_key:0:20}..."
    echo ""

    # Update .env.local
    if [ ! -z "$api_url" ] && [ ! -z "$anon_key" ] && [ ! -z "$service_key" ]; then
        echo "💾 Updating .env.local..."

        sed -i '' "s|NEXT_PUBLIC_SUPABASE_URL=.*|NEXT_PUBLIC_SUPABASE_URL=$api_url|" /Users/mahendrabalal/Desktop/new_indoordogpark/.env.local
        sed -i '' "s|NEXT_PUBLIC_SUPABASE_ANON_KEY=.*|NEXT_PUBLIC_SUPABASE_ANON_KEY=$anon_key|" /Users/mahendrabalal/Desktop/new_indoordogpark/.env.local
        sed -i '' "s|SUPABASE_SERVICE_ROLE_KEY=.*|SUPABASE_SERVICE_ROLE_KEY=$service_key|" /Users/mahendrabalal/Desktop/new_indoordogpark/.env.local

        echo "✅ Credentials updated successfully!"
        echo ""
        echo "🎉 Your login should work now! Restart your development server:"
        echo "npm run dev"
    else
        echo "❌ Could not extract all credentials. Please run 'supabase status' manually."
    fi

else
    echo "❌ No Supabase project linked yet."
    echo ""
    echo "Please run these commands first:"
    echo "1. supabase projects list"
    echo "2. supabase link --project-ref YOUR_PROJECT_REF"
    echo "3. Then run this script again: ./auto-supabase-setup.sh"
fi