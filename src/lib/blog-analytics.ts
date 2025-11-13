// Performance monitoring and analytics for the blog
import React from 'react';

interface PerformanceMetrics {
  pageLoadTime: number;
  apiResponseTime: number;
  contentRenderTime: number;
  imageLoadTime: number;
  errorCount: number;
  timestamp: number;
}

interface AnalyticsEvent {
  eventName: string;
  properties: Record<string, unknown>;
  timestamp: number;
  userId?: string;
  sessionId: string;
}

export class BlogAnalytics {
  private static instance: BlogAnalytics;
  private sessionId: string;
  private metrics: PerformanceMetrics[] = [];
  private events: AnalyticsEvent[] = [];
  private startTime: number = 0;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
  }

  static getInstance(): BlogAnalytics {
    if (!BlogAnalytics.instance) {
      BlogAnalytics.instance = new BlogAnalytics();
    }
    return BlogAnalytics.instance;
  }

  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Track page performance
  trackPageLoad(pageType: string, additionalData: Record<string, unknown> = {}) {
    if (typeof window === 'undefined') return;

    const loadTime = performance.now() - this.startTime;

    const metric: PerformanceMetrics = {
      pageLoadTime: loadTime,
      apiResponseTime: (additionalData.apiResponseTime as number) || 0,
      contentRenderTime: (additionalData.contentRenderTime as number) || 0,
      imageLoadTime: (additionalData.imageLoadTime as number) || 0,
      errorCount: 0,
      timestamp: Date.now(),
    };

    this.metrics.push(metric);

    // Send to analytics service
    this.sendEvent('page_load', {
      pageType,
      loadTime,
      userAgent: navigator.userAgent,
      url: window.location.href,
      ...additionalData,
    });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Blog Performance:', {
        pageType,
        loadTime: `${loadTime.toFixed(2)}ms`,
        ...additionalData,
      });
    }
  }

  // Track API performance
  trackApiCall(endpoint: string, responseTime: number, success: boolean, error?: Error) {
    this.sendEvent('api_call', {
      endpoint,
      responseTime,
      success,
      errorType: error?.name,
      errorMessage: error?.message,
    });

    if (!success) {
      console.error('🚨 Blog API Error:', { endpoint, error });
    }
  }

  // Track user interactions
  trackInteraction(action: string, target: string, additionalData: Record<string, unknown> = {}) {
    this.sendEvent('user_interaction', {
      action,
      target,
      ...additionalData,
    });
  }

  // Track content engagement
  trackContentEngagement(slug: string, engagementType: string, value: number) {
    this.sendEvent('content_engagement', {
      slug,
      engagementType, // 'scroll_depth', 'time_on_page', 'share', 'comment'
      value,
    });
  }

  // Track search performance
  trackSearch(query: string, resultCount: number, responseTime: number) {
    this.sendEvent('blog_search', {
      query,
      resultCount,
      responseTime,
    });
  }

  // Track image performance
  trackImageLoad(imageUrl: string, loadTime: number, success: boolean) {
    this.sendEvent('image_load', {
      imageUrl,
      loadTime,
      success,
    });
  }

  // Error tracking
  trackError(error: Error, context: Record<string, unknown> = {}) {
    this.sendEvent('error', {
      errorName: error.name,
      errorMessage: error.message,
      errorStack: error.stack,
      ...context,
    });

    // Track in global error count
    const lastMetric = this.metrics[this.metrics.length - 1];
    if (lastMetric) {
      lastMetric.errorCount++;
    }
  }

  // Send events to analytics service
  private sendEvent(eventName: string, properties: Record<string, unknown>) {
    const event: AnalyticsEvent = {
      eventName,
      properties,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.getUserId(),
    };

    this.events.push(event);

    // Send to Google Analytics if available
    if (typeof window !== 'undefined' && 'gtag' in window) {
      try {
        const gtag = (window as Record<string, unknown>).gtag as (...args: unknown[]) => void;
        gtag('event', eventName, {
          custom_parameter_1: JSON.stringify(properties),
          session_id: this.sessionId,
        });
      } catch (error) {
        console.warn('Failed to send event to Google Analytics:', error);
      }
    }

    // Send to custom endpoint in production
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
      this.sendToCustomEndpoint(event);
    }
  }

  private getUserId(): string | undefined {
    // Get user ID from authentication context or localStorage
    if (typeof window !== 'undefined') {
      return localStorage.getItem('blog_user_id') || undefined;
    }
    return undefined;
  }

  private async sendToCustomEndpoint(event: AnalyticsEvent) {
    try {
      await fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.warn('Failed to send analytics event:', error);
    }
  }

  // Get performance summary
  getPerformanceSummary(): {
    averageLoadTime: number;
    totalErrors: number;
    sessionDuration: number;
    pagesViewed: number;
  } {
    const sessionDuration = Date.now() - this.startTime;
    const totalErrors = this.metrics.reduce((sum, metric) => sum + metric.errorCount, 0);
    const averageLoadTime = this.metrics.length > 0
      ? this.metrics.reduce((sum, metric) => sum + metric.pageLoadTime, 0) / this.metrics.length
      : 0;

    return {
      averageLoadTime,
      totalErrors,
      sessionDuration,
      pagesViewed: this.metrics.length,
    };
  }
}

// Performance monitoring hooks
export function useBlogPerformance(pageType: string) {
  const analytics = BlogAnalytics.getInstance();

  // Track page load on mount
  React.useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          analytics.trackPageLoad(pageType, {
            domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
            loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
            apiResponseTime: 0, // Will be updated by individual API calls
          });
        }
      });
    });

    observer.observe({ entryTypes: ['navigation'] });

    return () => observer.disconnect();
  }, [pageType, analytics]);

  // Track image loading
  const trackImageLoad = (src: string) => {
    const startTime = performance.now();

    const img = new Image();
    img.onload = () => {
      const loadTime = performance.now() - startTime;
      analytics.trackImageLoad(src, loadTime, true);
    };
    img.onerror = () => {
      const loadTime = performance.now() - startTime;
      analytics.trackImageLoad(src, loadTime, false);
    };
    img.src = src;
  };

  // Track scroll engagement
  const trackScrollDepth = React.useCallback(() => {
    let maxScroll = 0;
    const scrollThresholds = [25, 50, 75, 90];

    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );

      scrollThresholds.forEach((threshold) => {
        if (scrollPercent >= threshold && maxScroll < threshold) {
          maxScroll = threshold;
          analytics.trackContentEngagement(
            window.location.pathname.replace('/blog/', ''),
            'scroll_depth',
            threshold
          );
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [analytics]);

  return {
    trackImageLoad,
    trackScrollDepth,
    analytics,
  };
}

// API wrapper with performance tracking
export function withPerformanceTracking<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  operationName: string
) {
  return async (...args: T): Promise<R> => {
    const startTime = performance.now();
    const analytics = BlogAnalytics.getInstance();

    try {
      const result = await fn(...args);
      const responseTime = performance.now() - startTime;

      analytics.trackApiCall(operationName, responseTime, true);

      return result;
    } catch (error) {
      const responseTime = performance.now() - startTime;
      analytics.trackApiCall(operationName, responseTime, false, error as Error);

      throw error;
    }
  };
}

export default BlogAnalytics;