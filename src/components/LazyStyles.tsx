'use client'

import { useEffect } from 'react'

// Load external CSS asynchronously to avoid render-blocking
export function LazyStyles() {
  useEffect(() => {
    // Only load if not already loaded
    const loadStylesheet = (href: string, id?: string) => {
      if (id && document.getElementById(id)) {
        return // Already loaded
      }
      
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = href
      link.media = 'all'
      if (id) link.id = id
      
      // Add crossOrigin for CDN resources
      if (href.includes('cdn.jsdelivr.net') || href.includes('unpkg.com')) {
        link.crossOrigin = 'anonymous'
      }
      
      document.head.appendChild(link)
    }

    // Load Bootstrap Icons CSS asynchronously
    loadStylesheet(
      'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css',
      'bootstrap-icons-stylesheet'
    )
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



