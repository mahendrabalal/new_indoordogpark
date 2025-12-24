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
  { 
    title: 'Emergency response plan', 
    format: 'PDF', 
    detail: 'Step-by-step protocol for injuries, severe weather, or facility issues. Download the PDF template or view online.', 
    link: '/resources/emergency-response-plan.pdf', 
    secondaryLink: '/resources/emergency-response-plan.html', 
    secondaryLabel: 'View Online' 
  },
  { 
    title: 'Vaccination & waiver tracker', 
    format: 'CSV/Excel', 
    detail: 'Auto-calculates expiration reminders and sends follow-up emails. Includes formulas and email automation guide.', 
    link: '/resources/vaccination-waiver-tracker.html',
    secondaryLink: null,
    secondaryLabel: null
  },
  { 
    title: 'Partnership outreach kit', 
    format: 'PDF/Template', 
    detail: 'Pitch scripts, sponsorship tiers, and co-marketing briefs. Ready-to-use email templates for partnerships.', 
    link: '/resources/partnership-outreach-kit.html',
    secondaryLink: null,
    secondaryLabel: null
  },
  { 
    title: 'Staff onboarding checklist', 
    format: 'PDF/Checklist', 
    detail: 'Role expectations, training videos, and customer experience standards. Complete onboarding checklist for new hires.', 
    link: '/resources/staff-onboarding-checklist.html',
    secondaryLink: null,
    secondaryLabel: null
  },
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
  alternates: {
    canonical: '/owner-resources',
  },
  openGraph: {
    title: 'Owner Resources | Indoor Dog Park Business Guides',
    description: 'Business guides and resources for indoor dog park operators and pet business owners.',
    url: 'https://www.indoordogpark.org/owner-resources',
    type: 'website',
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
            <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
              Whether you&rsquo;re planning your first indoor dog park, optimizing daily operations, or scaling to multiple locations, 
              we&rsquo;ve curated resources based on real-world experience from successful California operators.
            </p>
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
          <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Why These Resources Matter</h3>
            <p className="text-slate-600 mb-4">
              Starting and running an indoor dog park requires navigating complex regulations, managing staff, maintaining safety standards, 
              and building a loyal customer base. Our resources are compiled from interviews with successful park operators, industry best practices, 
              and lessons learned from common pitfalls.
            </p>
            <p className="text-slate-600">
              Each resource track is designed to address specific challenges at different stages of your business journey, helping you avoid costly 
              mistakes and accelerate your path to profitability.
            </p>
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
          <p className="mb-8 text-slate-600 max-w-3xl">
            Save hours of research and formatting with our professionally designed templates. Each document has been tested by real park operators 
            and includes best practices for compliance, safety, and operational efficiency. All templates are customizable to fit your specific needs 
            and local regulations.
          </p>
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
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link 
                    href={template.link} 
                    className="inline-flex items-center text-sm font-semibold text-violet-700 hover:text-violet-500"
                    {...(template.link.endsWith('.pdf') ? { download: true } : {})}
                  >
                    <i className="bi bi-download mr-1" aria-hidden></i>
                    Download PDF
                  </Link>
                  {template.secondaryLink && (
                    <Link 
                      href={template.secondaryLink} 
                      className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-slate-900"
                    >
                      {template.secondaryLabel || 'View Online'}
                      <i className="bi bi-arrow-right-short text-xl ml-1" aria-hidden />
                    </Link>
                  )}
                </div>
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
            <p className="mt-4 text-slate-600 max-w-2xl">
              Building a successful indoor dog park is challenging, but you don&rsquo;t have to figure it out alone. Our community of park operators 
              shares knowledge, troubleshoots problems together, and celebrates wins. Access expert guidance, proven strategies, and a network of 
              peers who understand the unique challenges of running a pet facility.
            </p>
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

