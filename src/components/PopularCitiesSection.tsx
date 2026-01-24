import Link from 'next/link';
import Image from 'next/image';

interface PopularCity {
    name: string;
    slug: string;
    image: string;
    parkCount: number;
}

const popularCities: PopularCity[] = [
    {
        name: 'Austin',
        slug: 'austin',
        image: '/images/cities/austin-tx/hero.png',
        parkCount: 15
    },
    {
        name: 'Phoenix',
        slug: 'phoenix',
        image: '/images/cities/Phoenix/hero.webp',
        parkCount: 12
    },
    {
        name: 'Los Angeles',
        slug: 'los-angeles',
        image: '/images/cities/los-angeles/hero.webp',
        parkCount: 22
    },
    {
        name: 'San Diego',
        slug: 'san-diego',
        image: '/images/cities/san-diego/hero.webp',
        parkCount: 18
    }
];

export default function PopularCitiesSection() {
    return (
        <section className="popular-cities-section">
            <div className="popular-cities-container">
                <div className="section-header">
                    <h2 className="section-title">Find indoor dog park in popular city</h2>
                    <p className="section-subtitle">
                        Explore our curated selection of top-rated, climate-controlled indoor dog parks across these major urban hubs.
                        From bustling city centers to dog-friendly neighborhoods, find the perfect spot for your furry friend to play,
                        socialize, and exercise safely, regardless of the weather outside.
                    </p>
                </div>

                <div className="popular-cities-grid">
                    {popularCities.map((city) => (
                        <Link key={city.slug} href={`/cities/${city.slug}`} className="popular-city-card">
                            <div className="city-image-wrapper">
                                <Image
                                    src={city.image}
                                    alt={`Indoor dog parks in ${city.name}`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    className="city-image"
                                />
                                <div className="city-overlay"></div>
                                <div className="city-content">
                                    <h3 className="city-name">{city.name}</h3>
                                    <p className="city-parks">{city.parkCount} Indoor Parks</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
