// Rate limiting and security middleware for blog API endpoints

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  message: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
  lastRequest: number;
}

export class RateLimiter {
  private static instances: Map<string, RateLimiter> = new Map();
  private requests: Map<string, RateLimitEntry> = new Map();
  private config: RateLimitConfig;
  private cleanupInterval: NodeJS.Timeout;

  constructor(config: RateLimitConfig) {
    this.config = config;
    // Clean up old entries periodically
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, Math.min(this.config.windowMs, 60000)); // Cleanup at least every minute
  }

  static getInstance(key: string, config: RateLimitConfig): RateLimiter {
    if (!this.instances.has(key)) {
      this.instances.set(key, new RateLimiter(config));
    }
    return this.instances.get(key)!;
  }

  // Check if request is allowed
  check(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = this.requests.get(identifier);

    if (!entry || now > entry.resetTime) {
      // New entry or expired window
      const newEntry: RateLimitEntry = {
        count: 1,
        resetTime: now + this.config.windowMs,
        lastRequest: now,
      };

      this.requests.set(identifier, newEntry);

      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime: newEntry.resetTime,
      };
    }

    // Existing entry within window
    if (entry.count >= this.config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }

    entry.count++;
    entry.lastRequest = now;

    return {
      allowed: true,
      remaining: this.config.maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  // Clean up expired entries
  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.requests.entries()) {
      if (now > entry.resetTime) {
        this.requests.delete(key);
      }
    }
  }

  // Get current stats
  getStats(): { totalEntries: number; activeRequests: number } {
    const now = Date.now();
    let activeRequests = 0;

    for (const entry of this.requests.values()) {
      if (now <= entry.resetTime) {
        activeRequests += entry.count;
      }
    }

    return {
      totalEntries: this.requests.size,
      activeRequests,
    };
  }

  // Clear all entries
  clear(): void {
    this.requests.clear();
  }

  // Destroy rate limiter
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.clear();
  }
}

// Security utilities
export class SecurityUtils {
  // Validate and sanitize input
  static sanitizeInput(input: string): string {
    if (typeof input !== 'string') {
      return '';
    }

    // Remove potentially dangerous characters
    return input
      .replace(/[<>]/g, '')
      .trim()
      .substring(0, 1000); // Limit length
  }

  // Validate request origin
  static isValidOrigin(request: Request): boolean {
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_BASE_URL,
      'https://your-domain.com',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
    ].filter((origin): origin is string => Boolean(origin));

    // Check origin header
    if (origin) {
      return allowedOrigins.includes(origin);
    }

    // Check referer header as fallback
    if (referer) {
      return allowedOrigins.some(allowed => referer!.startsWith(allowed));
    }

    // Allow same-origin requests
    return true;
  }

  // Check for suspicious patterns
  static detectSuspiciousActivity(request: Request): {
    isSuspicious: boolean;
    reasons: string[];
  } {
    const reasons: string[] = [];
    const userAgent = request.headers.get('user-agent') || '';
    const url = new URL(request.url);

    // Check for missing user agent
    if (!userAgent) {
      reasons.push('Missing user agent');
    }

    // Check for common bot patterns
    const botPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
    ];

    if (botPatterns.some(pattern => pattern.test(userAgent))) {
      reasons.push('Suspicious user agent pattern');
    }

    // Check for unusual request size
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 1024 * 1024) { // 1MB
      reasons.push('Request too large');
    }

    // Check for suspicious query parameters
    const suspiciousParams = ['callback', 'jsonp', 'redirect'];
    for (const param of suspiciousParams) {
      if (url.searchParams.has(param)) {
        reasons.push(`Suspicious parameter: ${param}`);
      }
    }

    return {
      isSuspicious: reasons.length > 0,
      reasons,
    };
  }

  // Generate client fingerprint
  static generateFingerprint(request: Request): string {
    const userAgent = request.headers.get('user-agent') || '';
    const acceptLanguage = request.headers.get('accept-language') || '';
    const acceptEncoding = request.headers.get('accept-encoding') || '';

    // Create a hash from common headers
    const fingerprint = [userAgent, acceptLanguage, acceptEncoding].join('|');

    // Simple hash function (in production, use crypto.createHash)
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    return Math.abs(hash).toString(16);
  }
}

// Rate limiting configurations for different endpoints
export const RATE_LIMIT_CONFIGS = {
  // Blog posts - more permissive for reading
  blogPosts: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    message: 'Too many requests to blog posts, please try again later.',
  },

  // Search - more restrictive to prevent abuse
  blogSearch: {
    windowMs: 1 * 60 * 1000, // 1 minute
    maxRequests: 30,
    message: 'Too many search requests, please try again later.',
  },

  // Categories and tags - moderate
  blogTaxonomy: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 50,
    message: 'Too many taxonomy requests, please try again later.',
  },

  // Newsletter signup - very restrictive
  newsletterSignup: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3,
    message: 'Too many newsletter signup attempts, please try again later.',
  },
};

// Middleware function for Next.js API routes
export function createRateLimitMiddleware(config: RateLimitConfig) {
  const limiter = RateLimiter.getInstance('default', config);

  return async (request: Request): Promise<{
    success: boolean;
    headers?: Record<string, string>;
    error?: { message: string; retryAfter?: number };
  }> => {
    // Security checks
    if (!SecurityUtils.isValidOrigin(request)) {
      return {
        success: false,
        error: { message: 'Invalid origin' },
      };
    }

    const suspicious = SecurityUtils.detectSuspiciousActivity(request);
    if (suspicious.isSuspicious) {
      console.warn('Suspicious activity detected:', suspicious.reasons);
      // You might want to implement more sophisticated handling here
    }

    // Generate client identifier
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';

    const fingerprint = SecurityUtils.generateFingerprint(request);
    const identifier = `${ip}-${fingerprint}`;

    // Check rate limit
    const result = limiter.check(identifier);

    if (!result.allowed) {
      const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);

      return {
        success: false,
        headers: {
          'X-RateLimit-Limit': config.maxRequests.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
          'Retry-After': retryAfter.toString(),
        },
        error: {
          message: config.message,
          retryAfter,
        },
      };
    }

    return {
      success: true,
      headers: {
        'X-RateLimit-Limit': config.maxRequests.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
      },
    };
  };
}

// Usage example in API routes:
export async function applyRateLimit(request: Request, configKey: keyof typeof RATE_LIMIT_CONFIGS) {
  const config = RATE_LIMIT_CONFIGS[configKey];
  const middleware = createRateLimitMiddleware(config);

  return await middleware(request);
}