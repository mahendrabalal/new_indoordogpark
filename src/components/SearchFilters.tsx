'use client';

import { SearchFilters as SearchFiltersType } from '@/hooks/useSearch';

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: Partial<SearchFiltersType>) => void;
  onClearFilters: () => void;
  resultCount: number;
}

export default function SearchFilters({ 
  filters, 
  onFiltersChange, 
  onClearFilters,
  resultCount 
}: SearchFiltersProps) {
  const hasActiveFilters = Object.keys(filters).some(key => 
    filters[key as keyof SearchFiltersType] !== undefined
  );

  return (
    <div className="search-filters-container">
      <div className="search-filters-header">
        <h3 className="search-filters-title">
          <i className="bi bi-funnel"></i> Filters
        </h3>
        {hasActiveFilters && (
          <button 
            onClick={onClearFilters}
            className="search-filters-clear"
            aria-label="Clear all filters"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="search-filters-grid">
        {/* Business Type Filter */}
        <div className="search-filter-group">
          <label htmlFor="business-type-filter" className="search-filter-label">
            Type
          </label>
          <select
            id="business-type-filter"
            value={filters.businessType || 'all'}
            onChange={(e) => onFiltersChange({ 
              businessType: e.target.value === 'all' ? undefined : e.target.value 
            })}
            className="search-filter-select"
          >
            <option value="all">All Types</option>
            <option value="Indoor Dog Park">Indoor Dog Park</option>
            <option value="Dog Park">Dog Park</option>
            <option value="Dog-Friendly Establishment">Dog-Friendly Establishment</option>
          </select>
        </div>

        {/* Minimum Rating Filter */}
        <div className="search-filter-group">
          <label htmlFor="rating-filter" className="search-filter-label">
            Min Rating
          </label>
          <select
            id="rating-filter"
            value={filters.minRating || ''}
            onChange={(e) => onFiltersChange({ 
              minRating: e.target.value ? Number(e.target.value) : undefined 
            })}
            className="search-filter-select"
          >
            <option value="">Any Rating</option>
            <option value="4">4+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
            <option value="4.8">4.8+ Stars</option>
          </select>
        </div>

        {/* Price Level Filter */}
        <div className="search-filter-group">
          <label htmlFor="price-filter" className="search-filter-label">
            Price
          </label>
          <select
            id="price-filter"
            value={filters.priceLevel || ''}
            onChange={(e) => onFiltersChange({ 
              priceLevel: e.target.value ? Number(e.target.value) : undefined 
            })}
            className="search-filter-select"
          >
            <option value="">Any Price</option>
            <option value="0">Free</option>
            <option value="1">$ - Inexpensive</option>
            <option value="2">$$ - Moderate</option>
            <option value="3">$$$ - Expensive</option>
            <option value="4">$$$$ - Very Expensive</option>
          </select>
        </div>

        {/* Results Count */}
        <div className="search-filter-results">
          <span className="search-filter-results-count">
            {resultCount} {resultCount === 1 ? 'park' : 'parks'} found
          </span>
        </div>
      </div>
    </div>
  );
}









