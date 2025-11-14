import { Metadata } from 'next';
import Link from 'next/link';
import PageLayout from '@/components/PageLayout';

const helpTopics = [
  { title: 'Account & profiles', description: 'Update saved parks, notification preferences, and membership details.', icon: 'bi-person-check' },
  { title: 'Listing support', description: 'Need edits or have a new photo set? Submit updates in minutes.', icon: 'bi-building' },
  { title: 'Billing & invoices', description: 'Download receipts, update payment methods, or request tax forms.', icon: 'bi-receipt' },
  { title: 'Trust & safety', description: 'Report an issue, request moderation, or review our verification standards.', icon: 'bi-shield-lock' },
  { title: 'Technical help', description: 'App issues, map errors, or trouble submitting reviews? We&rsquo;re on it.', icon: 'bi-bug' },
  { title: 'Community programs', description: 'Join meetups, volunteer drives, or education workshops across California.', icon: 'bi-people' },
];

const contactOptions = [
  { channel: 'Email support', detail: 'support@indoordogpark.org', response: 'Replies within 24h', href: 'mailto:support@indoordogpark.org' },
  { channel: 'Live chat', detail: 'Weekdays 9 AM – 6 PM PT', response: 'Look for the bubble in the bottom right corner', href: '/contact' },
  { channel: 'SMS hotline', detail: '(415) 555-7410', response: 'Urgent listing or safety issues', href: 'tel:+14155557410' },
];

const statusNotices = [
  { system: 'Maps & search', state: 'Operational', detail: 'No incidents reported.' },
  { system: 'Owner dashboard', state: 'Operational', detail: 'Scheduled maintenance every Sunday 10–11 PM PT.' },
  { system: 'Payments & billing', state: 'Operational', detail: 'Stripe-powered billing with redundant monitoring.' },
];

export const metadata: Metadata = {
  title: 'Help Center - IndoorDogPark',
  description: 'Contact IndoorDogPark support, browse help topics, and track system status.',
};

export default function HelpPage() {
  return (
    <PageLayout>
      <section className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-200">Support</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">Help center</h1>
          <p className="mt-4 text-lg text-slate-200">Find quick answers, send us a message, or check real-time platform status.</p>
          <form className="mt-8 flex flex-col gap-3 rounded-2xl border border-white/30 bg-white/10 p-4 backdrop-blur md:flex-row">
            <input type="search" name="q" placeholder="Search articles or keywords" className="flex-1 rounded-xl border border-transparent bg-white/80 px-4 py-3 text-slate-900 placeholder:text-slate-500 focus:outline-none" />
            <button type="submit" className="rounded-xl bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-violet-50">Search</button>
          </form>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-6 md:grid-cols-3">
            {helpTopics.map((topic) => (
              <div key={topic.title} className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                  <i className={`bi ${topic.icon} text-xl`} aria-hidden />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">{topic.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{topic.description}</p>
                <Link href="/contact" className="mt-4 inline-flex items-center text-sm font-semibold text-violet-700 hover:text-violet-500">
                  View guides
                  <i className="bi bi-arrow-right-short text-xl" aria-hidden />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-700">Contact options</p>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {contactOptions.map((option) => (
                <div key={option.channel} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                  <h3 className="text-lg font-semibold text-slate-900">{option.channel}</h3>
                  <a href={option.href} className="mt-2 inline-flex items-center text-sm font-semibold text-violet-700 hover:text-violet-500">
                    {option.detail}
                  </a>
                  <p className="mt-1 text-sm text-slate-500">{option.response}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-6 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">Emergency situations</p>
              <p className="mt-2">If there is an immediate safety concern at a park, contact the facility directly, notify local authorities if needed, and then email safety@indoordogpark.org so our team can investigate.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="rounded-3xl border border-slate-200 bg-slate-900/95 p-8 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-200">System status</p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {statusNotices.map((notice) => (
                <div key={notice.system} className="rounded-2xl border border-white/20 bg-white/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-200">{notice.system}</p>
                  <h3 className="mt-2 text-lg font-semibold">{notice.state}</h3>
                  <p className="mt-2 text-sm text-slate-200">{notice.detail}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-slate-200">Subscribe to proactive updates by emailing <a className="underline" href="mailto:support@indoordogpark.org?subject=Status%20updates">support@indoordogpark.org</a>.</p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

