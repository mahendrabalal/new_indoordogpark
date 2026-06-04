'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import ErrorFallback from './ErrorFallback';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<{ error: Error; errorInfo: ErrorInfo; resetError: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: 'page' | 'section' | 'component';
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isIgnoredError?: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Ignore Vercel Live WebSocket connection errors in iframes
    if (error.message === 'Connection closed.' || error.message?.includes('Connection closed')) {
      console.warn('Ignored Vercel Live connection error:', error);
      return { hasError: true, error, isIgnoredError: true };
    }
    
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, isIgnoredError: false };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // If it's the ignored error, don't log it to services or update state with info
    if (this.state.isIgnoredError) {
      return;
    }

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // Log error details
    console.error('ErrorBoundary caught an error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      level: this.props.level || 'component',
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }
  }

  logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // In a real application, you might send errors to a service like Sentry
    // For now, we'll just log with more details
    console.error('Production Error:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    });
  };

  resetError = () => {
    // Clear any pending retry timeout
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
      this.retryTimeoutId = null;
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleRetry = () => {
    // Add a small delay before retrying to prevent rapid successive retries
    this.retryTimeoutId = setTimeout(() => {
      this.resetError();
    }, 100);
  };

  render() {
    // If it's an ignored error (like Vercel Live WebSocket failure),
    // just render the children normally to prevent crashing the page preview.
    if (this.state.isIgnoredError) {
      return this.props.children;
    }

    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || ErrorFallback;
      // errorInfo may not be available yet (getDerivedStateFromError fires before componentDidCatch),
      // provide a safe default to prevent further crashes
      const safeErrorInfo = this.state.errorInfo || { componentStack: '' } as React.ErrorInfo;

      return (
        <FallbackComponent
          error={this.state.error}
          errorInfo={safeErrorInfo}
          resetError={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;