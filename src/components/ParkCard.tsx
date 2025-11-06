import Image from 'next/image';
import Link from 'next/link';
import { DogPark } from '@/types/dog-park';

interface ParkCardProps {
  park: DogPark;
  onViewDetails: (park: DogPark) => void;
}

export default function ParkCard({ park, onViewDetails }: ParkCardProps) {
  // Extract the first photo URL from photos array if available, otherwise use single photo field
  const getImageUrl = () => {
    if (park.photo) return park.photo;
    if (park.photos && park.photos.length > 0) {
      const firstPhoto = park.photos[0];
      // Handle both string and object formats
      if (typeof firstPhoto === 'string') return firstPhoto;
      if (typeof firstPhoto === 'object' && 'url' in firstPhoto) return (firstPhoto as any).url;
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

  return (
    <Link href={`/parks/${park.slug || park.id}`} className="park-card-new">
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
          <span className="park-badge">{getLandlordType()}</span>
          {park.amenities?.fencing && <span className="park-badge">Fenced</span>}
        </div>

        {/* Rating and Reviews */}
        <div className="park-card-rating">
          <i className="bi bi-star-fill"></i>
          <span className="rating-value">{park.rating}</span>
          <span className="rating-count">({park.reviewCount} reviews)</span>
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
