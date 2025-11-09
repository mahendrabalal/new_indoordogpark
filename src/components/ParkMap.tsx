'use client';

import { useEffect, useRef } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import { DogPark } from '@/types/dog-park';

interface ParkMapProps {
  park: DogPark;
}

export default function ParkMap({ park }: ParkMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current || !park.latitude || !park.longitude) return;

    const initializeMap = async () => {
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

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
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
      }
    };

    initializeMap();

    return () => {
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
