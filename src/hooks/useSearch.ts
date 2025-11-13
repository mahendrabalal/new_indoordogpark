import { useState, useEffect, useCallback } from 'react';
import { DogPark } from '@/types/dog-park';
import { useSearchParams } from './useSearchParams';
import { searchParks, SearchResponse } from '@/lib/api';

export interface SearchFilters {
  type?: string;
  businessType?: string; // Keep for backwards compatibility
  minRating?: number;
  priceRange?: string;
  priceLevel?: number; // Keep for backwards compatibility
  city?: string;
  amenities?: string[];
  sortBy?: 'relevance' | 'rating' | 'reviews' | 'name' | 'distance';
}

export interface SearchOptions {
  enableUrlState?: boolean;
  debounceDelay?: number;
  initialLimit?: number;
}

/**
 * Custom hook for SERVER-SIDE search functionality with manual trigger and URL state
 * Now searches through ALL parks in database, not just loaded ones
 * Search is only triggered explicitly (on form submit or autocomplete selection)
 */
export function useSearch(
  fallbackParks: DogPark[], // Used only as fallback when no search is active
  options: SearchOptions = {}
) {
  const { enableUrlState = true, initialLimit = 50 } = options;
  const { getSearchParam, setSearchParams } = useSearchParams();

  // Initialize from URL or default values
  const initialQuery = enableUrlState ? getSearchParam('q') || '' : '';
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [activeSearchTerm, setActiveSearchTerm] = useState(initialQuery);
  const [filters, setFilters] = useState<SearchFilters>(() => {
    if (!enableUrlState) return {};
    
    return {
      type: getSearchParam('type') || undefined,
      businessType: getSearchParam('type') || undefined, // Backwards compat
      minRating: getSearchParam('minRating') ? Number(getSearchParam('minRating')) : undefined,
      priceRange: getSearchParam('priceRange') || undefined,
      city: getSearchParam('city') || undefined,
      sortBy: (getSearchParam('sortBy') as SearchFilters['sortBy']) || 'relevance',
    };
  });
  
  const [results, setResults] = useState<DogPark[]>(fallbackParks);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMeta, setSearchMeta] = useState<SearchResponse['meta'] | null>(null);
  const [pagination, setPagination] = useState<SearchResponse['pagination'] | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const hasActiveFilters = !!(filters.type && filters.type !== 'all') || 
    !!filters.minRating || 
    !!filters.priceRange || 
    !!filters.city ||
    !!(filters.amenities && filters.amenities.length > 0);

  // Check if search is active (has been performed with term or filters)
  const isActive = !!activeSearchTerm || hasActiveFilters;

  // Perform server-side search
  const performSearch = useCallback(async () => {
    if (!isActive) {
      // No search active, use fallback parks
      setResults(fallbackParks);
      setSearchMeta(null);
      setPagination(null);
      return;
    }

    setIsSearching(true);

    try {
      const response = await searchParks({
        q: activeSearchTerm || undefined,
        type: filters.type && filters.type !== 'all' ? filters.type : undefined,
        minRating: filters.minRating,
        priceRange: filters.priceRange,
        city: filters.city,
        amenities: filters.amenities,
        sortBy: filters.sortBy || 'relevance',
        page: 1,
        limit: initialLimit,
      });

      if (response.success) {
        setResults(response.data);
        setSearchMeta(response.meta);
        setPagination(response.pagination);
      } else {
        setResults([]);
        setSearchMeta(null);
        setPagination(null);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setSearchMeta(null);
      setPagination(null);
    } finally {
      setIsSearching(false);
    }
  }, [activeSearchTerm, filters, isActive, fallbackParks, initialLimit]);

  // Run search whenever active term or filters change
  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!isActive) {
      setResults(fallbackParks);
      setSearchMeta(null);
      setPagination(null);
      setIsSearching(false);
      return;
    }

    performSearch();
  }, [activeSearchTerm, filters, isActive, performSearch, fallbackParks, isHydrated]);

  // Update URL when committed search term or filters change
  useEffect(() => {
    if (!enableUrlState) return;

    const updates: Record<string, string> = {
      q: activeSearchTerm,
      type: filters.type || '',
      minRating: filters.minRating?.toString() || '',
      priceRange: filters.priceRange || '',
      city: filters.city || '',
      sortBy: filters.sortBy || '',
    };

    setSearchParams(updates);
  }, [activeSearchTerm, filters, enableUrlState, setSearchParams]);

  // Mark as hydrated after first render (ensures fallback parks loaded)
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Update search term (doesn't trigger search)
  const updateSearchTerm = (term: string) => {
    setSearchTerm(term);
  };

  // Trigger search explicitly (called on form submit or autocomplete selection)
  const triggerSearch = (term?: string) => {
    const nextTermRaw = term !== undefined ? term : searchTerm;
    const nextTerm = nextTermRaw.trim();
    setSearchTerm(nextTerm);
    setActiveSearchTerm(nextTerm);
  };

  // Update filters (triggers search automatically)
  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters };
      // Keep backwards compatibility
      if (newFilters.type) {
        updated.businessType = newFilters.type;
      }
      return updated;
    });
  };

  // Clear search and filters
  const clearSearch = () => {
    setSearchTerm('');
    setActiveSearchTerm('');
    setFilters({});
    setResults(fallbackParks);
    setSearchMeta(null);
    setPagination(null);
  };

  // Get highlighted text (for showing matched terms)
  const getHighlightedText = (text: string) => {
    if (!activeSearchTerm) return text;
    
    const regex = new RegExp(`(${activeSearchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  return {
    searchTerm,
    activeSearchTerm,
    filters,
    results,
    isSearching,
    isActive,
    searchMeta,
    pagination,
    updateSearchTerm,
    triggerSearch,
    updateFilters,
    clearSearch,
    getHighlightedText,
    performSearch, // Expose for manual refresh if needed
  };
}


