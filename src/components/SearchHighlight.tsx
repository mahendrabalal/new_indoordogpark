'use client';

import { memo } from 'react';

interface SearchHighlightProps {
  text: string;
  searchTerm: string;
  className?: string;
  matchPartial?: boolean;
}

/**
 * Component to highlight search terms within text
 * Supports partial word matching and animations
 */
function SearchHighlightComponent({
  text,
  searchTerm,
  className = '',
  matchPartial = true
}: SearchHighlightProps) {
  if (!searchTerm || !text) {
    return <span className={className}>{text}</span>;
  }

  // Split search term into words for partial matching
  const searchWords = searchTerm.toLowerCase().split(/\s+/).filter(word => word.length > 0);

  // If no search words, return original text
  if (searchWords.length === 0) {
    return <span className={className}>{text}</span>;
  }

  // Create a regex pattern that matches any of the search words
  // For partial matching, we use word boundaries \b to match whole words
  // For exact matching, we match the exact phrase
  let pattern: string;
  if (matchPartial && searchWords.length > 1) {
    // Multiple words - match any of them
    pattern = searchWords.map(word => `\\b${word}\\b`).join('|');
  } else if (matchPartial && searchWords.length === 1) {
    // Single word - partial match with word boundary
    pattern = `\\b${searchWords[0]}\\b`;
  } else {
    // Exact phrase matching
    const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    pattern = `(${escapedSearchTerm})`;
  }

  // Create case-insensitive regex with global flag
  const regex = new RegExp(`(${pattern})`, 'gi');

  // Split text and wrap matches in animated mark tags
  let partIndex = 0;
  let matchIndex = 0;
  const parts: React.ReactNode[] = [];

  // Use split with a function to preserve matches
  text.split(regex).forEach((part) => {
    // Check if this part matches any of our search terms
    // Reset regex lastIndex before testing
    regex.lastIndex = 0;
    const isMatch = part && searchWords.some(word =>
      part.toLowerCase().includes(word.toLowerCase())
    );

    if (isMatch && part) {
      // Add highlighted part with animation
      parts.push(
        <mark
          key={`match-${matchIndex++}`}
          className="search-highlight-mark"
          style={{
            animationDelay: `${matchIndex * 50}ms`,
            backgroundColor: 'rgba(139, 92, 246, 0.2)',
            color: '#7c3aed',
            padding: '2px 4px',
            borderRadius: '4px',
            fontWeight: '600',
            animation: 'highlightFadeIn 0.3s ease-out forwards',
          }}
        >
          {part}
        </mark>
      );
    } else if (part) {
      // Add regular text part
      parts.push(<span key={`text-${partIndex++}`}>{part}</span>);
    }
  });

  return (
    <span className={`search-highlight-text ${className}`}>
      {parts}
    </span>
  );
}

// Memoize SearchHighlight to prevent unnecessary re-renders
const SearchHighlight = memo(SearchHighlightComponent, (prevProps, nextProps) => {
  // Only re-render if props change
  return (
    prevProps.text === nextProps.text &&
    prevProps.searchTerm === nextProps.searchTerm &&
    prevProps.className === nextProps.className &&
    prevProps.matchPartial === nextProps.matchPartial
  );
});

export default SearchHighlight;


















