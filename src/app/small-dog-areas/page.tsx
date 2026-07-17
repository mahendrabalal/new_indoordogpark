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
const ogImageUrl = `${siteUrl.replace(/\/$/, '')}/images/hero/small-dog-areas.webp`;

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Indoor Parks with Small Dog Areas | Safe Play Spaces';
  const description =
    'Discover indoor dog parks featuring dedicated small dog areas. Find safe, climate-controlled environments where petite pups can play freely without larger dogs.';
  const canonicalUrl = '/small-dog-areas';

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: 'indoor dog parks for small dogs, small dog play areas, dedicated small dog parks, safe indoor dog parks',
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
          alt: 'Indoor Parks with Small Dog Areas - Safe Play Spaces',
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

function filterParksForSmallDogs(parks: DogPark[]): DogPark[] {
  const smallDogKeywords = ['small dog', 'petite', 'under 30 lbs', 'under 25 lbs', 'little dog', 'separated area', 'designated small'];

  return parks.filter(park => {
    if (park.amenities?.smallDogArea) return true;

    const nameLower = park.name.toLowerCase();
    const descriptionLower = (park.description || '').toLowerCase();
    
    return smallDogKeywords.some(keyword =>
      nameLower.includes(keyword) ||
      descriptionLower.includes(keyword)
    );
  });
}

export const revalidate = 3600;

export default async function SmallDogAreasPage() {
  const allParks = await getAllStaticParks();
  const filteredParks = filterParksForSmallDogs(allParks);

  const topParks = filteredParks.slice(0, 6);
  const collectionPageSchema = generateCollectionPageSchema(filteredParks.slice(0, 20));

  let relatedBlogPosts: BlogPost[] = [];
  try {
    const blogData = await getCachedPosts({ page: 1, perPage: 6, search: 'small dog puppy safe play' });
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
        <div className="absolute inset-0 z-0 bg-blue-100">
           {/* Fallback color if image is missing */}
        </div>
        <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.4) 15%, rgba(0,0,0,0.1) 40%, transparent 70%)' }} />
        <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(135deg, rgba(142,68,173,0.72) 0%, rgba(52,152,219,0.72) 100%)', mixBlendMode: 'multiply' }} />
        
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto" style={{ paddingTop: '90px' }}>
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/20 text-white text-sm font-semibold tracking-widest uppercase mb-6 backdrop-blur-md border border-white/30 shadow-lg">
            Safe & Secure
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-xl">
            Indoor Parks with <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-pink-500">Small Dog Areas</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/95 mb-10 font-light drop-shadow-lg max-w-3xl mx-auto">
            Discover safe, climate-controlled environments featuring dedicated sections where petite pups can socialize freely without larger dogs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="#venues" className="bg-white text-purple-700 hover:bg-gray-100 font-bold py-4 px-8 rounded-full transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-lg flex items-center gap-2">
              <i className="bi bi-grid-3x3-gap"></i> Browse Safe Parks
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose a Dedicated Small Dog Area?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Providing a safe, intimidation-free zone is crucial for the positive socialization and well-being of smaller breeds.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                <i className="bi bi-shield-check text-3xl text-blue-600 group-hover:text-white transition-colors duration-300"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Injury Prevention</h3>
              <p className="text-gray-600 text-lg leading-relaxed">Even friendly large dogs can accidentally injure a small dog during play. Separate areas eliminate the risk of weight-discrepancy accidents.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-pink-600 transition-colors duration-300">
                <i className="bi bi-emoji-smile text-3xl text-pink-600 group-hover:text-white transition-colors duration-300"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Stress-Free Play</h3>
              <p className="text-gray-600 text-lg leading-relaxed">Small dogs often feel overwhelmed or defensive around larger breeds. A dedicated space allows them to relax and play confidently.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors duration-300">
                <i className="bi bi-people text-3xl text-purple-600 group-hover:text-white transition-colors duration-300"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Equal Play Styles</h3>
              <p className="text-gray-600 text-lg leading-relaxed">Dogs of similar sizes tend to have more compatible play styles, making interactions fairer and more enjoyable for everyone involved.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Rated Parks Grid */}
      <section id="venues" className="py-20 bg-white scroll-mt-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Top Rated Facilities</h2>
              <p className="text-lg text-gray-600">Explore some of the best-reviewed indoor dog parks with dedicated spaces for small breeds.</p>
            </div>
            <Link href="/parks" className="mt-6 md:mt-0 text-purple-600 font-semibold hover:text-purple-800 flex items-center gap-2 group whitespace-nowrap text-lg">
              Browse All Facilities <i className="bi bi-arrow-right group-hover:translate-x-2 transition-transform"></i>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topParks.map(park => (
              <ParkCard key={park.id} park={park} />
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <div id="guide" className="scroll-mt-20">
        <SeoContentSection
          eyebrow="Safe Playpaces"
          title="Understanding small dog areas: what to look for"
          intro={[
            'For owners of small breeds, a trip to the dog park can sometimes be stressful. Even well-intentioned large dogs can pose a risk to dogs under 30 pounds due to sheer size difference.',
            'Finding an indoor dog park with a strictly enforced, dedicated small dog area ensures your pet can run, socialize, and exercise without fear or intimidation.',
          ]}
          sections={[
            {
              heading: 'What defines a good small dog area?',
              paragraphs: [
                'A quality small dog area is more than just a fenced-off corner. It should be a thoughtful, fully-equipped section of the park designed specifically for the needs of petite pups.',
              ],
              listItems: [
                'Strict weight limits (usually 25-35 lbs max) enforced by staff.',
                'Secure, double-gated entry systems to prevent large dogs from slipping in.',
                'Fencing with gaps small enough to prevent tiny dogs from squeezing through.',
                'Appropriately sized water bowls and play equipment.',
                'Direct supervision by trained staff to ensure rules are followed.',
              ],
            },
            {
              heading: 'Benefits for puppies and seniors',
              paragraphs: [
                'Small dog areas aren’t just for adult small breeds. They are often the perfect environment for young puppies (once fully vaccinated) who are just learning to socialize, as well as senior dogs who need a gentler pace of play.',
                'Always check a venue’s specific rules regarding puppies, as age and vaccination requirements vary.',
              ],
              listItems: [],
            },
            {
              heading: 'Etiquette for the small dog side',
              paragraphs: [
                'Even in a small dog area, good etiquette is important to keep the peace.',
              ],
              listItems: [
                'Don\'t bring large dogs into the small dog area, even if they are "gentle giants".',
                'Monitor your dog closely; small dogs can still display aggressive or overly dominant behavior.',
                'Be mindful of extremely tiny "teacup" breeds, which can be fragile even among other small dogs.',
              ],
            },
          ]}
          faqs={[
            {
              question: 'What is the typical weight limit for a small dog area?',
              answer:
                'Most parks set the limit between 25 and 35 pounds. However, this can vary by facility, so it’s always best to check their specific rules before visiting.',
            },
            {
              question: 'Can I bring my gentle large dog into the small dog area?',
              answer:
                'Generally, no. Rules are in place to ensure the safety and comfort of the small dogs. Even a friendly large dog can cause accidental injury or induce fear in smaller dogs.',
            },
            {
              question: 'What if my small dog prefers playing with large dogs?',
              answer:
                'If your small dog is robust, confident, and the park rules allow it, they may be permitted in the large dog area. However, you assume the risk of accidental injury. Many parks prohibit small dogs in the large dog area for liability reasons.',
            },
          ]}
          links={[
            {
              href: '/list-your-park',
              title: 'List your facility',
              description: 'Own a dog park with a great small dog section? Submit a listing.',
            },
            {
              href: '/parks',
              title: 'Search all parks',
              description: 'Browse our complete directory of indoor dog parks and training facilities.',
            },
          ]}
          className=""
        />
      </div>

      <Footer />
    </div>
  );
}
