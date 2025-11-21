import { Metadata } from 'next';
import Link from 'next/link';
import PageLayout from '@/components/PageLayout';

const guideCollections = [
  {
    title: 'Indoor play essentials',
    description: 'Checklists, packing tips, and health reminders for climate-controlled parks across California.',
    tags: ['Weather-ready', 'Health & safety', 'First-time visitors'],
  },
  {
    title: 'City-by-city planners',
    description: 'Local guides covering neighborhoods, parking tips, and dog-friendly cafés nearby.',
    tags: ['Neighborhood walks', 'Transit tips', 'Weekend itineraries'],
  },
  {
    title: 'Training & enrichment',
    description: 'Behavior cues, enrichment games, and how to pair training goals with the right facility.',
    tags: ['Confidence building', 'Agility tracks', 'Puppy socials'],
  },
  {
    title: 'Inclusive & accessible parks',
    description: 'Resources for senior dogs, pups with mobility challenges, and sensory-sensitive friends.',
    tags: ['Mobility support', 'Quiet hours', 'Therapy partners'],
  },
];

const seasonalSpotlights = [
  { season: 'Rainy season survival', detail: 'Indoor agility circuits, paw-care routines, and backup plans when weather shifts.' },
  { season: 'Summer heat playbook', detail: 'Cooling stations, hydration tricks, and early-morning meetups to beat the sun.' },
  { season: 'Holiday travel kit', detail: 'Road trip stops, boarding alternatives, and etiquette for visiting new facilities.' },
];

const expertGuides = [
  { title: 'Trainer-approved socialization timeline', expert: 'Fiona Kim, CPDT-KA', summary: 'Week-by-week exposure ideas plus red flags to watch for.' },
  { title: 'Vet checklist before indoor play', expert: 'Dr. Marcus Leong, DVM', summary: 'Vaccines, parasite preventatives, and warm-up routines to avoid injuries.' },
  { title: 'Designing inclusive play sessions', expert: 'Carmen Ruiz, Behaviorist', summary: 'Managing mixed energy groups and creating decompression corners.' },
];

const resourceDownloads = [
  { title: 'Indoor visit checklist', format: 'PDF', description: 'Printable pack list covering vaccination proof, water routines, and enrichment toys.', href: '/contact' },
  { title: 'Event planning worksheet', format: 'Google Sheet', description: 'Budgeting, staffing, and sponsor tracking for dog birthday parties and fundraisers.', href: '/contact' },
  { title: 'Park launch readiness scorecard', format: 'Notion template', description: 'Amenity audits, staffing plans, and marketing countdown for new facilities.', href: '/list-your-park' },
];

export const metadata: Metadata = {
  title: 'Dog Park Guides & Playbooks | Indoor Dog Park Resources',
  description: 'Expert guides for indoor dog park visits, training tips, seasonal planning, and safety checklists. Curated resources for dog owners and park operators in California.',
  keywords: [
    'dog park guides',
    'indoor dog park tips',
    'dog training guides',
    'pet safety checklists',
    'dog park planning',
    'California dog parks',
    'dog socialization guides',
    'indoor pet activities'
  ],
  openGraph: {
    title: 'Dog Park Guides & Playbooks | Indoor Dog Park Resources',
    description: 'Expert guides for indoor dog park visits, training tips, and seasonal planning for California dog owners.',
    url: 'https://www.indoordogpark.org/guides',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function GuidesPage() {
  return (
    <PageLayout>
      <section className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-200">Guide library</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">Expert playbooks for every dog adventure</h1>
          <p className="mt-4 text-lg text-slate-200">From rainy-day plans to multi-dog outings, these guides package community wisdom and professional insight so you never guess what&rsquo;s next.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/blog" className="inline-flex items-center rounded-full bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-slate-50">
              Read the latest guides
            </Link>
            <Link href="/contact" className="inline-flex items-center rounded-full border border-white/30 px-6 py-3 font-semibold text-white hover:border-white">
              Suggest a topic
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">Collections</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Browse by interest</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {guideCollections.map((collection) => (
              <div key={collection.title} className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6">
                <h3 className="text-2xl font-semibold text-slate-900">{collection.title}</h3>
                <p className="mt-3 text-sm text-slate-600">{collection.description}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {collection.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-white px-3 py-1">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-700">Seasonal spotlights</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Stay ahead of the weather</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {seasonalSpotlights.map((spotlight) => (
                <div key={spotlight.season} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                  <h3 className="text-xl font-semibold text-slate-900">{spotlight.season}</h3>
                  <p className="mt-2 text-sm text-slate-600">{spotlight.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">Expert voices</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Advice from trainers, vets, and park directors</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {expertGuides.map((guide) => (
              <div key={guide.title} className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{guide.expert}</p>
                <h3 className="mt-3 text-xl font-semibold text-slate-900">{guide.title}</h3>
                <p className="mt-3 text-sm text-slate-600">{guide.summary}</p>
                <Link href="/blog" className="mt-4 inline-flex items-center text-sm font-semibold text-violet-700 hover:text-violet-500">
                  Read summary
                  <i className="bi bi-arrow-right-short text-xl" aria-hidden />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-16 text-white">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-200">Downloads</p>
            <h2 className="mt-3 text-3xl font-bold">Ready-to-use templates</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {resourceDownloads.map((resource) => (
              <div key={resource.title} className="rounded-3xl border border-white/10 bg-white/10 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-200">{resource.format}</p>
                <h3 className="mt-2 text-xl font-semibold">{resource.title}</h3>
                <p className="mt-2 text-sm text-slate-200">{resource.description}</p>
                <Link href={resource.href} className="mt-4 inline-flex items-center text-sm font-semibold text-white underline-offset-4 hover:underline">
                  Access resource
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto flex max-w-4xl flex-col gap-6 rounded-3xl border border-slate-200 bg-slate-50/80 px-6 py-10 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Want a guide for your city or park type?</h2>
          <p className="text-lg text-slate-600">We publish new playbooks every month. Tell us what would help your dog, family, or business plan better.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="inline-flex items-center rounded-full bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-violet-700">
              Submit a request
            </Link>
            <Link href="/blog" className="inline-flex items-center rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:border-slate-400">
              Explore more articles
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

