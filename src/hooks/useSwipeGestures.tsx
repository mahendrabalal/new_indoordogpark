'use client';

import { useRef, useCallback, useEffect } from 'react';

interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  restrictToVertical?: boolean;
  restrictToHorizontal?: boolean;
}

interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

/**
 * Custom hook for detecting swipe gestures on touch devices
 * Supports horizontal and vertical swipes with configurable thresholds
 */
export function useSwipeGestures(options: SwipeGestureOptions = {}) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    restrictToVertical = false,
    restrictToHorizontal = false,
  } = options;

  const startTouch = useRef<TouchPoint | null>(null);
  const endTouch = useRef<TouchPoint | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    startTouch.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    endTouch.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!startTouch.current || !endTouch.current) return;

    const deltaX = endTouch.current.x - startTouch.current.x;
    const deltaY = endTouch.current.y - startTouch.current.y;
    const deltaTime = endTouch.current.time - startTouch.current.time;

    // Ensure the swipe was quick enough (less than 300ms)
    if (deltaTime > 300) return;

    // Calculate the absolute distance
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Determine if this is a horizontal or vertical swipe
    const isHorizontalSwipe = !restrictToVertical && absDeltaX > threshold && absDeltaX > absDeltaY;
    const isVerticalSwipe = !restrictToHorizontal && absDeltaY > threshold && absDeltaY > absDeltaX;

    // Handle horizontal swipes
    if (isHorizontalSwipe) {
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }

    // Handle vertical swipes
    if (isVerticalSwipe) {
      if (deltaY > 0 && onSwipeDown) {
        onSwipeDown();
      } else if (deltaY < 0 && onSwipeUp) {
        onSwipeUp();
      }
    }

    // Reset touch points
    startTouch.current = null;
    endTouch.current = null;
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold, restrictToVertical, restrictToHorizontal]);

  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Add touch event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Cleanup
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    swipeRef: elementRef,
  };
}

/**
 * Hook specifically for map/list toggle with swipe gestures
 */
export function useMapListSwipeGestures(
  isMapView: boolean,
  onToggleView: () => void,
  isEnabled: boolean = true
) {
  // Only enable swipe gestures on mobile devices
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  const shouldEnable = isEnabled && isMobile;

  const { swipeRef } = useSwipeGestures({
    onSwipeLeft: shouldEnable && !isMapView ? onToggleView : undefined,
    onSwipeRight: shouldEnable && isMapView ? onToggleView : undefined,
    threshold: 75, // Slightly higher threshold for map toggle to prevent accidental triggers
  });

  return swipeRef;
}