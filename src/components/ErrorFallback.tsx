'use client';

import React from 'react';
import Link from 'next/link';

interface ErrorFallbackProps {
  error: Error;
  errorInfo: React.ErrorInfo;
  resetError: () => void;
  level?: 'page' | 'section' | 'component';
}

export default function ErrorFallback({
  error,
  errorInfo,
  resetError,
  level = 'component'
}: ErrorFallbackProps) {
  // Determine the appropriate UI based on error level
  const isPageLevel = level === 'page';
  const isSectionLevel = level === 'section';

  return (
    <div
      className={`error-boundary-fallback ${isPageLevel ? 'error-page' : isSectionLevel ? 'error-section' : 'error-component'
        }`}
      style={{
        padding: isPageLevel ? '60px 20px' : '40px 20px',
        textAlign: 'center',
        backgroundColor: isPageLevel ? '#fef2f2' : '#fff7ed',
        border: `2px solid ${isPageLevel ? '#fecaca' : '#fed7aa'}`,
        borderRadius: '12px',
        margin: isPageLevel ? '0' : '20px 0',
      }}
    >
      {/* Error Icon */}
      <div style={{ fontSize: '48px', marginBottom: '20px' }}>
        <i className="bi bi-exclamation-triangle-fill" style={{ color: '#dc2626' }}></i>
      </div>

      {/* Error Title */}
      <h2 style={{
        color: '#1f2937',
        marginBottom: '12px',
        fontSize: isPageLevel ? '24px' : '20px'
      }}>
        {isPageLevel
          ? 'Oops! Something went wrong'
          : 'This section couldn\'t load properly'
        }
      </h2>

      {/* Error Message */}
      <p style={{
        color: '#6b7280',
        marginBottom: '24px',
        maxWidth: '600px',
        margin: '0 auto 24px',
        lineHeight: '1.6'
      }}>
        {isPageLevel
          ? 'We\'re sorry, but we encountered an unexpected error. Please try refreshing the page or contact us if the problem persists.'
          : 'This part of the page failed to load. You can try reloading this section or continue using other parts of the site.'
        }
      </p>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: '24px'
      }}>
        <button
          onClick={resetError}
          style={{
            backgroundColor: '#8b5cf6',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#7c3aed';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#8b5cf6';
          }}
        >
          Try Again
        </button>

        {!isPageLevel && (
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#fff',
              color: '#374151',
              padding: '10px 20px',
              borderRadius: '8px',
              border: '2px solid #e5e7eb',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'border-color 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#9ca3af';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            Refresh Page
          </button>
        )}
      </div>

      {/* Help Links */}
      <div style={{
        display: 'flex',
        gap: '20px',
        justifyContent: 'center',
        flexWrap: 'wrap',
        fontSize: '14px'
      }}>
        <Link
          href="/"
          style={{
            color: '#8b5cf6',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'color 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = '#7c3aed';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = '#8b5cf6';
          }}
        >
          <i className="bi bi-house"></i>
          Home Page
        </Link>

        <Link
          href="/contact"
          style={{
            color: '#8b5cf6',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'color 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = '#7c3aed';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = '#8b5cf6';
          }}
        >
          <i className="bi bi-envelope"></i>
          Contact Us
        </Link>

        <button
          onClick={() => {
            // Copy error details to clipboard
            const errorDetails = `
Error: ${error.message}
URL: ${window.location.href}
Timestamp: ${new Date().toISOString()}
User Agent: ${navigator.userAgent}
            `.trim();

            navigator.clipboard.writeText(errorDetails).then(() => {
              alert('Error details copied to clipboard. Please include this when reporting the issue.');
            }).catch(() => {
              console.error('Failed to copy error details');
            });
          }}
          style={{
            backgroundColor: 'transparent',
            color: '#8b5cf6',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            padding: '0',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'color 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = '#7c3aed';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = '#8b5cf6';
          }}
        >
          <i className="bi bi-clipboard"></i>
          Copy Error
        </button>
      </div>

      {/* Development Mode: Show Error Details */}
      {process.env.NODE_ENV === 'development' && (
        <details
          style={{
            marginTop: '30px',
            textAlign: 'left',
            backgroundColor: '#f3f4f6',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            maxWidth: '800px',
            margin: '30px auto 0'
          }}
        >
          <summary style={{
            cursor: 'pointer',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '10px'
          }}>
            Error Details (Development Only)
          </summary>
          <pre style={{
            fontSize: '12px',
            overflow: 'auto',
            color: '#1f2937',
            whiteSpace: 'pre-wrap'
          }}>
            {`
Error: ${error.message}
${error.stack}

Component Stack:
${errorInfo.componentStack}
            `.trim()}
          </pre>
        </details>
      )}
    </div>
  );
}