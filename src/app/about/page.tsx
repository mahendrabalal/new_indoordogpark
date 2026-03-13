import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';


export const metadata: Metadata = {
  title: 'About Us | Indoor Dog Park Directory & Reviews',
  description: 'IndoorDogPark is an independent directory helping pet parents discover indoor dog parks, dog-friendly establishments, and canine play areas. Learn about our mission.',
  keywords: [
    'about indoor dog park',
    'dog park directory',
    'indoor dog parks',
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
      <Header variant="light" />

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
                and make it easy to find the right space for your dog. <Link href="/" style={{ color: 'rgba(255, 255, 255, 0.95)', textDecoration: 'underline', fontWeight: 600 }}>Browse our directory</Link> to find indoor dog parks near you.
              </p>
            </div>
          </div>
        </section>



        {/* Meet the Team Section */}
        <section className="about-modern-section" style={{ padding: '40px 20px' }}>
          <div className="about-modern-container">
            <div className="about-modern-content-layout">
              <div className="about-modern-text-content">
                <h2 className="about-modern-section-title">Meet Our Team</h2>
                <p className="about-modern-text">
                  The IndoorDogPark team started this project after struggling to find reliable information
                  about indoor dog facilities. What began as a personal research project evolved into
                  a comprehensive directory serving dog owners across the United States. We&apos;re a small team of dog lovers, researchers, and developers dedicated to making it easier
                  for pet parents to find safe, climate-controlled play spaces for their dogs. Every listing
                  is verified, every detail matters. Explore our <Link href="/states" style={{ color: '#10b981', textDecoration: 'underline', fontWeight: 600 }}>state-by-state directory</Link> to discover facilities in your area.
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
                  <Image
                    src="/images/about/team.webp"
                    alt="The IndoorDogPark.org team working together to build the best dog park directory"
                    width={600}
                    height={500}
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

        {/* What We Do & Tips Section */}
        <section className="about-modern-section-alt" style={{ padding: '40px 20px' }}>
          <div className="about-modern-container">
            <h2 className="about-modern-section-title-center">What We Do & Tips for First-Time Visitors</h2>
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
                  <p>We organize listings with detailed amenities, hours, pricing, and photos so you can compare options and find the perfect fit for your dog. Learn more about <Link href="/how-it-works" style={{ color: '#2c3e50', textDecoration: 'underline', fontWeight: 600 }}>how our directory works</Link>.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot timeline-green"></div>
                <div className="timeline-card">
                  <div className="timeline-year">Connect</div>
                  <p>We connect dog owners with facilities through our directory, helping parks reach new customers and helping owners discover new spaces.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot timeline-green"></div>
                <div className="timeline-card">
                  <div className="timeline-year">Before You Go</div>
                  <p>Ensure your dog is up-to-date on vaccinations and has received a clean bill of health from your veterinarian. Many facilities require proof of vaccinations before entry. Call ahead to understand specific requirements, reservation policies, and what to bring.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot timeline-pink"></div>
                <div className="timeline-card">
                  <div className="timeline-year">During Your Visit</div>
                  <p>Supervise your dog closely, especially during the first few visits. Be aware of your dog&apos;s body language and stress signals. Respect other dogs&apos; space and follow facility rules regarding toys, treats, and play styles. Keep your phone accessible but avoid distractions that prevent proper supervision.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot timeline-green"></div>
                <div className="timeline-card">
                  <div className="timeline-year">Making It a Success</div>
                  <p>Start with shorter visits during off-peak hours when the facility is less crowded. Gradually increase visit duration as your dog becomes more comfortable. Bring water, clean-up supplies, and any necessary medications. Take advantage of staff knowledge—they can offer valuable insights about facility features and dog behavior.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="about-modern-section" style={{ padding: '40px 20px' }}>
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
                <p>Park owners can <Link href="/list-your-park" style={{ color: '#2c3e50', textDecoration: 'underline', fontWeight: 600 }}>list their facilities</Link>, and dog owners can submit new discoveries. We grow through community contributions.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Indoor Dog Parks Matter Section */}
        <section className="about-modern-section-alt" style={{ padding: '40px 20px' }}>
          <div className="about-modern-container">
            <h2 className="about-modern-section-title-center">Why Indoor Dog Parks Matter</h2>
            <div className="about-modern-content-layout">
              <div className="about-modern-text-content">
                <p className="about-modern-text">
                  Indoor dog parks have emerged as a vital solution for pet owners across America, addressing challenges that traditional outdoor parks cannot. As our communities face increasingly unpredictable weather patterns, extreme temperatures, and urbanization, the need for climate-controlled canine recreation spaces has never been more apparent. Unlike traditional dog parks that leave pets exposed to harsh weather conditions, indoor facilities provide a safe, comfortable environment year-round. Whether it&apos;s scorching summer heat, freezing winter temperatures, heavy rainfall, or poor air quality from wildfires, indoor dog parks ensure your furry friend can exercise and socialize in optimal conditions. Read more about the benefits in our <Link href="/blog" style={{ color: '#2c3e50', textDecoration: 'underline', fontWeight: 600 }}>blog articles</Link> and <Link href="/faq" style={{ color: '#2c3e50', textDecoration: 'underline', fontWeight: 600 }}>frequently asked questions</Link>.
                </p>
                <h3 className="about-modern-section-title" style={{ fontSize: '1.5rem', marginTop: '30px', marginBottom: '15px' }}>Health and Safety Benefits</h3>
                <p className="about-modern-text">
                  Indoor dog parks offer numerous health and safety advantages. Controlled environments reduce the risk of heatstroke during summer months and hypothermia in winter. Surfaces are typically softer and more forgiving than concrete or packed dirt, reducing joint stress and injury risk. Many facilities also implement strict vaccination requirements and health screenings, creating safer spaces for all dogs. These facilities often feature better lighting, security measures, and staff supervision compared to public outdoor parks. Owners can exercise their dogs without worrying about unleashed aggressive animals, inadequate fencing, or unsafe equipment. For senior dogs, puppies, or dogs with mobility issues, indoor parks provide a more accessible and accommodating space for exercise.
                </p>
              </div>
              <div className="about-modern-image-content">
                <figure style={{ margin: 0 }}>
                  <Image
                    src="/images/about/indoordogpark-health-&-safety.jpg"
                    alt="Indoor dog park with multiple dogs playing safely in a climate-controlled environment with soft surfaces and proper supervision"
                    width={600}
                    height={500}
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
                    Indoor dog parks provide safe, comfortable environments regardless of weather
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </section>

        {/* What to Look For Section */}
        <section className="about-modern-section" style={{ padding: '40px 20px' }}>
          <div className="about-modern-container">
            <h2 className="about-modern-section-title-center">What to Look for in an Indoor Dog Park</h2>
            <p className="about-modern-text" style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto 40px', fontSize: '1.1rem' }}>
              Choosing the right indoor dog park involves considering several important factors to ensure a safe, enjoyable experience for both you and your pet. Check out our <Link href="/how-it-works" style={{ color: '#2c3e50', textDecoration: 'underline', fontWeight: 600 }}>guide on how to use our directory</Link> and explore <Link href="/blog" style={{ color: '#2c3e50', textDecoration: 'underline', fontWeight: 600 }}>helpful articles</Link> for more tips.
            </p>
            <div className="about-modern-values-grid">
              <div className="about-modern-value-card">
                <div className="value-icon-modern value-icon-green">
                  <i className="bi bi-shield-check-fill"></i>
                </div>
                <h3>Safety Measures</h3>
                <p>Look for facilities with proper fencing, secure entry systems, vaccination requirements, and trained staff who monitor play sessions. Well-maintained equipment and non-slip surfaces are essential for preventing injuries.</p>
              </div>
              <div className="about-modern-value-card">
                <div className="value-icon-modern value-icon-pink">
                  <i className="bi bi-thermometer-half"></i>
                </div>
                <h3>Climate Control</h3>
                <p>Effective heating, cooling, and ventilation systems ensure comfortable temperatures year-round. Good air quality and proper humidity levels are crucial for canine respiratory health and comfort.</p>
              </div>
              <div className="about-modern-value-card">
                <div className="value-icon-modern value-icon-green">
                  <i className="bi bi-rulers"></i>
                </div>
                <h3>Size and Layout</h3>
                <p>Consider the size of play areas relative to your dog&apos;s needs. Some facilities offer separate spaces for large and small dogs, active and passive play zones, and specialized areas for training or agility.</p>
              </div>
              <div className="about-modern-value-card">
                <div className="value-icon-modern value-icon-pink">
                  <i className="bi bi-list-check"></i>
                </div>
                <h3>Amenities</h3>
                <p>Modern indoor parks often include water stations, waste stations, seating areas, viewing areas, training equipment, grooming facilities, and retail shops. Some even offer daycare services and training classes.</p>
              </div>
              <div className="about-modern-value-card">
                <div className="value-icon-modern value-icon-green">
                  <i className="bi bi-clock-history"></i>
                </div>
                <h3>Operating Hours</h3>
                <p>Flexible scheduling is important for working pet parents. Many indoor facilities offer extended hours, weekend availability, and reservation systems to accommodate busy lifestyles.</p>
              </div>
              <div className="about-modern-value-card">
                <div className="value-icon-modern value-icon-pink">
                  <i className="bi bi-currency-dollar"></i>
                </div>
                <h3>Pricing Structure</h3>
                <p>Compare membership fees, day pass rates, and package deals. Consider whether the facility offers trial passes, referral discounts, or special rates for seniors, students, or multiple-dog households.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits for Different Dogs Section */}
        <section className="about-modern-section-alt" style={{ padding: '40px 20px' }}>
          <div className="about-modern-container">
            <h2 className="about-modern-section-title-center">Benefits for Every Type of Dog</h2>
            <div className="about-modern-content-layout">
              <div className="about-modern-text-content">
                <h3 className="about-modern-section-title" style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Puppies and Young Dogs</h3>
                <p className="about-modern-text">
                  Indoor dog parks are ideal environments for puppy socialization and early training. Controlled settings allow young dogs to interact with others in a safe, supervised space while learning appropriate play behaviors. Consistent temperatures and clean surfaces reduce health risks for developing immune systems. Find <Link href="/" style={{ color: '#2c3e50', textDecoration: 'underline', fontWeight: 600 }}>puppy-friendly facilities</Link> in our directory.
                </p>
                <h3 className="about-modern-section-title" style={{ fontSize: '1.5rem', marginTop: '30px', marginBottom: '15px' }}>Senior Dogs</h3>
                <p className="about-modern-text">
                  Older dogs benefit from indoor parks&apos; softer surfaces, which are easier on aging joints and paws. Climate-controlled environments prevent temperature-related stress, while smaller, quieter spaces can accommodate dogs who prefer calmer interactions. Many facilities offer senior-specific play times with reduced noise and activity levels.
                </p>
                <h3 className="about-modern-section-title" style={{ fontSize: '1.5rem', marginTop: '30px', marginBottom: '15px' }}>High-Energy Breeds</h3>
                <p className="about-modern-text">
                  Breeds requiring extensive exercise benefit from indoor parks&apos; year-round availability. Regardless of weather conditions, these dogs can maintain their exercise routines, preventing destructive behaviors that arise from pent-up energy. Many facilities feature agility equipment and larger play spaces designed for active breeds.
                </p>
                <h3 className="about-modern-section-title" style={{ fontSize: '1.5rem', marginTop: '30px', marginBottom: '15px' }}>Small and Toy Breeds</h3>
                <p className="about-modern-text">
                  Many indoor facilities offer separate play areas specifically designed for smaller dogs, preventing overwhelming interactions with larger breeds. These spaces provide safe environments where small dogs can socialize and exercise without intimidation or risk of injury.
                </p>
              </div>
              <div className="about-modern-image-content">
                <figure style={{ margin: 0 }}>
                  <Image
                    src="/images/about/indoordogpark-all-age-size.jpg"
                    alt="Dogs of various ages, sizes, and breeds playing together in an indoor dog park facility"
                    width={600}
                    height={500}
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
                    Every dog can benefit from indoor recreation facilities
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </section>

        {/* The Growing Trend Section */}
        <section className="about-modern-section" style={{ padding: '40px 20px' }}>
          <div className="about-modern-container">
            <div className="about-modern-content-layout">
              <div className="about-modern-image-content">
                <figure style={{ margin: 0 }}>
                  <Image
                    src="/images/about/trend-of-indoordogpark.jpg"
                    alt="A vibrant indoor dog park with multiple dogs playing and owners socializing, showing the growing trend of climate-controlled canine recreation facilities"
                    width={600}
                    height={500}
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
                    The future of canine recreation is climate-controlled
                  </figcaption>
                </figure>
              </div>
              <div className="about-modern-text-content">
                <h2 className="about-modern-section-title">The Growing Trend of Indoor Dog Parks</h2>
                <p className="about-modern-text">
                  The indoor dog park industry has experienced significant growth over the past decade, driven by changing climate patterns, increased urbanization, and a greater understanding of canine wellness needs. What began as a niche concept in metropolitan areas has expanded into a nationwide movement. Major cities across the United States now host multiple indoor dog park facilities, each offering unique amenities and services. From basic climate-controlled play spaces to luxury facilities featuring swimming pools, grooming salons, and cafés, the industry continues to evolve to meet diverse owner and pet needs. Explore facilities by <Link href="/states" style={{ color: '#2c3e50', textDecoration: 'underline', fontWeight: 600 }}>state</Link> or read more about this trend in our <Link href="/blog" style={{ color: '#2c3e50', textDecoration: 'underline', fontWeight: 600 }}>blog</Link>.
                </p>
                <p className="about-modern-text">
                  This growth reflects a broader shift in how pet owners view their dogs&apos; needs. Modern pet parents recognize that exercise and socialization are essential components of canine health and wellbeing, and they&apos;re seeking reliable, consistent solutions that aren&apos;t dependent on weather conditions or outdoor park availability. As more facilities open and existing ones expand, indoor dog parks are becoming integral parts of pet-friendly communities. They serve as gathering places for dog owners, support local economies, and contribute to overall community health by promoting responsible pet ownership and canine wellness.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Serve Section */}
        <section className="about-modern-section-alt" style={{ padding: '40px 20px' }}>
          <div className="about-modern-container">
            <h2 className="about-modern-section-title-center">Who We Serve</h2>
            <div className="about-modern-partners-grid">
              <div className="about-modern-partner-card">
                <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>DOG OWNERS</Link>
              </div>
              <div className="about-modern-partner-card">
                <Link href="/list-your-park" style={{ color: 'inherit', textDecoration: 'none' }}>PARK OPERATORS</Link>
              </div>
              <div className="about-modern-partner-card">
                <Link href="/list-your-park" style={{ color: 'inherit', textDecoration: 'none' }}>DAYCARE FACILITIES</Link>
              </div>
              <div className="about-modern-partner-card">
                <Link href="/list-your-park" style={{ color: 'inherit', textDecoration: 'none' }}>TRAINING CENTERS</Link>
              </div>
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
