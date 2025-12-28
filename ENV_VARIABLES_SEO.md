# Environment Variables for SEO and Analytics

This document lists all environment variables used for SEO, analytics, and social media integration.

## Required Environment Variables

### Google Analytics 4
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```
- **Description**: Your Google Analytics 4 Measurement ID
- **Format**: Starts with `G-` followed by alphanumeric characters
- **Where to get it**: Google Analytics 4 Admin → Data Streams → Web Stream → Measurement ID
- **Example**: `G-ABC123XYZ`
- **Required**: No (analytics won't track if missing)

## Optional Environment Variables

### Social Media Links (Organization Schema)
```bash
NEXT_PUBLIC_SOCIAL_FACEBOOK=https://www.facebook.com/indoordogpark
NEXT_PUBLIC_SOCIAL_TWITTER=https://twitter.com/indoordogpark
NEXT_PUBLIC_SOCIAL_INSTAGRAM=https://www.instagram.com/indoordogpark
NEXT_PUBLIC_SOCIAL_LINKEDIN=https://www.linkedin.com/company/indoordogpark
NEXT_PUBLIC_SOCIAL_YOUTUBE=https://www.youtube.com/@indoordogpark
```
- **Description**: Social media profile URLs for Organization structured data
- **Format**: Full HTTPS URLs
- **Required**: No (Organization schema will omit `sameAs` if not provided)

### Google Site Verification
```bash
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code
```
- **Description**: Google Search Console verification code
- **Format**: Alphanumeric code provided by Google Search Console
- **Required**: No (verification meta tag won't be added if missing)

### Site URL
```bash
NEXT_PUBLIC_SITE_URL=https://www.indoordogpark.org
```
- **Description**: Base URL of your site (used in structured data and sitemaps)
- **Format**: Full HTTPS URL without trailing slash
- **Default**: `https://www.indoordogpark.org`
- **Required**: No (has default value)

## Setup Instructions

1. **Create a `.env.local` file** in your project root (this file is git-ignored)

2. **Add your environment variables**:
```bash
# Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Social Media Links
NEXT_PUBLIC_SOCIAL_FACEBOOK=https://www.facebook.com/indoordogpark
NEXT_PUBLIC_SOCIAL_TWITTER=https://twitter.com/indoordogpark
NEXT_PUBLIC_SOCIAL_INSTAGRAM=https://www.instagram.com/indoordogpark

# Google Site Verification
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code

# Site URL (optional, has default)
NEXT_PUBLIC_SITE_URL=https://www.indoordogpark.org
```

3. **For Vercel/Production**: Add these variables in your deployment platform's environment variable settings

4. **Restart your development server** after adding new environment variables

## Verification

- **Google Analytics**: Check that events are being tracked in GA4 Real-Time reports
- **Social Media Links**: Verify in page source that `sameAs` array appears in Organization schema
- **Core Web Vitals**: Events should appear in GA4 under Events → Web Vitals







































