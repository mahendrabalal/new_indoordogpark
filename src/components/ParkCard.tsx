'use client';

import Link from 'next/link';
import { DogPark } from '@/types/dog-park';
import SearchHighlight from '@/components/SearchHighlight';
import { getParkStatus } from '@/lib/park-hours';
import { useEffect, useState, memo } from 'react';

import OptimizedImage from '@/components/OptimizedImage';

interface ParkCardProps {
  park: DogPark;
  searchTerm?: string;
}

function ParkCardComponent({ park, searchTerm }: ParkCardProps) {
  const [statusInfo, setStatusInfo] = useState(() => getParkStatus(park));
  const mainPhoto = park.photos?.[0]?.url || park.photo;
  const showImage = park.listingType === 'featured' && mainPhoto;

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

  // Diagnostic logging
  if (park.name.includes('South Park')) {
    console.log(`[ParkCard Debug] ${park.name}: listingType=${park.listingType}, mainPhoto=${!!mainPhoto}, showImage=${!!showImage}`);
  }

  return (
    <Link href={`/parks/${park.slug || park.id}`} className="park-card-premium-link">
      <div className={`${park.listingType === 'featured' ? 'park-card-premium' : 'park-card-standard'} ${showImage ? 'has-image' : ''}`}>
        {showImage && (
          <div className="park-premium-image-wrapper">
            <OptimizedImage
              src={mainPhoto}
              alt={park.name}
              fill
              className="park-premium-image"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="park-premium-image-overlay"></div>
            <div className="park-card-premium-badge">
              <i className="bi bi-star-fill"></i>
              <span>PREMIUM</span>
            </div>
          </div>
        )}
        <div className="park-premium-header">
          <h3 className="park-premium-title">
            {searchTerm ? (
              <SearchHighlight text={park.name} searchTerm={searchTerm} />
            ) : (
              park.name
            )}
          </h3>
          <div className="park-header-group">
            <div className={`status-pill ${statusInfo.status === 'open' || statusInfo.status === '24/7' ? 'open' : 'closed'}`}>
              {statusInfo.status === 'open' ? 'Open' : statusInfo.status === 'closed' ? 'Closed' : statusInfo.status}
            </div>
            <div className="park-premium-rating">
              <i className="bi bi-star"></i>
              <span>{park.rating.toFixed(0)}</span>
            </div>
          </div>
        </div>

        <div className="park-status-note">
          {statusInfo.nextChange || (park.hoursNote ? park.hoursNote : 'Hours vary by season')}
        </div>

        <div className="park-premium-location">
          <i className="bi bi-geo-alt"></i>
          <span>{park.city}, {park.state}</span>
        </div>

        <div className="park-premium-badges">
          {park.indoorOutdoor && <span className="premium-badge type-badge">{park.indoorOutdoor.toUpperCase()}</span>}
          {park.pricing?.priceRange && <span className="premium-badge price-badge">{park.pricing.priceRange}</span>}
          {park.amenities?.parking && <span className="premium-badge feature-badge">PARKING</span>}
          {park.listingType === 'featured' && !showImage && <span className="premium-badge special-badge">PREMIUM</span>}
        </div>

        <p className="park-premium-description">
          {park.description ? (
            park.description.length > 80
              ? `${park.description.substring(0, 80)}...`
              : park.description
          ) : (
            `${park.name} is a top-rated ${park.businessType || 'dog facility'} in ${park.city}.`
          )}
        </p>
      </div>
    </Link>
  );
}

// Custom comparison function for memo
const areEqual = (prevProps: ParkCardProps, nextProps: ParkCardProps) => {
  if (prevProps.park === nextProps.park && prevProps.searchTerm === nextProps.searchTerm) {
    return true;
  }

  const parkChanged =
    prevProps.park.id !== nextProps.park.id ||
    prevProps.park.name !== nextProps.park.name ||
    prevProps.park.rating !== nextProps.park.rating ||
    prevProps.park.reviewCount !== nextProps.park.reviewCount ||
    prevProps.park.photo !== nextProps.park.photo ||
    prevProps.park.photos !== nextProps.park.photos ||
    prevProps.park.businessType !== nextProps.park.businessType ||
    prevProps.park.city !== nextProps.park.city ||
    prevProps.park.state !== nextProps.park.state ||
    prevProps.park.pricing !== nextProps.park.pricing ||
    prevProps.park.listingType !== nextProps.park.listingType ||
    prevProps.park.full_address !== nextProps.park.full_address;

  const searchChanged = prevProps.searchTerm !== nextProps.searchTerm;

  return !parkChanged && !searchChanged;
};

const ParkCard = memo(ParkCardComponent, areEqual);

export default ParkCard;
