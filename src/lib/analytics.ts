/**
 * Google Analytics 4 utility functions
 * Provides type-safe wrapper around gtag for tracking events
 */

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'set' | 'event' | 'js',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Track a page view
 */
export function trackPageView(path: string, title?: string) {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !('gtag' in window)) {
    return;
  }

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
    page_title: title,
  });
}

/**
 * Track a custom event
 */
export function trackEvent(
  eventName: string,
  parameters?: Record<string, unknown>
) {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !('gtag' in window)) {
    return;
  }

  window.gtag('event', eventName, parameters);
}

/**
 * Track search events
 */
export function trackSearch(query: string, resultCount?: number) {
  trackEvent('search', {
    search_term: query,
    ...(resultCount !== undefined && { result_count: resultCount }),
  });
}

/**
 * Track park interactions
 */
export function trackParkView(parkId: string, parkName: string, city: string) {
  trackEvent('view_park', {
    park_id: parkId,
    park_name: parkName,
    city: city,
  });
}

/**
 * Track city page views
 */
export function trackCityView(cityName: string, state: string, parkCount: number) {
  trackEvent('view_city', {
    city: cityName,
    state: state,
    park_count: parkCount,
  });
}

/**
 * Track form submissions
 */
export function trackFormSubmission(formName: string, success: boolean) {
  trackEvent(success ? 'form_submit_success' : 'form_submit_error', {
    form_name: formName,
  });
}

/**
 * Track external link clicks
 */
export function trackExternalLink(url: string, linkText?: string) {
  trackEvent('click_external_link', {
    link_url: url,
    link_text: linkText,
  });
}

/**
 * Track button clicks
 */
export function trackButtonClick(buttonName: string, location?: string) {
  trackEvent('click_button', {
    button_name: buttonName,
    ...(location && { location }),
  });
}

/**
 * Track favorites
 */
export function trackFavorite(action: 'add' | 'remove', parkId: string) {
  trackEvent('favorite_park', {
    action,
    park_id: parkId,
  });
}

/**
 * Track review submissions
 */
export function trackReviewSubmission(parkId: string, rating: number) {
  trackEvent('submit_review', {
    park_id: parkId,
    rating,
  });
}

/**
 * Track download actions
 */
export function trackDownload(fileName: string, fileType?: string) {
  trackEvent('file_download', {
    file_name: fileName,
    ...(fileType && { file_type: fileType }),
  });
}

/**
 * Track video interactions (if videos are added)
 */
export function trackVideoPlay(videoTitle: string, videoUrl?: string) {
  trackEvent('video_play', {
    video_title: videoTitle,
    ...(videoUrl && { video_url: videoUrl }),
  });
}

/**
 * Track errors
 */
export function trackError(error: Error, context?: Record<string, unknown>) {
  trackEvent('exception', {
    description: error.message,
    fatal: false,
    error_name: error.name,
    ...context,
  });
}







































