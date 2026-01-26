import Image from 'next/image';
import Link from 'next/link';
import { CityData } from '@/lib/cityData';

interface CityCardProps {
  city: CityData;
}

export default function CityCard({ city }: CityCardProps) {
  const hasImage = !!city.featuredImage;

  return (
    <Link href={`/cities/${city.slug}`} className={`city-card ${!hasImage ? 'no-image' : ''}`}>
      {/* City Image */}
      {hasImage && (
        <div className="city-card-image-wrapper">
          <Image
            src={city.featuredImage!}
            alt={`Indoor dog parks in ${city.name}`}
            fill
            className="city-card-image"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
        </div>
      )}

      <div className="city-card-body">
        {/* City Name */}
        <h3 className="city-card-title">{city.name}</h3>

        {/* Park Count */}
        <div className="city-card-info">
          <span className="park-count">
            <i className="bi bi-map-fill"></i> {city.parkCount} {city.parkCount === 1 ? 'Park' : 'Parks'}
          </span>
        </div>

        {/* Rating and Reviews */}
        <div className="city-card-rating">
          <i className="bi bi-star-fill"></i>
          <span className="rating-value">{city.avgRating.toFixed(1)}</span>
          <span className="rating-count">({city.totalReviews} reviews)</span>
        </div>

        {/* Top Parks List */}
        {city.topParks && city.topParks.length > 0 && (
          <div className="city-card-top-parks">
            <div className="top-parks-label">
              <i className="bi bi-trophy"></i> Top Rated Parks
            </div>
            <ul>
              {city.topParks.map((park) => (
                <li key={park}>{park}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Explore Button */}
        <div className="city-card-action">
          <span className="explore-btn">Explore Parks →</span>
        </div>
      </div>
    </Link>
  );
}
