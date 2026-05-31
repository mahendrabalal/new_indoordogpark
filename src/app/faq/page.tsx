import { Metadata } from 'next';
import Link from 'next/link';
import PageLayout from '@/components/PageLayout';
import FAQSection from '@/components/FAQSection';

const parkCount = 500;


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
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-[#0f172a] pt-32 pb-40 text-white">
        {/* Subtle background image overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-[0.07] mix-blend-screen"></div>
        {/* Decorative Gradients */}
        <div className="absolute top-[-50%] left-[-10%] w-[60%] h-[200%] bg-[radial-gradient(circle,rgba(99,102,241,0.2)_0%,rgba(0,0,0,0)_60%)] pointer-events-none"></div>
        <div className="absolute bottom-[-50%] right-[-10%] w-[60%] h-[200%] bg-[radial-gradient(circle,rgba(255,87,34,0.15)_0%,rgba(0,0,0,0)_60%)] pointer-events-none"></div>
        
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <span className="inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-2 text-xs font-bold uppercase tracking-widest text-violet-300 backdrop-blur-md">
            Knowledge Base
          </span>
          <h1 className="mt-8 text-5xl font-extrabold leading-tight tracking-tight md:text-6xl lg:text-7xl">
            How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-orange-400">help you?</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
            Find clear, progressive answers about our directory, safety standards, community guidelines, and listing requirements.
          </p>
        </div>
      </section>



      {/* The FAQSection automatically handles progressive disclosure because we refactored it to use <details> and <summary> */}
      <FAQSection cityName="the United States" parkCount={parkCount} />

      {/* Support CTA */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-violet-100 text-4xl text-violet-600 mb-8 shadow-sm">
            <i className="bi bi-search"></i>
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Still looking for clarity?</h2>
          <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">
            Send us your question and our support team will get back to you directly, and we might even add it to this guide.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-violet-600 hover:shadow-xl">
              <i className="bi bi-envelope"></i> Contact support
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Options Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-xl shadow-slate-100 md:p-12">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-600 flex items-center gap-2">
              <i className="bi bi-headset"></i> Contact options
            </p>
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              <div className="group rounded-2xl border border-slate-100 bg-slate-50 p-6 transition-colors hover:bg-violet-50 hover:border-violet-100">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white text-xl text-slate-600 shadow-sm group-hover:text-violet-600">
                  <i className="bi bi-envelope-paper"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Email support</h3>
                <a href="mailto:support@indoordogpark.org" className="mt-3 block text-sm font-semibold text-violet-600 hover:text-violet-500">
                  support@indoordogpark.org
                </a>
                <p className="mt-2 text-sm text-slate-500">Replies typically within 24h</p>
              </div>
              <div className="group rounded-2xl border border-slate-100 bg-slate-50 p-6 transition-colors hover:bg-violet-50 hover:border-violet-100">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white text-xl text-slate-600 shadow-sm group-hover:text-violet-600">
                  <i className="bi bi-ui-radios"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Contact form</h3>
                <Link href="/contact" className="mt-3 block text-sm font-semibold text-violet-600 hover:text-violet-500">
                  Available 24/7
                </Link>
                <p className="mt-2 text-sm text-slate-500">Best for detailed inquiries</p>
              </div>
              <div className="group rounded-2xl border border-slate-100 bg-rose-50/50 p-6 transition-colors hover:bg-rose-50 hover:border-rose-100">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white text-xl text-rose-500 shadow-sm">
                  <i className="bi bi-shield-exclamation"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Urgent issues</h3>
                <a href="mailto:safety@indoordogpark.org" className="mt-3 block text-sm font-semibold text-rose-600 hover:text-rose-500">
                  safety@indoordogpark.org
                </a>
                <p className="mt-2 text-sm text-slate-500">Safety reports prioritized</p>
              </div>
            </div>
            <div className="mt-10 flex items-start gap-4 rounded-2xl border border-rose-200 bg-rose-50/50 p-6 text-sm text-slate-700">
              <i className="bi bi-info-circle-fill text-xl text-rose-500 mt-0.5"></i>
              <div>
                <p className="font-bold text-slate-900 text-base">Emergency situations</p>
                <p className="mt-2 text-slate-600 leading-relaxed">If there is an immediate safety concern at a park, contact the facility directly, notify local authorities if needed, and then email <span className="font-semibold text-slate-800">safety@indoordogpark.org</span> so our team can investigate.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* System Status Section */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="relative overflow-hidden rounded-3xl bg-[#0f172a] p-10 text-white shadow-2xl md:p-12">
            <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
               <i className="bi bi-hdd-network text-9xl"></i>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-300">System status</p>
              </div>
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Maps & search</p>
                  <h3 className="mt-3 text-xl font-bold text-green-400 flex items-center gap-2">
                    <i className="bi bi-check-circle-fill text-sm"></i> Operational
                  </h3>
                  <p className="mt-3 text-sm text-slate-300 leading-relaxed">No incidents reported.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Owner dashboard</p>
                  <h3 className="mt-3 text-xl font-bold text-green-400 flex items-center gap-2">
                    <i className="bi bi-check-circle-fill text-sm"></i> Operational
                  </h3>
                  <p className="mt-3 text-sm text-slate-300 leading-relaxed">Scheduled maintenance every Sunday 10–11 PM PT.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Payments & billing</p>
                  <h3 className="mt-3 text-xl font-bold text-green-400 flex items-center gap-2">
                    <i className="bi bi-check-circle-fill text-sm"></i> Operational
                  </h3>
                  <p className="mt-3 text-sm text-slate-300 leading-relaxed">Stripe-powered billing with redundant monitoring.</p>
                </div>
              </div>
              <p className="mt-8 text-sm text-slate-400 border-t border-white/10 pt-6">
                Subscribe to proactive updates by emailing <a className="text-white hover:text-violet-300 underline underline-offset-4 transition-colors" href="mailto:support@indoordogpark.org?subject=Status%20updates">support@indoordogpark.org</a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Resources Section */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Explore More Resources</h2>
            <p className="mt-4 text-lg text-slate-600">Everything you need to navigate our directory and find the perfect park.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Link href="/blog" className="group flex items-start gap-6 rounded-3xl border border-slate-200 bg-white p-8 transition-all hover:border-violet-300 hover:shadow-xl hover:shadow-violet-100">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-2xl text-violet-600 transition-transform group-hover:scale-110">
                <i className="bi bi-journal-text"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-violet-600 transition-colors">Blog & Guides</h3>
                <p className="mt-2 text-slate-600 leading-relaxed">Read helpful articles about dog parks, safety tips, and pet care advice from our experts.</p>
              </div>
            </Link>

            <Link href="/how-it-works" className="group flex items-start gap-6 rounded-3xl border border-slate-200 bg-white p-8 transition-all hover:border-orange-300 hover:shadow-xl hover:shadow-orange-100">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-2xl text-orange-600 transition-transform group-hover:scale-110">
                <i className="bi bi-compass"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">How It Works</h3>
                <p className="mt-2 text-slate-600 leading-relaxed">Learn how to use our directory effectively to discover and compare local indoor parks.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

