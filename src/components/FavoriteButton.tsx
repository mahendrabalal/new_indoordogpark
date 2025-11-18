'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';

interface FavoriteButtonProps {
  parkId: string;
  parkSlug?: string;
  className?: string;
  'aria-label'?: string;
}

/**
 * FavoriteButton component following industry best practices:
 * - Uses shared FavoritesContext to avoid duplicate API calls
 * - Requires login for persistence across devices
 * - Proper accessibility attributes
 * - Optimistic UI updates
 * - Error handling
 * - SSR-safe implementation
 */
export default function FavoriteButton({
  parkId,
  parkSlug,
  className = '',
  'aria-label': ariaLabel
}: FavoriteButtonProps) {
  const { user, loading: authLoading } = useAuth();
  const { isFavorited: checkIsFavorited, addFavorite, removeFavorite, loading: favoritesLoading } = useFavorites();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get favorite status from context
  const isFavorited = checkIsFavorited(parkId);

  // Initialize mounted state (SSR-safe)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleToggleFavorite = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent event bubbling to parent links
    e.preventDefault();
    e.stopPropagation();

    // Require login - redirect if not authenticated
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setIsLoading(true);

    try {
      if (isFavorited) {
        await removeFavorite(parkId);
      } else {
        await addFavorite(parkId, parkSlug);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [isFavorited, parkId, parkSlug, user, router, addFavorite, removeFavorite]);

  // Removed verbose render logging - only action logs remain for debugging

  // Don't render until mounted to avoid hydration mismatch
  if (!isMounted || authLoading || favoritesLoading) {
    return (
      <button
        className={`favorite-button ${className}`}
        aria-label={ariaLabel || 'Add to favorites'}
        disabled
        style={{ opacity: 0.5 }}
        type="button"
      >
        <i className="bi bi-heart" aria-hidden="true"></i>
      </button>
    );
  }

  const defaultAriaLabel = isFavorited 
    ? 'Remove from favorites' 
    : 'Add to favorites';

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`favorite-button ${isFavorited ? 'favorited' : ''} ${className}`}
      aria-label={ariaLabel || defaultAriaLabel}
      aria-pressed={isFavorited}
      type="button"
      title={defaultAriaLabel}
      style={{
        // Force red color when favorited for debugging
        ...(isFavorited ? { color: '#ef4444' } : {})
      }}
    >
      <i 
        className={`bi ${isFavorited ? 'bi-heart-fill' : 'bi-heart'}`}
        aria-hidden="true"
        style={{
          // Force red color when favorited for debugging
          ...(isFavorited ? { color: '#ef4444' } : {})
        }}
      ></i>
      {isLoading && <span className="loading-spinner" aria-hidden="true"></span>}
      <span className="sr-only">{defaultAriaLabel}</span>
    </button>
  );
}