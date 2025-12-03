'use client'

import { useEffect } from 'react'

// Load external CSS asynchronously to avoid render-blocking
export function LazyStyles() {
  useEffect(() => {
    // Load Bootstrap Icons CSS asynchronously with media query to prevent render blocking
    const bootstrapIconsLink = document.createElement('link') as HTMLLinkElement
    bootstrapIconsLink.rel = 'stylesheet'
    bootstrapIconsLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css'
    bootstrapIconsLink.id = 'bootstrap-icons-stylesheet'
    bootstrapIconsLink.media = 'print'
    bootstrapIconsLink.onload = () => {
      bootstrapIconsLink.media = 'all'
    }
    bootstrapIconsLink.crossOrigin = 'anonymous'
    document.head.appendChild(bootstrapIconsLink)
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



