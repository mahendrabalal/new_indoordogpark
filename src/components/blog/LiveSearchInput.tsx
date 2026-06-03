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
  
  // Update local state if URL changes externally (e.g. back button)
  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam !== null && searchParam !== term) {
      setTerm(searchParam);
    } else if (searchParam === null && term !== '') {
      setTerm('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (term) {
        params.set('search', term);
      } else {
        params.delete('search');
      }
      
      // reset to page 1 on search
      params.delete('page');

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [term, pathname, router, searchParams]);

  return (
    <input
      id={id}
      type="search"
      name="search"
      value={term}
      onChange={(e) => setTerm(e.target.value)}
      placeholder={placeholder}
      className={className}
      aria-label={ariaLabel}
    />
  );
}
