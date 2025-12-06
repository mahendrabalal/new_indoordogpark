# Fix 404 Page Errors Plan

## Problem Analysis
Based on the 404 errors identified in Ahrefs, there are several categories of issues:

### 1. **City Pages 404s**
- `/cities/california` - California is a state, not a city
- `/cities/durham` - Park exists but city page might not be generated
- `/cities/steiner-st-&` - Malformed URL with special characters

### 2. **Park Pages 404s**
- `/parks/indoor-dog-park-california-california` - Duplicate state in slug
- `/parks/down-town-indoor-dog-park-durham` - Park exists but wrong slug format
- `/parks/alamo-square-dog-play-area` - Park exists but returning 404

### 3. **Blog Pages 404s**
- Duplicate URLs (with and without www subdomain)
- Posts may have been removed or URLs changed

### 4. **Redirect Issues**
- Missing www vs non-www canonicalization
- Incorrect slug generation in some cases

## Implementation Plan

### Phase 1: Fix Dynamic Route Generation

**File: `src/lib/parks-data.ts`**
1. Update `getAllCitySlugs()` to ensure all cities with parks have slugs
2. Fix slug generation to handle special characters properly
3. Ensure consistent slug format across the application

**File: `src/app/cities/[slug]/page.tsx`**
1. Improve error handling for city pages
2. Add fallback logic for malformed city names
3. Add redirect logic for state names mistakenly used as cities

### Phase 2: Implement 301 Redirects

**Create: `src/middleware.ts`**
1. Add middleware to handle common redirect patterns:
   - `/cities/california` → `/` (home page)
   - Fix malformed URLs with special characters
   - Enforce www canonicalization

**Create: `public/_redirects`**
1. Add static redirects for known 404s:
   ```
   /cities/california / 301
   /parks/indoor-dog-park-california-california /parks/indoor-dog-park-california 301
   /cities/steiner-st-& /cities/steiner-st 301
   ```

### Phase 3: Fix Park Slug Issues

**File: `src/lib/parks-data.ts`**
1. Update `getParkBySlug()` to handle slug variations
2. Add fallback logic for parks with similar names
3. Implement fuzzy matching for common slug issues

### Phase 4: Blog URL Consistency

**File: `next.config.js`**
1. Ensure proper canonical URL handling
2. Add trailing slash normalization

### Phase 5: Add Custom 404 Page Improvements

**File: `src/app/not-found.tsx`**
1. Create helpful 404 page with:
   - Search functionality
   - Popular cities/parks suggestions
   - Clear navigation back to main site

### Phase 6: Data Validation

**Create: `scripts/validate-urls.js`**
1. Script to check all park and city URLs
2. Identify broken internal links
3. Validate slug consistency

## Critical Files to Modify

1. **src/middleware.ts** - New file for URL canonicalization
2. **public/_redirects** - New file for static redirects
3. **src/lib/parks-data.ts** - Improve slug handling and matching
4. **src/app/cities/[slug]/page.tsx` - Better error handling
5. **src/app/not-found.tsx** - Improved 404 page

## Implementation Priority

1. **High Priority**: Fix middleware for www canonicalization and basic redirects
2. **High Priority**: Add static redirects file for known 404s
3. **Medium Priority**: Improve dynamic route error handling
4. **Low Priority**: Custom 404 page improvements

## Testing

1. Test all redirect patterns
2. Verify park pages load correctly
3. Check city pages generate properly
4. Validate blog post URLs are consistent
5. Test with and without www subdomain

## SEO Considerations

- Use 301 redirects for permanent URL changes
- Ensure canonical URLs point to correct versions
- Update sitemap to reflect correct URLs
- Monitor Google Search Console for any new 404s