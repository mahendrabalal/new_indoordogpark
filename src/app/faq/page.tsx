import { Metadata } from 'next';
import Link from 'next/link';
import PageLayout from '@/components/PageLayout';
import FAQSection from '@/components/FAQSection';
import AdsterraBanner from '@/components/AdsterraBanner';

const parkCount = 500;

const faqStats = [
  { value: '72 hrs', label: 'Average listing verification time' },
  { value: '1.8K+', label: 'Community reviews published' },
  { value: '98%', label: 'Owner satisfaction rating' },
];

export const metadata: Metadata = {
  title: 'IndoorDogPark FAQs',
  description: 'Answers to common questions about IndoorDogPark, listings, safety standards, and community guidelines.',
  alternates: {
    canonical: '/faq',
  },
  openGraph: {
    title: 'IndoorDogPark FAQs',
    description: 'Get answers about listing requirements, safety standards, and how our directory works.',
    url: 'https://www.indoordogpark.org/faq',
    type: 'website',
    images: ['/images/hero/hero.webp'],
  },
};

export default function FAQPage() {
  return (
    <PageLayout>
      <section className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-200">FAQ</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">Answers for owners, park partners, and dog families</h1>
          <p className="mt-4 text-lg text-slate-200">We captured the most frequent questions about safety, pricing, reviews, and listing policies.</p>
        </div>
      </section>

      {/* Adsterra Banner Ad - After Hero */}
      <AdsterraBanner />

      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid gap-6 md:grid-cols-3">
            {faqStats.map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6 text-center">
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                <p className="mt-2 text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQSection cityName="the United States" parkCount={parkCount} />

      <section className="bg-slate-900 py-16 text-white">
        <div className="mx-auto flex max-w-4xl flex-col gap-6 text-center">
          <h2 className="text-3xl font-bold">Still looking for clarity?</h2>
          <p className="text-lg text-slate-200">Send us your question and we&rsquo;ll update this guide with the answer.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="inline-flex items-center rounded-full bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-violet-50">
              Contact support
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Options Section */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-700">Contact options</p>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                <h3 className="text-lg font-semibold text-slate-900">Email support</h3>
                <a href="mailto:support@indoordogpark.org" className="mt-2 inline-flex items-center text-sm font-semibold text-violet-700 hover:text-violet-500">
                  support@indoordogpark.org
                </a>
                <p className="mt-1 text-sm text-slate-500">Replies within 24h</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                <h3 className="text-lg font-semibold text-slate-900">Contact form</h3>
                <Link href="/contact" className="mt-2 inline-flex items-center text-sm font-semibold text-violet-700 hover:text-violet-500">
                  Available 24/7
                </Link>
                <p className="mt-1 text-sm text-slate-500">Best for detailed inquiries</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                <h3 className="text-lg font-semibold text-slate-900">Urgent issues</h3>
                <a href="mailto:safety@indoordogpark.org" className="mt-2 inline-flex items-center text-sm font-semibold text-violet-700 hover:text-violet-500">
                  safety@indoordogpark.org
                </a>
                <p className="mt-1 text-sm text-slate-500">Safety reports prioritized</p>
              </div>
            </div>
            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-6 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">Emergency situations</p>
              <p className="mt-2">If there is an immediate safety concern at a park, contact the facility directly, notify local authorities if needed, and then email safety@indoordogpark.org so our team can investigate.</p>
            </div>
          </div>
        </div>
      </section>

      {/* System Status Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="rounded-3xl border border-slate-200 bg-slate-900/95 p-8 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-200">System status</p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-200">Maps & search</p>
                <h3 className="mt-2 text-lg font-semibold">Operational</h3>
                <p className="mt-2 text-sm text-slate-200">No incidents reported.</p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-200">Owner dashboard</p>
                <h3 className="mt-2 text-lg font-semibold">Operational</h3>
                <p className="mt-2 text-sm text-slate-200">Scheduled maintenance every Sunday 10–11 PM PT.</p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-200">Payments & billing</p>
                <h3 className="mt-2 text-lg font-semibold">Operational</h3>
                <p className="mt-2 text-sm text-slate-200">Stripe-powered billing with redundant monitoring.</p>
              </div>
            </div>
            <p className="mt-6 text-sm text-slate-200">Subscribe to proactive updates by emailing <a className="underline" href="mailto:support@indoordogpark.org?subject=Status%20updates">support@indoordogpark.org</a>.</p>
          </div>
        </div>
      </section>

      {/* Related Resources Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Explore More Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/blog" className="bg-slate-50 p-6 rounded-lg hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Blog & Guides</h3>
              <p className="text-gray-600">Read helpful articles about dog parks and pet care</p>
            </Link>

            <Link href="/how-it-works" className="bg-slate-50 p-6 rounded-lg hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">How It Works</h3>
              <p className="text-gray-600">Learn how to use our directory effectively</p>
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

