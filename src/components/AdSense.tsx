'use client';

import { useEffect } from 'react';
import { safeLocalStorage } from '@/lib/storage';

const AD_CLIENT_ID = 'ca-pub-8688786543603411';

function injectAdSenseScript() {
  try {
    if (typeof window === 'undefined') return;

    const scriptUrl = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT_ID}`;

    // Prevent duplicate injection
    if (document.querySelector(`script[src*="${AD_CLIENT_ID}"]`)) return;

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
}

export default function AdSense() {
  useEffect(() => {
    // Rely on Google AdSense's built-in Consent Management Platform (CMP)
    // for GDPR/CCPA compliance. The adsbygoogle.js script must load first
    // in order to display the Google CMP banner.
    injectAdSenseScript();
  }, []);

  return null;
}
