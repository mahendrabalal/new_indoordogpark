import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
export const metadata: Metadata = {
  title: 'About Us | Indoor Dog Park Directory & Reviews',
  description: 'IndoorDogPark is the leading directory for indoor dog parks, dog-friendly establishments, and canine play areas. Learn about our mission to connect pet parents with safe, climate-controlled play spaces.',
  keywords: [
    'about indoor dog park',
    'dog park directory',
    'indoor dog parks california',
    'dog friendly places',
    'canine recreation',
    'pet wellness',
    'dog park reviews'
  ],
  openGraph: {
    title: 'About Us | Indoor Dog Park Directory',
    description: 'Connecting dog owners with the best indoor dog parks and play areas across California. Discover our mission and community.',
    url: 'https://www.indoordogpark.org/about',
    type: 'website',
    images: [
      {
        url: '/images/hero/hero.png',
        width: 1200,
        height: 630,
        alt: 'Indoor Dog Park - Connecting Pet Parents',
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="about-hero-content">
            <h1>About IndoorDogPark</h1>
            <p>Your trusted companion in discovering the perfect parks for your furry friends</p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="about-section">
          <div className="about-container">
            <div className="about-content-grid">
              <div className="about-text">
                <h2>Our Mission</h2>
                <p>
                  At IndoorDogPark, we believe every dog deserves a safe, fun, and engaging place to play,
                  socialize, and exercise. Our mission is to connect dog owners with the best dog parks
                  across California, making it easier than ever to find the perfect spot for your pup.
                </p>
                <p>
                  Whether you&rsquo;re looking for a spacious outdoor park with agility equipment, a cozy
                  indoor facility for rainy days, or a dog-friendly establishment where you can enjoy
                  time with your four-legged companion, IndoorDogPark has you covered.
                </p>
              </div>
              <div className="about-image-placeholder">
                <i className="bi bi-heart-fill"></i>
                <p>Happy dogs, happy owners</p>
              </div>
            </div>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="about-section-alt">
          <div className="about-container">
            <h2 className="text-center">What We Do</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="bi bi-search"></i>
                </div>
                <h3>Comprehensive Directory</h3>
                <p>
                  Browse our extensive database of dog parks, indoor facilities, and dog-friendly
                  establishments across California. We provide detailed information including amenities,
                  hours, and visitor reviews.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <i className="bi bi-star-fill"></i>
                </div>
                <h3>Verified Reviews</h3>
                <p>
                  Read honest reviews from fellow dog owners to make informed decisions. Our community
                  shares their experiences to help you find the best parks for your dog&rsquo;s needs.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <i className="bi bi-geo-alt-fill"></i>
                </div>
                <h3>Location-Based Search</h3>
                <p>
                  Find parks near you with our easy-to-use location search. Filter by city, amenities,
                  and park type to discover the perfect spot for your next adventure.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <i className="bi bi-info-circle-fill"></i>
                </div>
                <h3>Detailed Information</h3>
                <p>
                  Get all the details you need including park rules, size restrictions, available
                  amenities, parking information, and accessibility features.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="about-section">
          <div className="about-container">
            <div className="about-content-grid-reverse">
              <div className="about-image-placeholder">
                <i className="bi bi-flag-fill"></i>
                <p>Founded in California</p>
              </div>
              <div className="about-text">
                <h2>Our Story</h2>
                <p>
                  IndoorDogPark was founded by a team of passionate dog lovers who experienced firsthand
                  the challenge of finding quality dog parks. After countless hours spent searching
                  online and asking for recommendations, we realized there needed to be a better way.
                </p>
                <p>
                  We started by visiting and documenting dog parks throughout California, gathering
                  information that would be valuable to other dog owners. What began as a small
                  project quickly grew into a comprehensive directory trusted by thousands of dog
                  owners across the state.
                </p>
                <p>
                  Today, IndoorDogPark continues to grow, adding new parks and features to help you and
                  your furry friend discover amazing places to play, explore, and make new friends.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="about-section-alt">
          <div className="about-container">
            <h2 className="text-center">Our Values</h2>
            <div className="values-grid">
              <div className="value-item">
                <div className="value-icon">
                  <i className="bi bi-shield-check"></i>
                </div>
                <h3>Trust & Safety</h3>
                <p>We prioritize the safety and well-being of all dogs and their owners.</p>
              </div>

              <div className="value-item">
                <div className="value-icon">
                  <i className="bi bi-people-fill"></i>
                </div>
                <h3>Community</h3>
                <p>Building a supportive community of dog lovers who help each other.</p>
              </div>

              <div className="value-item">
                <div className="value-icon">
                  <i className="bi bi-check-circle"></i>
                </div>
                <h3>Accuracy</h3>
                <p>Providing verified, up-to-date information you can rely on.</p>
              </div>

              <div className="value-item">
                <div className="value-icon">
                  <i className="bi bi-heart"></i>
                </div>
                <h3>Passion</h3>
                <p>Driven by our love for dogs and dedication to their happiness.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="about-cta">
          <div className="about-container">
            <h2>Join Our Community</h2>
            <p>
              Help us build the most comprehensive dog park directory in California.
              List your park, share reviews, and connect with fellow dog lovers.
            </p>
            <div className="cta-buttons">
              <a href="/list-property" className="btn-primary-large">
                <i className="bi bi-plus-circle"></i>
                List Your Park
              </a>
              <a href="/contact" className="btn-secondary-large">
                <i className="bi bi-envelope"></i>
                Get in Touch
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
