import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SITE_URL } from '@/lib/metadata';
import { getAllParksForStateAggregation } from '@/lib/state-page-data';
import { getAllStates } from '@/lib/stateData';

export const revalidate = 60 * 60; // hourly

export const metadata: Metadata = {
  title: 'Browse Dog Parks by State | Indoor Dog Park',
  description: 'Explore dog park and dog-friendly listings by state. Start with the best-covered states and drill down into city directories.',
  alternates: {
    canonical: `${SITE_URL}/states`,
  },
};

export default async function StatesIndexPage() {
  const parks = await getAllParksForStateAggregation();
  const states = getAllStates(parks);

  // Keep this page lightweight: link to state hubs, but emphasize indexable ones.
  const indexable = states.filter((s) => s.totalCities >= 5 && s.totalParks >= 5);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-20 pb-16">
        <section className="max-w-6xl mx-auto px-4">
          <div className="mb-10">
            <div className="text-xs uppercase tracking-[0.2em] font-bold text-orange-600 mb-3">Browse</div>
            <h1 className="text-3xl md:text-5xl font-semibold text-slate-800 mb-4">Browse dog parks by state</h1>
            <p className="text-slate-600 max-w-2xl leading-relaxed">
              Start with states that have the strongest verified coverage, then drill down into city directories.
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <div className="font-semibold text-slate-900">Want your city covered faster?</div>
              <div className="text-slate-600">Submit a park and we’ll review it for inclusion in the directory.</div>
            </div>
            <Link
              href="/list-your-park"
              className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 font-semibold text-white bg-orange-600 hover:bg-orange-700 transition"
            >
              <i className="bi bi-plus-circle"></i>
              List your park
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {indexable.map((state) => (
              <Link
                key={state.slug}
                href={`/states/${state.slug}`}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-orange-200 transition"
              >
                <div className="text-xs uppercase tracking-[0.2em] text-orange-600 font-bold">State hub</div>
                <div className="text-xl font-semibold text-slate-900 mt-2">{state.name}</div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
                  <div>
                    <div className="text-slate-900 font-semibold">{state.totalParks}</div>
                    <div>Listings</div>
                  </div>
                  <div>
                    <div className="text-slate-900 font-semibold">{state.totalCities}</div>
                    <div>Cities</div>
                  </div>
                </div>
                <div className="mt-4 text-orange-600 font-semibold">Explore →</div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
















