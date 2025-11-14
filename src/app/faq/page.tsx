import { Metadata } from 'next';
import Link from 'next/link';
import PageLayout from '@/components/PageLayout';
import FAQSection from '@/components/FAQSection';

const parkCount = 360;

const faqStats = [
  { value: '72 hrs', label: 'Average listing verification time' },
  { value: '1.8K+', label: 'Community reviews published' },
  { value: '98%', label: 'Owner satisfaction rating' },
];

export const metadata: Metadata = {
  title: 'IndoorDogPark FAQs',
  description: 'Answers to common questions about IndoorDogPark, listings, safety standards, and community guidelines.',
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

      <FAQSection cityName="California" parkCount={parkCount} />

      <section className="bg-slate-900 py-16 text-white">
        <div className="mx-auto flex max-w-4xl flex-col gap-6 text-center">
          <h2 className="text-3xl font-bold">Still looking for clarity?</h2>
          <p className="text-lg text-slate-200">Send us your question and we&rsquo;ll update this guide with the answer.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="inline-flex items-center rounded-full bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-violet-50">
              Contact support
            </Link>
            <Link href="/help" className="inline-flex items-center rounded-full border border-white/30 px-6 py-3 font-semibold text-white hover:border-white">
              Visit help center
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

