import Link from 'next/link';
import { CityData } from '@/lib/cityData';

interface CityCardProps {
  city: CityData;
}

export default function CityCard({ city }: CityCardProps) {
  return (
    <Link href={`/cities/${city.slug}`} className="city-card no-image">
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
