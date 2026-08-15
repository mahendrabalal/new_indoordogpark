#!/bin/bash

echo "⚡ Quick Supabase Keys Update"
echo "============================="
echo ""

read -p "Paste your ANON public key: " anon_key
read -p "Paste your SERVICE ROLE key: " service_key

if [ ! -z "$anon_key" ]; then
    sed -i '' "s|NEXT_PUBLIC_SUPABASE_ANON_KEY=.*|NEXT_PUBLIC_SUPABASE_ANON_KEY=$anon_key|" /Users/mahendrabalal/Desktop/new_indoordogpark/.env.local
    echo "✅ Anon key updated"
fi

if [ ! -z "$service_key" ]; then
    sed -i '' "s|SUPABASE_SERVICE_ROLE_KEY=.*|SUPABASE_SERVICE_ROLE_KEY=$service_key|" /Users/mahendrabalal/Desktop/new_indoordogpark/.env.local
    echo "✅ Service role key updated"
fi

echo ""
echo "🎉 All set! Your login should work now!"
echo "🚀 Restart your server: npm run dev"

echo ""
echo "📋 Your updated .env.local:"
grep -n "SUPABASE" /Users/mahendrabalal/Desktop/new_indoordogpark/.env.local