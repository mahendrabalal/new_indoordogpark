import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { readFileSync } from 'fs';
import { join } from 'path';
import { DogPark } from '@/types/dog-park';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Map from '@/components/Map';
import ParkCard from '@/components/ParkCard';
import {
  getCityBySlug,
  getParksByCity,
  getCityStatistics,
  getParksByType,
  slugToCityName,
  getAllCities,
} from '@/lib/cityData';
import { generateCityMetadata, generateCitySchema, generateCityBreadcrumbSchema } from '@/lib/cityMetadata';
import { notFound } from 'next/navigation';

interface CityPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function getParks(): DogPark[] {
  try {
    const dataPath = join(process.cwd(), 'public/data/california.json');
    const data = readFileSync(dataPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading parks data:', error);
    return [];
  }
}

export async function generateMetadata(
  props: CityPageProps
): Promise<Metadata> {
  const params = await props.params;
  const parks = getParks();
  const city = getCityBySlug(parks, params.slug);

  if (!city) {
    return {
      title: 'City Not Found',
    };
  }

  return generateCityMetadata(city);
}

export async function generateStaticParams() {
  try {
    const parks = getParks();
    const cities = getAllCities(parks);
    return cities.map(city => ({ slug: city.slug }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function CityPage(props: CityPageProps) {
  const params = await props.params;
  const allParks = getParks();
  const city = getCityBySlug(allParks, params.slug);

  if (!city) {
    notFound();
  }

  const cityParks = getParksByCity(allParks, city.name);
  const parksByType = getParksByType(cityParks);
  const stats = getCityStatistics(cityParks);
  const featuredImage = city.featuredImage || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';

  const schemaMarkup = generateCitySchema(city, stats.totalParks);
  const breadcrumbSchema = generateCityBreadcrumbSchema(city);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Header />

      {/* Hero Section */}
      <section className="city-hero">
        <div className="city-hero-image">
          <Image
            src={featuredImage}
            alt={`${city.name}, ${city.state} - Dog Parks`}
            width={1400}
            height={400}
            className="hero-image"
            priority
          />
        </div>

        <div className="city-hero-content">
          {/* Breadcrumbs */}
          <div className="breadcrumbs" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
            <Link href="/">Home</Link>
            <i className="bi bi-chevron-right"></i>
            <span>Dog Parks</span>
            <i className="bi bi-chevron-right"></i>
            <span>{city.name}</span>
          </div>

          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
            <h1 className="park-title">Dog Parks in {city.name}, {city.state}</h1>
            <p className="park-subtitle">
              Discover {stats.totalParks} amazing dog parks for your furry friends
            </p>

            <div className="park-quick-info">
              <span>
                <i className="bi bi-geo-alt"></i> {city.name}, {city.state}
              </span>
              <span>
                <i className="bi bi-map-fill"></i> {stats.totalParks} Parks
              </span>
              <span>
                <i className="bi bi-star-fill"></i> {city.avgRating.toFixed(1)} avg rating
              </span>
              <span>
                <i className="bi bi-chat-dots-fill"></i> {city.totalReviews} reviews
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="park-detail-container">
        <div className="park-content-grid">
          {/* Main Content */}
          <div className="park-main-content">
            {/* Overview Section */}
            <section className="content-section">
              <h2>About Dog Parks in {city.name}</h2>
              <p className="park-description">
                {city.name}, {city.state} has a vibrant dog-loving community with {stats.totalParks} excellent dog parks
                and dog-friendly establishments. Whether you're looking for an off-leash dog park, an indoor dog park,
                or a dog-friendly establishment, {city.name} has options for every pet parent. With an average rating of {city.avgRating.toFixed(1)} stars across {city.totalReviews} reviews, you can find parks that suit your dog's needs and your lifestyle.
              </p>
            </section>

            {/* Parks by Type */}
            {Object.entries(parksByType).map(([type, parks]) => (
              <section key={type} className="content-section">
                <h2>{type}s in {city.name}</h2>
                <p className="park-description">
                  There are {parks.length} {type.toLowerCase()}(s) in {city.name} with an average rating of{' '}
                  {(parks.reduce((sum, p) => sum + p.rating, 0) / parks.length).toFixed(1)} stars.
                </p>
                <div className="parks-grid-new">
                  {parks.map((park) => (
                    <ParkCard
                      key={park.id}
                      park={park}
                      onViewDetails={() => {}}
                    />
                  ))}
                </div>
              </section>
            ))}

            {/* Map Section */}
            <section className="content-section">
              <h2>Map of Dog Parks in {city.name}</h2>
              <Map parks={cityParks} />
            </section>
          </div>

          {/* Sidebar */}
          <aside className="park-sidebar">
            {/* City Stats Card */}
            <div className="sidebar-card">
              <h3>City Overview</h3>
              <div className="nap-info">
                <div className="nap-item">
                  <i className="bi bi-map-fill"></i>
                  <div>
                    <strong>Total Parks</strong>
                    <p>{stats.totalParks}</p>
                  </div>
                </div>
                <div className="nap-item">
                  <i className="bi bi-star-fill"></i>
                  <div>
                    <strong>Average Rating</strong>
                    <p>{stats.avgRating.toFixed(1)} / 5.0</p>
                  </div>
                </div>
                <div className="nap-item">
                  <i className="bi bi-chat-dots-fill"></i>
                  <div>
                    <strong>Total Reviews</strong>
                    <p>{stats.totalReviews}</p>
                  </div>
                </div>
                <div className="nap-item">
                  <i className="bi bi-geo-alt"></i>
                  <div>
                    <strong>Location</strong>
                    <p>{city.name}, {city.state}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Park Types Card */}
            <div className="sidebar-card">
              <h3>Park Types</h3>
              <div className="nap-info">
                {Object.entries(parksByType).map(([type, parks]) => (
                  <div key={type} className="nap-item">
                    <i className="bi bi-pin-map-fill"></i>
                    <div>
                      <strong>{type}</strong>
                      <p>{parks.length} parks</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Card */}
            <div className="sidebar-card">
              <h3>Explore More</h3>
              <div className="sidebar-ctas">
                <Link href="/" className="cta-button cta-primary">
                  <i className="bi bi-house-door"></i> Back to Home
                </Link>
                <Link href="/?search=" className="cta-button cta-secondary">
                  <i className="bi bi-search"></i> Search All Parks
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </>
  );
}
