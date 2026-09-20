import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PuppyVaccinationCalculator from '@/components/PuppyVaccinationCalculator';
import VeterinaryReviewByline from '@/components/tools/VeterinaryReviewByline';
import EmbedToolModal from '@/components/tools/EmbedToolModal';
import AuthoritativeSourcesSection from '@/components/tools/AuthoritativeSourcesSection';
import ToolStructuredData from '@/components/tools/ToolStructuredData';
import { createCanonicalUrl } from '@/lib/seo-utils';

export const metadata: Metadata = {
  title: { absolute: 'Puppy Vaccination & Park Readiness Calculator | Indoor Dog Park' },
  description: 'Use our free interactive Puppy Vaccination Calculator to find out exactly when it is safe to take your puppy to public dog parks. Based on AAHA and WSAVA vaccination protocols.',
  keywords: [
    'puppy vaccination schedule',
    'when can a puppy go to the dog park',
    'puppy park readiness calculator',
    'parvo risk puppy dog park',
    'puppy shot timeline',
    'aaha canine vaccination guidelines',
  ],
  alternates: {
    canonical: createCanonicalUrl('/tools/puppy-vaccination-calculator'),
  },
};

const citations = [
  {
    organization: 'American Animal Hospital Association (AAHA)',
    title: 'AAHA Canine Vaccination Guidelines & Maternal Antibody Protocols',
    sourceUrl: 'https://www.aaha.org/resources/2022-aaha-canine-vaccination-guidelines/',
    description: 'Gold-standard clinical protocol governing core vaccines (DHPP/DA2PP, Rabies) and post-series immunity latency windows.',
  },
  {
    organization: 'World Small Animal Veterinary Association (WSAVA)',
    title: 'WSAVA Guidelines for the Vaccination of Dogs and Cats',
    sourceUrl: 'https://wsava.org/global-guidelines/vaccination-guidelines/',
    description: 'Global peer-reviewed vaccination timing recommendations addressing maternal antibody interference and critical socialization windows.',
  },
  {
    organization: 'American Veterinary Medical Association (AVMA)',
    title: 'Canine Parvovirus: Clinical Pathology, Transmission, and Environmental Risks',
    sourceUrl: 'https://www.avma.org/resources-tools/pet-owners/petcare/canine-parvovirus',
    description: 'Authoritative clinical guide on canine infectious diseases and high-density public park exposure risks for immature immune systems.',
  },
];

export default function PuppyVaccinationCalculatorPage() {
  const canonicalUrl = createCanonicalUrl('/tools/puppy-vaccination-calculator');

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <ToolStructuredData
        name="Puppy Vaccination & Dog Park Readiness Calculator"
        description="Free clinical calculator to determine puppy vaccine completion milestones and safe public park entry dates."
        url={canonicalUrl}
        citations={citations.map((c) => ({ organization: c.organization, title: c.title, url: c.sourceUrl }))}
        lastReviewed="2026-08-01"
      />
      <Header variant="light" />

      <main className="flex-1">
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Puppy Vaccination & Park Readiness Calculator
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Find out exactly when it's safe to take your puppy to the dog park based on AAHA and WSAVA vaccination protocols.
            </p>
          </div>
        </section>

        <section className="py-12 px-4 max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              AAHA Immunization Schedule Model
            </span>
            <EmbedToolModal
              toolName="Puppy Vaccination & Park Readiness Calculator"
              embedUrl="https://www.indoordogpark.org/tools/puppy-vaccination-calculator/embed"
              canonicalUrl={canonicalUrl}
              defaultHeight={640}
            />
          </div>

          {/* Prominent E-E-A-T Veterinary Review Byline */}
          <VeterinaryReviewByline
            title="AAHA & WSAVA Canine Immunization Protocols"
            subtitle="Calculated using standardized core vaccination intervals and latency windows"
            reviewDate="Updated August 2026"
            evidenceBase="AAHA & WSAVA Vaccination Guidelines"
          />

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

            {/* Verified Clinical Citations */}
            <AuthoritativeSourcesSection
              toolName="Puppy Vaccination Calculator"
              citations={citations}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
