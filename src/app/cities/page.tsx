import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CityCard from '@/components/CityCard';
import { SITE_URL } from '@/lib/metadata';
import { getAllParksForStateAggregation } from '@/lib/state-page-data';
import { getAllCities } from '@/lib/cityData';
import { ABBR_TO_NAME } from '@/lib/stateData';
import { USStateAbbr } from '@/lib/state';
import { priorityCityContent } from '@/data/priorityCityContent';
import CitiesPageStyles from './CitiesPageStyles';
import CityDirectory from '@/components/CityDirectory';

export const revalidate = 60 * 60; // hourly

export const metadata: Metadata = {
    title: 'Top Dog-Friendly Cities | Indoor Dog Park Directory',
    description: 'Explore the best cities for indoor dog parks and dog-friendly amenities. Find verified listings in Chicago, Austin, NYC, and more.',
    alternates: {
        canonical: `${SITE_URL}/cities`,
    },
};

export default async function CitiesPage() {
    const allParks = await getAllParksForStateAggregation();
    const allCities = getAllCities(allParks);

    // Identify priority cities
    const prioritySlugs = new Set(priorityCityContent.map(c => c.slug));
    const featuredCities = allCities
        .filter(city => prioritySlugs.has(city.slug))
        .sort((a, b) => b.parkCount - a.parkCount)
        .slice(0, 12);

    // Group all cities by state for the directory
    const citiesByState: Record<string, typeof allCities> = {};
    allCities.forEach(city => {
        // Ensure we work with normalized state abbreviations
        const stateKey = city.state;
        if (!citiesByState[stateKey]) {
            citiesByState[stateKey] = [];
        }
        citiesByState[stateKey].push(city);
    });

    // Sort states alphabetically by their full name
    const sortedStateKeys = Object.keys(citiesByState).sort((a, b) => {
        const nameA = ABBR_TO_NAME[a as USStateAbbr] || a;
        const nameB = ABBR_TO_NAME[b as USStateAbbr] || b;
        return nameA.localeCompare(nameB);
    });

    return (
        <>
            <Header variant="light" />
            <CitiesPageStyles />
            <main className="cities-page-layout">
                <section className="cities-hero">
                    <div className="section-shell">
                        <div className="section-eyebrow">Directory</div>
                        <h1 className="text-4xl md:text-6xl font-semibold text-slate-800 mb-6" style={{ fontSize: 'clamp(32px, 5vw, 60px)', lineHeight: 1.1 }}>
                            Top Dog-Friendly Cities
                        </h1>
                        <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                            Discover the most verified dog-friendly cities across the United States. From climate-controlled indoor parks to the best local amenities, find the perfect spot for your pup.
                        </p>
                    </div>
                </section>

                {/* Featured Cities Row */}
                <section className="state-section">
                    <div className="section-shell">
                        <div className="section-heading">
                            <div className="section-eyebrow">Featured hubs</div>
                            <h2>High-coverage hotspots</h2>
                            <p>These cities feature our most detailed content, curated photos, and verified local insights.</p>
                        </div>
                        <div className="cities-grid">
                            {featuredCities.map(city => (
                                <CityCard key={city.slug} city={city} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Browse by State Directory */}
                <section className="state-section alt">
                    <div className="section-shell">
                        <div className="section-heading">
                            <div className="section-eyebrow">Browse by state</div>
                            <h2>City directory by region</h2>
                            <p>Explore verified dog-friendly locations in {allCities.length} cities across {sortedStateKeys.length} states.</p>
                        </div>


                        <CityDirectory
                            citiesByState={citiesByState}
                            sortedStateKeys={sortedStateKeys}
                            abbrToName={ABBR_TO_NAME}
                        />

                    </div>
                </section>

                {/* Contribute CTA */}
                <section className="state-section">
                    <div className="section-shell">
                        <div className="cta-band">
                            <div>
                                <h3>Don&apos;t see your city?</h3>
                                <p>We&apos;re expanding fast. Help us cover your neighborhood by submitting a local dog park today.</p>
                            </div>
                            <Link href="/list-your-park" className="hero-cta primary">
                                <i className="bi bi-plus-circle"></i>
                                Submit a park
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
