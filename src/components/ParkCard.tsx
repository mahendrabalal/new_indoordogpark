'use client';

import Link from 'next/link';
import { DogPark } from '@/types/dog-park';
import FavoriteButton from '@/components/FavoriteButton';
import SearchHighlight from '@/components/SearchHighlight';
import { getParkStatus } from '@/lib/park-hours';
import { useEffect, useState } from 'react';

interface ParkCardProps {
  park: DogPark;
  searchTerm?: string;
}

export default function ParkCard({ park, searchTerm }: ParkCardProps) {
  const [statusInfo, setStatusInfo] = useState(() => getParkStatus(park));
  const [imageError, setImageError] = useState(false);

  // Update status every minute to keep it real-time
  useEffect(() => {
    const updateStatus = () => {
      setStatusInfo(getParkStatus(park));
    };

    // Update immediately on mount
    updateStatus();

    // Update every minute
    const interval = setInterval(updateStatus, 60000);

    return () => clearInterval(interval);
  }, [park]);

  // Reset image error when park changes
  useEffect(() => {
    setImageError(false);
  }, [park.id]);
  // Extract the first photo URL from photos array if available, otherwise use single photo field
  // Prefers local images over external URLs
  const getImageUrl = () => {
    const isLocalImage = (url: string): boolean => {
      return url.startsWith('/images/') || url.startsWith('./images/');
    };
    
    // Priority 1: Check single photo field (prefer local)
    if (typeof park.photo === 'string' && park.photo.trim() !== '') {
      const photoUrl = park.photo.trim();
      if (isLocalImage(photoUrl)) {
        return photoUrl; // Prefer local images
      }
      return photoUrl; // Fallback to external if no local
    }
    
    // Priority 2: Check photos array (prefer local)
    if (park.photos && park.photos.length > 0) {
      // First, try to find a local image
      for (const photo of park.photos) {
        if (photo?.url && typeof photo.url === 'string') {
          const photoUrl = photo.url.trim();
          if (isLocalImage(photoUrl)) {
            return photoUrl; // Prefer local images
          }
        }
      }
      
      // If no local image, use first available
      const firstPhoto = park.photos[0];
      if (firstPhoto?.url) return firstPhoto.url;
    }
    
    return 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
  };

  const imageUrl = getImageUrl();
  
  // Fallback image URL
  const fallbackImageUrl = 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
  
  // Use fallback image if error occurred
  const displayImageUrl = imageError ? fallbackImageUrl : imageUrl;

  // Handle image load error - Next.js Image component doesn't support onError directly
  // We'll use a wrapper approach with a regular img tag as fallback

  // Determine pricing display (adapt from rental pricing to park entry fees)
  const getPricingDisplay = () => {
    if (park.pricing?.isFree) {
      return { current: 'Free', period: null };
    }
    if (park.pricing?.dropInFee) {
      const period = park.pricing.pricingType === 'per-visit' ? 'visit' : park.pricing.pricingType || 'visit';
      return { current: `$${park.pricing.dropInFee}`, period };
    }
    if (park.pricing?.dailyRate) {
      return { current: `$${park.pricing.dailyRate}`, period: 'daily' };
    }
    if (park.pricing?.hourlyRate) {
      return { current: `$${park.pricing.hourlyRate}`, period: 'hourly' };
    }
    if (park.pricing?.monthlyRate) {
      return { current: `$${park.pricing.monthlyRate}`, period: 'monthly' };
    }
    return { current: 'Free', period: null };
  };

  const pricing = getPricingDisplay();

  // Get verification badge text
  const getVerificationBadge = () => {
    if (park.websiteVerified || park.dataQuality === 'verified') return 'Trusted Location';
    return null;
  };

  const verificationBadge = getVerificationBadge();
  const isFeatured = park.listingType === 'featured';

  return (
    <Link href={`/parks/${park.slug || park.id}`} className={`park-card-new ${isFeatured ? 'featured-park-card' : ''}`}>
      {/* Featured Badge Overlay */}
      {isFeatured && (
        <div className="featured-badge-overlay">
          <span className="featured-badge">
            <i className="bi bi-star-fill"></i> FEATURED
          </span>
        </div>
      )}
      <div className="park-card-image-wrapper">
        {/* Use native img tag for better error handling with external URLs */}
        {/* Next.js Image component's onError doesn't work reliably with unoptimized external images */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={displayImageUrl}
          alt={`${park.name} - ${park.businessType} in ${park.city}, ${park.state} | Indoor Dog Park`}
          className="park-card-image"
          loading="lazy"
          decoding="async"
          style={{ objectFit: 'cover', width: '100%', height: '100%', display: 'block' }}
          onError={() => {
            // If image fails to load, switch to fallback
            if (!imageError && displayImageUrl !== fallbackImageUrl) {
              setImageError(true);
            }
          }}
        />
      </div>

      <div className="park-card-body">
        {/* Header: Category and Title */}
        <div className="park-card-header">
          <div className="park-card-header-top">
            <div className="park-card-category">
              {searchTerm ? (
                <SearchHighlight text={park.businessType.toUpperCase()} searchTerm={searchTerm} />
              ) : (
                park.businessType.toUpperCase()
              )}
            </div>
            <h3 className="park-card-title">
              {searchTerm ? (
                <SearchHighlight text={park.name} searchTerm={searchTerm} />
              ) : (
                park.name
              )}
            </h3>
          </div>
          {/* Location inline with header */}
          <p className="park-card-location">
            {searchTerm ? (
              <SearchHighlight text={`${park.city}, ${park.state}`} searchTerm={searchTerm} />
            ) : (
              `${park.city}, ${park.state}`
            )}
          </p>
        </div>

        {/* Badges Row: Trusted + Status combined */}
        {(verificationBadge || statusInfo.status !== 'unknown') && (
          <div className="park-card-badges-row">
            {verificationBadge && (
              <span className="trusted-badge-text">{verificationBadge}</span>
            )}
            {statusInfo.status !== 'unknown' && (
              <span className={`status-badge status-${statusInfo.status === '24/7' ? '24x7' : statusInfo.status}`}>
                {statusInfo.status === 'open' && <i className="bi bi-circle-fill"></i>}
                {statusInfo.status === 'closed' && <i className="bi bi-circle"></i>}
                {statusInfo.status === '24/7' && <i className="bi bi-circle-fill"></i>}
                <span className="status-text">
                  {statusInfo.status === 'open' && 'Open Now'}
                  {statusInfo.status === 'closed' && 'Closed'}
                  {statusInfo.status === '24/7' && 'Open 24/7'}
                </span>
              </span>
            )}
          </div>
        )}

        {/* Footer: Rating and Pricing combined */}
        <div className="park-card-footer">
          <div className="park-card-rating">
            <i className="bi bi-star-fill"></i>
            <span className="rating-value">{park.rating}</span>
            <span className="rating-count">({park.reviewCount} reviews)</span>
          </div>
          <div className="park-card-pricing">
            <span className="price-current">{pricing.current}</span>
            {pricing.period && (
              <span className="price-period"> /{pricing.period}</span>
            )}
          </div>
        </div>

        {/* Favorite Button */}
        <div className="park-card-favorite">
          <FavoriteButton
            parkId={park.id}
            parkSlug={park.slug}
            className="favorite-btn-card"
            aria-label={`Toggle favorite for ${park.name}`}
          />
        </div>
      </div>
    </Link>
  );
}
