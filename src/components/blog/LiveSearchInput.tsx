'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTransition, useState, useEffect, useRef } from 'react';

export default function LiveSearchInput({
  id,
  defaultValue = '',
  placeholder = 'Search...',
  className = '',
  'aria-label': ariaLabel,
}: {
  id: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  'aria-label'?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [term, setTerm] = useState(defaultValue);
  const searchParamsString = searchParams.toString();
  const currentSearchTerm = searchParams.get('search') ?? '';
  const latestSearchParamsString = useRef(searchParamsString);
  const userEditedRef = useRef(false);
  
  // Update local state if URL changes externally (e.g. back button)
  useEffect(() => {
    setTerm((currentTerm) => (
      currentTerm === currentSearchTerm ? currentTerm : currentSearchTerm
    ));
  }, [currentSearchTerm]);

  useEffect(() => {
    latestSearchParamsString.current = searchParamsString;
  }, [searchParamsString]);

  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    if (!userEditedRef.current) {
      return;
    }

    const handler = setTimeout(() => {
      const params = new URLSearchParams(latestSearchParamsString.current);
      if (term) {
        params.set('search', term);
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

      if (nextUrl === currentUrl) {
        userEditedRef.current = false;
        return;
      }

      startTransition(() => {
        userEditedRef.current = false;
        router.replace(nextUrl, { scroll: false });
      });
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [term, pathname, router]);

  return (
    <input
      id={id}
      type="search"
      name="search"
      value={term}
      onChange={(e) => {
        userEditedRef.current = true;
        setTerm(e.target.value);
      }}
      placeholder={placeholder}
      className={className}
      aria-label={ariaLabel}
    />
  );
}
