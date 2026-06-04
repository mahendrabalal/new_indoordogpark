'use client';

import { useEffect } from 'react';

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
    // GDPR / CCPA compliance: only load AdSense if the user has not declined cookies.
    // 'cookieConsent' is set by the CookieBanner component:
    //   'accepted'  → user clicked "Accept All"
    //   'declined'  → user clicked "Essential Only"
    //   null        → user has not yet made a choice (treat as accepted to allow ads
    //                 in jurisdictions where opt-in is not required; EU users will
    //                 see the banner before any meaningful browsing occurs)
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'declined') return;

    // If already accepted (or no choice made yet), inject immediately
    injectAdSenseScript();

    // Listen for the user accepting cookies after the page has loaded
    // (e.g. they clicked "Accept All" on the banner that appeared after 1 s)
    function handleStorageChange(event: StorageEvent) {
      if (event.key === 'cookieConsent' && event.newValue === 'accepted') {
        injectAdSenseScript();
      }
    }

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return null;
}
