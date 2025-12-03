'use client';

import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; reset: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Blog ErrorBoundary caught an error:', error, errorInfo);

    // Log to external monitoring service if available
    if (typeof window !== 'undefined' && 'gtag' in window) {
      const gtag = (window as unknown as Record<string, unknown>).gtag as (...args: unknown[]) => void;
      gtag('event', 'exception', {
        description: error.message,
        fatal: false,
      });
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error} reset={this.reset} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, reset }: { error?: Error; reset: () => void }) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-6">
          {error?.message || 'We encountered an error while loading the blog content.'}
        </p>
        <div className="space-y-2">
          <button
            onClick={reset}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Try again
          </button>
          <a
            href="/blog"
            className="block ml-4 inline-flex items-center text-purple-600 hover:text-purple-700"
          >
            ← Back to blog
          </a>
        </div>
        {process.env.NODE_ENV === 'development' && error?.stack && (
          <details className="mt-6 text-left">
            <summary className="text-sm text-gray-500 cursor-pointer">Error details</summary>
            <pre className="mt-2 text-xs text-gray-400 bg-gray-100 p-4 rounded overflow-auto">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

export default ErrorBoundary;