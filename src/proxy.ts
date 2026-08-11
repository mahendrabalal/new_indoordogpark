import { NextResponse, type NextRequest } from 'next/server';

function applyNoIndexHeader(response: NextResponse) {
  // Best practice: never allow Vercel Preview/Dev deployments to be indexed.
  // Vercel provides VERCEL_ENV = 'production' | 'preview' | 'development'
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  return response;
}

export async function proxy(request: NextRequest) {
  // Redirect non-www to www for SEO (301 permanent redirect)
  // Industry best practice: Consolidate link equity and prevent duplicate content
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // Only redirect in production to avoid breaking local development
  // Check if it's the production domain without www
  if (
    process.env.NODE_ENV === 'production' &&
    hostname === 'indoordogpark.org'
  ) {
    // Preserve protocol (https), path, and query parameters
    url.host = 'www.indoordogpark.org';
    return applyNoIndexHeader(NextResponse.redirect(url, 301));
  }

  // Fix common 404 issues with proper 301 redirects
  const redirectMap: Record<string, string> = {
    '/cities/california': '/',
    '/cities/steiner-st-&': '/cities/steiner-st',
    '/parks/indoor-dog-park-california-california': '/parks/indoor-dog-park-california',
    '/day': '/',
    '/help': '/contact',
  };

  // Check for exact path matches
  if (redirectMap[pathname]) {
    const redirectUrl = new URL(url);
    redirectUrl.pathname = redirectMap[pathname];
    return applyNoIndexHeader(NextResponse.redirect(redirectUrl, 301));
  }

  // Fix malformed URLs with special characters
  if (pathname.includes('steiner-st-&')) {
    const cleanUrl = new URL(url);
    cleanUrl.pathname = pathname.replace('steiner-st-&', 'steiner-st');
    return applyNoIndexHeader(NextResponse.redirect(cleanUrl, 301));
  }

  // Fix trailing slash issues (remove trailing slash except for root)
  if (pathname.length > 1 && pathname.endsWith('/')) {
    const cleanUrl = new URL(url);
    cleanUrl.pathname = pathname.slice(0, -1);
    // Check if this would cause a redirect loop
    if (!redirectMap[cleanUrl.pathname]) {
      return applyNoIndexHeader(NextResponse.redirect(cleanUrl, 301));
    }
  }

  // Handle double-slug patterns (e.g., /parks/some-park-marietta-marietta -> /parks/some-park-marietta)
  if (pathname.startsWith('/parks/')) {
    const parkSlug = pathname.replace('/parks/', '');
    const parts = parkSlug.split('-');
    if (parts.length >= 2) {
      const last = parts[parts.length - 1];
      const secondLast = parts[parts.length - 2];
      if (last === secondLast && last.length > 2) {
        const cleanUrl = new URL(url);
        cleanUrl.pathname = `/parks/${parts.slice(0, -1).join('-')}`;
        return applyNoIndexHeader(NextResponse.redirect(cleanUrl, 301));
      }
    }

    // Handle city-suffix mismatches (e.g., play-pals-nyc-new-york -> play-pals-nyc)
    // Common suffixes that might be double-appended
    const citySuffixes = ['new-york', 'los-angeles', 'san-francisco', 'san-diego', 'chicago', 'houston', 'phoenix', 'philadelphia', 'san-antonio', 'dallas', 'seattle', 'portland', 'austin'];
    for (const suffix of citySuffixes) {
      const doubleSuffix = `-${suffix}-${suffix}`;
      if (parkSlug.includes(doubleSuffix)) {
        const cleanUrl = new URL(url);
        cleanUrl.pathname = `/parks/${parkSlug.replace(doubleSuffix, `-${suffix}`)}`;
        return applyNoIndexHeader(NextResponse.redirect(cleanUrl, 301));
      }
    }
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
  response = applyNoIndexHeader(response);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - studio (Sanity Studio)
     * - sitemap.xml (SEO sitemap)
     * - sitemap-*.xml (SEO sitemap index children)
     * - robots.txt (robots file)
     * - .txt files (IndexNow key file and other text files)
     * - .xml files (sitemaps and other XML endpoints)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|studio|sitemap\\.xml|sitemap-[^/]+\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|txt|xml)$).*)',
  ],
};
