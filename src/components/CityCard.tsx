import Image from 'next/image';
import Link from 'next/link';
import { CityData } from '@/lib/cityData';

interface CityCardProps {
  city: CityData;
}

export default function CityCard({ city }: CityCardProps) {
  // Use featured image or fallback to default
  const imageUrl = city.featuredImage || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';

  return (
    <Link href={`/cities/${city.slug}`} className="city-card">
      <div className="city-card-image-wrapper">
        <Image
          src={imageUrl}
          alt={`${city.name}, ${city.state} - Dog Parks Directory`}
          width={400}
          height={250}
          className="city-card-image"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQADAD8Jz8YvqVX4J3hw+EPnJ54cr6C+h2R//9k="
        />
      </div>

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

        {/* Explore Button */}
        <div className="city-card-action">
          <span className="explore-btn">Explore Parks →</span>
        </div>
      </div>
    </Link>
  );
}
