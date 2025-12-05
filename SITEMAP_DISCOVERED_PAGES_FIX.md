# Fix: Google Search Console Shows "Discovered Pages: 0"

## Issue Summary

Google Search Console shows:
- ✅ **Status**: Success
- ✅ **Type**: Sitemap index
- ❌ **Discovered pages**: 0

This means Google can read your sitemap index, but isn't discovering any URLs from the child sitemaps.

## Common Causes

### 1. **Timing Issue (Most Likely)**
- **Symptom**: Sitemap just submitted today (Dec 2, 2025)
- **Cause**: Google needs time to crawl child sitemaps after reading the index
- **Solution**: Wait 24-48 hours for Google to process child sitemaps

### 2. **Empty Child Sitemaps**
- **Symptom**: Child sitemaps return 200 but contain 0 URLs
- **Cause**: Data loading failures, empty databases, or file read errors
- **Solution**: Check if sitemaps actually contain URLs (use diagnostic tool)

### 3. **Child Sitemap Errors**
- **Symptom**: Child sitemaps return 500 errors or timeouts
- **Cause**: Server errors, timeouts, or database connection issues
- **Solution**: Check Vercel logs for errors in sitemap routes

### 4. **Robots.txt Blocking**
- **Symptom**: Sitemaps are accessible but URLs are blocked
- **Cause**: robots.txt disallowing paths
- **Solution**: Verify robots.txt allows Googlebot to access sitemap URLs

### 5. **Invalid URLs**
- **Symptom**: URLs in sitemaps return 404 errors
- **Cause**: URLs don't match actual page routes
- **Solution**: Verify URLs are accessible

## Diagnostic Steps

### Step 1: Test Sitemap Accessibility

Run the diagnostic script to check if sitemaps contain URLs:

```bash
# Test production sitemaps
NEXT_PUBLIC_SITE_URL=https://www.indoordogpark.org node scripts/test-sitemap.js

# Test local sitemaps (if running dev server)
NEXT_PUBLIC_SITE_URL=http://localhost:3000 node scripts/test-sitemap.js
```

**Expected output:**
- Main sitemap index: Should show 4 child sitemaps
- Static sitemap: Should show ~20 URLs
- Parks sitemap: Should show ~500+ URLs
- Cities sitemap: Should show ~196 URLs
- Blog sitemap: Should show blog post URLs

### Step 2: Check Individual Sitemaps

Manually verify each child sitemap in browser:

1. **Static Pages**: `https://www.indoordogpark.org/sitemap-static.xml`
   - Should contain homepage, about, contact, etc.

2. **Parks**: `https://www.indoordogpark.org/sitemap-parks.xml`
   - Should contain all park URLs

3. **Cities**: `https://www.indoordogpark.org/sitemap-cities.xml`
   - Should contain all city page URLs

4. **Blog**: `https://www.indoordogpark.org/sitemap-blog.xml`
   - Should contain all blog post URLs

### Step 3: Check Vercel Logs

1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on latest deployment → Functions Logs
3. Search for `[sitemap]` messages
4. Look for errors in:
   - `[sitemap-parks]`
   - `[sitemap-cities]`
   - `[sitemap-blog]`
   - `[sitemap-static]`

### Step 4: Verify robots.txt

Check that robots.txt doesn't block sitemap URLs:

```bash
curl https://www.indoordogpark.org/robots.txt
```

**Verify:**
- Sitemap is listed: `Sitemap: https://www.indoordogpark.org/sitemap.xml`
- Googlebot can access `/parks/`, `/cities/`, `/blog/`

### Step 5: Test URL Accessibility

Pick a few URLs from your sitemap and verify they're accessible:

```bash
# Test a park URL
curl -I https://www.indoordogpark.org/parks/[park-slug]

# Test a city URL
curl -I https://www.indoordogpark.org/cities/[city-slug]

# Test blog URL
curl -I https://www.indoordogpark.org/blog/[post-slug]
```

All should return `200 OK`.

## Quick Fixes

### Fix 1: Request Re-indexing

In Google Search Console:
1. Go to **Sitemaps** section
2. Click on your sitemap
3. Click **"Request Indexing"** or wait 24-48 hours

### Fix 2: Verify Sitemap URLs Are Correct

Check that the sitemap index points to correct URLs:

```xml
<sitemap>
  <loc>https://www.indoordogpark.org/sitemap-static.xml</loc>
  ...
</sitemap>
```

All URLs should:
- Use HTTPS
- Match your production domain
- Be accessible (return 200)

### Fix 3: Check for Empty Sitemaps

If child sitemaps are empty, check:

1. **Parks sitemap empty?**
   - Verify `public/data/california.json` exists and has parks
   - Check database for approved park submissions
   - Look for errors in `getAllStaticParks()` function

2. **Cities sitemap empty?**
   - Verify `getAllCitySlugs()` returns city slugs
   - Check city data files

3. **Blog sitemap empty?**
   - Verify Sanity CMS connection
   - Check blog posts are published
   - Verify `getCachedPosts()` function works

### Fix 4: Force Sitemap Regeneration

If sitemaps are cached, force regeneration:

```bash
# In Vercel, trigger a redeploy or clear cache
# Or use revalidate API endpoint if you have one
```

## Long-term Solutions

### 1. Add Sitemap Health Check Endpoint

Create `/api/sitemap/health` to monitor sitemap status:

```typescript
// src/app/api/sitemap/health/route.ts
export async function GET() {
  const parks = await getParksSitemap();
  const cities = await getCitiesSitemap();
  const blog = await getBlogSitemap();
  const staticPages = await getStaticPagesSitemap();
  
  return Response.json({
    status: 'ok',
    counts: {
      parks: parks.length,
      cities: cities.length,
      blog: blog.length,
      static: staticPages.length,
      total: parks.length + cities.length + blog.length + staticPages.length,
    },
    timestamp: new Date().toISOString(),
  });
}
```

### 2. Add Error Logging

Add comprehensive logging to catch issues early:

```typescript
console.log(`[sitemap-parks] Generated sitemap with ${urls.length} URLs`);
```

### 3. Monitor Sitemap Generation

Set up alerts for:
- Empty sitemaps (0 URLs)
- Sitemap generation errors
- Timeout issues

## Expected Timeline

| Action | Timeframe |
|--------|-----------|
| Submit sitemap | Immediate |
| Google reads sitemap index | Within hours |
| Google crawls child sitemaps | 24-48 hours |
| Pages appear in Search Console | 1-7 days |
| Pages get indexed | 1-14 days |

## Verification Checklist

After fixing issues, verify:

- [ ] Main sitemap index is accessible
- [ ] All child sitemaps return 200 OK
- [ ] Child sitemaps contain URLs (not empty)
- [ ] URLs in sitemaps are accessible (200 OK)
- [ ] robots.txt doesn't block sitemap URLs
- [ ] No errors in Vercel logs
- [ ] Wait 24-48 hours for Google to process

## Next Steps

1. **Run diagnostic script**: `node scripts/test-sitemap.js`
2. **Check Vercel logs** for errors
3. **Wait 24-48 hours** if sitemaps are correct
4. **Request re-indexing** in Search Console if needed
5. **Monitor Search Console** over next few days

## Most Likely Cause

Given that the sitemap was just submitted today (Dec 2, 2025), the most likely cause is:

**⏰ Timing**: Google hasn't had time to crawl the child sitemaps yet.

**Recommendation**: 
1. Verify child sitemaps contain URLs (run diagnostic script)
2. Wait 24-48 hours
3. Check Search Console again
4. If still 0, investigate further using diagnostic steps above

---

**Last Updated**: December 2, 2025
**Status**: Sitemap index successfully submitted, waiting for child sitemap processing











