'use client';

import { useEffect, useState, useCallback } from 'react';

interface ScrollPosition {
  y: number;
  direction: 'up' | 'down' | null;
}

export const useNavbarScroll = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);

  // Industry standard thresholds
  const HIDE_THRESHOLD = 100; // Start hiding after 100px scroll
  const SHOW_THRESHOLD = 50;   // Show navbar when scrolling up 50px
  const DEBOUNCE_MS = 16;      // ~60fps for smooth animations

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    // Don't hide on mobile when menu might be open
    if (window.innerWidth <= 768) {
      setIsVisible(true);
      return;
    }

    // Determine scroll direction
    const direction = currentScrollY > lastScrollY ? 'down' : 'up';
    setScrollDirection(direction);

    // Hide navbar when scrolling down past threshold
    if (direction === 'down' && currentScrollY > HIDE_THRESHOLD) {
      setIsVisible(false);
    }
    // Show navbar when scrolling up past threshold
    else if (direction === 'up' && currentScrollY < SHOW_THRESHOLD) {
      setIsVisible(true);
    }
    // Show navbar when scrolling up from anywhere
    else if (direction === 'up' && !isVisible) {
      setIsVisible(true);
    }

    setLastScrollY(currentScrollY);
  }, [lastScrollY, isVisible]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const throttledHandleScroll = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(handleScroll, DEBOUNCE_MS);
    };

    // Add scroll listener
    window.addEventListener('scroll', throttledHandleScroll, { passive: true });

    // Handle window resize
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsVisible(true); // Always visible on mobile
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Initial check for mobile
    handleResize();

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      window.removeEventListener('resize', handleResize);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [handleScroll]);

  return {
    isVisible,
    scrollDirection,
    shouldHide: !isVisible && window.scrollY > HIDE_THRESHOLD
  };
};