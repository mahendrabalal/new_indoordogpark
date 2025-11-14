'use client';

import { useEffect, useRef } from 'react';
import { DogPark } from '@/types/dog-park';

// Type definitions for Leaflet (since it's dynamically imported)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LeafletMap = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Marker = any;

interface MapProps {
  parks: DogPark[];
  onParkClick?: (park: DogPark) => void;
}

declare global {
  interface Window {
    handleParkClick?: (parkId: string) => void;
  }
}

export default function Map({ parks, onParkClick }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Marker[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    const initializeMap = async () => {
      const L = (await import('leaflet')).default;
      
      // Fix for default markers
      delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      if (!mapInstanceRef.current && mapRef.current) {
        mapInstanceRef.current = L.map(mapRef.current).setView([36.7783, -119.4179], 6);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstanceRef.current);
      }

      // Clear existing markers
      markersRef.current.forEach(marker => mapInstanceRef.current?.removeLayer(marker));
      markersRef.current = [];

      // Add markers for parks with custom dog park icons
      parks.forEach(park => {
        if (park.latitude && park.longitude && mapInstanceRef.current) {
          // Determine icon and label based on park type
          let iconSymbol = '🐕';
          let labelText = 'Dog Park';
          let bgColor = '#00bfff';
          
          if (park.businessType === 'Indoor Dog Park') {
            iconSymbol = '🏠';
            labelText = 'Indoor';
            bgColor = '#8b5cf6';
          } else if (park.businessType === 'Dog-Friendly Establishment') {
            iconSymbol = '🏪';
            labelText = 'Business';
            bgColor = '#f59e0b';
          } else {
            iconSymbol = '🐕';
            labelText = 'Park';
            bgColor = '#10b981';
          }

          // Create custom dog park icon
          const parkIcon = L.divIcon({
            className: 'custom-park-marker',
            html: `
              <div class="park-marker" data-type="${park.businessType}">
                <div class="park-marker-icon" style="background: ${bgColor};">
                  <span class="park-icon-symbol">${iconSymbol}</span>
                </div>
                <div class="park-marker-label">${labelText}</div>
              </div>
            `,
            iconSize: [48, 60],
            iconAnchor: [24, 60],
          });

          const marker = L.marker([park.latitude, park.longitude], { icon: parkIcon })
            .addTo(mapInstanceRef.current)
            .bindPopup(`
              <div style="min-width: 260px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                  <span style="font-size: 1.5rem;">${iconSymbol}</span>
                  <h5 style="margin: 0; font-size: 1.1rem; font-weight: 600; color: #1f2937; flex: 1;">${park.name}</h5>
                </div>
                
                <div style="background: #f3f4f6; padding: 10px; border-radius: 8px; margin-bottom: 12px;">
                  <p style="margin: 0; font-size: 0.85rem; color: #374151; line-height: 1.5;">
                    <i class="bi bi-geo-alt-fill" style="color: #ef4444;"></i> <strong>${park.address || park.full_address}</strong>
                  </p>
                  <p style="margin: 4px 0 0 0; font-size: 0.85rem; color: #6b7280;">
                    ${park.city}, ${park.state} ${park.zipCode || ''}
                  </p>
                </div>

                <div style="display: flex; gap: 15px; margin-bottom: 10px;">
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <i class="bi bi-star-fill" style="color: #fbbf24; font-size: 0.9rem;"></i>
                    <span style="font-size: 0.9rem; font-weight: 600; color: #1f2937;">${park.rating}</span>
                    <span style="font-size: 0.85rem; color: #9ca3af;">(${park.reviewCount})</span>
                  </div>
                  <div style="padding: 3px 10px; background: ${bgColor}; color: white; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                    ${labelText}
                  </div>
                </div>
                
                <a 
                  href="/parks/${park.slug || park.id}" 
                  style="
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    margin-top: 12px;
                    padding: 10px 18px;
                    background: ${bgColor};
                    color: white;
                    text-decoration: none;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    transition: all 0.2s ease;
                    width: 100%;
                    justify-content: center;
                  "
                  onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'"
                  onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
                >
                  <i class="bi bi-arrow-right-circle"></i> View Details
                </a>
              </div>
            `);
          
          markersRef.current.push(marker);
        }
      });

      // Fit map to show all markers
      if (markersRef.current.length > 0 && mapInstanceRef.current) {
        const group = L.featureGroup(markersRef.current);
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
      }
    };

    initializeMap();

    // Handle park clicks from popup
    window.handleParkClick = (parkId: string) => {
      const park = parks.find(p => p.id === parkId);
      if (park && onParkClick) {
        onParkClick(park);
      }
    };

    return () => {
      delete window.handleParkClick;
    };
  }, [parks, onParkClick]);

  return <div id="map" ref={mapRef} />;
}
