import Image from 'next/image';
import Link from 'next/link';
import { DogPark } from '@/types/dog-park';
import FavoriteButton from '@/components/FavoriteButton';

interface ParkCardProps {
  park: DogPark;
}

export default function ParkCard({ park }: ParkCardProps) {
  // Extract the first photo URL from photos array if available, otherwise use single photo field
  const getImageUrl = () => {
    if (typeof park.photo === 'string' && park.photo.trim() !== '') return park.photo;
    if (park.photos && park.photos.length > 0) {
      const firstPhoto = park.photos[0];
      if (firstPhoto?.url) return firstPhoto.url;
    }
    return 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
  };

  const imageUrl = getImageUrl();

  // Determine pricing display (adapt from rental pricing to park entry fees)
  const getPricingDisplay = () => {
    if (park.pricing?.isFree) {
      return { current: 'Free', original: null };
    }
    if (park.pricing?.dropInFee) {
      return { current: `$${park.pricing.dropInFee}`, original: null };
    }
    if (park.pricing?.dailyRate) {
      return { current: `$${park.pricing.dailyRate}`, original: null };
    }
    return { current: 'Free', original: null };
  };

  const pricing = getPricingDisplay();

  // Get landlord type equivalent (e.g., "Trusted Location", "Verified Park")
  const getLandlordType = () => {
    if (park.websiteVerified) return 'Verified';
    if (park.dataQuality === 'verified') return 'Trusted Location';
    return 'Standard';
  };

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
          alt={`${park.name} - Dog Park in ${park.city}, ${park.state}`}
          width={400}
          height={250}
          className="park-card-image"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </div>

      <div className="park-card-body">
        {/* Type and Title */}
        <div className="park-card-header">
          <p className="park-card-type">{park.businessType}</p>
          <h3 className="park-card-title">{park.name}</h3>
        </div>

        {/* Location */}
        <p className="park-card-location">
          <i className="bi bi-geo-alt"></i> {park.city}, {park.state}
        </p>

        {/* Badges */}
        <div className="park-card-badges">
          {isFeatured && (
            <span className="park-badge featured-badge-small" style={{
              background: 'linear-gradient(45deg, #f59e0b, #eab308)',
              color: 'white',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(245, 158, 11, 0.3)'
            }}>
              <i className="bi bi-star-fill"></i> FEATURED
            </span>
          )}
          <span className="park-badge">{getLandlordType()}</span>
          {park.source === 'user_submitted' && (
            <span className="park-badge" style={{ backgroundColor: '#10b981', color: 'white' }}>
              Community Added
            </span>
          )}
          {park.amenities?.fencing && <span className="park-badge">Fenced</span>}
        </div>

        {/* Rating and Reviews */}
        <div className="park-card-rating">
          <i className="bi bi-star-fill"></i>
          <span className="rating-value">{park.rating}</span>
          <span className="rating-count">({park.reviewCount} reviews)</span>
        </div>

        {/* Favorite Button */}
        <div className="park-card-favorite">
          <FavoriteButton
            parkId={park.id}
            parkSlug={park.slug}
            className="favorite-btn-card"
          />
        </div>

        {/* Pricing */}
        <div className="park-card-pricing">
          <span className="price-current">{pricing.current}</span>
          {pricing.original && (
            <span className="price-original">{pricing.original}</span>
          )}
          {park.pricing?.pricingType && park.pricing.pricingType !== 'free' && (
            <span className="price-period">/{park.pricing.pricingType}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
