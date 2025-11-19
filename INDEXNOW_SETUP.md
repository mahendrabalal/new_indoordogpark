# IndexNow Integration Setup Guide

## Overview

IndexNow is an open protocol that allows website owners to instantly inform search engines about recently added, updated, or deleted URLs on their website. This helps search engines discover and index new content more quickly than waiting for natural crawling.

## Supported Search Engines

- **Bing** - Microsoft's search engine
- **Yandex** - Russia's largest search engine
- **Seznam.cz** - Czech Republic's search engine
- **Naver** - South Korea's search engine

**Note:** Google does not currently support IndexNow but may in the future. You can still use Google Search Console for manual URL submission.

## Implementation Status

✅ **Complete** - IndexNow is fully integrated into the Indoor Dog Park application.

### What's Been Done

1. ✅ **API Key Generated** - A unique 32-character UTF-8 key has been generated
2. ✅ **Key File Hosted** - The key file is available at `/public/8abd796f2d329b8de96a77235663de27.txt`
3. ✅ **Utility Functions Created** - Functions in `src/lib/indexnow.ts` handle URL submission
4. ✅ **Auto-Submission Integrated** - Park URLs are automatically submitted when approved

## How It Works

### Step 1: Generate API Key ✅

An API key is needed to match the ownership of the domain with submitted URLs. The key must be:
- At least 8 characters
- UTF-8 encoded
- Unique to your domain

**Current key:** `8abd796f2d329b8de96a77235663de27`

### Step 2: Host Your API Key ✅

The key file must be hosted at the root of your website or another location within your host. The file should:
- Be accessible via HTTP/HTTPS
- Contain only the key (no other content)
- Have UTF-8 encoding

**Key file location:** `https://www.indoordogpark.org/8abd796f2d329b8de96a77235663de27.txt`

### Step 3: Submit URLs ✅

When a park is approved via the admin panel, the system automatically:
1. Constructs the full park URL: `https://www.indoordogpark.org/parks/[slug]`
2. Submits the URL to IndexNow endpoints
3. Logs the submission status (success/failure)

**Code location:** `src/app/api/admin/submissions/approve/route.ts`

### Step 4: Verify URLs ✅

Use Bing Webmaster Tools to verify if your URLs are received by search engines:

1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add your site if not already added
3. Navigate to "IndexNow" section
4. View submitted URLs and their status

## Technical Implementation

### Utility Functions

The IndexNow functionality is implemented in `src/lib/indexnow.ts`:

```typescript
// Submit a single URL
submitUrlToIndexNow(url: string): Promise<boolean>

// Submit multiple URLs in a single request
submitUrlsToIndexNow(urls: string[]): Promise<number>

// Submit a park URL (convenience function)
submitParkToIndexNow(slug: string, baseUrl?: string): Promise<boolean>
```

### Integration Points

**Park Approval:**
- Location: `src/app/api/admin/submissions/approve/route.ts`
- Triggers: When admin approves a park submission
- Action: Automatically submits park URL to IndexNow

### Request Format

The IndexNow API expects a POST request with JSON body:

```json
{
  "host": "www.indoordogpark.org",
  "key": "8abd796f2d329b8de96a77235663de27",
  "keyLocation": "https://www.indoordogpark.org/8abd796f2d329b8de96a77235663de27.txt",
  "urlList": [
    "https://www.indoordogpark.org/parks/example-park-slug"
  ]
}
```

### Response Codes

- **200 OK** - Submission successful
- **202 Accepted** - Submission accepted (also success)
- **204 No Content** - Submission successful (some endpoints)
- **400 Bad Request** - Invalid request format
- **403 Forbidden** - Invalid API key or key location
- **429 Too Many Requests** - Rate limit exceeded

## Environment Variables

Optional environment variables for customization:

```env
# Override the default API key (not recommended)
INDEXNOW_API_KEY=your-custom-key

# Override the key file location (not recommended)
INDEXNOW_KEY_LOCATION=your-custom-key.txt
```

**Default values:**
- `INDEXNOW_API_KEY`: `8abd796f2d329b8de96a77235663de27`
- `INDEXNOW_KEY_LOCATION`: `8abd796f2d329b8de96a77235663de27.txt`

## Testing

### Test Key File Accessibility

Visit the key file URL in your browser:
```
https://www.indoordogpark.org/8abd796f2d329b8de96a77235663de27.txt
```

You should see the key displayed (32 hexadecimal characters).

### Test URL Submission

1. **Approval Test:**
   - Submit a new park listing
   - Approve it via the admin panel
   - Check server logs for `[IndexNow]` messages
   - Verify the URL appears in Bing Webmaster Tools

2. **Manual Test:**
   - Use the utility function directly:
   ```typescript
   import { submitParkToIndexNow } from '@/lib/indexnow';
   await submitParkToIndexNow('test-park-slug');
   ```

### Check Logs

Look for IndexNow-related log messages in your server logs:
- `[IndexNow] Successfully submitted URL: ...`
- `[IndexNow] Error submitting URL: ...`
- `[IndexNow] Submission returned status X for URL: ...`

## Troubleshooting

### Key File Not Accessible

**Problem:** Key file returns 404 or is inaccessible.

**Solutions:**
1. Verify the file exists at `/public/8abd796f2d329b8de96a77235663de27.txt`
2. Check file permissions (should be readable)
3. Ensure the file contains only the key (no extra whitespace)
4. Verify the URL is accessible via HTTPS

### URLs Not Being Submitted

**Problem:** Park approvals don't trigger IndexNow submission.

**Solutions:**
1. Check server logs for errors
2. Verify the approval route includes IndexNow call
3. Check network connectivity to IndexNow endpoints
4. Verify the base URL is correct (`NEXT_PUBLIC_SITE_URL`)

### Submission Failures

**Problem:** IndexNow returns error status codes.

**Solutions:**
1. **400 Bad Request:** Check URL format (must be absolute HTTPS URLs)
2. **403 Forbidden:** Verify key file is accessible and key matches
3. **429 Too Many Requests:** Reduce submission frequency (already implemented with batching)
4. Check IndexNow service status

### URLs Not Appearing in Search Results

**Problem:** URLs are submitted but don't appear in search results.

**Solutions:**
1. IndexNow speeds up discovery, but indexing may still take time
2. Check Bing Webmaster Tools for crawl status
3. Ensure your site is verified in Bing Webmaster Tools
4. IndexNow is one signal; search engines may still need to crawl the page

## Best Practices

1. **Submit Only Changed URLs** - Only submit URLs that are new, updated, or deleted
2. **Batch Submissions** - Submit multiple URLs in one request when possible (up to 10,000)
3. **Don't Spam** - Don't submit the same URL repeatedly
4. **Monitor Logs** - Regularly check logs for submission errors
5. **Verify Key File** - Periodically verify the key file is accessible

## Rate Limits

IndexNow endpoints may have rate limits. The implementation includes:
- Batching of URLs (up to 100 per batch)
- Individual fallback if batch submission fails
- Small delays between batches (100ms)
- Non-blocking submission (approval succeeds even if IndexNow fails)

## Additional Resources

- [IndexNow Official Documentation](https://www.indexnow.org/documentation)
- [Bing IndexNow Documentation](https://www.bing.com/indexnow)
- [Yandex IndexNow Documentation](https://yandex.com/support/indexnow/)
- [IndexNow Protocol Specification](https://www.indexnow.org/specification)

## Future Enhancements

Potential improvements:
- [ ] Submit city pages when updated
- [ ] Submit blog posts when published
- [ ] Bulk submission for all parks on schedule
- [ ] Retry mechanism for failed submissions
- [ ] Submission tracking/analytics
- [ ] Support for URL removal (DELETE method)

---

**Last Updated:** January 2025  
**Maintained by:** Indoor Dog Park Development Team
