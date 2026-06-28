'use client';

import { HeadingItem } from '@/lib/extract-headings';
import { useEffect, useRef, useState } from 'react';

interface BlogTableOfContentsProps {
  items: HeadingItem[];
}

export default function BlogTableOfContents({ items }: BlogTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const isScrollingRef = useRef(false);
  const sectionRefs = useRef<Map<string, IntersectionObserverEntry>>(new Map());

  useEffect(() => {
    if (items.length === 0) return;

    // Optional: initial check to highlight first item if nothing is active initially
    if (!activeId) {
      setActiveId(items[0]?.id || '');
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            sectionRefs.current.set(entry.target.id, entry);
          } else {
            sectionRefs.current.delete(entry.target.id);
          }
        });

        // Find topmost visible section
        const visibleSections = Array.from(sectionRefs.current.values())
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleSections.length > 0) {
          setActiveId(visibleSections[0].target.id);
        }
      },
      {
        rootMargin: '-100px 0px -60% 0px', // Offset for header
        threshold: [0, 1],
      }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      isScrollingRef.current = true;
      setActiveId(id);

      const offset = 100; // Account for header
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth',
      });

      // Reset scroll tracking after scroll completes
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 1000);
    }
  };

  return (
    <div className="bg-[#FFF5F2] border-2 border-[#FF5722]/20 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Table Of Contents</h3>
      <ul className="space-y-2">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li key={item.id} className={item.level > 2 ? 'ml-4' : ''}>
              <button
                onClick={() => scrollToSection(item.id)}
                className={`text-left text-sm transition-colors w-full ${
                  isActive
                    ? 'text-[#FF5722] font-semibold'
                    : 'text-gray-700 hover:text-[#FF5722]'
                }`}
              >
                {item.title}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

