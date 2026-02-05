import { headers } from 'next/headers';
import type { NextRequest } from 'next/server';

const LOCALHOST_FALLBACK = 'http://localhost:3000';

/**
 * Returns a fully qualified base URL for the current request context.
 * Prefers the incoming request origin so local dev ports are always in sync,
 * then falls back to the configured public URL or localhost.
 */
export async function getBaseUrl(request?: NextRequest) {
  if (request?.nextUrl?.origin) {
    return request.nextUrl.origin;
  }

  const headerList = await headers();
  const headerOrigin = headerList.get('origin');
  if (headerOrigin) {
    return headerOrigin;
  }

  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  return LOCALHOST_FALLBACK;
}
