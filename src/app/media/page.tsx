import { Metadata } from 'next';
import Link from 'next/link';
import PageLayout from '@/components/PageLayout';

const mediaHighlights = [
  { icon: 'bi-graph-up', title: 'Statewide trend data', detail: 'Monthly reports on visitation, seasonality, and booking demand for every California metro.' },
  { icon: 'bi-camera-video', title: 'Broadcast-ready assets', detail: 'B-roll, testimonials, and map animations for indoor dog parks and community events.' },
  { icon: 'bi-megaphone', title: 'Expert commentary', detail: 'Access quotes from veterinarians, trainers, and our research team within 24 hours.' },
];

const assetKits = [
  {
    title: 'Brand & logo system',
    description: 'Vector wordmarks, icon lockups, and typography guidance for IndoorDogPark.',
    items: ['Primary + secondary logos', 'Monochrome marks', 'Clear-space rules'],
    actionLabel: 'Request files',
    actionHref: 'mailto:press@indoordogpark.org?subject=Brand%20assets%20request',
  },
  {
    title: 'Photography & video',
    description: 'High-resolution imagery showcasing modern indoor parks, member moments, and California locations.',
    items: ['4K video loops', 'Lifestyle photography', 'Facility interiors'],
    actionLabel: 'View gallery',
    actionHref: '/contact',
  },
  {
    title: 'Data & research',
    description: 'Downloadable charts, city scorecards, and insights from our proprietary marketplace data.',
    items: ['Quarterly trendbook', 'City comparison sheets', 'Safety standards report'],
    actionLabel: 'Get latest report',
    actionHref: '/contact',
  },
];

const pressContacts = [
  {
    title: 'Press inquiries',
    person: 'Nia Castillo',
    role: 'Head of Communications',
    email: 'press@indoordogpark.org',
    response: 'Replies within one business day',
  },
  {
    title: 'Speaking & events',
    person: 'Mateo Rios',
    role: 'Program Director',
    email: 'events@indoordogpark.org',
    response: 'Keynotes, panels, and media tours',
  },
  {
    title: 'Urgent story support',
    person: 'On-call team',
    role: '24/7 newsroom hotline',
    email: '415-555-8110',
    response: 'Call or text for same-day deadlines',
  },
];

const timeline = [
  { year: '2021', event: 'IndoorDogPark launches to map indoor play spaces during rainy seasons.' },
  { year: '2022', event: 'Expanded to 30 metros and introduced safety verification standards.' },
  { year: '2023', event: 'Opened partner labs with trainers, vets, and hospitality leaders.' },
  { year: '2024', event: 'Surpassed 2 million annual sessions and introduced live occupancy data.' },
  { year: '2025', event: 'Rolling out nationwide benchmarking study on urban recreation for dogs.' },
];

const storyAngles = [
  'The rise of climate-resilient recreation for pets',
  'How indoor parks fuel small-business growth in downtown cores',
  'San Francisco vs. Los Angeles: Different playstyles, same love for dogs',
  'Accessibility design for dogs with mobility needs',
  'Community impact of dog-friendly coworking concepts',
];

export const metadata: Metadata = {
  title: 'Media & Press Resources - IndoorDogPark',
  description: 'Press-ready facts, research, and imagery for journalists covering indoor dog parks, pet wellness, and urban recreation.',
};

export default function MediaPage() {
  return (
    <PageLayout>
      <section className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-200">Media hub</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">Everything you need to tell the next dog-forward story</h1>
          <p className="mt-4 text-lg text-slate-200">
            We collaborate with journalists, podcasters, and creators to spotlight the future of dog recreation, indoor facilities, and the communities that build them.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="mailto:press@indoordogpark.org" className="inline-flex items-center rounded-full bg-white px-6 py-3 font-semibold text-slate-900 shadow-lg shadow-slate-900/20 hover:bg-slate-50">
              Contact press team
            </Link>
            <Link href="/media" className="inline-flex items-center rounded-full border border-white/40 px-6 py-3 font-semibold text-white hover:border-white">
              Download fact sheet
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid gap-6 md:grid-cols-3">
            {mediaHighlights.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                  <i className={`bi ${item.icon} text-xl`} aria-hidden />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-slate-600">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">Press kits</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Grab the assets you need</h2>
            <p className="mt-3 text-slate-600">Every request includes credits, usage guidelines, and optional interview pairings.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {assetKits.map((kit) => (
              <div key={kit.title} className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6">
                <h3 className="text-xl font-semibold text-slate-900">{kit.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{kit.description}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {kit.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <i className="bi bi-check-circle-fill text-violet-500" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href={kit.actionHref} className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700">
                  {kit.actionLabel}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-6 md:grid-cols-3">
            {pressContacts.map((contact) => (
              <div key={contact.title} className="rounded-2xl border border-slate-200 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">{contact.title}</p>
                <h3 className="mt-3 text-2xl font-bold text-slate-900">{contact.person}</h3>
                <p className="text-sm text-slate-500">{contact.role}</p>
                <a href={`mailto:${contact.email}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-violet-700 hover:text-violet-500">
                  <i className="bi bi-envelope" aria-hidden />
                  {contact.email}
                </a>
                <p className="mt-2 text-sm text-slate-500">{contact.response}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-16 text-white">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-300">Story ideas</p>
              <h2 className="mt-3 text-3xl font-bold">Fresh angles we can help you explore</h2>
              <p className="mt-3 text-slate-200">We pair journalists with parks, trainers, and dog families that illustrate emerging trends.</p>
            </div>
            <ul className="space-y-4 text-sm text-slate-200">
              {storyAngles.map((angle) => (
                <li key={angle} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  {angle}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">Milestones</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">IndoorDogPark at a glance</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-5">
            {timeline.map((entry) => (
              <div key={entry.year} className="rounded-2xl border border-slate-200 p-4">
                <p className="text-sm font-semibold text-violet-600">{entry.year}</p>
                <p className="mt-2 text-sm text-slate-600">{entry.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-4xl space-y-6 rounded-3xl border border-slate-200 bg-white/80 px-6 py-10 text-center shadow-lg shadow-slate-900/10">
          <h2 className="text-3xl font-bold text-slate-900">Working on a deadline?</h2>
          <p className="text-lg text-slate-600">Send us the angle, outlet, and deadline&mdash;we&rsquo;ll reply with quotes, data, and visuals faster than a tail wag.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="mailto:press@indoordogpark.org?subject=Interview%20request" className="inline-flex items-center rounded-full bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-500">
              Request interview
            </Link>
            <Link href="/contact" className="inline-flex items-center rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:border-slate-400">
              Submit coverage link
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

