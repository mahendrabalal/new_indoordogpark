# Quick Start Guide - List Your Park Feature

## 🚀 Get Started in 5 Minutes

### 1. Setup Database (One-time)

```bash
# Go to Supabase Dashboard SQL Editor
# Copy and run: supabase/migrations/create_park_listings_tables.sql
```

### 2. Start Development

```bash
npm run dev
```

### 3. Setup Stripe Webhooks (Local Testing)

```bash
# In a separate terminal
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### 4. Create Admin User

```sql
-- Run in Supabase SQL Editor (replace with your email)
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'your-email@example.com';
```

## 📍 Key URLs

- **List a Park**: http://localhost:3000/list-property
- **Dashboard**: http://localhost:3000/dashboard
- **Admin**: http://localhost:3000/admin

## 🧪 Test with Stripe

**Test Card**: `4242 4242 4242 4242`
**Expiry**: Any future date
**CVC**: Any 3 digits

## ✨ Features

- ✅ Free listing ($0/month)
- ✅ Featured listing ($9.99/month)
- ✅ Multi-step form with validation
- ✅ Stripe subscription management
- ✅ Admin approval workflow
- ✅ User dashboard
- ✅ Featured section on homepage

## 📖 Full Documentation

See [LISTING_FEATURE_SETUP.md](./LISTING_FEATURE_SETUP.md) for complete setup and testing guide.
