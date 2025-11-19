import { Metadata } from 'next';
import Link from 'next/link';
import PageLayout from '@/components/PageLayout';

const explorerSteps = [
  { title: 'Tell us what your dog loves', detail: 'Filter by city, amenities, indoor/outdoor, and vibe. Save favorites for later.' },
  { title: 'Compare trusted listings', detail: 'Every park includes verified photos, safety standards, pricing, and real visitor tips.' },
  { title: 'Plan the perfect visit', detail: 'See live busyness, weather context, and reminders for vaccination or reservation requirements.' },
  { title: 'Share feedback', detail: 'Drop a review or photo after visiting so the community stays up to date.' },
];

const ownerSteps = [
  { title: 'Submit your park', detail: 'Provide details about your space, staff, amenities, and availability.' },
  { title: 'Verification & onboarding', detail: 'Our team reviews safety practices, brand assets, and policies within 72 hours.' },
  { title: 'Launch listing & campaigns', detail: 'Appear in relevant search results, city guides, newsletters, and partner spotlights.' },
  { title: 'Measure & optimize', detail: 'Dashboard insights show inquiries, conversions, and reviews so you can keep improving.' },
];

const platformFeatures = [
  { icon: 'bi-map', title: 'Smart maps', detail: 'Auto-fit maps highlight parks nearby, with clusters by neighborhood and amenity tags.' },
  { icon: 'bi-layers', title: 'Curated guides', detail: 'Editorial teams publish seasonal roundups, breed-specific tips, and accessibility spotlights.' },
  { icon: 'bi-lightning-charge', title: 'Live signals', detail: 'Occupancy estimates, weather alerts, and maintenance notices keep visitors informed in real time.' },
  { icon: 'bi-chat-dots', title: 'Community intel', detail: 'Verified reviews, staff highlights, and trainer Q&A fuel confident decisions.' },
];

const trustStats = [
  { value: '360+', label: 'Verified California parks' },
  { value: '2M+', label: 'Searches powered each year' },
  { value: '48', label: 'Metros with curated guides' },
  { value: '4.9/5', label: 'Average community satisfaction' },
];

export const metadata: Metadata = {
  title: 'How IndoorDogPark Works',
  description: 'See how IndoorDogPark helps dog owners discover safe play spaces and enables park operators to reach new guests.',
};

export default function HowItWorksPage() {
  return (
    <PageLayout>
      <section className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-200">How it works</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">The trusted bridge between dog families and premium play spaces</h1>
          <p className="mt-4 text-lg text-slate-200">We combine vetted data, local expertise, and real-time updates so every visit feels confident and fun.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/" className="inline-flex items-center rounded-full bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-slate-50">
              Start exploring
            </Link>
            <Link href="/list-your-park" className="inline-flex items-center rounded-full border border-white/30 px-6 py-3 font-semibold text-white hover:border-white">
              Add your park
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">For dog owners</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">Plan with confidence</h2>
              <div className="mt-6 space-y-4">
                {explorerSteps.map((step, index) => (
                  <div key={step.title} className="rounded-2xl border border-slate-200 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Step {index + 1}</p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-900">{step.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{step.detail}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">For park owners</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">Reach the right guests</h2>
              <div className="mt-6 space-y-4">
                {ownerSteps.map((step, index) => (
                  <div key={step.title} className="rounded-2xl border border-slate-200 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Stage {index + 1}</p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-900">{step.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{step.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-700">Platform highlights</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">Everything you need in one dashboard</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {platformFeatures.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                  <i className={`bi ${feature.icon} text-xl`} aria-hidden />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{feature.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-700">Built on trust</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">Quality standards at every touchpoint</h2>
            </div>
            <p className="text-sm text-slate-500">We verify business information, insurance, and vaccination requirements before listings go live.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-4">
            {trustStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 text-center">
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                <p className="mt-2 text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-900/95 p-8 text-center text-white">
            <h3 className="text-2xl font-bold">Humans review every listing</h3>
            <p className="mt-3 text-slate-200">Our quality assurance checklist covers safety protocols, accessibility, and community impact. Listings stay fresh thanks to owner portals and community reporting tools.</p>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-16 text-white">
        <div className="mx-auto flex max-w-4xl flex-col gap-6 text-center">
          <h2 className="text-3xl font-bold">Let&rsquo;s plan your next play session</h2>
          <p className="text-lg text-slate-200">Browse trusted parks or list your space in minutes. We&rsquo;re here to support you at every step.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/" className="inline-flex items-center rounded-full bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-violet-50">
              Browse parks
            </Link>
            <Link href="/list-your-park" className="inline-flex items-center rounded-full border border-white/30 px-6 py-3 font-semibold text-white hover:border-white">
              Start a listing
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

