'use client';

import { useEffect } from 'react';

export default function AdSense() {
  useEffect(() => {
    try {
      // Ensure we only run in browser environment
      if (typeof window === 'undefined') return;

      const adClientId = 'ca-pub-8688786543603411';
      const scriptUrl = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClientId}`;

      // Check if the script is already present to prevent duplicate loads
      const existingScript = document.querySelector(`script[src*="${adClientId}"]`);
      if (existingScript) {
        return;
      }

      // Create a native script tag to load AdSense.
      // This bypasses the Next.js `next/script` metadata injection (e.g. data-nscript)
      // which causes the "AdSense head tag doesn't support data-nscript attribute" warning.
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;
      script.crossOrigin = 'anonymous';

      document.head.appendChild(script);
    } catch (e) {
      console.error('[AdSense] Failed to dynamically load script:', e);
    }
  }, []);

  return null;
}
