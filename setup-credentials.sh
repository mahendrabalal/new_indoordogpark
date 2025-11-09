#!/bin/bash

# Quick credential setup script
echo "🚀 Dog Parks Directory - Credential Setup"
echo "=========================================="
echo ""

ENV_FILE="/Users/mahendrabalal/Desktop/new_indoordogpark/.env.local"

echo "📝 Please enter your credentials (press Enter to skip):"
echo ""

read -p "🔑 Supabase URL: " supabase_url
read -p "🔑 Supabase Anon Key: " anon_key
read -p "🔑 Supabase Service Role Key: " service_key

echo ""
echo "💳 Stripe Credentials:"
read -p "🔑 Stripe Secret Key: " stripe_secret
read -p "🔑 Stripe Publishable Key: " stripe_publishable

echo ""
echo "🌍 Google Places API:"
read -p "🔑 Google Places API Key: " google_key

echo ""
echo "📝 Updating .env.local..."

# Update the file
if [ ! -z "$supabase_url" ]; then
    sed -i '' "s|NEXT_PUBLIC_SUPABASE_URL=|NEXT_PUBLIC_SUPABASE_URL=$supabase_url|" "$ENV_FILE"
fi

if [ ! -z "$anon_key" ]; then
    sed -i '' "s|NEXT_PUBLIC_SUPABASE_ANON_KEY=|NEXT_PUBLIC_SUPABASE_ANON_KEY=$anon_key|" "$ENV_FILE"
fi

if [ ! -z "$service_key" ]; then
    sed -i '' "s|SUPABASE_SERVICE_ROLE_KEY=|SUPABASE_SERVICE_ROLE_KEY=$service_key|" "$ENV_FILE"
fi

if [ ! -z "$stripe_secret" ]; then
    sed -i '' "s|STRIPE_SECRET_KEY=|STRIPE_SECRET_KEY=$stripe_secret|" "$ENV_FILE"
fi

if [ ! -z "$stripe_publishable" ]; then
    sed -i '' "s|NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=|NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$stripe_publishable|" "$ENV_FILE"
fi

if [ ! -z "$google_key" ]; then
    sed -i '' "s|GOOGLE_PLACES_API_KEY=|GOOGLE_PLACES_API_KEY=$google_key|" "$ENV_FILE"
fi

echo ""
echo "✅ Credentials updated! 🎉"
echo ""
echo "🚀 Your login should work now! Restart your development server:"