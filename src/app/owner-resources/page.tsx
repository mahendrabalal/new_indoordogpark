import { Metadata } from 'next';
import Link from 'next/link';
import PageLayout from '@/components/PageLayout';

const resourceTracks = [
  {
    title: 'Launch playbook',
    description: 'Zoning research, insurance checklists, and vendor recommendations for brand-new facilities.',
    items: ['Market sizing worksheet', 'Floor plan inspiration', 'Permitting cheat sheet'],
  },
  {
    title: 'Operations toolkit',
    description: 'Day-to-day templates that cover staffing, scheduling, cleaning routines, and safety drills.',
    items: ['Shift handoff notes', 'Incident reporting workflows', 'Maintenance matrix'],
  },
  {
    title: 'Growth lab',
    description: 'Campaign templates, review activation guides, and retention playbooks for existing parks.',
    items: ['Membership nurture series', 'Referral promos', 'Seasonal event calendar'],
  },
];

const templateLibrary = [
  { title: 'Emergency response plan', format: 'Google Doc', detail: 'Step-by-step protocol for injuries, severe weather, or facility issues.', link: '/contact' },
  { title: 'Vaccination & waiver tracker', format: 'Spreadsheet', detail: 'Auto-calculates expiration reminders and sends follow-up emails.', link: '/contact' },
  { title: 'Partnership outreach kit', format: 'Notion template', detail: 'Pitch scripts, sponsorship tiers, and co-marketing briefs.', link: '/partners' },
  { title: 'Staff onboarding checklist', format: 'PDF', detail: 'Role expectations, training videos, and customer experience standards.', link: '/contact' },
];

const supportChannels = [
  { icon: 'bi-chat-dots', title: 'Office hours', detail: 'Live 1:1 coaching every Tuesday & Thursday covering growth, pricing, and policies.' },
  { icon: 'bi-collection-play', title: 'Resource vault', detail: 'Video walkthroughs of the listing dashboard, review tools, and campaign manager.' },
  { icon: 'bi-people', title: 'Owner forum', detail: 'Invite-only Slack for sharing wins, staffing tips, and vendor recommendations.' },
  { icon: 'bi-lightbulb', title: 'Program experiments', detail: 'Pilot new features such as live waitlists, birthday bundles, and multi-park passes.' },
];

export const metadata: Metadata = {
  title: 'Owner Resources | Indoor Dog Park Business Guides',
  description: 'Business guides, templates, and coaching resources for indoor dog park operators and dog-friendly business owners in California.',
  keywords: [
    'indoor dog park business',
    'dog park operations',
    'pet business resources',
    'dog facility management',
    'pet business startup',
    'dog park templates',
    'California pet business',
    'dog daycare resources'
  ],
  openGraph: {
    title: 'Owner Resources | Indoor Dog Park Business Guides',
    description: 'Business guides and resources for indoor dog park operators and pet business owners.',
    url: 'https://www.indoordogpark.org/owner-resources',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function OwnerResourcesPage() {
  return (
    <PageLayout>
      <section className="bg-gradient-to-br from-slate-900 to-violet-900 py-20 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-200">Owner resources</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">Run a thriving indoor dog park with confidence</h1>
          <p className="mt-4 text-lg text-slate-200">We package the tools, coaching, and benchmarks that California operators use to launch, scale, and delight their communities.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/list-your-park" className="inline-flex items-center rounded-full bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-slate-50">
              List your park
            </Link>
            <Link href="/contact" className="inline-flex items-center rounded-full border border-white/30 px-6 py-3 font-semibold text-white hover:border-white">
              Book a coaching call
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">Resource tracks</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Choose the stage you&rsquo;re in</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {resourceTracks.map((track) => (
              <div key={track.title} className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6">
                <h3 className="text-2xl font-semibold text-slate-900">{track.title}</h3>
                <p className="mt-3 text-sm text-slate-600">{track.description}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {track.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <i className="bi bi-check-circle-fill text-violet-500" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-700">Template library</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">Ready-to-use docs</h2>
            </div>
            <p className="text-sm text-slate-500">Need something custom? Email us and we&rsquo;ll co-create a new resource.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {templateLibrary.map((template) => (
              <div key={template.title} className="rounded-3xl border border-slate-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{template.format}</p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-900">{template.title}</h3>
                  </div>
                  <i className="bi bi-download text-2xl text-slate-400" aria-hidden />
                </div>
                <p className="mt-3 text-sm text-slate-600">{template.detail}</p>
                <Link href={template.link} className="mt-4 inline-flex items-center text-sm font-semibold text-violet-700 hover:text-violet-500">
                  Access file
                  <i className="bi bi-arrow-right-short text-xl" aria-hidden />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-violet-50 to-rose-50 p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-700">Support system</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">You don&rsquo;t have to build alone</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {supportChannels.map((channel) => (
                <div key={channel.title} className="rounded-2xl border border-white/70 bg-white/80 p-5">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-violet-600/10 text-violet-700">
                    <i className={`bi ${channel.icon}`} aria-hidden />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{channel.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{channel.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-16 text-white">
        <div className="mx-auto flex max-w-4xl flex-col gap-6 text-center">
          <h2 className="text-3xl font-bold">Need a hands-on playbook?</h2>
          <p className="text-lg text-slate-200">Our owner success team will review your goals and send a personalized roadmap within a week.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="inline-flex items-center rounded-full bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-violet-50">
              Request a strategy session
            </Link>
            <Link href="/partners" className="inline-flex items-center rounded-full border border-white/30 px-6 py-3 font-semibold text-white hover:border-white">
              Explore partnerships
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

