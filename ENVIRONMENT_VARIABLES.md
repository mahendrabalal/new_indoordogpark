# Environment Variables Guide

This guide explains all environment variables used in the Indoor Dog Park application.

## Setup Instructions

1. Copy this content to a `.env.local` file in the root directory
2. Replace placeholder values with your actual credentials
3. Never commit `.env.local` to version control (it's in `.gitignore`)

## Required Environment Variables

### Site Configuration

```env
# The canonical URL of your site (required for SEO)
NEXT_PUBLIC_SITE_URL=https://www.indoordogpark.org
```

**Usage:** Used in sitemap, robots.txt, canonical URLs, and structured data.

### SEO & Search Engine Verification

```env
# Google Search Console verification code
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-google-verification-code

# Bing Webmaster Tools verification code (optional)
NEXT_PUBLIC_BING_VERIFICATION=your-bing-verification-code

# Yandex verification code (optional, for international SEO)
NEXT_PUBLIC_YANDEX_VERIFICATION=your-yandex-verification-code
```

### IndexNow (Instant Search Engine Indexing)

```env
# IndexNow API key (auto-generated, already set up)
# Optional: Override if you want to use a different key
INDEXNOW_API_KEY=8abd796f2d329b8de96a77235663de27

# IndexNow key file location (auto-generated based on API key)
# Optional: Override if you want to use a different location
INDEXNOW_KEY_LOCATION=8abd796f2d329b8de96a77235663de27.txt
```

**What is IndexNow?**
- IndexNow is an open protocol that allows website owners to instantly inform search engines about recently added, updated, or deleted URLs.
- Supported search engines: Bing, Yandex, Seznam.cz, Naver
- Automatically submits park URLs when they are approved or updated.

**Setup is automatic:**
- The API key file is already created in `/public/8abd796f2d329b8de96a77235663de27.txt`
- The key file is accessible at `https://www.indoordogpark.org/8abd796f2d329b8de96a77235663de27.txt`
- URLs are automatically submitted when parks are approved via the admin panel

**To verify:**
1. Visit `https://www.indoordogpark.org/8abd796f2d329b8de96a77235663de27.txt` (should show the key)
2. Check Bing Webmaster Tools to verify URLs are being received
3. Monitor server logs for `[IndexNow]` messages

**For more details:** See `INDEXNOW_SETUP.md`

**How to get verification codes:**

1. **Google Search Console:**
   - Go to [Google Search Console](https://search.google.com/search-console)
   - Add your property
   - Choose "HTML tag" verification method
   - Copy the content value from the meta tag

2. **Bing Webmaster Tools:**
   - Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
   - Add your site
   - Choose "Meta tag" verification
   - Copy the content value

### Supabase (Database & Authentication)

```env
# Supabase project URL (public)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# Supabase anonymous key (public)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Supabase service role key (private - never expose to client)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**How to get Supabase credentials:**
1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to Settings > API
4. Copy the URL and keys

### Sanity CMS (Content Management)

```env
# Sanity project ID (public)
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id

# Sanity dataset (usually "production")
NEXT_PUBLIC_SANITY_DATASET=production

# Sanity API version (format: YYYY-MM-DD)
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01

# Sanity read token (for published content)
SANITY_API_READ_TOKEN=your-read-token

# Sanity write token (for Studio access)
SANITY_API_WRITE_TOKEN=your-write-token
```

**How to get Sanity credentials:**
1. Go to [Sanity.io Dashboard](https://www.sanity.io/manage)
2. Select your project
3. Project ID is shown in the project settings
4. Create API tokens in Settings > API

### Stripe (Payment Processing)

```env
# Stripe publishable key (public)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Stripe secret key (private - never expose)
STRIPE_SECRET_KEY=sk_test_...

# Stripe webhook secret (for webhook verification)
STRIPE_WEBHOOK_SECRET=whsec_...
```

**How to get Stripe credentials:**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to Developers > API keys
3. Copy publishable and secret keys
4. For webhook secret:
   - Go to Developers > Webhooks
   - Add endpoint
   - Copy the signing secret

### Resend (Email Service)

```env
# Resend API key (private - never expose)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# From email address for outreach emails
RESEND_FROM_EMAIL=IndoorDogPark <outreach@indoordogpark.org>

# Optional: API token for protecting outreach endpoint
OUTREACH_API_TOKEN=your-secure-random-token-here
```

**How to get Resend credentials:**
1. Sign up at [Resend.com](https://resend.com) (free tier: 3,000 emails/month)
2. Verify your domain OR use Resend's test domain for development
3. Go to API Keys in dashboard
4. Create a new API key
5. Copy the key (starts with `re_`)

**Usage:**
- Used for sending promotional emails to park owners
- Powers the outreach campaign system
- See `EMAIL_OUTREACH_GUIDE.md` for full setup instructions

### Optional: Google Places API / Google Maps API

```env
# Used for geocoding (address to coordinates) and data scraping scripts
# Either GOOGLE_PLACES_API_KEY or GOOGLE_MAPS_API_KEY will work
GOOGLE_PLACES_API_KEY=your-api-key
# OR
GOOGLE_MAPS_API_KEY=your-api-key
```

**How to get Google Maps API key:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the following APIs:
   - **Geocoding API** (required for automatic coordinate generation in property listings)
   - **Places API** (optional, for data scraping scripts)
4. Create credentials (API key)
5. Restrict the key to specific APIs and domains for security

**Note:** The geocoding feature in the property listing form automatically converts addresses to latitude/longitude coordinates. This requires either `GOOGLE_PLACES_API_KEY` or `GOOGLE_MAPS_API_KEY` to be set with Geocoding API enabled.

### Optional: Analytics

```env
# Google Analytics 4 measurement ID
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Tag Manager container ID
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

**How to get analytics IDs:**

1. **Google Analytics 4:**
   - Go to [Google Analytics](https://analytics.google.com/)
   - Create a GA4 property
   - Get measurement ID from Admin > Data Streams

2. **Google Tag Manager:**
   - Go to [Google Tag Manager](https://tagmanager.google.com/)
   - Create a container
   - Copy the container ID

### Description Generator (LLM-powered copy)

```env
# Preferred provider (optional—auto-detected from keys if omitted)
PARK_DESC_MODEL_PROVIDER=openai

# OpenAI-compatible API keys (either works; Z AI mirrors OpenAI endpoints)
OPENAI_API_KEY=sk-your-openai-key
Z_AI_API_KEY=b22bc319e6f54a5fb3fc25827e96bed6.3TBvNglKWe8GGPKN

# Model + tuning overrides (optional)
PARK_DESC_OPENAI_MODEL=gpt-4.1-mini
PARK_DESC_MODEL_TEMPERATURE=0.7
PARK_DESC_MAX_TOKENS=900
PARK_DESC_TARGET_CHARS=1500
PARK_DESC_MIN_CHARS=1450
PARK_DESC_MAX_CHARS=1650
```

**Usage notes:**

1. Set either `OPENAI_API_KEY` or `Z_AI_API_KEY`; the scripts automatically select the OpenAI flow when one of those values exists.
2. Leave `PARK_DESC_MODEL_PROVIDER` blank to let the tooling auto-detect (`openai` when OpenAI/Z AI keys exist, `anthropic` when only Anthropic keys exist).
3. Adjust the length/tuning variables to tweak copy size without editing code.
4. All description-generation scripts fall back to deterministic templates if no provider is configured.

### Optional: Error Tracking

```env
# Sentry DSN for error tracking
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

**How to get Sentry DSN:**
1. Go to [Sentry.io](https://sentry.io/)
2. Create a project
3. Copy the DSN from project settings

## Environment Variable Prefixes

### `NEXT_PUBLIC_*`
- **Exposed to the browser**
- Can be accessed in client-side code
- Use for public configuration only
- Never put secrets here

### No Prefix
- **Server-side only**
- Only accessible in server components and API routes
- Use for sensitive data (API keys, secrets)
- Safe for confidential information

## Example `.env.local` File

```env
# Site
NEXT_PUBLIC_SITE_URL=https://www.indoordogpark.org

# SEO
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=abc123xyz

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=xxx
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_READ_TOKEN=sk...
SANITY_API_WRITE_TOKEN=sk...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend (Email Service)
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=IndoorDogPark <outreach@indoordogpark.org>
OUTREACH_API_TOKEN=your-secure-random-token-here

# Optional: Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Vercel Deployment

When deploying to Vercel:

1. Go to Project Settings > Environment Variables
2. Add each variable with appropriate scope:
   - **Production**: Live site
   - **Preview**: Pull request previews
   - **Development**: Local development (optional)

3. **Important:** 
   - Add all `NEXT_PUBLIC_*` variables
   - Add all server-side secrets
   - Never commit actual values to Git

## Security Best Practices

1. ✅ **Never commit `.env.local` or `.env` files**
2. ✅ **Use different keys for development and production**
3. ✅ **Rotate secrets regularly**
4. ✅ **Restrict API keys to specific domains when possible**
5. ✅ **Use environment-specific Stripe keys (test vs. live)**
6. ✅ **Monitor usage of API keys**
7. ✅ **Revoke compromised keys immediately**

## Validation

To check if environment variables are set correctly:

```typescript
// Add to a utility file
export function validateEnv() {
  const required = [
    'NEXT_PUBLIC_SITE_URL',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
```

## Troubleshooting

### Environment variables not updating

**Solution:**
1. Restart the development server (`npm run dev`)
2. Clear `.next` cache: `rm -rf .next`
3. Rebuild: `npm run build`

### Variables undefined in browser

**Problem:** Server-side variable accessed in client

**Solution:**
- Add `NEXT_PUBLIC_` prefix for client-side access
- Or move logic to server component/API route

### Variables work locally but not in production

**Solution:**
1. Check Vercel environment variables are set
2. Ensure they're set for "Production" scope
3. Redeploy after adding variables

## Additional Resources

- [Next.js Environment Variables Docs](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)
- [Security Best Practices](https://nextjs.org/docs/authentication)

---

**Last Updated:** November 2025  
**Maintained by:** Indoor Dog Park Development Team

