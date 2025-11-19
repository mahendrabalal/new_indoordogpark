/**
 * IndexNow Integration
 * 
 * IndexNow is an open protocol that allows website owners to instantly inform
 * search engines about recently added, updated, or deleted URLs on their website.
 * This helps search engines discover and index new content more quickly.
 * 
 * Supported search engines: Bing, Yandex, Seznam.cz, Naver
 * 
 * API Documentation: https://www.indexnow.org/documentation
 */

const INDEXNOW_API_KEY = process.env.INDEXNOW_API_KEY || '8abd796f2d329b8de96a77235663de27';
const INDEXNOW_KEY_LOCATION = process.env.INDEXNOW_KEY_LOCATION || `${INDEXNOW_API_KEY}.txt`;
const INDEXNOW_ENDPOINTS = [
  'https://api.indexnow.org/IndexNow',
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow',
];

/**
 * Submits a single URL to IndexNow
 * 
 * @param url - The full URL to submit (must be absolute)
 * @returns Promise<boolean> - True if submission was successful
 */
export async function submitUrlToIndexNow(url: string): Promise<boolean> {
  if (!url || !url.startsWith('http')) {
    console.error('[IndexNow] Invalid URL:', url);
    return false;
  }

  try {
    // IndexNow expects a POST request with JSON body containing the URL list
    const payload = {
      host: new URL(url).hostname,
      key: INDEXNOW_API_KEY,
      keyLocation: `https://${new URL(url).hostname}/${INDEXNOW_KEY_LOCATION}`,
      urlList: [url],
    };

    // Try submitting to the primary IndexNow endpoint
    // IndexNow protocol will forward to other search engines
    const response = await fetch(INDEXNOW_ENDPOINTS[0], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // IndexNow returns 200 for successful submission, 202 for accepted
    // Some endpoints may return 204 (No Content)
    const success = response.ok || response.status === 202 || response.status === 204;

    if (success) {
      console.log(`[IndexNow] Successfully submitted URL: ${url}`);
    } else {
      console.warn(`[IndexNow] Submission returned status ${response.status} for URL: ${url}`);
    }

    return success;
  } catch (error) {
    console.error('[IndexNow] Error submitting URL:', url, error);
    return false;
  }
}

/**
 * Submits multiple URLs to IndexNow in a single request
 * 
 * @param urls - Array of full URLs to submit (must be absolute)
 * @returns Promise<number> - Number of successfully submitted URLs
 */
export async function submitUrlsToIndexNow(urls: string[]): Promise<number> {
  if (!urls || urls.length === 0) {
    return 0;
  }

  // Filter out invalid URLs
  const validUrls = urls.filter((url) => url && url.startsWith('http'));

  if (validUrls.length === 0) {
    console.error('[IndexNow] No valid URLs provided');
    return 0;
  }

  // IndexNow supports up to 10,000 URLs per request, but we'll batch in chunks of 100
  // for better reliability
  const BATCH_SIZE = 100;
  let successCount = 0;

  for (let i = 0; i < validUrls.length; i += BATCH_SIZE) {
    const batch = validUrls.slice(i, i + BATCH_SIZE);
    
    try {
      // All URLs in a batch must be from the same host
      const hostname = new URL(batch[0]).hostname;
      const allSameHost = batch.every((url) => new URL(url).hostname === hostname);

      if (!allSameHost) {
        console.warn('[IndexNow] URLs in batch must be from same host, submitting individually');
        // Submit individually if not from same host
        for (const url of batch) {
          const success = await submitUrlToIndexNow(url);
          if (success) successCount++;
        }
        continue;
      }

      const payload = {
        host: hostname,
        key: INDEXNOW_API_KEY,
        keyLocation: `https://${hostname}/${INDEXNOW_KEY_LOCATION}`,
        urlList: batch,
      };

      const response = await fetch(INDEXNOW_ENDPOINTS[0], {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const success = response.ok || response.status === 202 || response.status === 204;

      if (success) {
        console.log(`[IndexNow] Successfully submitted batch of ${batch.length} URLs`);
        successCount += batch.length;
      } else {
        console.warn(`[IndexNow] Batch submission returned status ${response.status}, trying individually`);
        // Fallback to individual submission
        for (const url of batch) {
          const success = await submitUrlToIndexNow(url);
          if (success) successCount++;
        }
      }

      // Small delay between batches to avoid rate limiting
      if (i + BATCH_SIZE < validUrls.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error(`[IndexNow] Error submitting batch ${i}-${i + BATCH_SIZE}:`, error);
      // Try submitting individually as fallback
      for (const url of batch) {
        const success = await submitUrlToIndexNow(url);
        if (success) successCount++;
      }
    }
  }

  return successCount;
}

import { SITE_URL } from '@/lib/metadata';

/**
 * Submits a park URL to IndexNow when a park is approved or updated
 * 
 * @param slug - The park slug
 * @param baseUrl - The base URL of the site (defaults to SITE_URL)
 * @returns Promise<boolean> - True if submission was successful
 */
export async function submitParkToIndexNow(
  slug: string,
  baseUrl?: string
): Promise<boolean> {
  const parkUrl = `${baseUrl || SITE_URL}/parks/${slug}`;
  return submitUrlToIndexNow(parkUrl);
}

