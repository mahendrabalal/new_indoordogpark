'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface FavoriteButtonProps {
  parkId: string;
  parkSlug?: string;
  isInitiallyFavorited?: boolean;
  className?: string;
}

export default function FavoriteButton({
  parkId,
  parkSlug,
  isInitiallyFavorited = false,
  className = ''
}: FavoriteButtonProps) {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(isInitiallyFavorited);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFavorite = async () => {
    if (!user) {
      // Redirect to login or show login modal
      alert('Please log in to save favorites');
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorited) {
        // Remove from favorites
        const response = await fetch(`/api/favorites/${parkId}`, {
          method: 'DELETE',
          credentials: 'include', // Include auth cookies
        });

        if (response.ok) {
          setIsFavorited(false);
        } else {
          console.error('Failed to remove favorite');
        }
      } else {
        // Add to favorites
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include auth cookies
          body: JSON.stringify({
            parkId,
            parkSlug,
          }),
        });

        if (response.ok) {
          setIsFavorited(true);
        } else {
          console.error('Failed to add favorite');
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`favorite-button ${isFavorited ? 'favorited' : ''} ${className}`}
      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <i className={`bi ${isFavorited ? 'bi-heart-fill' : 'bi-heart'}`}></i>
      {isLoading && <span className="loading-spinner"></span>}
    </button>
  );
}