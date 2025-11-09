#!/bin/bash

# Script to update Supabase credentials in .env.local
echo "🔧 Supabase Credentials Updater"
echo "================================="
echo ""

# Function to update a line in .env.local
update_env() {
    local key=$1
    local value=$2
    local file="/Users/mahendrabalal/Desktop/new_indoordogpark/.env.local"

    if grep -q "^${key}=" "$file"; then
        sed -i '' "s|^${key}=.*|${key}=${value}|" "$file"
        echo "✅ Updated ${key}"
    else
        echo "${key}=${value}" >> "$file"
        echo "✅ Added ${key}"
    fi
}

echo "Please provide your Supabase credentials:"
echo "(Leave empty to skip any field)"
echo ""

read -p "Supabase Project URL (e.g., https://your-project.supabase.co): " supabase_url
read -p "Supabase Anon Key (starts with eyJ...): " anon_key
read -p "Supabase Service Role Key (starts with eyJ...): " service_role_key
read -p "Photos Bucket Name (default: park-submissions): " photos_bucket

echo ""
echo "Updating .env.local file..."

if [ ! -z "$supabase_url" ]; then
    update_env "NEXT_PUBLIC_SUPABASE_URL" "$supabase_url"
fi

if [ ! -z "$anon_key" ]; then
    update_env "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$anon_key"
fi

if [ ! -z "$service_role_key" ]; then
    update_env "SUPABASE_SERVICE_ROLE_KEY" "$service_role_key"
fi

if [ ! -z "$photos_bucket" ]; then
    update_env "SUPABASE_PHOTOS_BUCKET" "$photos_bucket"
else
    update_env "SUPABASE_PHOTOS_BUCKET" "park-submissions"
fi

echo ""
echo "✅ Credentials updated successfully!"
echo ""
echo "Your updated Supabase configuration:"
grep -n "SUPABASE" /Users/mahendrabalal/Desktop/new_indoordogpark/.env.local
echo ""
echo "🚀 You can now test the login functionality!"