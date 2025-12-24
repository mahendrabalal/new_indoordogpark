import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'About Us | Indoor Dog Park Directory & Reviews',
  description: 'IndoorDogPark is an independent directory helping pet parents discover indoor dog parks, dog-friendly establishments, and canine play areas. Learn about our mission.',
  keywords: [
    'about indoor dog park',
    'dog park directory',
    'indoor dog parks california',
    'dog friendly places',
    'canine recreation',
    'pet wellness',
    'dog park reviews'
  ],
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Us | Indoor Dog Park Directory',
    description: 'Connecting dog owners with the best indoor dog parks and play areas. Discover our mission and community.',
    url: 'https://www.indoordogpark.org/about',
    type: 'website',
    images: [
      {
        url: '/images/hero/hero.webp',
        width: 1200,
        height: 630,
        alt: 'Indoor Dog Park - Connecting Pet Parents',
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen about-page-modern">
      <Header />

      <main className="flex-1">
        {/* Hero / About Us Section */}
        <section className="about-modern-hero">
          <div className="about-modern-container">
            <div className="about-modern-hero-content">
              <h1 className="about-modern-title">
                HELPING DOG OWNERS FIND <span className="text-accent-green">INDOOR PLAY SPACES</span>
              </h1>
              <p className="about-modern-mission">
                IndoorDogPark is an independent directory helping pet parents discover climate-controlled
                dog parks, daycare facilities, and training centers. We verify listings, aggregate reviews,
                and make it easy to find the right space for your dog.
              </p>
            </div>
          </div>
        </section>

        {/* Meet the Team Section */}
        <section className="about-modern-section">
          <div className="about-modern-container">
            <div className="about-modern-content-layout">
              <div className="about-modern-text-content">
                <h2 className="about-modern-section-title">Meet Our Team</h2>
                <p className="about-modern-text">
                  The IndoorDogPark team started this project after struggling to find reliable information
                  about indoor dog facilities. What began as a personal research project evolved into
                  a comprehensive directory serving dog owners across the United States.
                </p>
                <p className="about-modern-text">
                  We&apos;re a small team of dog lovers, researchers, and developers dedicated to making it easier
                  for pet parents to find safe, climate-controlled play spaces for their dogs. Every listing
                  is verified, every detail matters.
                </p>

                <div className="about-modern-stats-grid">
                  <div className="about-modern-stat-card">
                    <div className="stat-number stat-green">500+</div>
                    <div className="stat-label">Verified Listings</div>
                  </div>
                  <div className="about-modern-stat-card">
                    <div className="stat-number stat-pink">150+</div>
                    <div className="stat-label">Cities Covered</div>
                  </div>
                  <div className="about-modern-stat-card">
                    <div className="stat-number stat-green">50</div>
                    <div className="stat-label">States</div>
                  </div>
                  <div className="about-modern-stat-card">
                    <div className="stat-number stat-pink">24/7</div>
                    <div className="stat-label">Free Access</div>
                  </div>
                </div>
              </div>
              <div className="about-modern-image-content">
                <figure style={{ margin: 0 }}>
                  <img
                    src="/images/about/team.webp"
                    alt="The IndoorDogPark.org team working together to build the best dog park directory"
                    style={{
                      width: '100%',
                      height: '500px',
                      borderRadius: '1rem',
                      objectFit: 'cover',
                      objectPosition: 'center'
                    }}
                  />
                  <figcaption style={{
                    textAlign: 'center',
                    marginTop: '0.75rem',
                    fontSize: '0.875rem',
                    color: '#64748b',
                    fontStyle: 'italic'
                  }}>
                    The IndoorDogPark.org Team — Building the most comprehensive dog park directory
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="about-modern-section-alt">
          <div className="about-modern-container">
            <h2 className="about-modern-section-title-center">What We Do</h2>
            <div className="about-modern-timeline">
              <div className="timeline-item">
                <div className="timeline-dot timeline-green"></div>
                <div className="timeline-card">
                  <div className="timeline-year">Research</div>
                  <p>We research and verify indoor dog parks, daycare centers, and training facilities to ensure accurate, up-to-date information for pet parents.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot timeline-pink"></div>
                <div className="timeline-card">
                  <div className="timeline-year">Organize</div>
                  <p>We organize listings with detailed amenities, hours, pricing, and photos so you can compare options and find the perfect fit for your dog.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot timeline-green"></div>
                <div className="timeline-card">
                  <div className="timeline-year">Connect</div>
                  <p>We connect dog owners with facilities through our directory, helping parks reach new customers and helping owners discover new spaces.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="about-modern-section">
          <div className="about-modern-container">
            <h2 className="about-modern-section-title-center">Our Commitment</h2>
            <div className="about-modern-values-grid">
              <div className="about-modern-value-card">
                <div className="value-icon-modern value-icon-green">
                  <i className="bi bi-check-circle-fill"></i>
                </div>
                <h3>Accurate Information</h3>
                <p>We verify listings and regularly update our directory to ensure the information you find is current and reliable.</p>
              </div>
              <div className="about-modern-value-card">
                <div className="value-icon-modern value-icon-pink">
                  <i className="bi bi-unlock-fill"></i>
                </div>
                <h3>Free to Use</h3>
                <p>Our directory is free for dog owners. We believe everyone should have access to information about safe play spaces for their pets.</p>
              </div>
              <div className="about-modern-value-card">
                <div className="value-icon-modern value-icon-green">
                  <i className="bi bi-shield-check-fill"></i>
                </div>
                <h3>Community First</h3>
                <p>Park owners can list their facilities, and dog owners can submit new discoveries. We grow through community contributions.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Serve Section */}
        <section className="about-modern-section-alt">
          <div className="about-modern-container">
            <h2 className="about-modern-section-title-center">Who We Serve</h2>
            <div className="about-modern-partners-grid">
              <div className="about-modern-partner-card">DOG OWNERS</div>
              <div className="about-modern-partner-card">PARK OPERATORS</div>
              <div className="about-modern-partner-card">DAYCARE FACILITIES</div>
              <div className="about-modern-partner-card">TRAINING CENTERS</div>
            </div>
          </div>
        </section>

        {/* Join Our Mission Section */}
        <section className="about-modern-cta">
          <div className="about-modern-container">
            <h2 className="about-modern-cta-title">Have a Park to Add?</h2>
            <p className="about-modern-cta-text">
              Know of an indoor dog park that&apos;s not in our directory? Own a facility you&apos;d like listed?
              We welcome submissions from the community.
            </p>
            <div className="about-modern-cta-buttons">
              <Link href="/list-your-park" className="btn-modern-green">
                Submit a Park
              </Link>
              <Link href="/contact" className="btn-modern-pink">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
