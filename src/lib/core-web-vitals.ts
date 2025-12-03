/**
 * Core Web Vitals monitoring and tracking
 * Implements Google's recommended Core Web Vitals measurement
 */

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'set' | 'event' | 'js',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
  }
}

type MetricType = 'CLS' | 'FCP' | 'LCP' | 'TTFB' | 'INP';

interface Metric {
  name: MetricType;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  entries: PerformanceEntry[];
}

/**
 * Get the rating for a Core Web Vitals metric
 */
function getRating(metricName: MetricType, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds: Record<MetricType, { good: number; poor: number }> = {
    CLS: { good: 0.1, poor: 0.25 },
    FCP: { good: 1800, poor: 3000 },
    LCP: { good: 2500, poor: 4000 },
    TTFB: { good: 800, poor: 1800 },
    INP: { good: 200, poor: 500 },
  };

  const threshold = thresholds[metricName];
  if (!threshold) return 'needs-improvement';

  if (value <= threshold.good) return 'good';
  if (value >= threshold.poor) return 'poor';
  return 'needs-improvement';
}

/**
 * Send Core Web Vitals to Google Analytics
 */
function sendToAnalytics(metric: Metric) {
  if (typeof window === 'undefined' || !('gtag' in window)) {
    return;
  }

  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!GA_MEASUREMENT_ID) {
    return;
  }

  window.gtag('event', metric.name, {
    event_category: 'Web Vitals',
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    event_label: metric.id,
    non_interaction: true,
    metric_rating: metric.rating,
    metric_value: metric.value,
  });
}

/**
 * Report Core Web Vitals to console in development
 */
function reportToConsole(metric: Metric) {
  if (process.env.NODE_ENV === 'development') {
    const emoji = {
      good: '✅',
      'needs-improvement': '⚠️',
      poor: '❌',
    }[metric.rating];

    console.log(`${emoji} Core Web Vital: ${metric.name}`, {
      value: metric.value.toFixed(2),
      rating: metric.rating,
    });
  }
}

/**
 * Initialize Core Web Vitals monitoring
 */
export function initCoreWebVitals() {
  if (typeof window === 'undefined') {
    return;
  }

    // Load web-vitals library dynamically to avoid blocking
    import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
      // Cumulative Layout Shift (CLS)
      onCLS((metric) => {
        const enhancedMetric: Metric = {
          ...metric,
          rating: getRating('CLS', metric.value),
        };
        sendToAnalytics(enhancedMetric);
        reportToConsole(enhancedMetric);
      });

      // First Contentful Paint (FCP)
      onFCP((metric) => {
        const enhancedMetric: Metric = {
          ...metric,
          rating: getRating('FCP', metric.value),
        };
        sendToAnalytics(enhancedMetric);
        reportToConsole(enhancedMetric);
      });

      // Largest Contentful Paint (LCP)
      onLCP((metric) => {
        const enhancedMetric: Metric = {
          ...metric,
          rating: getRating('LCP', metric.value),
        };
        sendToAnalytics(enhancedMetric);
        reportToConsole(enhancedMetric);
      });

      // Time to First Byte (TTFB)
      onTTFB((metric) => {
        const enhancedMetric: Metric = {
          ...metric,
          rating: getRating('TTFB', metric.value),
        };
        sendToAnalytics(enhancedMetric);
        reportToConsole(enhancedMetric);
      });

      // Interaction to Next Paint (INP) - new Core Web Vital (replaces FID)
      onINP((metric) => {
        const enhancedMetric: Metric = {
          ...metric,
          rating: getRating('INP', metric.value),
        };
        sendToAnalytics(enhancedMetric);
        reportToConsole(enhancedMetric);
      });
    }).catch((error) => {
      console.warn('Failed to load web-vitals library:', error);
    });
}

/**
 * Get current Core Web Vitals metrics (for debugging)
 */
export function getCurrentWebVitals(): Promise<Record<string, number>> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve({});
      return;
    }

    import('web-vitals')
      .then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
        const metrics: Record<string, number> = {};

        const promises: Promise<void>[] = [];

        promises.push(
          new Promise<void>((res) => {
            onCLS((metric) => {
              metrics.CLS = metric.value;
              res();
            });
          })
        );

        promises.push(
          new Promise<void>((res) => {
            onFCP((metric) => {
              metrics.FCP = metric.value;
              res();
            });
          })
        );

        promises.push(
          new Promise<void>((res) => {
            onLCP((metric) => {
              metrics.LCP = metric.value;
              res();
            });
          })
        );

        promises.push(
          new Promise<void>((res) => {
            onTTFB((metric) => {
              metrics.TTFB = metric.value;
              res();
            });
          })
        );

        promises.push(
          new Promise<void>((res) => {
            onINP((metric) => {
              metrics.INP = metric.value;
              res();
            });
          })
        );

        Promise.all(promises)
          .then(() => {
            resolve(metrics);
          })
          .catch((error) => {
            console.warn('Failed to collect Core Web Vitals metrics:', error);
            resolve(metrics); // Resolve with partial metrics if available
          });
      })
      .catch((error) => {
        console.warn('Failed to load web-vitals library:', error);
        resolve({}); // Resolve with empty metrics object on import failure
      });
  });
}

