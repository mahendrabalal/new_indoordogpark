'use client'

import { useEffect } from 'react'

// Load external CSS asynchronously to avoid render-blocking
export function LazyStyles() {
  useEffect(() => {
    // Check if already loaded
    if (document.getElementById('bootstrap-icons-stylesheet')) {
      return
    }

    // Load Bootstrap Icons CSS asynchronously with media query to prevent render blocking
    // This technique prevents the CSS from blocking page rendering
    const bootstrapIconsLink = document.createElement('link') as HTMLLinkElement
    bootstrapIconsLink.rel = 'stylesheet'
    bootstrapIconsLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css'
    bootstrapIconsLink.id = 'bootstrap-icons-stylesheet'
    // Use media query trick to prevent render blocking - set to 'print' initially
    bootstrapIconsLink.media = 'print'
    bootstrapIconsLink.onload = () => {
      // Switch to 'all' once loaded to apply styles
      bootstrapIconsLink.media = 'all'
    }
    bootstrapIconsLink.onerror = () => {
      // Remove on error to allow retry
      bootstrapIconsLink.remove()
    }
    bootstrapIconsLink.crossOrigin = 'anonymous'
    // Load after initial render to avoid blocking critical path
    // Use requestIdleCallback for better performance, with fallback
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        document.head.appendChild(bootstrapIconsLink)
      }, { timeout: 3000 }) // Increased timeout to ensure it loads after critical resources
    } else {
      // Fallback: delay slightly to ensure critical CSS loads first
      setTimeout(() => {
        document.head.appendChild(bootstrapIconsLink)
      }, 100)
    }
  }, [])

  return null
}

// Load Leaflet CSS only when map component is used
export function loadLeafletStyles() {
  if (typeof window === 'undefined') return
  
  const leafletStylesheetId = 'leaflet-stylesheet'
  if (document.getElementById(leafletStylesheetId)) {
    return // Already loaded
  }

  const link = document.createElement('link')
  link.id = leafletStylesheetId
  link.rel = 'stylesheet'
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
  link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
  link.crossOrigin = 'anonymous'
  link.media = 'all'
  
  document.head.appendChild(link)
}



