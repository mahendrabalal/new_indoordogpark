'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      // Small delay to prevent initial mount jank
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 md:p-6 transition-transform duration-300 transform translate-y-0">
      <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Confirm your cookie preferences</h3>
          <p className="text-sm text-gray-600">
            We use cookies and similar technologies to help personalize content, tailor and measure ads, and provide a better experience. 
            By clicking accept, you agree to this, as outlined in our{' '}
            <Link href="/privacy" className="text-purple-600 hover:text-purple-800 underline">Privacy Policy</Link>.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={declineCookies}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            Essential Only
          </button>
          <button 
            onClick={acceptCookies}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-purple-600"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
