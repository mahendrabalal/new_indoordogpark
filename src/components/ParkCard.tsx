'use client';

import Image from 'next/image';
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
        <Image
          src={imageUrl}
          alt={`${park.name} - ${park.businessType} in ${park.city}, ${park.state} | Indoor Dog Park`}
          width={400}
          height={250}
          className="park-card-image"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQADAD8Jz8YvqVX4J3hw+EPnJ54cr6C+h2R//9k="
          decoding="async"
          style={{ objectFit: 'cover' }}
          unoptimized={imageUrl.startsWith('http')}
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
