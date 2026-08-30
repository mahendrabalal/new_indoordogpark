'use client';

import { useState } from 'react';
import { DogPark } from '@/types/dog-park';
import ParkMapClient from '@/components/ParkMapClient';
import { useToast } from '@/contexts/ToastContext';

interface ParkLocationCardProps {
  park: DogPark;
}

export default function ParkLocationCard({ park }: ParkLocationCardProps) {
  const { showSuccess } = useToast();
  const [copied, setCopied] = useState(false);

  const address = park.full_address || `${park.street || park.address}, ${park.city}, ${park.state} ${park.zipCode || ''}`.trim();
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  const appleMapsUrl = `https://maps.apple.com/?daddr=${encodeURIComponent(address)}`;

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      showSuccess('Address copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showSuccess('Address: ' + address);
    }
  };

  return (
    <section className="premium-content-section location-map-section">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2 m-0">
            <i className="bi bi-geo-alt-fill text-orange-500 text-lg"></i>
            Location & Directions
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Find parking, route details, and interactive map</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyAddress}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
            title="Copy address"
          >
            <i className={`bi ${copied ? 'bi-check-lg text-emerald-600' : 'bi-clipboard'}`}></i>
            <span>{copied ? 'Copied' : 'Copy Address'}</span>
          </button>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
          >
            <i className="bi bi-map-fill"></i>
            <span>Open Maps</span>
            <i className="bi bi-box-arrow-up-right text-[10px] opacity-80"></i>
          </a>
        </div>
      </div>

      {/* Address Card Bar */}
      <div className="bg-gradient-to-r from-orange-50/70 to-amber-50/50 border border-orange-100/80 rounded-xl p-4 mb-5 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0 mt-0.5">
          <i className="bi bi-building"></i>
        </div>
        <div className="flex-1">
          <div className="text-xs font-bold uppercase tracking-wider text-orange-800">Physical Address</div>
          <p className="text-sm font-semibold text-gray-900 mt-0.5 leading-snug">{address}</p>
        </div>
      </div>

      {/* Map Client Container */}
      {park.latitude && park.longitude ? (
        <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200 h-[360px] sm:h-[400px] mb-4">
          <ParkMapClient park={park} />
        </div>
      ) : null}

      {/* Navigation Quick Links */}
      <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
        <span className="text-gray-500 font-medium">Get directions via:</span>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold hover:underline"
        >
          <i className="bi bi-google"></i> Google Maps
        </a>
        <span className="text-gray-300">•</span>
        <a
          href={appleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-slate-700 hover:text-slate-900 font-semibold hover:underline"
        >
          <i className="bi bi-apple"></i> Apple Maps
        </a>
      </div>
    </section>
  );
}
