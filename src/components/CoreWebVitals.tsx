'use client';

import { useEffect } from 'react';
import { initCoreWebVitals } from '@/lib/core-web-vitals';

/**
 * Core Web Vitals monitoring component
 * Automatically tracks and reports Core Web Vitals metrics to Google Analytics
 */
export default function CoreWebVitals() {
  useEffect(() => {
    // Initialize Core Web Vitals monitoring
    initCoreWebVitals();
  }, []);

  // This component doesn't render anything
  return null;
}











































