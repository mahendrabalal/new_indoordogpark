'use client';

import { useEffect, useRef, useState, useCallback, FormEvent } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { safeLocalStorage, safeSessionStorage } from '@/lib/storage';

// ─── Constants ───────────────────────────────────────────────────────────────

const STORAGE_KEY_SUBSCRIBED = 'newsletter_popup_subscribed';
const STORAGE_KEY_DISMISSED = 'newsletter_popup_dismissed_at';
const SESSION_KEY_SHOWN = 'newsletter_popup_shown_this_session';
const DISMISS_COOLDOWN_DAYS = 7;
const MIN_TIME_ON_PAGE_MS = 30_000; // 30 seconds
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Pages where the popup should NEVER appear
const BLOCKED_PATHS = [
  '/list-your-park',
  '/contact',
  '/login',
  '/signup',
  '/privacy',
  '/terms',
  '/payment',
  '/admin',
  '/dashboard',
  '/studio',
  '/cookie-preferences',
  '/unsubscribe',
  '/403',
];

/**
 * Get the scroll-depth trigger percentage based on the current page.
 * Blog posts trigger earlier (40%) because engaged readers are high-intent.
 * Other pages trigger at 50%.
 */
function getScrollThreshold(pathname: string): number {
  if (pathname.startsWith('/blog/') && pathname !== '/blog') return 0.40;
  return 0.50;
}

/**
 * Determine the analytics source tag based on the current page.
 */
function getSource(pathname: string): string {
  if (pathname === '/') return 'popup_homepage';
  if (pathname.startsWith('/blog/')) return 'popup_blog_post';
  if (pathname === '/blog') return 'popup_blog_listing';
  if (pathname.startsWith('/cities/')) return 'popup_city_page';
  if (pathname.startsWith('/states/')) return 'popup_state_page';
  return 'popup_other';
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function NewsletterPopup() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const mountTimeRef = useRef(Date.now());
  const hasTriggeredRef = useRef(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Reset trigger on pathname change
  useEffect(() => {
    hasTriggeredRef.current = false;
    mountTimeRef.current = Date.now();
  }, [pathname]);

  /**
   * Check whether the popup should be suppressed:
   * - Already subscribed (permanent)
   * - Dismissed within cooldown period (7 days)
   * - Already shown this session
   * - Current page is blocked
   */
  const shouldSuppress = useCallback((): boolean => {
    // Check blocked pages
    if (BLOCKED_PATHS.some((p) => pathname.startsWith(p))) return true;

    // Already subscribed — never show again
    if (safeLocalStorage.getItem(STORAGE_KEY_SUBSCRIBED) === 'true') return true;

    // Already shown this browser session
    if (safeSessionStorage.getItem(SESSION_KEY_SHOWN) === 'true') return true;

    // Dismissed recently — check cooldown
    const dismissedAt = safeLocalStorage.getItem(STORAGE_KEY_DISMISSED);
    if (dismissedAt) {
      const daysSince = (Date.now() - Number(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (daysSince < DISMISS_COOLDOWN_DAYS) return true;
    }

    return false;
  }, [pathname]);

  /**
   * Try to show the popup. Only succeeds if all suppression checks pass
   * and enough time has passed on the page.
   */
  const tryShow = useCallback(() => {
    if (hasTriggeredRef.current) return;
    if (shouldSuppress()) return;

    const timeOnPage = Date.now() - mountTimeRef.current;
    if (timeOnPage < MIN_TIME_ON_PAGE_MS) return;

    hasTriggeredRef.current = true;
    safeSessionStorage.setItem(SESSION_KEY_SHOWN, 'true');
    setIsVisible(true);

    // Focus the email input for accessibility after animation
    setTimeout(() => emailInputRef.current?.focus(), 400);
  }, [shouldSuppress]);

  /**
   * Scroll listener: trigger when user scrolls past the threshold.
   */
  useEffect(() => {
    if (shouldSuppress()) return;

    const threshold = getScrollThreshold(pathname);

    const handleScroll = () => {
      const scrollPercent =
        window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPercent >= threshold) {
        tryShow();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname, shouldSuppress, tryShow]);

  /**
   * Time-based fallback: if user stays on page for 45 seconds without
   * scrolling enough, show the popup anyway (they're engaged).
   */
  useEffect(() => {
    if (shouldSuppress()) return;

    const timer = setTimeout(() => {
      tryShow();
    }, 45_000);

    return () => clearTimeout(timer);
  }, [pathname, shouldSuppress, tryShow]);

  /**
   * Close the popup with animation.
   */
  const handleClose = useCallback(() => {
    setIsClosing(true);
    safeLocalStorage.setItem(STORAGE_KEY_DISMISSED, String(Date.now()));
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, 300);
  }, []);

  /**
   * Keyboard handler: close on Escape.
   */
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, handleClose]);

  /**
   * Click-outside handler: close when clicking the backdrop overlay.
   */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) handleClose();
  };

  /**
   * Prevent body scrolling while popup is open.
   */
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible]);

  /**
   * Reset error state when user edits inputs.
   */
  useEffect(() => {
    if (status === 'error') {
      setStatus('idle');
      setMessage('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  /**
   * Form submission.
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      emailInputRef.current?.focus();
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmedEmail,
          name: '',
          type: 'consumer',
          source: getSource(pathname),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Welcome to the pack! 🐾');
        safeLocalStorage.setItem(STORAGE_KEY_SUBSCRIBED, 'true');

        // Auto-close after success
        setTimeout(() => {
          setIsClosing(true);
          setTimeout(() => {
            setIsVisible(false);
            setIsClosing(false);
          }, 300);
        }, 2500);
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  if (!isVisible) return null;

  return (
    <div
      ref={overlayRef}
      className={`nl-popup-overlay ${isClosing ? 'nl-popup-overlay--closing' : ''}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Subscribe to newsletter"
    >
      <div className={`nl-popup-split ${isClosing ? 'nl-popup-split--closing' : ''}`}>
        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          className="nl-popup-split-close"
          aria-label="Close popup"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
            <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
          </svg>
        </button>

        {/* Left side — Image */}
        <div className="nl-popup-split-image">
          <Image
            src="/images/subscribe/newsletter-popup-dog.jpg"
            alt="Happy golden retriever puppy in an indoor dog park"
            fill
            sizes="(max-width: 640px) 100vw, 340px"
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>

        {/* Right side — Form content */}
        <div className="nl-popup-split-content">
          {status !== 'success' ? (
            <>
              <h2 className="nl-popup-split-title">
                NEVER MISS A<br />NEW DOG PARK!
              </h2>
              <p className="nl-popup-split-subtitle">
                We help pet parents find the best indoor dog parks.
                <br />
                Sign up for weekly tips, new park alerts &amp; exclusive guides.
              </p>

              <form onSubmit={handleSubmit} className="nl-popup-split-form">
                <input
                  ref={emailInputRef}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  disabled={status === 'loading'}
                  className={`nl-popup-split-input ${status === 'error' ? 'nl-popup-split-input--error' : ''}`}
                  autoComplete="email"
                />

                {message && status === 'error' && (
                  <p className="nl-popup-split-error" role="alert">
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="nl-popup-split-submit"
                >
                  {status === 'loading' ? 'JOINING…' : 'SIGN UP'}
                </button>
              </form>

              <button
                type="button"
                onClick={handleClose}
                className="nl-popup-split-dismiss"
              >
                NO, I DON&apos;T NEED PARK TIPS
              </button>
            </>
          ) : (
            <div className="nl-popup-split-success">
              <div className="nl-popup-split-success-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="nl-popup-split-success-text">{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
