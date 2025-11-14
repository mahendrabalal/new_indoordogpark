import { useState, useEffect, useCallback, useRef } from 'react';
import { useDebounce } from './useDebounce';

export interface AutocompleteSuggestion {
  type: 'city' | 'park' | 'business_type';
  value: string;
  displayValue: string;
  subtitle?: string;
  count?: number;
}

export interface AutocompleteOptions {
  debounceDelay?: number;
  minChars?: number;
}

/**
 * Custom hook for autocomplete functionality with keyboard navigation
 */
export function useAutocomplete(options: AutocompleteOptions = {}) {
  const { debounceDelay = 150, minChars = 2 } = options;

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Debounce the query
  const debouncedQuery = useDebounce(query, debounceDelay);

  // Fetch suggestions from API
  const fetchSuggestions = useCallback(async (searchTerm: string) => {
    if (searchTerm.length < minChars) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/parks/autocomplete?q=${encodeURIComponent(searchTerm)}`,
        { signal: abortControllerRef.current.signal }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      const data = await response.json();

      if (data.success) {
        setSuggestions(data.suggestions || []);
        setIsOpen(data.suggestions.length > 0);
        setSelectedIndex(-1);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Request was cancelled, ignore
        return;
      }
      console.error('Autocomplete error:', error);
      setSuggestions([]);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, [minChars]);

  // Trigger fetch when debounced query changes
  useEffect(() => {
    fetchSuggestions(debouncedQuery);
  }, [debouncedQuery, fetchSuggestions]);

  // Update query
  const updateQuery = (value: string) => {
    setQuery(value);
  };

  // Close dropdown
  const close = () => {
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  // Open dropdown (if there are suggestions)
  const open = () => {
    if (suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  // Select a suggestion
  const selectSuggestion = (suggestion: AutocompleteSuggestion): string => {
    setQuery(suggestion.value);
    close();
    return suggestion.value;
  };

  // Keyboard navigation handlers
  const handleKeyDown = (e: React.KeyboardEvent): string | null => {
    if (!isOpen || suggestions.length === 0) {
      return null;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        return null;

      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        return null;

      case 'Enter':
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          e.preventDefault();
          const selected = suggestions[selectedIndex];
          setQuery(selected.value);
          close();
          return selected.value;
        }
        return null;

      case 'Escape':
        e.preventDefault();
        close();
        return null;

      default:
        return null;
    }
  };

  // Click on suggestion
  const handleSuggestionClick = (suggestion: AutocompleteSuggestion): string => {
    return selectSuggestion(suggestion);
  };

  // Get selected suggestion
  const getSelectedSuggestion = (): AutocompleteSuggestion | null => {
    if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
      return suggestions[selectedIndex];
    }
    return null;
  };

  // Clear all
  const clear = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  return {
    query,
    suggestions,
    isOpen,
    isLoading,
    selectedIndex,
    updateQuery,
    close,
    open,
    clear,
    handleKeyDown,
    handleSuggestionClick,
    getSelectedSuggestion,
  };
}





