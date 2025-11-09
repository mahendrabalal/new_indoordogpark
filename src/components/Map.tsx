'use client';

import { useEffect, useRef } from 'react';
import type { Map as LeafletMap, Marker } from 'leaflet';
import { DogPark } from '@/types/dog-park';

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

      // Add markers for parks
      parks.forEach(park => {
        if (park.latitude && park.longitude && mapInstanceRef.current) {
          const marker = L.marker([park.latitude, park.longitude])
            .addTo(mapInstanceRef.current)
            .bindPopup(`
              <div style="min-width: 200px;">
                <h6>${park.name}</h6>
                <p class="mb-1"><strong>Type:</strong> ${park.businessType}</p>
                <p class="mb-1"><strong>Rating:</strong> ${park.rating} ⭐</p>
                <p class="mb-1"><strong>Address:</strong> ${park.full_address}</p>
                <button class="btn btn-sm btn-primary" onclick="window.handleParkClick('${park.id}')">
                  View Details
                </button>
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
