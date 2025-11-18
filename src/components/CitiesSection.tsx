import Link from 'next/link';

interface City {
  name: string;
  slug: string;
}

const cities: Record<string, City[]> = {
  'Northern California': [
    { name: 'San Francisco', slug: 'san-francisco' },
    { name: 'Oakland', slug: 'oakland' },
    { name: 'San Jose', slug: 'san-jose' },
    { name: 'Sacramento', slug: 'sacramento' },
    { name: 'Berkeley', slug: 'berkeley' },
    { name: 'Palo Alto', slug: 'palo-alto' },
    { name: 'Fremont', slug: 'fremont' },
    { name: 'Santa Rosa', slug: 'santa-rosa' },
  ],
  'Central California': [
    { name: 'Fresno', slug: 'fresno' },
    { name: 'Bakersfield', slug: 'bakersfield' },
    { name: 'Modesto', slug: 'modesto' },
    { name: 'Stockton', slug: 'stockton' },
    { name: 'Salinas', slug: 'salinas' },
    { name: 'Visalia', slug: 'visalia' },
    { name: 'Santa Cruz', slug: 'santa-cruz' },
    { name: 'Monterey', slug: 'monterey' },
  ],
  'Southern California': [
    { name: 'Los Angeles', slug: 'los-angeles' },
    { name: 'San Diego', slug: 'san-diego' },
    { name: 'Long Beach', slug: 'long-beach' },
    { name: 'Anaheim', slug: 'anaheim' },
    { name: 'Santa Ana', slug: 'santa-ana' },
    { name: 'Riverside', slug: 'riverside' },
    { name: 'Irvine', slug: 'irvine' },
    { name: 'Pasadena', slug: 'pasadena' },
  ],
  'Coastal Cities': [
    { name: 'Santa Barbara', slug: 'santa-barbara' },
    { name: 'Newport Beach', slug: 'newport-beach' },
    { name: 'Huntington Beach', slug: 'huntington-beach' },
    { name: 'Malibu', slug: 'malibu' },
    { name: 'Carmel', slug: 'carmel' },
    { name: 'Laguna Beach', slug: 'laguna-beach' },
    { name: 'Ventura', slug: 'ventura' },
    { name: 'Carlsbad', slug: 'carlsbad' },
  ],
  'Other Cities': [
    { name: 'Chicago, IL', slug: 'chicago-il' },
    { name: 'Minneapolis, MN', slug: 'minneapolis-mn' },
    { name: 'Portland, OR', slug: 'portland-or' },
    { name: 'Columbus, OH', slug: 'columbus-oh' },
    { name: 'Phoenix, AZ', slug: 'phoenix' },
    { name: 'Las Vegas, NV', slug: 'las-vegas-nv' },
    { name: 'Austin, TX', slug: 'austin' },
    { name: 'New York, NY', slug: 'new-york' },
    { name: 'Houston, TX', slug: 'houston' },
    { name: 'Seattle, WA', slug: 'seattle' },
  ],
};

export default function CitiesSection() {
  return (
    <section className="cities-section">
      <div className="cities-container">
        <h2 className="cities-heading">Our main cities</h2>

        <div className="cities-grid">
          {Object.entries(cities).map(([region, cityList]) => (
            <div key={region} className="cities-column">
              <h3 className="cities-region">{region}</h3>
              <ul className="cities-list">
                {cityList.map(city => (
                  <li key={city.slug}>
                    <Link href={`/cities/${city.slug}`}>
                      {city.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
