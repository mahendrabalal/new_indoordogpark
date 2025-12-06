'use client';

import React, { useState, useCallback, memo } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  fetchPriority?: 'high' | 'low' | 'auto';
  sizes?: string;
  quality?: number;
  unoptimized?: boolean;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
}

/**
 * OptimizedImage component with fallback support for external images
 * Uses Next.js Image for local images, falls back to img tag for external unoptimized images
 */
function OptimizedImageComponent({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  fetchPriority = 'auto',
  sizes,
  quality = 75,
  unoptimized = false,
  style,
  onLoad,
  onError,
  fallbackSrc = 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  ...props
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  // Determine if this is a local image that should be optimized
  const isLocalImage = typeof src === 'string' && (
    src.startsWith('/images/') ||
    src.startsWith('./images/') ||
    src.startsWith('https://images.unsplash.com') ||
    src.startsWith('https://lh3.googleusercontent.com') ||
    src.startsWith('https://lh4.googleusercontent.com') ||
    src.startsWith('https://lh5.googleusercontent.com') ||
    src.startsWith('https://lh6.googleusercontent.com')
  );

  const shouldUseNextImage = !unoptimized && isLocalImage && !useFallback;

  const handleError = useCallback(() => {
    if (!imageError) {
      setImageError(true);
      if (onError) onError();
    }
  }, [imageError, onError]);

  const handleLoad = useCallback(() => {
    if (onLoad) onLoad();
  }, [onLoad]);

  // If we have an error and haven't switched to fallback yet
  if (imageError && !useFallback && src !== fallbackSrc) {
    setUseFallback(true);
    setImageError(false);
  }

  // For local images, use Next.js Image with optimization
  if (shouldUseNextImage) {
    const imageSrc = useFallback ? fallbackSrc : src;

    return (
      <div className={`relative ${className}`} style={style}>
        <Image
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          fill={fill}
          priority={priority}
          fetchPriority={fetchPriority}
          sizes={sizes}
          quality={quality}
          className={`${className}`}
          onError={handleError}
          onLoad={handleLoad}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          {...(fill ? {} : { width: width || 400, height: height || 300 })}
          {...props}
        />
      </div>
    );
  }

  // For external images or fallback, use regular img tag
  const displaySrc = useFallback ? fallbackSrc : src;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={displaySrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={fetchPriority}
      style={{
        objectFit: 'cover',
        width: fill ? '100%' : width,
        height: fill ? '100%' : height,
        ...style,
      }}
      onError={handleError}
      onLoad={handleLoad}
      {...props}
    />
  );
}

// Memoize the OptimizedImage component to prevent unnecessary re-renders
const OptimizedImage = memo(OptimizedImageComponent, (prevProps, nextProps) => {
  // Only re-render if these props change
  return (
    prevProps.src === nextProps.src &&
    prevProps.alt === nextProps.alt &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.className === nextProps.className &&
    prevProps.priority === nextProps.priority &&
    prevProps.quality === nextProps.quality &&
    prevProps.unoptimized === nextProps.unoptimized &&
    prevProps.fallbackSrc === nextProps.fallbackSrc
  );
});

export default OptimizedImage;