import { Metadata } from 'next';
import Link from 'next/link';
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
    name: 'Featured spotlight',
    price: '$349 / mo',
    description: 'Ideal for established parks looking to dominate a metro area.',
    perks: ['Priority placement across search & maps', 'Quarterly creative refresh', 'Lead routing via SMS + email', 'Dedicated success manager'],
  },
  {
    name: 'Community partner',
    price: '$189 / mo',
    description: 'Built for boutique facilities, trainers, and indoor pop-ups.',
    perks: ['Verified listing & review boost', 'Inclusion in discovery campaigns', 'Access to owner resource portal', 'Monthly metrics digest'],
  },
  {
    name: 'Network collaborator',
    price: 'Custom',
    description: 'For franchises, real-estate groups, and tourism boards.',
    perks: ['Multi-location rollout support', 'Joint research & events', 'API + data sharing options', 'Co-branded marketing playbooks'],
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
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 lg:flex-row lg:items-center">
          <div className="space-y-6 lg:w-2/3">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-200">Partners program</p>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">Grow your park with California&rsquo;s most trusted dog community</h1>
            <p className="text-lg text-slate-200">
              IndoorDogPark connects motivated pet parents with safe, well-run facilities. Tap into an audience that is actively searching, planning,
              and ready to visit today.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="inline-flex items-center rounded-full bg-white px-6 py-3 font-semibold text-slate-900 shadow-lg shadow-slate-900/30 hover:bg-violet-50">
                Apply to partner
              </Link>
              <Link href="/media" className="inline-flex items-center rounded-full border border-white/40 px-6 py-3 font-semibold text-white hover:border-white">
                Download program deck
              </Link>
            </div>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-4">
            {partnerStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-widest text-violet-200">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">Why partner with us</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Purpose-built distribution for indoor parks, daycares, and trainers</h2>
            <p className="mt-4 text-lg text-slate-600">We combine editorial storytelling, conversion-optimized listings, and hands-on support to help you fill every play session.</p>
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
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {partnerTiers.map((tier) => (
              <div key={tier.name} className="flex flex-col rounded-3xl border border-slate-200 bg-slate-50/70 p-6 shadow-lg shadow-slate-900/5">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{tier.name}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{tier.price}</p>
                  <p className="mt-1 text-sm text-slate-600">{tier.description}</p>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-slate-700">
                  {tier.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2">
                      <i className="bi bi-check-circle-fill text-emerald-500" aria-hidden />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className="mt-8 inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700">
                  Schedule a walkthrough
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-900/95 py-16 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-200">Building trust together</p>
          <p className="mt-8 text-lg text-slate-200">We partner with safety-first operators, training collectives, animal welfare groups, and tourism boards to elevate dog experiences across the state.</p>
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

