# Sitemap Troubleshooting Guide

## Current Issue

**Problem:** Production sitemap only shows 29 URLs instead of 744
- Local build: ✅ 744 URLs (529 parks + 196 cities)
- Production: ❌ 29 URLs (static pages only)

## Root Cause Analysis

The sitemap generation is likely failing silently in production when trying to load parks/cities. Possible causes:

1. **File Path Issues:** `process.cwd()` might resolve differently in Vercel
2. **Timeout:** Loading 529 parks + 196 cities might exceed Vercel's function timeout
3. **Memory Limits:** Large JSON files might hit memory constraints
4. **Build vs Runtime:** Sitemap might be generated at build time when files aren't available

## Fixes Applied

### Fix 1: Separated Error Handling
- Parks and cities now have independent try-catch blocks
- If one fails, the other can still be added
- Better error logging

### Fix 2: Force Runtime Generation
- Added `export const dynamic = 'force-dynamic'`
- Ensures sitemap generates at request time, not build time
- Files should be accessible at runtime

## Verification Steps

### 1. Check Vercel Deployment Logs

After deployment, check Vercel logs for sitemap generation:

```bash
# In Vercel dashboard → Deployments → Latest → Functions Logs
# Look for:
[sitemap] Processing X parks into sitemap
[sitemap] Added X park pages to sitemap
[sitemap] Added X city pages to sitemap
```

### 2. Test Production Sitemap

After deployment completes (2-5 minutes):

```bash
# Check total URLs
curl -s https://www.indoordogpark.org/sitemap.xml | grep -c "<loc>"

# Should show ~744, not 29

# Check for park URLs
curl -s https://www.indoordogpark.org/sitemap.xml | grep "/parks/" | wc -l

# Should show ~529
```

### 3. Check for Errors

Look for error messages in the sitemap:
- `[sitemap] No parks loaded`
- `[sitemap] Failed to read California parks`
- `[sitemap] Error building park sitemap entries`

## Alternative Solutions

If the issue persists, consider:

### Option 1: Sitemap Index (Multiple Sitemaps)

Split into multiple sitemaps:
- `sitemap-static.xml` - Static pages
- `sitemap-parks.xml` - All park pages
- `sitemap-cities.xml` - All city pages
- `sitemap-blog.xml` - Blog posts
- `sitemap.xml` - Index file pointing to all

**Benefits:**
- Smaller files = faster generation
- Less likely to timeout
- Easier to debug which section fails

### Option 2: Static Sitemap Generation

Generate sitemap at build time and save to `public/sitemap.xml`:

```typescript
// scripts/generate-sitemap.ts
// Run during build to generate static sitemap
```

**Benefits:**
- No runtime generation needed
- Guaranteed to work
- Faster response times

### Option 3: API Route for Sitemap

Create `/api/sitemap` route that generates sitemap on-demand:

```typescript
// src/app/api/sitemap/route.ts
export async function GET() {
  // Generate sitemap
  // Return XML
}
```

**Benefits:**
- More control over generation
- Can add caching
- Easier to debug

## Next Steps

1. ✅ **Wait for deployment** (2-5 minutes after push)
2. ✅ **Test production sitemap** (check URL count)
3. ✅ **Check Vercel logs** (look for sitemap generation messages)
4. ⏳ **If still 29 URLs:** Check logs for errors
5. ⏳ **If errors found:** Implement one of the alternative solutions above

## Expected Timeline

- **Deployment:** 2-5 minutes
- **Sitemap generation:** Should work immediately after deployment
- **Search engine discovery:** 24-48 hours after resubmission

## Monitoring

After deployment, monitor:

1. **Vercel Function Logs:**
   - Check for sitemap generation logs
   - Look for errors or warnings

2. **Production Sitemap:**
   - Verify URL count increases
   - Check for park/city URLs

3. **Search Console:**
   - Resubmit sitemap after verification
   - Monitor "Discovered pages" count

---

**Last Updated:** January 2025  
**Status:** Fix Deployed - Awaiting Verification ⏳

