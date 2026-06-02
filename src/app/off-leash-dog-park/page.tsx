import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SeoContentSection from '@/components/SeoContentSection';
import { generateBreadcrumbSchema, generateFAQSchema } from '@/lib/metadata';

/**
 * SEO metadata for the Off‑Leash Dog Parks pillar page.
 */
export const metadata: Metadata = {
  title: 'Off‑Leash Dog Parks – The Ultimate Guide & Resources',
  description: 'Discover everything you need to know about off‑leash dog parks: health benefits, safety tips, how to choose the right park, and the latest U.S. statistics.',
  keywords: [
    'off‑leash dog park',
    'off leash dog area',
    'fenced dog park',
    'dog park safety',
    'dog park etiquette',
    'dog park health benefits',
    'indoor dog park',
    'dog park guide',
  ],
  alternates: { canonical: '/off-leash-dog-park' },
  openGraph: {
    title: 'Off‑Leash Dog Parks – The Ultimate Guide',
    description: 'A comprehensive guide to off‑leash dog parks, covering health, safety, selection criteria, and U.S. market data.',
    url: 'https://www.indoordogpark.org/off-leash-dog-park',
    type: 'website',
    images: [{
      url: '/images/hero/off-leash-hero.webp',
      width: 1200,
      height: 630,
      alt: 'Happy dogs playing off‑leash in a fenced indoor park',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Off‑Leash Dog Parks – The Ultimate Guide',
    description: 'Everything you need to know about off‑leash dog parks.',
    images: ['/images/hero/off-leash-hero.webp'],
    site: '@indoordogpark',
    creator: '@indoordogpark',
  },
};

/**
 * Pillar content – a long‑form, SEO‑rich article.
 */
export default function OffLeashPillarPage() {
  // Structured‑data generation
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Off‑Leash Dog Parks – The Ultimate Guide',
    description: 'All you need to know about off‑leash dog parks, from health benefits and safety guidelines to how to evaluate a facility and the latest U.S. statistics.',
    image: '/images/hero/off-leash-hero.webp',
    author: {
      '@type': 'Organization',
      name: 'Indoor Dog Park',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indoordogpark.org',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Indoor Dog Park',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indoordogpark.org'}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indoordogpark.org'}/off-leash-dog-park`,
    },
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Off‑Leash Dog Parks' },
  ]);

  const faqSchema = generateFAQSchema([
    {
      question: 'What vaccinations does my dog need before visiting an off‑leash park?',
      answer: 'Most parks require a current rabies vaccine and often DHPP (distemper, hepatitis, parainfluenza, parvovirus) plus bordetella. Check the park’s posted rules; many list the exact requirements on their website or at the entrance.',
    },
    {
      question: 'How do I know if my dog is ready for an off‑leash park?',
      answer: 'Your dog should reliably respond to a basic recall, be comfortable around other dogs, and show relaxed body language in new environments. If your dog still resource‑guards or reacts fearfully, start with short, off‑peak visits and work on socialization before long sessions.',
    },
    {
      question: 'Are off‑leash parks safe for small dogs?',
      answer: 'Look for facilities that provide a separate small‑dog area. When that isn’t available, visit during quieter hours and stay close to your dog. Double‑gated entry and strict fencing are critical safety features for any size.',
    },
    {
      question: 'What should I bring to an off‑leash park?',
      answer: 'Bring waste bags, fresh water (and a portable bowl), a leash for entry/exit, and proof of vaccination if required. Avoid toys or treats that can trigger resource guarding unless the park explicitly allows them.',
    },
    {
      question: 'How many off‑leash dog parks are there in the United States?',
      answer: 'The Trust for Public Land reports over 3,800 off‑leash dog parks across the 100 largest U.S. cities—a 40 % increase since 2009. Nationwide, the number is well into the tens of thousands when municipal and private facilities are combined.',
    },
  ]);

  return (
    <>
      {/* Structured data scripts */}
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <Header variant="light" />

      {/* Hero */}
      <section className="about-modern-hero">
        <div className="about-modern-container">
          <div className="about-modern-hero-content">
            <h1 className="about-modern-title">
              OFF‑LEASH DOG PARKS <span className="text-accent-green">THE ULTIMATE GUIDE</span>
            </h1>
            <p className="about-modern-mission">
              Off‑leash parks give dogs the freedom to run, socialize, and burn energy safely. In this guide we dive deep into the health benefits, safety standards, choosing the right facility, and the latest market data.
            </p>
          </div>
        </div>
      </section>

      {/* Core Sections – built with the modern‑about layout */}
      <section className="about-modern-section">
        <div className="about-modern-container">
          <div className="about-modern-content-layout">
            <div className="about-modern-text-content">
              <h2 className="about-modern-section-title">Why Off‑Leash Play Matters for Your Dog’s Health</h2>
              <p className="about-modern-text">
                Dogs are social mammals that thrive on physical exercise and mental stimulation. A 2019 study in <em>Applied Animal Behaviour Science</em> showed that regular off‑leash play lowered cortisol levels and reduced problem behaviours at home. The American Kennel Club recommends 30 min – 2 h of daily activity, and off‑leash parks let dogs self‑regulate their pace – sprinting, resting, sniff‑exploring – in ways a leash walk cannot.
              </p>
              <ul className="about-modern-text" style={{ listStyleType: 'disc', marginLeft: '1.5rem' }}>
                <li>Cardiovascular fitness and weight management.</li>
                <li>Improved joint health on softer, non‑concrete surfaces.</li>
                <li>Socialisation that reduces fear and aggression.</li>
                <li>Cognitive enrichment from new scents and peer interaction.</li>
                <li>Confidence‑building recall practice in a real‑world setting.</li>
              </ul>
            </div>
            <div className="about-modern-image-content">
              <figure className="about-modern-image-wrapper">
                <img src="/images/off-leash/health-benefits.webp" alt="Dogs playing off‑leash in a climate‑controlled park" className="about-modern-team-image" />
                <figcaption className="about-modern-image-caption"><p>Happy dogs exercising freely in a fenced indoor park.</p></figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      <section className="about-modern-section-alt">
        <div className="about-modern-container">
          <h2 className="about-modern-section-title-center">How to Choose the Right Off‑Leash Park</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="bi bi-shield-check text-xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Secure Fencing</h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4 text-sm">A safe off-leash park starts with proper physical boundaries.</p>
              <ul className="text-sm text-gray-600 space-y-2.5">
                <li className="flex items-start"><i className="bi bi-check2 text-emerald-500 mr-2 mt-0.5 text-base"></i> <span><strong>Height:</strong> Minimum 4 ft for small dogs, 6 ft for large breeds.</span></li>
                <li className="flex items-start"><i className="bi bi-check2 text-emerald-500 mr-2 mt-0.5 text-base"></i> <span><strong>Entry:</strong> Double-gated transition zones to prevent accidental escapes.</span></li>
                <li className="flex items-start"><i className="bi bi-check2 text-emerald-500 mr-2 mt-0.5 text-base"></i> <span><strong>Condition:</strong> No gaps, exposed wires, or weak points at ground level.</span></li>
              </ul>
            </div>
            
            {/* Card 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="bi bi-aspect-ratio text-xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Separate Play Areas</h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4 text-sm">Dedicated zones based on size and temperament are crucial for injury prevention.</p>
              <ul className="text-sm text-gray-600 space-y-2.5">
                <li className="flex items-start"><i className="bi bi-check2 text-pink-500 mr-2 mt-0.5 text-base"></i> <span><strong>Small Dogs:</strong> Typically reserved for dogs under 25-30 lbs.</span></li>
                <li className="flex items-start"><i className="bi bi-check2 text-pink-500 mr-2 mt-0.5 text-base"></i> <span><strong>Prey Drive:</strong> Prevents large dogs from mistaking small dogs for prey.</span></li>
                <li className="flex items-start"><i className="bi bi-check2 text-pink-500 mr-2 mt-0.5 text-base"></i> <span><strong>Training:</strong> Some facilities offer a third quiet zone for shy dogs or training.</span></li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="bi bi-droplet-half text-xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Hydration &amp; Comfort</h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4 text-sm">Proper environmental controls keep dogs healthy during vigorous play.</p>
              <ul className="text-sm text-gray-600 space-y-2.5">
                <li className="flex items-start"><i className="bi bi-check2 text-blue-500 mr-2 mt-0.5 text-base"></i> <span><strong>Fresh Water:</strong> Accessible, clean water stations (avoid stagnant bowls).</span></li>
                <li className="flex items-start"><i className="bi bi-check2 text-blue-500 mr-2 mt-0.5 text-base"></i> <span><strong>Climate Control:</strong> Indoor parks provide A/C in summer and heat in winter.</span></li>
                <li className="flex items-start"><i className="bi bi-check2 text-blue-500 mr-2 mt-0.5 text-base"></i> <span><strong>Rest Areas:</strong> Shaded spots or cool mats for dogs to safely rest.</span></li>
              </ul>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="bi bi-clipboard2-pulse text-xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Health Policies</h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4 text-sm">Strict entry requirements protect the community from communicable diseases.</p>
              <ul className="text-sm text-gray-600 space-y-2.5">
                <li className="flex items-start"><i className="bi bi-check2 text-purple-500 mr-2 mt-0.5 text-base"></i> <span><strong>Vaccines:</strong> Must require current Rabies, DHPP, and Bordetella records.</span></li>
                <li className="flex items-start"><i className="bi bi-check2 text-purple-500 mr-2 mt-0.5 text-base"></i> <span><strong>Sanitation:</strong> Regular deep cleaning protocols using pet-safe disinfectants.</span></li>
                <li className="flex items-start"><i className="bi bi-check2 text-purple-500 mr-2 mt-0.5 text-base"></i> <span><strong>Staffing:</strong> Trained staff present to enforce rules and monitor behavior.</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="about-modern-section">
        <div className="about-modern-container">
          <h2 className="about-modern-section-title">Safety &amp; Etiquette Checklist</h2>
          <ul className="about-modern-text" style={{ listStyleType: 'disc', marginLeft: '1.5rem' }}>
            <li>Keep your dog on‑site until you leave – never walk away.</li>
            <li>Clean up waste immediately; many parks provide dispensers.</li>
            <li>Remove prong or retractable leashes before entering the off‑leash area.</li>
            <li>Supervise closely, especially during the first few visits.</li>
            <li>Respect other owners – no food, toys, or treats unless permitted.</li>
            <li>Know the park’s emergency contact information (posted at every gate).</li>
          </ul>
        </div>
      </section>

      <section className="about-modern-section-alt">
        <div className="about-modern-container">
          <h2 className="about-modern-section-title-center">Industry Statistics &amp; Trends</h2>
          <p className="about-modern-text">
            The Trust for Public Land’s 2023 <strong>City Park Facts</strong> report found over 3,800 off‑leash parks in the 100 largest U.S. cities — a 40 % growth since 2009. That translates to roughly one off‑leash park per 10,000 residents in major metros, reflecting rising demand for climate‑controlled canine recreation.
          </p>
          <div className="about-modern-values-grid">
            <div className="about-modern-value-card">
              <div className="value-icon-modern value-icon-green"><i className="bi bi-graph-up" /></div>
              <h3>3,800+</h3>
              <p>Off‑leash parks in the 100 largest U.S. cities.</p>
            </div>
            <div className="about-modern-value-card">
              <div className="value-icon-modern value-icon-pink"><i className="bi bi-people" /></div>
              <h3>40 % ↑</h3>
              <p>Growth since 2009.</p>
            </div>
            <div className="about-modern-value-card">
              <div className="value-icon-modern value-icon-green"><i className="bi bi-building" /></div>
              <h3>Nationwide</h3>
              <p>Private and municipal facilities combined.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Section – extensive E‑E‑A‑T article */}
      <SeoContentSection
        eyebrow="Expert Guidance"
        title="Off‑Leash Dog Parks: A Complete Resource for Health, Safety, and Selection"
        intro={[
          "Off‑leash parks have become essential for modern dog owners, offering a weather‑proof, supervised environment where dogs can exercise, socialize, and thrive.",
          "This guide compiles scientific research, industry data, and practical tips to help you choose the best facility for your canine companion.",
        ]}
        sections={[
          {
            heading: "Health Benefits Backed by Science",
            paragraphs: [
              "A 2019 study in Applied Animal Behaviour Science demonstrated that dogs with regular off‑leash play exhibited significantly lower cortisol (stress hormone) levels compared to dogs limited to leash walks. The study also reported reductions in destructive behaviours at home.",
            ],
            listItems: [
              "Improved cardiovascular health and weight management.",
              "Reduced joint strain on softer indoor surfaces.",
              "Enhanced mental stimulation from novel scents and social interactions.",
              "Better recall training in an uncontrolled environment.",
            ],
          },
          {
            heading: "Evaluating Facility Safety",
            paragraphs: [
              "Safety starts at the gate. Look for double‑gated entry, secure fencing, and clear vaccination requirements. Staff supervision, regular cleaning, and visible emergency contacts are additional indicators of a high‑quality park.",
            ],
          },
        ]}
        faqs={[
          {
            question: "What vaccinations does my dog need before visiting an off‑leash park?",
            answer: "Most parks require up‑to‑date rabies vaccination and often DHPP + bordetella. Always verify the specific requirements on the park’s website or posted signage.",
          },
          {
            question: "Are off‑leash parks safe for small dogs?",
            answer: "Facilities that provide a separate small‑dog area are ideal. If not available, choose off‑peak hours, stay close, and monitor interactions carefully.",
          },
          {
            question: "How many off‑leash parks exist in the United States?",
            answer: "The Trust for Public Land reports over 3,800 off‑leash parks in the 100 largest U.S. cities, representing a 40 % increase since 2009. Nationwide totals are substantially higher when private facilities are included.",
          },
        ]}
        links={[
          { href: '/training-facilities', title: 'Training Facilities', description: 'Build recall and social skills before visiting an off‑leash park.' },
          { href: '/parks-with-bars', title: 'Parks with Bars', description: 'Enjoy a drink while your dog plays in a social setting.' },
          { href: '/list-your-park', title: 'List Your Park', description: 'Own a facility? Submit it to our directory for free exposure.' },
        ]}
        className="border-t border-gray-100"
      />

      <Footer />
    </>
  );
}
