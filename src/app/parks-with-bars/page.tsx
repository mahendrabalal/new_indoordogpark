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
const ogImageUrl = `${siteUrl.replace(/\/$/, '')}/images/hero/parks-with-bars.webp`;

type ParksWithBarsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  searchParams,
}: ParksWithBarsPageProps): Promise<Metadata> {
  const title = 'Indoor Dog Parks with Bars | Dog-Friendly Bars & Play Spaces';
  const description =
    'Discover indoor dog parks with bars and restaurants. Find climate-controlled play spaces where you can enjoy drinks while your dog plays. Search by city or location.';
  const canonicalUrl = '/parks-with-bars';
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const isFiltered = Object.keys(resolvedSearchParams).length > 0;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: 'indoor dog parks with bars, dog-friendly bars, dog parks with restaurants, indoor dog play spaces with food',
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
          alt: 'Indoor Dog Parks with Bars - Dog-Friendly Bars & Play Spaces',
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
      index: !isFiltered,
      follow: true,
      googleBot: {
        index: !isFiltered,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// Filter parks that have bars, restaurants, or food service
function filterParksWithBars(parks: DogPark[]): DogPark[] {
  const barKeywords = ['bar', 'restaurant', 'cafe', 'food', 'dining', 'pub', 'brewery', 'bistro', 'grill'];

  return parks.filter(park => {
    const nameLower = park.name.toLowerCase();
    const descriptionLower = (park.description || '').toLowerCase();
    const businessTypeLower = (park.businessType || '').toLowerCase();

    // Check if name, description, or business type contains bar-related keywords
    const hasBarKeyword = barKeywords.some(keyword =>
      nameLower.includes(keyword) ||
      descriptionLower.includes(keyword) ||
      businessTypeLower.includes(keyword)
    );

    return hasBarKeyword;
  });
}

export const revalidate = 3600; // Refresh hourly

export default async function ParksWithBarsPage() {
  // Get all parks and filter for those with bars
  const allParks = await getAllStaticParks();
  const filteredParks = filterParksWithBars(allParks);

  // Take top 6 for initial display on the pillar page
  const topParks = filteredParks.slice(0, 6);
  const collectionPageSchema = generateCollectionPageSchema(filteredParks.slice(0, 20));

  // Get related blog posts about bars/restaurants
  let relatedBlogPosts: BlogPost[] = [];
  try {
    const blogData = await getCachedPosts({ page: 1, perPage: 6, search: 'bar restaurant food dining' });
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
            src="/images/hero/parks-with-bars.webp"
            alt="Dogs playing at an indoor dog park with a bar"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        {/* Dark gradient scrim behind the header so white nav text is always readable */}
        <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.4) 15%, rgba(0,0,0,0.1) 40%, transparent 70%)' }} />
        {/* Main hero gradient overlay */}
        <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(135deg, rgba(44,62,80,0.72) 0%, rgba(52,152,219,0.72) 100%)', mixBlendMode: 'multiply' }} />
        
        
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto" style={{ paddingTop: '90px' }}>
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/20 text-white text-sm font-semibold tracking-widest uppercase mb-6 backdrop-blur-md border border-white/30 shadow-lg">
            Premium Venues
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-xl">
            Indoor Dog Parks <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">with Bars</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/95 mb-10 font-light drop-shadow-lg max-w-3xl mx-auto">
            Discover climate-controlled play spaces where you can enjoy craft drinks and great food while your dog plays safely.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="#venues" className="bg-white text-purple-700 hover:bg-gray-100 font-bold py-4 px-8 rounded-full transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-lg flex items-center gap-2">
              <i className="bi bi-grid-3x3-gap"></i> Browse Top Venues
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose a Park with a Bar?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">The perfect blend of canine enrichment and human socialization, offering a unique experience for both you and your furry friend.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                <i className="bi bi-thermometer-sun text-3xl text-blue-600 group-hover:text-white transition-colors duration-300"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Climate Controlled</h3>
              <p className="text-gray-600 text-lg leading-relaxed">No more muddy paws, freezing winters, or overheating in the summer sun. Enjoy perfect weather year-round.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors duration-300">
                <i className="bi bi-cup-hot text-3xl text-purple-600 group-hover:text-white transition-colors duration-300"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Socialize & Relax</h3>
              <p className="text-gray-600 text-lg leading-relaxed">Grab a craft beer, wine, or artisanal coffee while mingling with other local dog owners in your community.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors duration-300">
                <i className="bi bi-shield-check text-3xl text-green-600 group-hover:text-white transition-colors duration-300"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Safe Supervision</h3>
              <p className="text-gray-600 text-lg leading-relaxed">Most premium venues employ trained "Rufferees" to monitor play, ensuring a safe environment for everyone.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Rated Parks Grid */}
      <section id="venues" className="py-20 bg-white scroll-mt-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Top Rated Venues</h2>
              <p className="text-lg text-gray-600">Explore some of the highest-rated indoor dog parks featuring bars, cafes, and restaurants across the country.</p>
            </div>
            <Link href="/parks" className="mt-6 md:mt-0 text-purple-600 font-semibold hover:text-purple-800 flex items-center gap-2 group whitespace-nowrap text-lg">
              Browse All Venues <i className="bi bi-arrow-right group-hover:translate-x-2 transition-transform"></i>
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
          eyebrow="Dog-friendly nightlife"
          title="Indoor dog parks with bars: what to expect and how to choose"
          intro={[
            'Indoor dog parks with bars combine a climate-controlled play space for dogs with a bar, restaurant, or café area for people. These venues are popular when it is too hot, too cold, or too rainy for outdoor parks—and they can be a great option for social dogs and owners who want a relaxed place to hang out.',
            'Because food and drinks are involved, the best “parks with bars” tend to have clear safety rules, strong supervision, and thoughtful layouts that separate play zones from serving areas. Read our practical tips before you go.',
          ]}
          sections={[
            {
              heading: 'What makes a great park-with-bar venue',
              paragraphs: [
                'The best experiences come from venues that treat the dog park as the main attraction, not an afterthought. Look for clean flooring, ample room for dogs to move, and a clear plan for separating dogs by size or play style when needed.',
                'For humans, comfortable seating with good sight lines matters. Many venues also offer water stations, waste disposal, and staff who actively monitor play.',
              ],
              listItems: [
                'Clear rules posted at check-in (vaccines, age, temperament, supervision).',
                'Separate entry/exit and double-gated vestibules to prevent escapes.',
                'Visible staff oversight and an easy way to report issues.',
                'Good ventilation and routine cleaning throughout the day.',
                'Designated food/drink zones away from high-energy play.',
              ],
            },
            {
              heading: 'Etiquette and safety tips (especially around food and drinks)',
              paragraphs: [
                'Food and drinks can increase excitement. Plan for your dog’s success by arriving after a short walk, bringing high-value treats only if allowed, and avoiding peak hours if your dog is still learning polite greetings.',
                'If your venue serves alcohol, remember: dogs take cues from us. Staying attentive—rather than treating the park like a “hands-off” daycare—helps keep the space safe for everyone.',
              ],
              listItems: [
                'Watch body language: stiff posture, hard staring, or repeated mounting are signs to intervene.',
                'Avoid bringing toys if the venue discourages them (resource guarding).',
                'Keep drinks and food out of reach; ask staff about spill cleanup procedures.',
                'Know when to leave: overtired dogs can get snippy even if they started happy.',
              ],
            },
            {
              heading: 'How to use our directory to find the right match',
              paragraphs: [
                'Start by searching your city in our main directory, then refine by rating and price. Click a listing to open details, photos, and website links so you can confirm requirements and hours.',
                'If you are traveling, bookmark a few options. Policies vary, and some venues require registration, waivers, or proof of vaccinations before entry.',
              ],
              listItems: [
                'Use “Any Rating” to quickly narrow down to the most loved venues.',
                'Check the description for clues like “brewery,” “café,” or “restaurant.”',
                'Open the website to verify vaccination rules and whether reservations are needed.',
              ],
            },
            {
              heading: 'For owners: add or update your venue',
              paragraphs: [
                'If you run an indoor dog park with a bar or food service, a complete listing helps customers understand your rules and reduces friction at check-in. Strong listings typically include accurate hours, pricing, photos of the play zones, and a short description of how you handle safety.',
                'You can submit your venue for free, or choose a featured placement for extra visibility.',
              ],
              listItems: [
                'Include vaccine requirements and any age restrictions.',
                'Mention play area separation (small/large, high/low energy).',
                'Add details about food/drink areas and leash policies.',
                'Upload multiple photos showing the space and seating layout.',
              ],
            },
          ]}
          faqs={[
            {
              question: 'Do indoor dog parks with bars usually require vaccinations?',
              answer:
                'Yes. Most venues require proof of core vaccines, and many also require bordetella and a current rabies vaccine. Always check the venue website for the exact list and acceptable documentation.',
            },
            {
              question: 'Are these venues safe for puppies?',
              answer:
                'It depends on the venue rules and your puppy’s age and vaccine status. Some locations have age minimums or puppy-specific play times. If your puppy is still learning social skills, choose off-peak hours and start with short visits.',
            },
            {
              question: 'How long should a first visit be?',
              answer:
                'For many dogs, 30–60 minutes is a great first session. Watch for signs of overstimulation and leave while your dog is still having a good time so the experience ends on a positive note.',
            },
            {
              question: 'Can I bring outside food or treats?',
              answer:
                'Policies vary. Some venues allow treats; others restrict them to prevent resource guarding. When in doubt, keep food and toys in your bag and follow staff guidance.',
            },
          ]}
          links={[
            {
              href: '/list-your-park',
              title: 'List your venue',
              description: 'Own a dog-friendly bar or venue? Submit a free listing or upgrade to featured placement.',
            },
            {
              href: '/parks',
              title: 'Search all parks',
              description: 'Browse our complete directory of indoor dog parks and training facilities.',
            },
            {
              href: '/contact',
              title: 'Contact us',
              description: 'Found an incorrect listing or want to suggest a venue? Send us a message.',
            },
          ]}
          className=""
        />
      </div>

      {/* Related Resources Section */}
      <div className="bg-gray-100 py-20 border-t border-gray-200">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Related Resources</h2>
            <p className="text-gray-600 text-lg">Keep exploring our guides, directories, and latest articles.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <Link href="/training-facilities" className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <i className="bi bi-mortarboard text-blue-600 group-hover:text-white transition-colors"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">Training Facilities</h3>
              <p className="text-gray-600">Find indoor dog training facilities and agility centers to build skills.</p>
            </Link>
            <Link href="/blog" prefetch={false} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors">
                <i className="bi bi-journal-text text-purple-600 group-hover:text-white transition-colors"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">Blog & Guides</h3>
              <p className="text-gray-600">Read our latest articles about dog parks, training, and pet care.</p>
            </Link>
            <Link href="/parks" className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
                <i className="bi bi-geo-alt text-green-600 group-hover:text-white transition-colors"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">Full Directory</h3>
              <p className="text-gray-600">Search our complete database of indoor dog parks nationwide.</p>
            </Link>
          </div>

          {relatedBlogPosts.length > 0 && (
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Latest from the Blog</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedBlogPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group flex flex-col h-full"
                  >
                    <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">{post.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">{post.excerpt.replace(/<[^>]*>/g, '').substring(0, 120)}...</p>
                    <span className="text-purple-600 font-semibold text-sm flex items-center gap-1">Read Article <i className="bi bi-arrow-right"></i></span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
