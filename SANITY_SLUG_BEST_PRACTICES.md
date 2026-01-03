# Sanity CMS Slug Best Practices

This document outlines the best practices implemented for managing slugs in Sanity CMS to prevent soft 404 errors and ensure consistent URL routing.

## Overview

Slugs are URL-friendly identifiers used for routing. In Sanity CMS, slugs should be:
- **URL-safe**: Lowercase, hyphens only, no spaces or special characters
- **Consistent**: Same normalization logic across all routes
- **Validated**: Enforced at the schema level
- **Unique**: Each tag/category should have a unique slug

## Schema-Level Best Practices

### 1. Custom Slugify Function

We use a custom `slugify` function in our schemas to ensure consistent slug generation:

```typescript
function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')  // Remove special chars
    .replace(/[\s-]+/g, '-')         // Normalize spaces/hyphens
    .replace(/^-+|-+$/g, '')         // Remove leading/trailing hyphens
    .slice(0, 96);                    // Limit length
}
```

**Benefits:**
- Consistent slug format across all content
- Handles edge cases (multiple spaces, special characters)
- Prevents URL encoding issues

### 2. Slug Validation

Slugs are validated at the schema level to ensure they're URL-safe:

```typescript
validation: (Rule) =>
  Rule.required()
    .custom((slug) => {
      if (!slug?.current) return 'Slug is required';
      const slugValue = slug.current;
      // Must match: lowercase letters, numbers, hyphens only
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slugValue)) {
        return 'Slug must be lowercase with hyphens only';
      }
      return true;
    })
```

**Pattern:** `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`
- Starts with alphanumeric
- Can contain hyphens (but not at start/end)
- No spaces, uppercase, or special characters

### 3. Required Fields

Both `title` and `slug` are required fields with length constraints:
- **Title**: 1-100 characters
- **Slug**: 1-96 characters (URL-safe limit)

## Route-Level Best Practices

### 1. Slug Normalization

All route handlers use a consistent `normalizeSlug` function:

```typescript
function normalizeSlug(slug: string): string {
  return decodeURIComponent(slug)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}
```

**Why this matters:**
- Handles URL-encoded slugs (`indoor%20dog%20park` → `indoor-dog-park`)
- Case-insensitive matching
- Normalizes spaces to hyphens
- Handles legacy URLs with different formats

### 2. Matching Strategy

Routes use a three-tier matching strategy:

1. **Exact match**: Try the slug as-is
2. **Normalized match**: Compare normalized versions
3. **Name-based match**: Fallback to matching by name (normalized)

This ensures backward compatibility with existing URLs while enforcing new standards.

### 3. Proper 404 Handling

Routes return proper 404s (not soft 404s) when:
- Tag/category doesn't exist
- Tag/category has 0 posts
- Invalid slug format

```typescript
if (!tag) {
  return notFound(); // Returns 404 status
}

if (!tag.count || tag.count === 0) {
  return notFound(); // Prevents empty pages
}
```

## Common Issues and Solutions

### Issue 1: Spaces in URLs
**Problem:** `indoor dog park` → `/blog/category/indoor dog park` (invalid URL)

**Solution:** 
- Schema: Custom slugify converts spaces to hyphens
- Route: Normalization handles legacy URLs with spaces
- Redirect: Canonical redirect to proper slug format

### Issue 2: URL Encoding
**Problem:** `indoor%20dog%20park` → Not matching `indoor-dog-park`

**Solution:**
- Route normalization decodes URL-encoded slugs
- Comparison uses normalized versions

### Issue 3: Case Sensitivity
**Problem:** `Indoor-Dog-Park` vs `indoor-dog-park` → Different URLs

**Solution:**
- Schema: Slugs always lowercase
- Route: Case-insensitive matching via normalization

### Issue 4: Empty Pages (Soft 404s)
**Problem:** Tag/category exists but has no posts → Empty page → Soft 404

**Solution:**
- Check `count` property before rendering
- Return `notFound()` if count is 0
- Prevents Google from indexing empty pages

## Content Editor Guidelines

When creating tags/categories in Sanity Studio:

1. **Use descriptive titles**: "Indoor Dog Park" (not "indoor-dog-park")
2. **Let Sanity generate the slug**: Click "Generate" button
3. **Review the slug**: Ensure it's URL-friendly
4. **Edit if needed**: Manually adjust slug if auto-generation is incorrect
5. **Avoid special characters**: The slugify function handles this, but be aware

### Examples

| Title | Generated Slug | Status |
|-------|---------------|--------|
| "Indoor Dog Park" | `indoor-dog-park` | ✅ Good |
| "Dog Daycare" | `dog-daycare` | ✅ Good |
| "City Guides" | `city-guides` | ✅ Good |
| "Las Vegas, Nevada" | `las-vegas-nevada` | ✅ Good (comma removed) |
| "Dog's Playground" | `dogs-playground` | ✅ Good (apostrophe removed) |

## Migration Notes

### Existing Content

If you have existing tags/categories with non-standard slugs:

1. **Update in Sanity Studio**: Edit each item and regenerate the slug
2. **Add redirects**: Legacy routes (`/tag/...`, `/category/...`) redirect to `/blog/tag/...` and `/blog/category/...`
3. **Normalization handles legacy URLs**: Routes can match old formats via normalization

### Testing

After updating schemas:

1. Create a test tag/category in Sanity Studio
2. Verify slug is generated correctly
3. Test URL routing: `/blog/tag/[slug]`
4. Test legacy routes: `/tag/[slug]` (should redirect)
5. Test edge cases: spaces, special chars, URL encoding

## Next.js Best Practices

### Server-Side Rendering (SSR)

**Best Practice:** Fetch all data on the server, not in client components.

**Why:**
- ✅ Better SEO (content is in initial HTML)
- ✅ Faster initial page load (no loading states)
- ✅ Better performance (no client-side API calls)
- ✅ Works without JavaScript

**Implementation:**
- Use server components (default in Next.js App Router)
- Call `getCachedPosts()` directly from server components
- Avoid client-side `useEffect` for data fetching
- Only use client components for interactivity (forms, animations)

**Example (Good):**
```typescript
// Server component - fetches data on server
export default async function TagPage({ params }) {
  const tag = await getTag(params.slug);
  const blogData = await getCachedPosts({ tag: tag.slug });
  // Render directly - no loading state needed
  return <div>{/* posts */}</div>;
}
```

**Example (Bad):**
```typescript
// Client component - fetches data in browser
'use client';
export default function TagPage({ tag }) {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch('/api/blog?tag=' + tag.slug).then(...);
  }, []);
  // Shows loading state, slower, worse SEO
}
```

### API Routes

**When to use:**
- ✅ External API consumers (mobile apps, third-party integrations)
- ✅ Webhooks or server-to-server communication
- ❌ NOT for internal Next.js page components

**Best Practice:** Server components should call data functions directly, not through API routes.

## Summary

**Key Principles:**
1. ✅ Always use lowercase, hyphenated slugs
2. ✅ Validate at schema level
3. ✅ Normalize at route level for backward compatibility
4. ✅ Return proper 404s for missing/empty content
5. ✅ Use consistent normalization functions
6. ✅ **Fetch data server-side (SSR) for better performance and SEO**

**Files Updated:**
- `sanity/schemas/category.ts` - Added custom slugify and validation
- `sanity/schemas/tag.ts` - Added custom slugify and validation
- `src/app/blog/tag/[slug]/page.tsx` - Server-side rendering, improved slug normalization
- `src/app/blog/category/[slug]/page.tsx` - Server-side rendering, improved slug normalization
- `src/app/tag/[slug]/page.tsx` - Added normalization for legacy routes
- `src/app/category/[slug]/page.tsx` - Added normalization for legacy routes
- `src/app/api/blog/route.ts` - API route for external consumers (optional)

**Architecture Improvements:**
- ✅ Removed client-side data fetching from tag/category pages
- ✅ All data fetched server-side for better performance
- ✅ No loading states needed (content in initial HTML)
- ✅ Better SEO (content crawlable by search engines)
- ✅ Faster page loads (no client-side API calls)

These changes ensure:
- Consistent slug format across all content
- Proper handling of legacy URLs
- Prevention of soft 404 errors
- Better SEO and user experience
- **Optimal performance with server-side rendering**

