import { useSearchParams as useNextSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';

/**
 * Custom hook for managing URL search parameters
 * Provides methods to update URL without full page reload
 */
export function useSearchParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useNextSearchParams();

  /**
   * Update a single search parameter
   */
  const setSearchParam = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    const search = params.toString();
    const query = search ? `?${search}` : '';
    
    router.push(`${pathname}${query}`, { scroll: false });
  }, [pathname, router, searchParams]);

  /**
   * Update multiple search parameters at once
   */
  const setSearchParams = useCallback((updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams?.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    const search = params.toString();
    const query = search ? `?${search}` : '';
    
    router.push(`${pathname}${query}`, { scroll: false });
  }, [pathname, router, searchParams]);

  /**
   * Get a single search parameter value
   */
  const getSearchParam = useCallback((key: string): string | null => {
    return searchParams?.get(key) || null;
  }, [searchParams]);

  /**
   * Clear all search parameters
   */
  const clearSearchParams = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  return {
    searchParams,
    setSearchParam,
    setSearchParams,
    getSearchParam,
    clearSearchParams,
  };
}














