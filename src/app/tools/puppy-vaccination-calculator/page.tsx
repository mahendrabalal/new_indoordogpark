import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PuppyVaccinationCalculator from '@/components/PuppyVaccinationCalculator';

export const metadata: Metadata = {
  title: { absolute: 'Puppy Vaccination & Park Readiness Calculator | Indoor Dog Park' },
  description: 'Use our free interactive Puppy Vaccination Calculator to find out exactly when it is safe to take your puppy to public dog parks.',
  keywords: [
    'puppy vaccination schedule',
    'when can a puppy go to the dog park',
    'puppy park readiness calculator',
    'parvo risk puppy dog park',
    'puppy shot timeline'
  ],
  alternates: {
    canonical: '/tools/puppy-vaccination-calculator',
  },
};

export default function PuppyVaccinationCalculatorPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header variant="light" />

      <main className="flex-1">
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Puppy Vaccination & Park Readiness Calculator
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Find out exactly when it's safe to take your puppy to the dog park.
            </p>
          </div>
        </section>

        <section className="py-12 px-4 max-w-3xl mx-auto">
          <PuppyVaccinationCalculator />
        </section>

        {/* SEO Content Section for Backlink Value */}
        <section className="bg-white py-16 px-4 border-t border-slate-100">
          <div className="max-w-4xl mx-auto prose prose-slate lg:prose-lg">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Why is it dangerous to take a puppy to a dog park too early?</h2>
            <p className="text-slate-600 mb-4">
              Dog parks are high-traffic areas where diseases can easily spread. Puppies do not have a fully developed immune system until they have completed their entire vaccination series.
            </p>
            <p className="text-slate-600 mb-4">
              The most significant threat to a young puppy is <strong>Canine Parvovirus (Parvo)</strong>. Parvo is highly contagious, easily transmitted through contaminated feces or soil, and can survive in the environment for months or even years. Because <Link href="/parks" className="text-indigo-600 hover:underline">public dog parks</Link> see so many dogs, the soil is often heavily contaminated.
            </p>
            <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">How the Parvo Vaccine Works</h3>
            <p className="text-slate-600 mb-4">
              When a puppy is born, they receive maternal antibodies from their mother's milk. These antibodies temporarily protect the puppy but also interfere with the effectiveness of vaccines. As maternal antibodies fade (usually between 6 and 14 weeks), the puppy becomes vulnerable.
            </p>
            <p className="text-slate-600 mb-4">
              Because it's impossible to know exactly when a specific puppy's maternal antibodies drop off without expensive testing, veterinarians administer a series of DHPP shots every 2 to 4 weeks. This ensures that as soon as the maternal antibodies wane, a vaccine is given to stimulate the puppy's own immune system to create long-lasting protection.
            </p>
            <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">The "Two Week" Rule</h3>
            <p className="text-slate-600 mb-4">
              Even after the final shot is administered at 14-16 weeks, the puppy is not instantly protected. It takes the immune system approximately 10 to 14 days to fully respond to the vaccine and build up immunity. This is why our calculator recommends waiting until <strong>18 weeks of age</strong> before visiting high-risk areas like <Link href="/parks" className="text-indigo-600 hover:underline">dog parks</Link>. Once your puppy is fully vaccinated, check out our <Link href="/tools/dog-park-packing-list-generator" className="text-indigo-600 hover:underline">dog park packing list generator</Link> to ensure you bring everything you need for their first big adventure!
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
