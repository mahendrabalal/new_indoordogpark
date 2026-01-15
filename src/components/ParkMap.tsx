'use client';

import { useEffect, useRef } from 'react';
import { DogPark } from '@/types/dog-park';

// Type definitions for Leaflet
// Note: Leaflet is dynamically imported, so we use type aliases
// This is a pragmatic solution - see DEPENDENCY_ANALYSIS.md for details
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LeafletMap = any;

interface ParkMapProps {
  park: DogPark;
}

export default function ParkMap({ park }: ParkMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const resizeHandlerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current || !park.latitude || !park.longitude) return;

    const initializeMap = async () => {
      // Load Leaflet CSS on demand
      const { loadLeafletStyles } = await import('@/components/LazyStyles');
      loadLeafletStyles();

      const L = (await import('leaflet')).default;

      // Fix for default markers
      delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      if (!mapInstanceRef.current && mapRef.current && park.latitude && park.longitude) {
        mapInstanceRef.current = L.map(mapRef.current).setView(
          [park.latitude, park.longitude],
          15
        );

        // Create a custom TileLayer to add alt attribute to tiles for SEO/Accessibility
        const CustomTileLayer = L.TileLayer.extend({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          createTile: function (coords: any, done: any) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const tile = (L.TileLayer.prototype as any).createTile.call(this, coords, done);
            tile.alt = "Map tile";
            return tile;
          }
        });

        new CustomTileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstanceRef.current);

        // Add marker for the park
        L.marker([park.latitude, park.longitude])
          .addTo(mapInstanceRef.current)
          .bindPopup(`
            <div style="min-width: 200px; text-align: center;">
              <h6 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">${park.name}</h6>
              <p style="margin: 0; font-size: 12px; color: #666;">${park.full_address}</p>
            </div>
          `)
          .openPopup();

        // Invalidate map size after a short delay to ensure container is visible
        // This is important when the map is in a sidebar or initially hidden
        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 100);

        // Also invalidate size when the map container becomes visible (using Intersection Observer)
        observerRef.current = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && mapInstanceRef.current) {
                setTimeout(() => {
                  mapInstanceRef.current?.invalidateSize();
                }, 100);
              }
            });
          },
          { threshold: 0.1 }
        );

        if (mapRef.current) {
          observerRef.current.observe(mapRef.current);
        }

        // Handle window resize events to ensure map displays correctly
        resizeHandlerRef.current = () => {
          if (mapInstanceRef.current) {
            setTimeout(() => {
              mapInstanceRef.current?.invalidateSize();
            }, 100);
          }
        };

        window.addEventListener('resize', resizeHandlerRef.current);
      }
    };

    initializeMap();

    return () => {
      if (resizeHandlerRef.current) {
        window.removeEventListener('resize', resizeHandlerRef.current);
        resizeHandlerRef.current = null;
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [park]);

  if (!park.latitude || !park.longitude) {
    return (
      <div className="park-map-placeholder">
        <p>Map unavailable for this location</p>
      </div>
    );
  }

  return <div className="park-map" ref={mapRef} />;
}
