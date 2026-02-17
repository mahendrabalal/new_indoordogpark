import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import PageLayout from '@/components/PageLayout';

const partnerStats = [
  { label: 'States covered', value: '50' },
  { label: 'Cities in directory', value: '150+' },
  { label: 'Active park listings', value: '500+' },
  { label: 'Email response time', value: '24h' },
];

const partnerBenefits = [
  {
    icon: 'bi-broadcast-pin',
    title: 'Premium visibility',
    description: 'Top-of-list placement on relevant city and category pages, plus inclusion in curated discovery emails.',
  },
  {
    icon: 'bi-bar-chart-line',
    title: 'Performance intelligence',
    description: 'Weekly recaps covering views, saves, inquiries, and attribution so you always know what is working.',
  },
  {
    icon: 'bi-people',
    title: 'Concierge onboarding',
    description: 'We verify amenities, refresh photography, and publish new promotions in under 72 hours.',
  },
  {
    icon: 'bi-shield-check',
    title: 'Trust & compliance',
    description: 'Every partner listing carries our verified badge, vaccination requirement guidance, and safety checklist.',
  },
];

const partnerProcess = [
  { step: '01', title: 'Share your park story', detail: 'Tell us about your facility, floor plan, staff, and the type of community you are building.' },
  { step: '02', title: 'Audience alignment', detail: 'We map your listing to the right regions, audiences, and intent signals using our first-party data.' },
  { step: '03', title: 'Launch & optimize', detail: 'Our editors create guided copy, rich media, and CTAs while your dashboard tracks conversions.' },
  { step: '04', title: 'Grow together', detail: 'Unlock seasonal campaigns, co-branded events, and data-backed expansion planning.' },
];

const partnerTiers = [
  {
    name: 'Normal Listing',
    price: '$0 / mo',
    description: 'Free listing for all dog parks. Perfect for getting started.',
    perks: ['Basic listing on the platform', 'Appears in search results', 'Shows on map', 'Pending admin approval'],
  },
  {
    name: 'Premium Listing',
    price: '$9.99 / mo',
    description: 'Enhanced visibility and priority placement for your park.',
    perks: ['Everything in Normal plan', 'Featured section on homepage', 'Priority in search results', 'Premium badge on listing', 'Highlighted on map', 'Cancel anytime'],
  },
];

// Partner testimonials section removed - will add real partner quotes when available

export const metadata: Metadata = {
  title: 'IndoorDogPark Partners Program',
  description: 'Collaborate with IndoorDogPark to reach committed dog families, promote premium facilities, and access performance insights.',
  alternates: {
    canonical: '/partners',
  },
  openGraph: {
    title: 'IndoorDogPark Partners Program',
    description: 'Collaborate with IndoorDogPark to reach committed dog families, promote premium facilities, and access performance insights.',
    url: 'https://www.indoordogpark.org/partners',
    type: 'website',
  },
};

export default function PartnersPage() {
  return (
    <PageLayout>
      <section className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
            <div className="space-y-6 lg:w-1/2">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-200">Partners program</p>
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">Grow your park with the most trusted dog community</h1>
              <p className="text-lg text-slate-200">
                IndoorDogPark connects motivated pet parents with safe, well-run facilities. Tap into an audience that is actively searching, planning,
                and ready to visit today.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact" className="inline-flex items-center rounded-full bg-white px-6 py-3 font-semibold text-slate-900 shadow-lg shadow-slate-900/30 hover:bg-violet-50">
                  Apply to partner
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                {partnerStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                    <p className="text-xs uppercase tracking-widest text-violet-200">{stat.label}</p>
                    <p className="mt-2 text-2xl font-bold">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 lg:pl-8">
              <div className="relative h-[500px] w-full overflow-hidden rounded-2xl">
                <Image
                  src="/images/partners/dog-in-partner-page.jpg"
                  alt="Dog standing on green artificial turf in an indoor dog park facility"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">Why partner with us</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Purpose-built distribution for indoor parks, daycares, and trainers</h2>
            <p className="mt-4 text-lg text-slate-600">We combine editorial storytelling, conversion-optimized listings, and hands-on support to help you fill every play session.</p>
            <div className="mt-6 space-y-4 text-slate-700">
              <p>
                IndoorDogPark.org serves as the most comprehensive directory for indoor dog facilities, attracting thousands of pet owners each month who are actively searching for safe, climate-controlled spaces for their dogs. Unlike generic business directories, we focus exclusively on indoor dog parks, training facilities, and daycare centers, ensuring your business reaches an audience with genuine intent to visit.
              </p>
              <p>
                Our platform combines search engine optimization, user reviews, detailed amenities information, and local market insights to help dog owners discover facilities that match their specific needs. By partnering with us, you gain access to a dedicated audience of committed pet parents who value quality, safety, and exceptional service for their dogs.
              </p>
              <p>
                We understand that running an indoor dog facility requires significant investment in safety protocols, staff training, and facility maintenance. Our partnership program is designed to help you maximize your marketing efforts and connect with the right customers who appreciate the value of professional, well-maintained indoor dog spaces.
              </p>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {partnerBenefits.map((benefit) => (
              <div key={benefit.title} className="rounded-2xl border border-slate-200 p-6 shadow-sm shadow-slate-900/5">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                  <i className={`bi ${benefit.icon} text-xl`} aria-hidden />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">{benefit.title}</h3>
                <p className="mt-2 text-slate-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
            <div className="lg:w-1/3">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-700">Go live in days</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">White-glove onboarding</h2>
              <p className="mt-4 text-slate-600">No complicated dashboards to learn. We guide the entire process so your team can keep delighting dogs.</p>
              <div className="mt-6 space-y-3 text-slate-600">
                <p>
                  Our streamlined onboarding process is designed to get your facility listed quickly without overwhelming your team with complex setup requirements. We handle the technical aspects of listing creation, optimization, and publication, allowing you to focus on what you do best: providing exceptional experiences for dogs and their owners.
                </p>
                <p>
                  Once your listing goes live, you&apos;ll have access to a simple dashboard where you can view visitor statistics, update information, respond to inquiries, and manage your subscription. Our support team is available to answer questions and help you maximize the value of your partnership.
                </p>
              </div>
            </div>
            <div className="grid flex-1 gap-4 md:grid-cols-2">
              {partnerProcess.map((step) => (
                <div key={step.step} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">{step.step}</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{step.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">Programs</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">Choose a tier that matches your goals</h2>
            <p className="mt-4 max-w-3xl mx-auto text-slate-600">
              We offer flexible listing options to accommodate facilities at every stage of growth. Whether you&apos;re just getting started or looking to maximize your visibility, we have a plan that fits your needs and budget. All listings are reviewed for quality to ensure our directory maintains high standards.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            {partnerTiers.map((tier, index) => (
              <div key={tier.name} className={`flex flex-col rounded-3xl border-2 p-6 shadow-lg shadow-slate-900/5 ${index === 1
                ? 'border-violet-600 bg-gradient-to-br from-violet-50 to-purple-50'
                : 'border-slate-200 bg-slate-50/70'
                }`}>
                {index === 1 && (
                  <div className="mb-4">
                    <span className="inline-block bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      Recommended
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{tier.name}</p>
                  <p className={`mt-2 text-3xl font-bold ${index === 1 ? 'text-violet-600' : 'text-slate-900'}`}>{tier.price}</p>
                  <p className="mt-1 text-sm text-slate-600">{tier.description}</p>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-slate-700">
                  {tier.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2">
                      <i className={`bi bi-check-circle-fill ${index === 1 ? 'text-violet-600' : 'text-emerald-500'}`} aria-hidden />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={index === 0 ? "/list-your-park" : "/list-your-park?plan=premium"}
                  className={`mt-8 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold ${index === 1
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                >
                  {index === 0 ? 'Get Started Free' : 'Choose Premium'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">Frequently asked questions</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">Common questions about our partnership program</h2>
          </div>
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">What types of facilities qualify for partnership?</h3>
              <p className="text-slate-600">
                We work with indoor dog parks, climate-controlled play facilities, dog daycare centers, training facilities with indoor spaces, and dog-friendly establishments with dedicated play areas. Facilities must maintain appropriate safety standards, have clear vaccination requirements, and provide a professional, welcoming environment for dogs and their owners.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">How does the Normal listing differ from Premium?</h3>
              <p className="text-slate-600">
                Normal listings are free and include basic features like search visibility, map placement, and standard listing information. Premium listings at $9.99/month provide enhanced visibility through featured homepage placement, priority search ranking, premium badges, and highlighted map markers. Both options require admin approval to ensure quality standards.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">What information do I need to provide for listing?</h3>
              <p className="text-slate-600">
                You&apos;ll need to provide basic facility information including name, address, business type, description, contact details, operating hours, amenities, pricing information, and photos. We also ask about safety protocols, vaccination requirements, and any special features that make your facility unique. Our team reviews all submissions to ensure accuracy and completeness.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">How long does the approval process take?</h3>
              <p className="text-slate-600">
                Most listings are reviewed and approved within 24-48 hours. For Premium listings, once payment is confirmed through Stripe, your listing is typically upgraded within the same timeframe. We verify facility information, confirm contact details, and ensure listings meet our quality standards before going live.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Can I update my listing after it&apos;s published?</h3>
              <p className="text-slate-600">
                Yes, you can update your listing at any time through your dashboard. Changes to basic information, hours, amenities, photos, and descriptions can be made instantly. Significant changes like location updates may require re-approval. Premium listing subscribers also have access to priority support for updates and optimizations.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">What if I want to cancel my Premium listing?</h3>
              <p className="text-slate-600">
                Premium listings can be cancelled at any time through the Stripe Customer Portal, accessible from your dashboard. Your listing will remain active until the end of your current billing period, then revert to a Normal listing. You&apos;ll retain all your listing information and can upgrade again in the future if desired.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900/95 py-16 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-200">Building trust together</p>
          <p className="mt-8 text-lg text-slate-200">We partner with safety-first operators, training collectives, animal welfare groups, and tourism boards to elevate dog experiences across the state. Our commitment to quality ensures that every listing on our platform represents a facility dedicated to providing safe, enjoyable experiences for dogs and their families.</p>
          <p className="mt-4 text-slate-300">
            By maintaining high standards for all listings and providing detailed, accurate information, we help dog owners make informed decisions while supporting facilities that prioritize animal welfare, proper safety protocols, and exceptional customer service.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto flex max-w-4xl flex-col gap-8 rounded-3xl border border-violet-100 bg-gradient-to-r from-violet-50 to-rose-50 px-6 py-10 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Ready to co-create better dog adventures?</h2>
          <p className="text-lg text-slate-600">Tell us how you envision partnering and we&rsquo;ll craft a pilot that meets your growth targets.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="inline-flex items-center rounded-full bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-500">
              Introduce your team
            </Link>
            <Link href="/list-your-park" className="inline-flex items-center rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:border-slate-400">
              Self-serve listing
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

