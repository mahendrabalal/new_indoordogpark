import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DogSpaceEstimator from '@/components/DogSpaceEstimator';

export const metadata: Metadata = {
  title: 'Dog Space Estimator: How Much Room Does A Dog Need?',
  description: 'Calculate exactly how much square footage of open space your dog needs to safely play fetch, sprint, or train indoors or outdoors.',
  keywords: [
    'dog space calculator',
    'how much space does a dog need',
    'apartment dogs',
    'dog park size',
    'indoor dog play space'
  ],
  alternates: {
    canonical: '/tools/dog-space-estimator',
  },
  openGraph: {
    title: 'The "Tire Out Your Dog" Space Estimator',
    description: 'Find out the minimum square footage your dog needs to reach full sprinting speed safely.',
    url: 'https://www.indoordogpark.org/tools/dog-space-estimator',
    type: 'website',
  },
};

export default function DogSpaceEstimatorPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header variant="light" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">
              <Link href="/tools" className="hover:text-white transition-colors">Free Tools</Link> / Space Estimator
            </p>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              The &quot;Tire Out Your Dog&quot; Space Estimator
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Living in an apartment or a house with a small yard? Find out exactly how much open square footage your dog needs to safely reach full sprinting speed.
            </p>
          </div>
        </section>

        {/* Tool Section */}
        <section className="py-16 px-4 -mt-10">
          <div className="max-w-5xl mx-auto">
            <DogSpaceEstimator />
            
            {/* SEO Article Area */}
            <article className="mt-16 prose prose-slate lg:prose-lg max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Does Space Matter for Dogs?</h2>
              
              <p>
                As urban living becomes more popular, more dogs are being raised in apartments, condos, and homes with minimal yard space. While dogs can absolutely thrive in small spaces with the right routine, <strong>high-intensity exercise requires significant physical area</strong>.
              </p>

              <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">The Physics of the "Zoomies"</h3>
              
              <p>
                When a dog gets the "zoomies" (FRAPs - Frenetic Random Activity Periods), they are releasing built-up energy in short, intense bursts of speed. 
              </p>
              
              <p>
                A medium-sized dog like a Labrador Retriever or Australian Shepherd can reach speeds of 20 to 30 miles per hour. At 30 mph, a dog is traveling <strong>44 feet per second</strong>. If they are in a 20-foot living room, they have less than half a second before they hit a wall. This is why sprinting in tight spaces frequently leads to sliding, crashing, and torn cruciate ligaments (CCL injuries).
              </p>

              <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">How to Tire Out a Dog Without a Yard</h3>
              
              <ul className="space-y-3">
                <li>
                  <strong>Sniffaris (Decompression Walks):</strong> Taking your dog to a novel area (like a wooded trail) on a long leash and letting them sniff freely tires out their brain faster than a fast-paced walk tires their legs.
                </li>
                <li>
                  <strong>Indoor Dog Parks:</strong> If the weather is bad or you lack a yard, <Link href="/parks" className="font-bold underline hover:text-slate-900 text-indigo-600">indoor dog parks</Link> are specifically designed to offer 3,000 to 20,000+ square feet of safe, climate-controlled sprinting space with shock-absorbing flooring.
                </li>
                <li>
                  <strong>Mental Training:</strong> 15 minutes of learning a complex new trick or finding hidden treats around the apartment can exhaust a dog as much as a mile of running.
                </li>
              </ul>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
