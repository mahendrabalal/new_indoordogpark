import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

function applyNoIndexHeader(response: NextResponse) {
  // Best practice: never allow Vercel Preview/Dev deployments to be indexed.
  // Vercel provides VERCEL_ENV = 'production' | 'preview' | 'development'
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  return response;
}

export async function middleware(request: NextRequest) {
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

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
  response = applyNoIndexHeader(response);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Only log auth info in debug mode or actual errors (not missing sessions)
  const shouldLogAuth =
    process.env.NODE_ENV !== 'production' &&
    process.env.NEXT_PUBLIC_ENABLE_AUTH_DEBUG === 'true';

  if (shouldLogAuth) {
    console.info('middleware: auth session', {
      user: user?.email || user?.id || 'anonymous',
      error: error?.message,
    });
  } else if (error && error.message !== 'Auth session missing!' && process.env.NODE_ENV !== 'production') {
    // Only log actual errors, not expected missing sessions for public routes
    console.warn('middleware: auth session error', error.message);
  }

  // Protect admin routes - industry best practice: middleware-level protection
  if (pathname.startsWith('/admin')) {
    // Check if user is authenticated
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user has admin role
    const userMetadata = user.user_metadata as { role?: string } | undefined;
    if (userMetadata?.role !== 'admin') {
      // Return 403 Forbidden instead of redirecting to home
      const forbiddenUrl = new URL('/403', request.url);
      return NextResponse.rewrite(forbiddenUrl);
    }
  }

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
