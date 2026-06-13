'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTransition, useState, useEffect, useRef, useMemo } from 'react';

export interface BlogSearchSuggestion {
  label: string;
  href: string;
  type: string;
  description?: string;
}

export default function LiveSearchInput({
  id,
  defaultValue = '',
  placeholder = 'Search...',
  className = '',
  suggestions = [],
  'aria-label': ariaLabel,
}: {
  id: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  suggestions?: BlogSearchSuggestion[];
  'aria-label'?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [term, setTerm] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchParamsString = searchParams.toString();
  const currentSearchTerm = searchParams.get('search') ?? '';
  const latestSearchParamsString = useRef(searchParamsString);

  // Update local state if URL changes externally (e.g. back button)
  useEffect(() => {
    setTerm((currentTerm) => (
      currentTerm === currentSearchTerm ? currentTerm : currentSearchTerm
    ));
  }, [currentSearchTerm]);

  useEffect(() => {
    latestSearchParamsString.current = searchParamsString;
  }, [searchParamsString]);

  const trimmedTerm = term.trim();
  const normalizedTerm = trimmedTerm.toLowerCase();
  const listboxId = `${id}-suggestions`;

  const visibleSuggestions = useMemo(() => {
    if (normalizedTerm.length < 2) {
      return [];
    }

    const matches = suggestions
      .filter((suggestion) => {
        const haystack = `${suggestion.label} ${suggestion.type} ${suggestion.description || ''}`.toLowerCase();
        return haystack.includes(normalizedTerm);
      })
      .sort((a, b) => {
        const aStartsWith = a.label.toLowerCase().startsWith(normalizedTerm);
        const bStartsWith = b.label.toLowerCase().startsWith(normalizedTerm);
        if (aStartsWith === bStartsWith) return a.label.localeCompare(b.label);
        return aStartsWith ? -1 : 1;
      })
      .slice(0, 6);

    return [
      ...matches,
      {
        label: `Search all articles for "${trimmedTerm}"`,
        href: '',
        type: 'Search',
      },
    ];
  }, [normalizedTerm, suggestions, trimmedTerm]);

  const commitSearch = (value: string) => {
    const nextTerm = value.trim();
    const params = new URLSearchParams(latestSearchParamsString.current);
    if (nextTerm) {
      params.set('search', nextTerm);
    } else {
      params.delete('search');
    }

    // reset to page 1 on search
    params.delete('page');

    const queryString = params.toString();
    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;
    const currentUrl = latestSearchParamsString.current
      ? `${pathname}?${latestSearchParamsString.current}`
      : pathname;

    setIsOpen(false);
    setActiveIndex(-1);

    if (nextUrl === currentUrl) {
      return;
    }

    startTransition(() => {
      router.push(nextUrl, { scroll: false });
    });
  };

  const selectSuggestion = (suggestion: BlogSearchSuggestion) => {
    setIsOpen(false);
    setActiveIndex(-1);

    if (suggestion.href) {
      startTransition(() => {
        router.push(suggestion.href, { scroll: false });
      });
      return;
    }

    commitSearch(trimmedTerm);
  };

  const showSuggestions = isOpen && visibleSuggestions.length > 0;

  return (
    <>
      <input
        id={id}
        type="search"
        name="search"
        value={term}
        onChange={(e) => {
          setTerm(e.target.value);
          setIsOpen(true);
          setActiveIndex(-1);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => {
          window.setTimeout(() => setIsOpen(false), 120);
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' && visibleSuggestions.length > 0) {
            e.preventDefault();
            setIsOpen(true);
            setActiveIndex((index) => (index + 1) % visibleSuggestions.length);
            return;
          }

          if (e.key === 'ArrowUp' && visibleSuggestions.length > 0) {
            e.preventDefault();
            setIsOpen(true);
            setActiveIndex((index) => (
              index <= 0 ? visibleSuggestions.length - 1 : index - 1
            ));
            return;
          }

          if (e.key === 'Enter') {
            e.preventDefault();
            const selectedSuggestion = activeIndex >= 0 ? visibleSuggestions[activeIndex] : null;
            if (selectedSuggestion) {
              selectSuggestion(selectedSuggestion);
            } else {
              commitSearch(term);
            }
            return;
          }

          if (e.key === 'Escape') {
            setIsOpen(false);
            setActiveIndex(-1);
          }
        }}
        placeholder={placeholder}
        className={className}
        aria-label={ariaLabel}
        aria-autocomplete="list"
        aria-controls={showSuggestions ? listboxId : undefined}
        aria-expanded={showSuggestions}
        aria-activedescendant={
          showSuggestions && activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined
        }
        autoComplete="off"
      />
      {showSuggestions && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl"
        >
          {visibleSuggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.type}-${suggestion.label}-${index}`}
              id={`${listboxId}-${index}`}
              type="button"
              role="option"
              aria-selected={index === activeIndex}
              className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition ${
                index === activeIndex ? 'bg-orange-50' : 'bg-white hover:bg-gray-50'
              }`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => selectSuggestion(suggestion)}
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-gray-900">{suggestion.label}</span>
                {suggestion.description && (
                  <span className="block truncate text-xs text-gray-500">{suggestion.description}</span>
                )}
              </span>
              <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                {suggestion.type}
              </span>
            </button>
          ))}
          <div className="border-t border-gray-100 px-4 py-2 text-xs text-gray-500">
            Press Enter to search, or choose a topic.
          </div>
        </div>
      )}
      {isPending && (
        <span className="absolute right-4 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#FF5722]" aria-hidden="true" />
      )}
    </>
  );
}
