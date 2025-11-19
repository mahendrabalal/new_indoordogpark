'use client';

import { AutocompleteSuggestion } from '@/hooks/useAutocomplete';

interface SearchAutocompleteProps {
  suggestions: AutocompleteSuggestion[];
  isOpen: boolean;
  isLoading: boolean;
  selectedIndex: number;
  query: string;
  onSuggestionClick: (suggestion: AutocompleteSuggestion) => void;
  onClose: () => void;
}

export default function SearchAutocomplete({
  suggestions,
  isOpen,
  isLoading,
  selectedIndex,
  query,
  onSuggestionClick,
}: SearchAutocompleteProps) {
  if (!isOpen || (suggestions.length === 0 && !isLoading)) {
    return null;
  }

  // Helper to highlight matching text
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (regex.test(part)) {
        return (
          <mark key={index} className="autocomplete-highlight">
            {part}
          </mark>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  // Get icon for suggestion type
  const getIcon = (type: AutocompleteSuggestion['type']) => {
    switch (type) {
      case 'city':
        return <i className="bi bi-geo-alt"></i>;
      case 'park':
        return <i className="bi bi-tree"></i>;
      case 'business_type':
        return <i className="bi bi-building"></i>;
      default:
        return <i className="bi bi-search"></i>;
    }
  };

  return (
    <div className="autocomplete-dropdown">
      {isLoading && suggestions.length === 0 ? (
        <div className="autocomplete-loading">
          <div className="autocomplete-spinner"></div>
          <span>Searching...</span>
        </div>
      ) : (
        <ul className="autocomplete-list" role="listbox">
          {suggestions.map((suggestion, index) => (
            <li
              key={`${suggestion.type}-${suggestion.value}-${index}`}
              className={`autocomplete-item ${
                index === selectedIndex ? 'autocomplete-item-selected' : ''
              }`}
              role="option"
              aria-selected={index === selectedIndex}
              onClick={() => onSuggestionClick(suggestion)}
              onMouseDown={(e) => e.preventDefault()} // Prevent input blur
            >
              <div className="autocomplete-item-icon">
                {getIcon(suggestion.type)}
              </div>
              <div className="autocomplete-item-content">
                <div className="autocomplete-item-title">
                  {highlightMatch(suggestion.displayValue, query)}
                </div>
                {suggestion.subtitle && (
                  <div className="autocomplete-item-subtitle">
                    {suggestion.subtitle}
                  </div>
                )}
              </div>
              <div className="autocomplete-item-arrow">
                <i className="bi bi-arrow-return-left"></i>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Footer hint */}
      <div className="autocomplete-footer">
        <span className="autocomplete-hint">
          <kbd>↑</kbd> <kbd>↓</kbd> to navigate • <kbd>Enter</kbd> to select • <kbd>Esc</kbd> to close
        </span>
      </div>
    </div>
  );
}












