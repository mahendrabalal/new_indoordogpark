'use client';

// Accessibility utilities and components for the blog

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

// Skip link component for keyboard navigation
export function SkipLinks() {
  return (
    <div className="fixed top-0 left-0 z-50">
      <a
        href="#main-content"
        className="absolute -top-full left-0 bg-purple-600 text-white px-4 py-2 rounded-md focus:top-4 focus:left-4 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-200"
      >
        Skip to main content
      </a>
    </div>
  );
}

// ARIA live region for announcements
export function LiveRegion() {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
      id="blog-live-region"
    />
  );
}

// Announcer for screen readers
export function useAnnouncer() {
  const announceRef = useRef<HTMLDivElement>(null);

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announceRef.current) {
      announceRef.current.setAttribute('aria-live', priority);
      announceRef.current.textContent = message;

      // Clear after announcement
      setTimeout(() => {
        if (announceRef.current) {
          announceRef.current.textContent = '';
        }
      }, 1000);
    }
  };

  const AnnouncerComponent = () => (
    <div
      ref={announceRef}
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  );

  return { announce, AnnouncerComponent };
}

// Focus trap for modals and overlays
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive]);

  return containerRef;
}

// Keyboard navigation hook
export function useKeyboardNavigation(
  items: Array<{ id: string; element?: HTMLElement }>,
  onSelect: (id: string) => void
) {
  const [focusedIndex, setFocusedIndex] = useState(-1);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (items.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault();
          const nextIndex = (focusedIndex + 1) % items.length;
          setFocusedIndex(nextIndex);
          items[nextIndex].element?.focus();
          break;

        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          const prevIndex = focusedIndex <= 0 ? items.length - 1 : focusedIndex - 1;
          setFocusedIndex(prevIndex);
          items[prevIndex].element?.focus();
          break;

        case 'Enter':
        case ' ':
          e.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < items.length) {
            onSelect(items[focusedIndex].id);
          }
          break;

        case 'Escape':
          setFocusedIndex(-1);
          (document.activeElement as HTMLElement)?.blur();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [items, focusedIndex, onSelect]);

  return { focusedIndex, setFocusedIndex };
}

// Accessible image component
interface AccessibleImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fallback?: string;
}

export function AccessibleImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fallback,
}: AccessibleImageProps) {
  const [imgError, setImgError] = useState(false);

  const handleError = () => {
    setImgError(true);
  };

  if (imgError && fallback) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 text-gray-500 ${className}`}
        style={{ width, height }}
        role="img"
        aria-label={alt}
      >
        <span className="text-sm text-center px-2">{fallback}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}

// Accessible button component
interface AccessibleButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
}

export function AccessibleButton({
  children,
  onClick,
  disabled = false,
  className = '',
  ariaLabel,
  ariaDescribedBy,
  variant = 'primary',
}: AccessibleButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    tertiary: 'text-purple-600 hover:text-purple-700 focus:ring-purple-500',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className} px-4 py-2`}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
}

// Reading progress indicator
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progressPercentage = (scrolled / documentHeight) * 100;
      setProgress(Math.min(Math.max(progressPercentage, 0), 100));
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress(); // Initial call

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-1 bg-purple-600 z-50 transition-all duration-300"
      style={{ width: `${progress}%` }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    />
  );
}

// Color scheme toggle
export function ColorSchemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for saved preference or system preference
    const saved = localStorage.getItem('color-scheme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const shouldBeDark = saved === 'dark' || (!saved && systemPrefersDark);
    setIsDark(shouldBeDark);
    document.documentElement.setAttribute('data-color-scheme', shouldBeDark ? 'dark' : 'light');
  }, []);

  const toggleColorScheme = () => {
    const newScheme = !isDark ? 'dark' : 'light';
    setIsDark(!isDark);
    localStorage.setItem('color-scheme', newScheme);
    document.documentElement.setAttribute('data-color-scheme', newScheme);
  };

  return (
    <button
      onClick={toggleColorScheme}
      className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
}

// Font size controls
export function FontSizeControls() {
  const [fontSize, setFontSize] = useState('medium');

  useEffect(() => {
    const saved = localStorage.getItem('font-size');
    if (saved) {
      setFontSize(saved);
      document.documentElement.setAttribute('data-font-size', saved);
    }
  }, []);

  const changeFontSize = (size: 'small' | 'medium' | 'large') => {
    setFontSize(size);
    localStorage.setItem('font-size', size);
    document.documentElement.setAttribute('data-font-size', size);
  };

  return (
    <div className="flex items-center space-x-2" role="group" aria-label="Font size controls">
      <button
        onClick={() => changeFontSize('small')}
        className={`px-3 py-1 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
          fontSize === 'small' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-gray-900'
        }`}
        aria-pressed={fontSize === 'small'}
        aria-label="Small font size"
      >
        A-
      </button>
      <button
        onClick={() => changeFontSize('medium')}
        className={`px-3 py-1 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
          fontSize === 'medium' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-gray-900'
        }`}
        aria-pressed={fontSize === 'medium'}
        aria-label="Medium font size"
      >
        A
      </button>
      <button
        onClick={() => changeFontSize('large')}
        className={`px-3 py-1 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
          fontSize === 'large' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-gray-900'
        }`}
        aria-pressed={fontSize === 'large'}
        aria-label="Large font size"
      >
        A+
      </button>
    </div>
  );
}

// Accessible link component
interface AccessibleLinkProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
  ariaLabel?: string;
}

export function AccessibleLink({
  href,
  children,
  external = false,
  className = '',
  ariaLabel,
}: AccessibleLinkProps) {
  return (
    <a
      href={href}
      className={`text-purple-600 hover:text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded ${className}`}
      aria-label={ariaLabel}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      {children}
      {external && (
        <span className="sr-only">(opens in new tab)</span>
      )}
    </a>
  );
}

// Error boundary for accessibility
export class AccessibilityErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Accessibility Error Boundary:', error, errorInfo);

    // Announce error to screen readers
    const announcement = `An error has occurred: ${error.message}`;
    const liveRegion = document.getElementById('blog-live-region');
    if (liveRegion) {
      liveRegion.textContent = announcement;
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="p-6 bg-red-50 border border-red-200 rounded-lg"
          aria-live="assertive"
        >
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-red-700 mb-4">
            {this.state.error?.message || 'An unexpected error occurred while loading the blog content.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}