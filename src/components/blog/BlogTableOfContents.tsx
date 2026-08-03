'use client';

import { HeadingItem } from '@/lib/extract-headings';
import { useEffect, useRef, useState } from 'react';

interface BlogTableOfContentsProps {
  items: HeadingItem[];
  isMobile?: boolean;
}

export default function BlogTableOfContents({ items, isMobile = false }: BlogTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(!isMobile);
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
      <div 
        className={`flex justify-between items-center ${isMobile ? 'cursor-pointer select-none' : ''}`}
        onClick={() => isMobile && setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-semibold text-gray-900 m-0">Table Of Contents</h3>
        {isMobile && (
          <svg 
            className={`w-5 h-5 text-[#FF5722] transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </div>
      
      {isExpanded && (
        <ul className="space-y-2 mt-4 pt-3 border-t border-[#FF5722]/10">
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
      )}
    </div>
  );
}

