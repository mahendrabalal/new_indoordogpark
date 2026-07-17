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
const ogImageUrl = `${siteUrl.replace(/\/$/, '')}/images/hero/agility-courses.webp`;

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Indoor Dog Agility Courses | Training & Enrichment Parks';
  const description =
    'Find the best indoor dog agility courses near you. Discover climate-controlled facilities with professional agility equipment, obstacles, and training programs.';
  const canonicalUrl = '/indoor-agility-courses';

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: 'indoor dog agility courses, dog agility training, indoor dog obstacle courses, indoor dog training facilities',
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
          alt: 'Indoor Dog Agility Courses - Training & Enrichment Parks',
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

function filterParksWithAgility(parks: DogPark[]): DogPark[] {
  const agilityKeywords = ['agility', 'obstacle', 'course', 'training equipment', 'jump', 'tunnel', 'weave poles'];

  return parks.filter(park => {
    if (park.amenities?.agilityCourse) return true;

    const nameLower = park.name.toLowerCase();
    const descriptionLower = (park.description || '').toLowerCase();
    const businessTypeLower = (park.businessType || '').toLowerCase();

    return agilityKeywords.some(keyword =>
      nameLower.includes(keyword) ||
      descriptionLower.includes(keyword) ||
      businessTypeLower.includes(keyword)
    );
  });
}

export const revalidate = 3600;

export default async function IndoorAgilityCoursesPage() {
  const allParks = await getAllStaticParks();
  const filteredParks = filterParksWithAgility(allParks);

  const topParks = filteredParks.slice(0, 6);
  const collectionPageSchema = generateCollectionPageSchema(filteredParks.slice(0, 20));

  let relatedBlogPosts: BlogPost[] = [];
  try {
    const blogData = await getCachedPosts({ page: 1, perPage: 6, search: 'agility training obstacle course' });
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
            src="/images/hero/agility-courses.webp"
            alt="Dogs running an indoor agility course"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.4) 15%, rgba(0,0,0,0.1) 40%, transparent 70%)' }} />
        <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(135deg, rgba(39,174,96,0.72) 0%, rgba(41,128,185,0.72) 100%)', mixBlendMode: 'multiply' }} />
        
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto" style={{ paddingTop: '90px' }}>
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/20 text-white text-sm font-semibold tracking-widest uppercase mb-6 backdrop-blur-md border border-white/30 shadow-lg">
            Active Enrichment
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-xl">
            Indoor Dog <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-green-500">Agility Courses</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/95 mb-10 font-light drop-shadow-lg max-w-3xl mx-auto">
            Find climate-controlled facilities with professional agility equipment, obstacles, and training programs to challenge your dog physically and mentally.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="#venues" className="bg-white text-green-700 hover:bg-gray-100 font-bold py-4 px-8 rounded-full transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-lg flex items-center gap-2">
              <i className="bi bi-grid-3x3-gap"></i> Browse Facilities
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose an Agility Course?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Agility training provides unmatched physical exercise and mental stimulation, building confidence and strengthening your bond.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                <i className="bi bi-lightning-charge text-3xl text-blue-600 group-hover:text-white transition-colors duration-300"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">High-Energy Burn</h3>
              <p className="text-gray-600 text-lg leading-relaxed">Perfect for working breeds and energetic dogs. A short session of agility burns more energy than a long walk.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors duration-300">
                <i className="bi bi-puzzle text-3xl text-purple-600 group-hover:text-white transition-colors duration-300"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Mental Stimulation</h3>
              <p className="text-gray-600 text-lg leading-relaxed">Navigating obstacles requires focus and problem-solving, which tires out dogs mentally and reduces destructive behaviors.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors duration-300">
                <i className="bi bi-heart-pulse text-3xl text-green-600 group-hover:text-white transition-colors duration-300"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Build Confidence</h3>
              <p className="text-gray-600 text-lg leading-relaxed">Overcoming new challenges like tunnels and A-frames helps shy or fearful dogs build confidence in themselves and trust in you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Rated Parks Grid */}
      <section id="venues" className="py-20 bg-white scroll-mt-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Top Agility Facilities</h2>
              <p className="text-lg text-gray-600">Explore some of the highest-rated indoor dog parks featuring agility equipment and obstacle courses.</p>
            </div>
            <Link href="/parks" className="mt-6 md:mt-0 text-green-600 font-semibold hover:text-green-800 flex items-center gap-2 group whitespace-nowrap text-lg">
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
          eyebrow="Active Enrichment"
          title="Indoor dog agility courses: a beginner's guide"
          intro={[
            'Agility training is one of the most rewarding activities you can do with your dog. It combines physical exercise with mental challenges, requiring teamwork and communication. Indoor agility courses offer the perfect environment to practice year-round, regardless of weather conditions.',
            'Whether you are looking for a fun way to tire out a high-energy pup or training for competitive events, these facilities provide the equipment and space you need.',
          ]}
          sections={[
            {
              heading: 'Equipment you will typically find',
              paragraphs: [
                'Indoor facilities vary from basic obstacle setups to full regulation-size competition courses. Most locations will have a mix of jumps (bar jumps, tire jumps), tunnels (open and closed), weave poles, and contact obstacles like A-frames, dog walks, and seesaws.',
                'Premium training centers often feature specialized flooring, such as high-density EVA foam or artificial turf designed specifically to reduce impact on canine joints.',
              ],
              listItems: [
                'Standard jumps and tire jumps.',
                'Open tunnels and closed/chute tunnels.',
                'Weave poles (often adjustable for training).',
                'A-frames, dog walks, and seesaws.',
                'Pause tables or boxes.',
              ],
            },
            {
              heading: 'Getting started safely',
              paragraphs: [
                'If your dog has never tried agility before, start slow. Safety is paramount. Many facilities offer beginner classes or introductory sessions where an instructor can show you how to properly introduce your dog to each obstacle.',
                'Never force a dog over or through an obstacle. Use positive reinforcement, high-value treats, and encouragement. Keep sessions short—mental fatigue sets in quickly for beginners.',
              ],
              listItems: [
                'Ensure your dog is physically mature enough (jumping is often restricted for puppies under 1 year to protect developing joints).',
                'Consult your vet before starting high-impact activities.',
                'Start with jumps set low or on the ground.',
                'Keep sessions brief (10-15 minutes of active work).',
              ],
            },
            {
              heading: 'Drop-in vs. structured classes',
              paragraphs: [
                'Many venues offer "open gym" or drop-in hours where you can rent ring time or use the equipment independently. This is great for practice, but if you are new to the sport, look for a facility that offers structured classes.',
                'Classes provide guided instruction, help prevent bad habits, and ensure you and your dog are using the equipment safely.',
              ],
              listItems: [
                'Drop-in/Open Ring: Best for experienced handlers looking to practice.',
                'Beginner Classes: Best for introducing obstacles safely.',
                'Advanced/Competition Classes: Best for refining skills and handling techniques.',
              ],
            },
          ]}
          faqs={[
            {
              question: 'Can any breed do agility?',
              answer:
                'Yes! While breeds like Border Collies and Australian Shepherds excel at the highest competitive levels, any healthy, active dog can enjoy agility for fun. Equipment can usually be adjusted to accommodate different sizes and abilities.',
            },
            {
              question: 'At what age can my dog start agility?',
              answer:
                'Foundation skills (like focus, obedience, and navigating tunnels) can start early, but high-impact activities like jumping or weaving should wait until the dog’s growth plates have closed (typically 12-18 months, depending on the breed).',
            },
            {
              question: 'Do I need special equipment to participate?',
              answer:
                'Just bring a standard flat collar (no choke, prong, or e-collars), a regular leash (no retractables), and plenty of high-value treats or your dog’s favorite tug toy. Wear comfortable athletic shoes with good traction.',
            },
          ]}
          links={[
            {
              href: '/list-your-park',
              title: 'List your facility',
              description: 'Own an indoor training center or agility facility? Submit a listing.',
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
