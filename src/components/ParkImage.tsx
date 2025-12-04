'use client';

import { useState, useEffect } from 'react';

interface ParkImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80';

export default function ParkImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
}: ParkImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  // Reset state when src changes
  useEffect(() => {
    setImgSrc(src);
    setIsLoading(true);

    // Pre-check if image is already loaded (cached) or if it fails
    const img = new Image();
    let isMounted = true;
    
    img.onload = () => {
      if (isMounted) {
        setIsLoading(false);
      }
    };
    img.onerror = () => {
      if (isMounted) {
        // If image fails during pre-check, immediately switch to fallback
        setImgSrc(DEFAULT_IMAGE);
        setIsLoading(false);
      }
    };
    img.src = src;

    // Fallback timeout: if image doesn't load within 2 seconds, show it anyway
    // This handles cases where onLoad doesn't fire (cached images, etc.)
    const timeout = setTimeout(() => {
      if (isMounted) {
        setIsLoading(false);
      }
    }, 2000);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  const handleError = () => {
    // Always fallback to default image on error, but prevent infinite loops
    if (imgSrc !== DEFAULT_IMAGE) {
      setImgSrc(DEFAULT_IMAGE);
      setIsLoading(false);
    } else {
      // If default image also fails, just hide loading state
      setIsLoading(false);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };


  // Industry best practice: Use native img tag for local images to avoid Next.js Image Optimization API
  // This prevents 402 errors and improves performance for local images
  // For external images, we still use native img for better error handling
  return (
    <div className="park-image-wrapper">
      {isLoading && (
        <div 
          className="park-image-loading"
          aria-hidden="true"
        >
          <svg 
            className="park-image-loading-icon" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {/* Using native img tag to avoid Next.js Image Optimization API 402 errors for local images */}
      {/* This is intentional - we need onError handler and want to avoid Next.js Image Optimization for local images */}
      <img
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className={`park-image ${className} ${isLoading ? 'park-image-loading-state' : ''}`}
        onError={handleError}
        onLoad={handleLoad}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    </div>
  );
}

