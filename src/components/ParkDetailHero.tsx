'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DogPark } from '@/types/dog-park';
import ParkStatusBadge from '@/components/ParkStatusBadge';
import { formatBusinessTypeName } from '@/lib/park-description';
import { useToast } from '@/contexts/ToastContext';

interface ParkDetailHeroProps {
  park: DogPark;
  citySlug: string;
  stateSlug?: string;
  stateName?: string;
  categoryTitle?: string;
  categoryHref?: string;
}

export default function ParkDetailHero({
  park,
  citySlug,
  stateSlug,
  stateName = 'California',
  categoryTitle = 'Dog Training',
  categoryHref = '/training-facilities',
}: ParkDetailHeroProps) {
  const { showSuccess } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Initialize favorite state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`saved_park_${park.id}`);
      if (saved === 'true') {
        setIsSaved(true);
      }
    } catch {
      // Ignore storage errors in private browsing
    }
  }, [park.id]);

  const toggleSave = () => {
    try {
      const nextState = !isSaved;
      setIsSaved(nextState);
      localStorage.setItem(`saved_park_${park.id}`, String(nextState));
      showSuccess(nextState ? `Saved ${park.name} to your favorites!` : `Removed ${park.name} from favorites.`);
    } catch {
      setIsSaved(!isSaved);
    }
  };

  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${park.name} | IndoorDogPark`,
          text: `Check out ${park.name} in ${park.city}, ${park.state} on IndoorDogPark!`,
          url,
        });
        return;
      } catch {
        // Fallback to clipboard on abort/error
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      showSuccess('Link copied to clipboard!');
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      showSuccess('Link ready: ' + url);
    }
  };

  const businessTypeDisplay = formatBusinessTypeName(park.businessType);
  const mapDirectionsUrl = park.full_address
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(park.full_address)}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${park.name} ${park.city} ${park.state}`)}`;

  return (
    <section className="park-hero-modern">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="breadcrumbs-modern">
          <Link href="/" className="breadcrumb-link">
            <i className="bi bi-house-door-fill text-xs mr-1 opacity-70"></i>
            Home
          </Link>
          <i className="bi bi-chevron-right breadcrumb-separator"></i>

          {categoryHref && (
            <>
              <Link href={categoryHref} className="breadcrumb-link">
                {categoryTitle}
              </Link>
              <i className="bi bi-chevron-right breadcrumb-separator"></i>
            </>
          )}

          {stateSlug && (
            <>
              <Link href={`/states/${stateSlug}`} className="breadcrumb-link hidden sm:inline-flex">
                {stateName}
              </Link>
              <i className="bi bi-chevron-right breadcrumb-separator hidden sm:inline-flex"></i>
            </>
          )}

          <Link href={`/cities/${citySlug}`} className="breadcrumb-link">
            {park.city}
          </Link>
          <i className="bi bi-chevron-right breadcrumb-separator"></i>

          <span className="breadcrumb-current truncate max-w-[200px] sm:max-w-xs" aria-current="page">
            {park.name}
          </span>
        </nav>

        {/* Hero Header Content */}
        <div className="hero-main-header">
          {/* Badge Row */}
          <div className="hero-badge-row">
            <span className="hero-pill-badge category-badge">
              <i className="bi bi-shield-shaded text-amber-400"></i>
              {businessTypeDisplay}
            </span>

            {(park.listingType === 'featured' || park.dataQuality === 'verified') && (
              <span className="hero-pill-badge verified-badge">
                <i className="bi bi-patch-check-fill text-emerald-400"></i>
                Verified Listing
              </span>
            )}

            <ParkStatusBadge park={park} showNextChange={false} className="hero-status-pill" />
          </div>

          {/* Listing Title */}
          <h1 className="hero-listing-title">{park.name}</h1>

          {/* Rating & Address Sub-header */}
          <div className="hero-meta-row">
            {park.rating && park.rating > 0 ? (
              <div className="hero-rating-badge flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15">
                <div className="flex items-center text-amber-400 text-sm">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`bi ${
                        i < Math.floor(park.rating)
                          ? 'bi-star-fill'
                          : i < park.rating
                          ? 'bi-star-half'
                          : 'bi-star'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-white text-base ml-1">{park.rating.toFixed(1)}</span>
                <span className="text-white/70 text-xs font-medium">({park.reviewCount || 0} reviews)</span>
              </div>
            ) : null}

            <div className="hero-location-snippet flex items-center gap-1.5 text-white/90 text-sm font-medium">
              <i className="bi bi-geo-alt-fill text-rose-400 text-base"></i>
              <span>{park.full_address || `${park.city}, ${park.state}`}</span>
            </div>
          </div>

          {/* Quick Actions Row */}
          <div className="hero-actions-bar">
            {park.phone && (
              <a
                href={`tel:${park.phone}`}
                className="hero-action-btn primary-action"
                title={`Call ${park.name}`}
              >
                <i className="bi bi-telephone-fill"></i>
                <span>Call {park.phone}</span>
              </a>
            )}

            {park.website && (
              <a
                href={park.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-action-btn secondary-action"
                title={`Visit ${park.name} official website`}
              >
                <i className="bi bi-globe2"></i>
                <span>Visit Website</span>
                <i className="bi bi-box-arrow-up-right text-[11px] opacity-70 ml-0.5"></i>
              </a>
            )}

            <a
              href={mapDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-action-btn secondary-action"
              title="Get directions on Google Maps"
            >
              <i className="bi bi-map-fill text-cyan-300"></i>
              <span>Directions</span>
            </a>

            <button
              type="button"
              onClick={toggleSave}
              className={`hero-action-btn icon-action ${isSaved ? 'saved-active' : ''}`}
              title={isSaved ? 'Remove from Saved' : 'Save to Favorites'}
              aria-label={isSaved ? 'Remove from Saved' : 'Save to Favorites'}
            >
              <i className={`bi ${isSaved ? 'bi-heart-fill text-rose-500' : 'bi-heart'}`}></i>
              <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="hero-action-btn icon-action"
              title="Share listing"
              aria-label="Share listing"
            >
              <i className={`bi ${copiedLink ? 'bi-check-lg text-emerald-400' : 'bi-share-fill'}`}></i>
              <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
