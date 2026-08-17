import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getCachedPosts } from '@/lib/sanity-api';
import { BlogPost } from '@/types/wordpress';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAllStaticParks } from '@/lib/parks-data';
import { DogPark } from '@/types/dog-park';
import ParkCard from '@/components/ParkCard';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indoordogpark.org';
const siteName = 'Indoor Dog Park';
const editorialAuthorSlug = 'article';
const ogImageUrl = `${siteUrl.replace(/\/$/, '')}/images/hero/indoor-dog-training-facilities.webp`;

export async function generateMetadata(): Promise<Metadata> {
  const title = 'The Ultimate Guide to Indoor Dog Training Facilities | IndoorDogPark';
  const description =
    'Discover the benefits of indoor dog training facilities. Learn about year-round consistency, specialized equipment, training programs, and how to evaluate certifications.';
  const canonicalUrl = '/training-facilities';

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: 'dog training facilities, indoor dog training, agility centers, dog training classes, professional dog training, CPDT-KA, dog obedience',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'article',
      url: `${siteUrl}${canonicalUrl}`,
      title,
      description,
      siteName,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: 'Indoor Dog Training Facilities Guide',
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
  };
}

export const revalidate = 86400; // 24 hours

const updatedDate = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
}).format(new Date());

// Filter parks that offer training services
function filterTrainingFacilities(parks: DogPark[]): DogPark[] {
  const trainingKeywords = ['training', 'agility', 'obedience', 'class', 'instructor', 'trainer'];
  return parks.filter(park => {
    const hasTrainingAmenity = park.amenities?.training === true;
    const isTrainingBusinessType = park.businessType === 'Agility & Training Parks';
    const nameLower = park.name.toLowerCase();
    const descriptionLower = (park.description || '').toLowerCase();
    const businessTypeLower = (park.businessType || '').toLowerCase();
    const hasTrainingKeyword = trainingKeywords.some(keyword =>
      nameLower.includes(keyword) ||
      descriptionLower.includes(keyword) ||
      businessTypeLower.includes(keyword)
    );
    return hasTrainingAmenity || isTrainingBusinessType || hasTrainingKeyword;
  });
}

export default async function TrainingFacilitiesPage() {
  const allParks = await getAllStaticParks();
  const filteredParks = filterTrainingFacilities(allParks);
  const topTrainingParks = filteredParks
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 3);

  // Get related blog posts about training
  let relatedBlogPosts: BlogPost[] = [];
  try {
    const blogData = await getCachedPosts({ page: 1, perPage: 6, search: 'training agility obedience' });
    relatedBlogPosts = blogData.posts.slice(0, 3);
  } catch (error) {
    console.error('Error fetching related blog posts:', error);
  }

  return (
    <div className="flex flex-col min-h-screen scroll-smooth">
      <Header variant="light" />

      <main className="flex-1 bg-slate-50 pt-24 pb-16">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-slate-500">
              <li>
                <Link href="/" className="hover:text-violet-600 transition-colors">Home</Link>
              </li>
              <li><i className="bi bi-chevron-right text-xs"></i></li>
              <li className="text-slate-900 font-medium" aria-current="page">Training Facilities Guide</li>
            </ol>
          </nav>

          {/* Hero Section */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
              The Ultimate Guide to Indoor Dog Training Facilities
            </h1>
            <div className="flex items-center text-slate-500 text-sm mb-8 space-x-4">
              <Link href={`/blog/author/${editorialAuthorSlug}`} className="flex items-center hover:text-violet-600 transition-colors group">
                <i className="bi bi-person-circle mr-2 text-lg text-violet-500"></i>
                <span className="font-medium group-hover:text-violet-600 transition-colors">Mahendra Balal</span>
              </Link>
              <div className="flex items-center">
                <i className="bi bi-calendar3 mr-2"></i>
                <span>Updated {updatedDate}</span>
              </div>
            </div>
            
            <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg mb-10">
              <Image
                src="/images/hero/indoor-dog-training-facilities.webp"
                alt="Indoor dog training facilities"
                fill
                className="object-cover"
                priority
              />
            </div>
            
            <p className="text-xl text-slate-700 leading-relaxed font-medium">
              Training your dog is one of the most rewarding investments you can make as a pet parent. 
              However, outdoor parks and public spaces often introduce unpredictable weather and uncontrollable distractions. 
              That is why a dedicated indoor dog training facility is rapidly becoming the gold standard for canine education.
            </p>
          </header>

          <div className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-violet-600 hover:prose-a:text-violet-800">
            
            {/* Table of Contents for better UX */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 mb-12 shadow-sm not-prose">
              <h2 className="text-lg font-bold text-slate-900 mb-4 uppercase tracking-wide">Table of Contents</h2>
              <ul className="space-y-3 text-slate-600">
                <li><a href="#why-choose-indoor" className="hover:text-violet-600 font-medium transition-colors flex items-center"><i className="bi bi-arrow-right-short mr-2 text-violet-500"></i> Why Choose an Indoor Training Facility?</a></li>
                <li><a href="#training-programs" className="hover:text-violet-600 font-medium transition-colors flex items-center"><i className="bi bi-arrow-right-short mr-2 text-violet-500"></i> Comparing Types of Training Programs</a></li>
                <li><a href="#featured-facilities" className="hover:text-violet-600 font-medium transition-colors flex items-center"><i className="bi bi-arrow-right-short mr-2 text-violet-500"></i> Featured Indoor Training Facilities</a></li>
                <li><a href="#topic-clusters" className="hover:text-violet-600 font-medium transition-colors flex items-center"><i className="bi bi-arrow-right-short mr-2 text-violet-500"></i> Deep Dive: Specialized Training Topics</a></li>
                <li><a href="#evaluating-centers" className="hover:text-violet-600 font-medium transition-colors flex items-center"><i className="bi bi-arrow-right-short mr-2 text-violet-500"></i> How to Evaluate a Training Center</a></li>
                <li><a href="#faqs" className="hover:text-violet-600 font-medium transition-colors flex items-center"><i className="bi bi-arrow-right-short mr-2 text-violet-500"></i> Frequently Asked Questions</a></li>
              </ul>
            </div>

            <h2 id="why-choose-indoor" className="text-3xl mt-12 mb-6 scroll-mt-24">Why Choose an Indoor Training Facility?</h2>
            <p>
              Indoor facilities provide a controlled, purpose-built environment that maximizes learning retention for both you and your dog. 
              When a dog is trying to learn a new behavior, minimizing environmental variables is crucial.
            </p>

            {/* Scannable Bullet Points */}
            <ul className="mt-6 mb-8">
              <li><strong>Year-Round Consistency:</strong> Extreme summer heat, freezing winter temperatures, or heavy rainfall can disrupt a training schedule for weeks. Climate control guarantees consistency.</li>
              <li><strong>Controlled Distractions:</strong> Public parks are filled with squirrels and traffic. Indoor facilities allow dogs to learn foundational mechanics in a low-stress zone.</li>
              <li><strong>Specialized Flooring:</strong> Reputable centers utilize high-density EVA foam or compressed rubber, protecting joints during high-impact sports like agility.</li>
            </ul>

            {/* Stylized Pull Quote */}
            <blockquote className="border-l-4 border-violet-500 pl-6 italic text-slate-700 my-8 bg-violet-50 py-4 pr-4 rounded-r-lg">
              "A consistent, distraction-free environment is the foundation of all successful canine behavioral modification."
            </blockquote>

            {/* Mid-content CTA */}
            <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 rounded-xl p-6 my-8 not-prose">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">Find Indoor Training Facilities Near You</h3>
                  <p className="text-slate-600 text-sm">Search our directory for climate-controlled training centers in your area.</p>
                </div>
                <Link href="/?type=Agility+%26+Training+Parks" className="inline-flex items-center px-6 py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors">
                  Search Now <i className="bi bi-arrow-right ml-2"></i>
                </Link>
              </div>
            </div>

            <h2 id="training-programs" className="text-3xl mt-16 mb-8 scroll-mt-24">Comparing Types of Training Programs</h2>
            <p>
              Facilities often host a variety of specialized classes. Below is a breakdown of the most common programs you'll find, helping you decide which is right for your dog.
            </p>

            {/* High Quality HTML Comparison Table */}
            <div className="not-prose overflow-x-auto my-10 rounded-xl shadow-sm border border-slate-200">
              <table className="min-w-full text-left border-collapse bg-white">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 border-b border-slate-200">
                    <th className="p-4 font-semibold">Program Type</th>
                    <th className="p-4 font-semibold">Core Focus</th>
                    <th className="p-4 font-semibold">Best For</th>
                    <th className="p-4 font-semibold">Physical vs. Mental</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600 text-sm md:text-base">
                  <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-900"><Link href="/blog/puppy-socialization-classes" className="text-violet-600 hover:text-violet-800">Puppy Socialization</Link></td>
                    <td className="p-4">Bite inhibition, positive exposure to novel stimuli, basic handling.</td>
                    <td className="p-4">Puppies under 16-20 weeks.</td>
                    <td className="p-4">High Social, Low Physical</td>
                  </tr>
                  <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-900"><Link href="/blog/how-much-is-puppy-obedience-training" className="text-violet-600 hover:text-violet-800">Basic Obedience</Link></td>
                    <td className="p-4">Foundational cues: sit, down, stay, recall, and loose-leash walking.</td>
                    <td className="p-4">Adolescents and newly adopted rescue dogs.</td>
                    <td className="p-4">High Mental, Low Physical</td>
                  </tr>
                  <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-900">Agility & Sports</td>
                    <td className="p-4">Navigating obstacles, jumps, tunnels, and weaves via handler cues.</td>
                    <td className="p-4">High-energy working breeds (Border Collies, Aussies).</td>
                    <td className="p-4">High Physical, High Mental</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-900">Behavior Modification</td>
                    <td className="p-4">Desensitization and counter-conditioning for reactivity, fear, or aggression.</td>
                    <td className="p-4">Dogs needing 1-on-1 expert intervention.</td>
                    <td className="p-4">High Mental, High Stress</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 id="featured-facilities" className="text-3xl mt-16 mb-8 scroll-mt-24">Featured Indoor Training Facilities</h2>
            <p>
              To help you get started, here are some of the top-rated indoor training facilities from our national directory:
            </p>
            
            {/* Real Training Facilities Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 not-prose mb-12">
              {topTrainingParks.map(park => (
                <ParkCard key={park.id} park={park} />
              ))}
            </div>

            <h2 id="topic-clusters" className="text-3xl mt-16 mb-8 scroll-mt-24">Deep Dive: Specialized Training Topics</h2>
            <p>
              Looking for highly specific training environments? Explore our focused training clusters to find facilities tailored precisely to your dog's needs:
            </p>
            
            {/* Topic Cluster Hub Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-12">
              <Link href="/blog/puppy-socialization-classes" className="group p-6 bg-white border border-slate-200 rounded-xl hover:border-violet-400 hover:shadow-md transition-all flex items-start">
                <div className="bg-indigo-100 text-indigo-600 p-3 rounded-lg mr-4">
                  <i className="bi bi-heart-fill text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-violet-700 transition-colors">Puppy Socialization Classes</h3>
                  <p className="text-sm text-slate-500 mt-1">Complete guide to finding the best socialization classes for your puppy's critical development window.</p>
                </div>
              </Link>
              <Link href="/blog/how-much-is-puppy-obedience-training" className="group p-6 bg-white border border-slate-200 rounded-xl hover:border-violet-400 hover:shadow-md transition-all flex items-start">
                <div className="bg-green-100 text-green-600 p-3 rounded-lg mr-4">
                  <i className="bi bi-currency-dollar text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-violet-700 transition-colors">Puppy Obedience Training Costs</h3>
                  <p className="text-sm text-slate-500 mt-1">Complete 2026 cost guide for puppy obedience training - what to expect and how to budget.</p>
                </div>
              </Link>
              <Link href="/?type=Agility+%26+Training+Parks" className="group p-6 bg-white border border-slate-200 rounded-xl hover:border-violet-400 hover:shadow-md transition-all flex items-start">
                <div className="bg-orange-100 text-orange-600 p-3 rounded-lg mr-4">
                  <i className="bi bi-lightning-fill text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-violet-700 transition-colors">Agility & Sports Training</h3>
                  <p className="text-sm text-slate-500 mt-1">Discover arenas equipped with professional regulation obstacles.</p>
                </div>
              </Link>
              <Link href="/?query=behavior+modification" className="group p-6 bg-white border border-slate-200 rounded-xl hover:border-violet-400 hover:shadow-md transition-all flex items-start">
                <div className="bg-purple-100 text-purple-600 p-3 rounded-lg mr-4">
                  <i className="bi bi-brain text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-violet-700 transition-colors">Behavior Modification</h3>
                  <p className="text-sm text-slate-500 mt-1">Find facilities specializing in reactivity, fear, and aggression rehabilitation.</p>
                </div>
              </Link>
            </div>

            {/* Agility training video */}
            <div className="my-12 not-prose">
              <div className="relative w-full overflow-hidden rounded-2xl shadow-lg aspect-video bg-black">
                <iframe
                  src="https://www.youtube.com/embed/wBmJDpwtQXQ?rel=0"
                  title="Agility training in action"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>
              <p className="mt-3 text-center text-sm text-slate-500">See agility training in action</p>
            </div>

            <h2 id="evaluating-centers" className="text-3xl mt-16 mb-6 scroll-mt-24">How to Evaluate a Training Center</h2>
            <p>
              The dog training industry is largely unregulated. When selecting an indoor facility, it is critical to evaluate their expertise and health protocols to ensure a safe environment.
            </p>

            <h3 className="text-2xl mt-8 mb-4">1. Verify Trainer Certifications</h3>
            <p>
              Look for facilities employing trainers with recognized, independent certifications. 
              The <a href="https://www.ccpdt.org/" target="_blank" rel="noopener noreferrer">Certification Council for Professional Dog Trainers (CCPDT)</a> offers the <strong>CPDT-KA</strong> credential, requiring rigorous examination. 
              These certifications indicate a commitment to modern, science-based, positive reinforcement methods.
            </p>

            <h3 className="text-2xl mt-8 mb-4">2. Facility Health & Safety Protocols</h3>
            <p>
              According to the <a href="https://www.avma.org/" target="_blank" rel="noopener noreferrer">American Veterinary Medical Association (AVMA)</a>, communal dog environments carry a risk of infectious disease transmission. 
              Top-tier facilities utilize MERV-13 air filtration or commercial-grade UV-C air purifiers to actively reduce airborne pathogens.
            </p>

            <h3 className="text-2xl mt-8 mb-4">3. Essential Training Equipment</h3>
            <p>
              Quality indoor training facilities invest in professional-grade equipment that enhances learning outcomes and ensures safety. Here's what to look for:
            </p>
            <ul className="mt-4 mb-6 space-y-3">
              <li><strong>Agility Equipment:</strong> A-frames, dog walks, teeter-totters, weave poles, tunnels, and jumps should be competition-grade and properly maintained.</li>
              <li><strong>Training Platforms:</strong> Elevated platforms and target mats help teach positioning and stay behaviors with clear visual boundaries.</li>
              <li><strong>Scent Work Supplies:</strong> Scent boxes, odor vessels, and search areas for nose work and tracking exercises.</li>
              <li><strong>Balance & Core Equipment:</strong> Balance discs, wobble boards, and fitbones for proprioception and core strengthening.</li>
              <li><strong>Clickers & Markers:</strong> Professional training tools for precise timing and positive reinforcement.</li>
            </ul>

            <h3 className="text-2xl mt-8 mb-4">4. Understanding Training Costs</h3>
            <p>
              Training costs vary significantly based on program type, duration, and instructor expertise. Here's a general breakdown:
            </p>
            <div className="not-prose bg-violet-50 border border-violet-100 rounded-xl p-6 my-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-bold text-slate-900 mb-2">Group Classes</h4>
                  <p className="text-2xl font-bold text-violet-600 mb-1">$150-$300</p>
                  <p className="text-sm text-slate-600">6-8 week course</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-bold text-slate-900 mb-2">Private Sessions</h4>
                  <p className="text-2xl font-bold text-violet-600 mb-1">$75-$150</p>
                  <p className="text-sm text-slate-600">Per hour session</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-bold text-slate-900 mb-2">Board & Train</h4>
                  <p className="text-2xl font-bold text-violet-600 mb-1">$1,500-$5,000</p>
                  <p className="text-sm text-slate-600">2-4 week program</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-bold text-slate-900 mb-2">Puppy Packages</h4>
                  <p className="text-2xl font-bold text-violet-600 mb-1">$200-$500</p>
                  <p className="text-sm text-slate-600">Complete socialization</p>
                </div>
              </div>
              <div className="mt-4 text-center space-y-2">
                <Link href="/blog/how-much-is-puppy-obedience-training" className="text-violet-600 hover:text-violet-800 font-medium">View detailed cost guide →</Link>
                <div className="pt-2">
                  <Link href="/?type=Agility+%26+Training+Parks" className="inline-flex items-center px-5 py-2.5 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors text-sm">
                    Find Training Facilities <i className="bi bi-arrow-right ml-2"></i>
                  </Link>
                </div>
              </div>
            </div>

            <h2 id="faqs" className="text-3xl mt-16 mb-8 scroll-mt-24">Frequently Asked Questions</h2>
            
            <div className="space-y-4 not-prose">
              <details className="group bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <summary className="font-bold text-slate-900 text-lg cursor-pointer list-none flex justify-between items-center [&::-webkit-details-marker]:hidden">
                  What age should I start training my puppy?
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">
                    <i className="bi bi-chevron-down"></i>
                  </span>
                </summary>
                <div className="mt-4 text-slate-600 leading-relaxed text-base">
                  <p>
                    Start as early as 8 weeks old! The critical socialization window is 8-16 weeks. <Link href="/blog/puppy-socialization-classes" className="text-violet-600 hover:text-violet-800">Puppy socialization classes</Link> can begin after the first round of vaccinations. Early training prevents behavioral issues before they start.
                  </p>
                </div>
              </details>

              <details className="group bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <summary className="font-bold text-slate-900 text-lg cursor-pointer list-none flex justify-between items-center [&::-webkit-details-marker]:hidden">
                  How long does it take to see results?
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">
                    <i className="bi bi-chevron-down"></i>
                  </span>
                </summary>
                <div className="mt-4 text-slate-600 leading-relaxed text-base">
                  <p>
                    Basic obedience typically shows results within 4-6 weeks of consistent practice. Complex behaviors like agility or behavior modification may take 3-6 months. Consistency at home is just as important as class attendance.
                  </p>
                </div>
              </details>

              <details className="group bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <summary className="font-bold text-slate-900 text-lg cursor-pointer list-none flex justify-between items-center [&::-webkit-details-marker]:hidden">
                  Do indoor training facilities require vaccines?
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">
                    <i className="bi bi-chevron-down"></i>
                  </span>
                </summary>
                <div className="mt-4 text-slate-600 leading-relaxed text-base">
                  <p>
                    Yes. Reputable facilities require proof of Rabies, DHLPP (Distemper/Parvo), and Bordetella. 
                    Puppies are generally allowed to attend socialization classes after their first round of core vaccines.
                  </p>
                </div>
              </details>

              <details className="group bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <summary className="font-bold text-slate-900 text-lg cursor-pointer list-none flex justify-between items-center [&::-webkit-details-marker]:hidden">
                  Is agility training only for high-energy dogs?
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">
                    <i className="bi bi-chevron-down"></i>
                  </span>
                </summary>
                <div className="mt-4 text-slate-600 leading-relaxed text-base">
                  <p>
                    Not at all. While high-energy working breeds excel at it, agility is a fantastic confidence-building exercise for shy dogs and a great bonding activity for any healthy breed.
                  </p>
                </div>
              </details>

              <details className="group bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <summary className="font-bold text-slate-900 text-lg cursor-pointer list-none flex justify-between items-center [&::-webkit-details-marker]:hidden">
                  What should I bring to my first training class?
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">
                    <i className="bi bi-chevron-down"></i>
                  </span>
                </summary>
                <div className="mt-4 text-slate-600 leading-relaxed text-base">
                  <p>
                    Bring your dog's vaccination records, a well-fitted collar or harness, a 6-foot leash (no retractables), high-value treats, and a positive attitude. Most facilities provide water bowls, but check ahead.
                  </p>
                </div>
              </details>

              <details className="group bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <summary className="font-bold text-slate-900 text-lg cursor-pointer list-none flex justify-between items-center [&::-webkit-details-marker]:hidden">
                  Can I observe a class before enrolling?
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">
                    <i className="bi bi-chevron-down"></i>
                  </span>
                </summary>
                <div className="mt-4 text-slate-600 leading-relaxed text-base">
                  <p>
                    Absolutely! Reputable facilities welcome prospective clients to observe classes. This lets you see the training methods, instructor style, and facility cleanliness firsthand before committing.
                  </p>
                </div>
              </details>
            </div>

            {/* Bottom Call to Action */}
            <div className="mt-16 bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-8 text-center not-prose">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to Start Training?</h2>
              <p className="text-slate-600 mb-8 max-w-2xl mx-auto text-lg">
                Use our comprehensive directory to find top-rated, climate-controlled indoor training facilities in your local area. Filter by amenities, read reviews, and book your first class today.
              </p>
              <Link 
                href="/?type=Agility+%26+Training+Parks" 
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-md transition-all hover:-translate-y-1"
              >
                Search for Training Facilities Near Me <i className="bi bi-arrow-right ml-2"></i>
              </Link>
            </div>

          </div>
        </article>
      </main>

      {/* Related Resources Section */}
      <div className="bg-white py-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-10">Continue Reading</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <Link href="/parks-with-bars" className="group bg-slate-50 border border-slate-100 p-8 rounded-2xl hover:border-violet-200 hover:shadow-md transition-all">
              <div className="flex items-center mb-4 text-violet-600">
                <i className="bi bi-cup-straw text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-violet-700 transition-colors">Relax While They Play</h3>
              <p className="text-slate-600 underline-offset-4 group-hover:underline">Explore our comprehensive guide on indoor dog parks with built-in bars and cafés.</p>
            </Link>
            <Link href="/list-your-park" className="group bg-slate-50 border border-slate-100 p-8 rounded-2xl hover:border-violet-200 hover:shadow-md transition-all">
              <div className="flex items-center mb-4 text-violet-600">
                <i className="bi bi-shop text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-violet-700 transition-colors">Are You a Facility Owner?</h3>
              <p className="text-slate-600 underline-offset-4 group-hover:underline">Submit your business details and get your indoor dog park listed in our national directory.</p>
            </Link>
          </div>

          {relatedBlogPosts.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Latest from the Blog</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedBlogPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group bg-white border border-slate-200 p-6 rounded-xl hover:shadow-lg transition-all flex flex-col h-full"
                  >
                    <h4 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-violet-600 transition-colors line-clamp-2">{post.title}</h4>
                    <p className="text-slate-500 text-sm line-clamp-3 mb-4 flex-1">{post.excerpt.replace(/<[^>]*>/g, '')}</p>
                    <span className="text-violet-600 text-sm font-semibold flex items-center mt-auto">
                      Read full article <i className="bi bi-arrow-right ml-1"></i>
                    </span>
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
