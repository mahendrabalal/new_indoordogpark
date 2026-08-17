import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllStaticParks } from '@/lib/parks-data';
import { generateCollectionPageSchema } from '@/lib/metadata';
import { DogPark } from '@/types/dog-park';
import { getCachedPosts } from '@/lib/sanity-api';
import { BlogPost } from '@/types/wordpress';
import SeoContentSection from '@/components/SeoContentSection';
import OptimizedImage from '@/components/OptimizedImage';
import ParkCard from '@/components/ParkCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indoordogpark.org';
const siteName = 'Indoor Dog Park';
const ogImageUrl = `${siteUrl.replace(/\/$/, '')}/images/hero/hero.webp`;

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Indoor Dog Pools & Swimming Facilities | Near Me';
  const description =
    'Discover indoor dog pools, hydrotherapy, and swimming facilities. Find climate-controlled pools where your dog can swim year-round. Search by city or location.';
  const canonicalUrl = '/indoor-dog-pools';

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: 'indoor dog pools, dog swimming near me, dog hydrotherapy, indoor dog water park, dog pool',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      url: `${siteUrl}${canonicalUrl}`,
      title,
      description,
      siteName,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: 'Indoor Dog Pools and Swimming Facilities',
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
      site: '@indoordogpark',
      creator: '@indoordogpark',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// Filter parks that have pools, swimming, or hydrotherapy
function filterIndoorDogPools(parks: DogPark[]): DogPark[] {
  const poolKeywords = ['pool', 'swim', 'hydrotherapy', 'splash', 'water park', 'dock diving'];

  return parks.filter(park => {
    const nameLower = park.name.toLowerCase();
    const descriptionLower = (park.description || '').toLowerCase();
    const businessTypeLower = (park.businessType || '').toLowerCase();

    // Check if name, description, or business type contains pool-related keywords
    const hasPoolKeyword = poolKeywords.some(keyword =>
      nameLower.includes(keyword) ||
      descriptionLower.includes(keyword) ||
      businessTypeLower.includes(keyword)
    );

    return hasPoolKeyword;
  });
}

export const revalidate = 86400; // 24 hours

export default async function IndoorDogPoolsPage() {
  // Get all parks and filter for those with pools
  const allParks = await getAllStaticParks();
  const filteredParks = filterIndoorDogPools(allParks);

  // Take top 6 for initial display on the pillar page
  const topParks = filteredParks.slice(0, 6);
  const collectionPageSchema = generateCollectionPageSchema(filteredParks.slice(0, 20));

  // Get related blog posts about swimming/pools
  let relatedBlogPosts: BlogPost[] = [];
  try {
    const blogData = await getCachedPosts({ page: 1, perPage: 6, search: 'swim pool hydrotherapy' });
    relatedBlogPosts = blogData.posts.slice(0, 3);
  } catch (error) {
    console.error('Error fetching related blog posts:', error);
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header variant="light" />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      
      {/* Premium Hero Section */}
      <section className="relative h-[65vh] min-h-[550px] flex items-center justify-center overflow-hidden" style={{ marginTop: '-1px' }}>
        <div className="absolute inset-0 z-0">
          <OptimizedImage
            src="/images/hero/hero.webp"
            alt="Dogs swimming in an indoor pool"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        {/* Dark gradient scrim behind the header so white nav text is always readable */}
        <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.4) 15%, rgba(0,0,0,0.1) 40%, transparent 70%)' }} />
        {/* Main hero gradient overlay */}
        <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(135deg, rgba(30,144,255,0.72) 0%, rgba(0,191,255,0.72) 100%)', mixBlendMode: 'multiply' }} />
        
        
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto" style={{ paddingTop: '90px' }}>
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/20 text-white text-sm font-semibold tracking-widest uppercase mb-6 backdrop-blur-md border border-white/30 shadow-lg">
            Premium Facilities
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-xl">
            Indoor Dog <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">Pools</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/95 mb-10 font-light drop-shadow-lg max-w-3xl mx-auto">
            Discover climate-controlled pools and hydrotherapy facilities where your dog can swim, splash, and exercise year-round.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="#venues" className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-full transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-lg flex items-center gap-2">
              <i className="bi bi-grid-3x3-gap"></i> Browse Top Pools
            </a>
            <Link href="#guide" className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold py-4 px-8 rounded-full transition-all shadow-lg text-lg">
              Read the Guide
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20">
          <svg className="relative block w-full h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.98,131.5,202.8,126.7,243.66,124,284.1,111.4,321.39,56.44Z" fill="#f9fafb"></path>
          </svg>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-20 bg-gray-50 relative z-30 -mt-2">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose an Indoor Dog Pool?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Swimming is incredible low-impact exercise for dogs, perfect for burning energy, cooling down, or rehabilitating injuries.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                <i className="bi bi-droplet text-3xl text-blue-600 group-hover:text-white transition-colors duration-300"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Year-Round Swimming</h3>
              <p className="text-gray-600 text-lg leading-relaxed">No toxic algae blooms, freezing lakes, or dangerous currents. Indoor pools offer a safe, clean, and climate-controlled swimming environment.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-cyan-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-cyan-600 transition-colors duration-300">
                <i className="bi bi-heart-pulse text-3xl text-cyan-600 group-hover:text-white transition-colors duration-300"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Hydrotherapy</h3>
              <p className="text-gray-600 text-lg leading-relaxed">Perfect for senior dogs or dogs recovering from surgery. The buoyancy of water relieves joint stress while building muscle.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-600 transition-colors duration-300">
                <i className="bi bi-lightning text-3xl text-teal-600 group-hover:text-white transition-colors duration-300"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Burn Huge Energy</h3>
              <p className="text-gray-600 text-lg leading-relaxed">Just 15 minutes of swimming is equivalent to a long, exhausting run. It's the fastest way to tire out a high-energy dog.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Rated Parks Grid */}
      <section id="venues" className="py-20 bg-white scroll-mt-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Top Rated Pools</h2>
              <p className="text-lg text-gray-600">Explore some of the highest-rated indoor dog swimming pools and hydrotherapy centers across the country.</p>
            </div>
            <Link href="/parks" className="mt-6 md:mt-0 text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-2 group whitespace-nowrap text-lg">
              Browse All Facilities <i className="bi bi-arrow-right group-hover:translate-x-2 transition-transform"></i>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topParks.length > 0 ? (
              topParks.map(park => (
                <ParkCard key={park.id} park={park} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-lg text-gray-600">We are currently updating our directory with the best indoor dog pools. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <div id="guide" className="scroll-mt-20">
        <SeoContentSection
          eyebrow="Swimming and Hydrotherapy"
          title="Indoor dog pools: everything you need to know before you go"
          intro={[
            'Indoor dog pools are becoming incredibly popular for pet parents looking to give their dogs safe, clean, and joint-friendly exercise. Unlike lakes or rivers, indoor facilities offer climate-controlled water, eliminating risks like toxic algae, sharp rocks, and dangerous currents.',
            'Whether your dog is a seasoned dock-diver, an arthritic senior needing hydrotherapy, or a beginner learning to swim, indoor pools provide a controlled environment to build confidence and burn energy.',
          ]}
          sections={[
            {
              heading: 'Types of indoor swimming facilities',
              paragraphs: [
                'Not all indoor dog pools are the same. It is important to choose the right facility based on your dog’s needs and experience level.',
              ],
              listItems: [
                'Recreational Pools: Large, open swimming pools designed for fetching toys, dock diving, and high-energy play.',
                'Hydrotherapy Tanks: Smaller, specialized pools or underwater treadmills monitored by certified canine rehabilitation practitioners for injury recovery.',
                'Private Rentals: Smaller pools that you can rent out entirely for your dog, which is perfect for reactive dogs or beginners who need quiet time.',
              ],
            },
            {
              heading: 'How to prepare your dog for indoor swimming',
              paragraphs: [
                'If it is your dog’s first time swimming indoors, the acoustics and smells can be a bit overwhelming. Arrive early to let them sniff around the building before getting wet.',
              ],
              listItems: [
                'Bring a well-fitting dog life jacket if your dog is not a strong swimmer. (Many facilities offer rentals!).',
                'Pack extra towels. While some places provide towels or blow dryers, bringing your own is always a safe bet.',
                'Do not feed a large meal right before swimming to prevent cramping and reduce the risk of bloat.',
                'Ensure your dog’s nails are trimmed so they don’t scratch the pool liner or themselves while paddling.',
              ],
            },
            {
              heading: 'What to look for in a quality facility',
              paragraphs: [
                'Safety and hygiene should be your top priorities when selecting an indoor dog pool.',
              ],
              listItems: [
                'Water Quality: Ask how the pool is sanitized. Quality pools use advanced filtration, UV light, or low-chlorine systems safe for dogs.',
                'Ramp Access: Pools should have gently sloping ramps or stairs, not just ladders, so dogs can safely enter and exit the water.',
                'Supervision: Look for facilities that require an orientation swim with a staff member on your first visit.',
                'Non-Slip Flooring: The areas surrounding the pool should have textured, anti-slip matting to prevent injuries when dogs run out wet.',
              ],
            },
          ]}
          faqs={[
            {
              question: 'Are indoor dog pools safe?',
              answer:
                'Yes, highly maintained indoor dog pools are often safer than natural bodies of water. They are free from blue-green algae, unpredictable currents, and underwater hazards. However, you must always supervise your dog.',
            },
            {
              question: 'Can I swim in the pool with my dog?',
              answer:
                'This depends entirely on the facility. Some allow owners in the water, especially for hydrotherapy or beginner lessons, while others strictly prohibit humans in the pool for health code reasons. Always check the rules beforehand.',
            },
            {
              question: 'Do I need to wash my dog after swimming?',
              answer:
                'It is highly recommended to thoroughly rinse your dog with fresh water after swimming in a chlorinated or salt-water pool to prevent dry, itchy skin. Most facilities provide a self-wash station or rinse hose.',
            },
          ]}
          links={[
            {
              href: '/list-your-park',
              title: 'List your facility',
              description: 'Own an indoor dog pool or hydrotherapy center? Submit a free listing.',
            },
            {
              href: '/parks',
              title: 'Search all facilities',
              description: 'Browse our complete directory of indoor dog parks and training centers.',
            },
          ]}
          className=""
        />
      </div>

      <Footer />
    </div>
  );
}
