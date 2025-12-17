#!/bin/bash

# Script to update Sanity Project ID in .env.local
echo "🔧 Sanity Project ID Updater"
echo "============================"
echo ""

ENV_FILE="/Users/mahendrabalal/Desktop/new_indoordogpark/.env.local"

# Check if .env.local exists, create if not
if [ ! -f "$ENV_FILE" ]; then
    echo "📝 Creating .env.local file..."
    touch "$ENV_FILE"
    echo "✅ Created .env.local"
fi

echo "Please enter your new Sanity Project ID:"
echo "(This is the 8-character ID you got when creating your new project)"
echo ""
read -p "New Project ID: " project_id

if [ -z "$project_id" ]; then
    echo "❌ Project ID cannot be empty!"
    exit 1
fi

# Remove any spaces from project ID
project_id=$(echo "$project_id" | tr -d ' ')

echo ""
echo "📝 Updating .env.local..."

# Function to update or add a line
update_env() {
    local key=$1
    local value=$2
    
    if grep -q "^${key}=" "$ENV_FILE"; then
        # Update existing line
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s|^${key}=.*|${key}=${value}|" "$ENV_FILE"
        else
            # Linux
            sed -i "s|^${key}=.*|${key}=${value}|" "$ENV_FILE"
        fi
        echo "✅ Updated ${key}"
    else
        # Add new line
        echo "${key}=${value}" >> "$ENV_FILE"
        echo "✅ Added ${key}"
    fi
}

# Update project ID
update_env "NEXT_PUBLIC_SANITY_PROJECT_ID" "$project_id"

# Ensure dataset is set
if ! grep -q "^NEXT_PUBLIC_SANITY_DATASET=" "$ENV_FILE"; then
    update_env "NEXT_PUBLIC_SANITY_DATASET" "production"
fi

echo ""
echo "✅ Sanity configuration updated successfully!"
echo ""
echo "📋 Your Sanity configuration:"
grep -n "SANITY" "$ENV_FILE" || echo "  (No Sanity variables found)"
echo ""
echo "🚀 Next steps:"
echo "1. Restart your development server: npm run dev"
echo "2. Navigate to: http://localhost:3000/studio"
echo "3. Log in with your new account (mahendrabalalport@gmail.com)"
echo ""



