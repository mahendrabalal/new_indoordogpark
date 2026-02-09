'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

interface Favorite {
  id: string;
  user_id: string;
  park_id: string;
  park_slug: string | null;
  created_at: string;
}

interface FavoritesContextType {
  favorites: Favorite[];
  loading: boolean;
  isFavorited: (parkId: string) => boolean;
  addFavorite: (parkId: string, parkSlug?: string) => Promise<void>;
  removeFavorite: (parkId: string) => Promise<void>;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/favorites', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites || []);
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const isFavorited = useCallback(
    (parkId: string) => {
      return favorites.some((fav) => fav.park_id === parkId);
    },
    [favorites]
  );

  const addFavorite = useCallback(
    async (parkId: string, parkSlug?: string) => {
      if (!user) return;

      // Optimistic update
      const newFavorite: Favorite = {
        id: `temp-${Date.now()}`,
        user_id: user.id,
        park_id: parkId,
        park_slug: parkSlug || null,
        created_at: new Date().toISOString(),
      };
      setFavorites((prev) => [...prev, newFavorite]);

      try {
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ parkId, parkSlug }),
        });

        if (!response.ok) {
          // Revert on error
          setFavorites((prev) => prev.filter((fav) => fav.park_id !== parkId));
          throw new Error('Failed to add favorite');
        }

        const data = await response.json();
        // Replace temporary favorite with real one from server, or add if not in list
        if (data.favorite) {
          setFavorites((prev) => {
            const exists = prev.some((fav) => fav.park_id === parkId);
            if (exists) {
              return prev.map((fav) => (fav.park_id === parkId ? data.favorite : fav));
            } else {
              return [...prev, data.favorite];
            }
          });
        }
      } catch (error) {
        console.error('Error adding favorite:', error);
        // Revert on error
        setFavorites((prev) => prev.filter((fav) => fav.park_id !== parkId));
        throw error;
      }
    },
    [user]
  );

  const removeFavorite = useCallback(
    async (parkId: string) => {
      if (!user) return;

      // Optimistic update - capture previous state for potential rollback
      let previousFavorites: Favorite[] = [];
      setFavorites((prev) => {
        previousFavorites = [...prev];
        return prev.filter((fav) => fav.park_id !== parkId);
      });

      try {
        const response = await fetch(`/api/favorites/${parkId}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (!response.ok) {
          // Revert on error
          setFavorites(previousFavorites);
          throw new Error('Failed to remove favorite');
        }
      } catch (error) {
        console.error('Error removing favorite:', error);
        // Revert on error
        setFavorites(previousFavorites);
        throw error;
      }
    },
    [user]
  );

  const refreshFavorites = useCallback(async () => {
    await fetchFavorites();
  }, [fetchFavorites]);

  const value = {
    favorites,
    loading,
    isFavorited,
    addFavorite,
    removeFavorite,
    refreshFavorites,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}

