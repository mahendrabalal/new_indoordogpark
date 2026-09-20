import { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import HydrationCalculator from '@/components/tools/HydrationCalculator';
import VeterinaryReviewByline from '@/components/tools/VeterinaryReviewByline';
import EmbedToolModal from '@/components/tools/EmbedToolModal';
import AuthoritativeSourcesSection from '@/components/tools/AuthoritativeSourcesSection';
import ToolStructuredData from '@/components/tools/ToolStructuredData';
import { createCanonicalUrl } from '@/lib/seo-utils';

export const metadata: Metadata = {
  title: { absolute: 'Dog Hydration Calculator | How Much Water Does My Dog Need?' },
  description: 'Use our free interactive Dog Hydration Calculator to find out exactly how many ounces and cups of water your dog should drink per day based on their weight and activity level. Based on Merck Veterinary Manual guidelines.',
  alternates: {
    canonical: createCanonicalUrl('/tools/dog-hydration-calculator'),
  },
};

const citations = [
  {
    organization: 'Merck Veterinary Manual',
    title: 'Fluid Therapy and Water Balance in Small Animals',
    sourceUrl: 'https://www.merckvetmanual.com/special-pet-topics/emergencies/fluid-therapy-in-small-animals',
    description: 'Clinical standard detailing physiological maintenance water requirements (50-60 mL/kg/day) and thermal panting fluid loss.',
  },
  {
    organization: 'American College of Veterinary Internal Medicine (ACVIM)',
    title: 'Consensus Statement on Fluid and Electrolyte Disorders in Canines',
    sourceUrl: 'https://www.acvim.org/',
    description: 'Specialist clinical consensus on extracellular fluid maintenance, dehydration biomarkers, and renal protection.',
  },
  {
    organization: 'American Veterinary Medical Association (AVMA)',
    title: 'Warm Weather Pet Safety and Heatstroke Hydration Strategies',
    sourceUrl: 'https://www.avma.org/resources-tools/pet-owners/petcare/warm-weather-pet-safety',
    description: 'Essential preventive guidelines for hydration during high-exertion play at dog parks and in warm ambient temperatures.',
  },
];

export default function HydrationCalculatorPage() {
  const canonicalUrl = createCanonicalUrl('/tools/dog-hydration-calculator');

  return (
    <PageLayout>
      <ToolStructuredData
        name="Dog Hydration Calculator"
        description="Free clinical calculator to determine daily canine fluid requirements (ounces, mL, and cups) based on weight, weather, and activity levels."
        url={canonicalUrl}
        citations={citations.map((c) => ({ organization: c.organization, title: c.title, url: c.sourceUrl }))}
        lastReviewed="2026-08-01"
      />
      <div className="bg-slate-50 min-h-screen pb-24 font-sans">
        
        {/* Simple Page Header */}
        <section className="bg-white py-16 lg:py-24 border-b border-slate-200 mb-12">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h1 className="text-4xl font-black leading-tight md:text-5xl text-slate-900 tracking-tight mb-6">
              Dog Hydration Calculator
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Find out exactly how much water your dog needs to stay healthy and hydrated based on veterinary guidelines.
            </p>
          </div>
        </section>

        {/* Tool Container */}
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Veterinary Fluid Balance Protocol
            </span>
            <EmbedToolModal
              toolName="Dog Hydration Calculator"
              embedUrl="https://www.indoordogpark.org/tools/dog-hydration-calculator/embed"
              canonicalUrl={canonicalUrl}
              defaultHeight={640}
            />
          </div>

          {/* Prominent E-E-A-T Veterinary Review Byline */}
          <VeterinaryReviewByline
            title="Merck Veterinary & ACVIM Fluid Guidelines"
            subtitle="Maintenance hydration and evaporative loss calculations"
            reviewDate="Updated August 2026"
            evidenceBase="Merck Veterinary Manual & ACVIM Guidelines"
          />
          
          <HydrationCalculator />

          {/* Educational Content Below Tool */}
          <div className="mt-16 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Why Hydration is Critical for Dogs</h3>
            <div className="space-y-6 text-slate-700 leading-relaxed">
              <p>
                Unlike humans who sweat to cool down, dogs primarily cool themselves through panting. This process requires a significant amount of moisture from their respiratory tract, meaning active dogs can become dehydrated surprisingly fast.
              </p>
              <p>
                <strong>The General Rule:</strong> A healthy dog should drink between 0.5 to 1 ounce of water per pound of body weight each day. However, this base requirement can easily double if your dog is engaging in vigorous play at a dog park or if the weather is hot and humid.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
                <h4 className="font-bold text-slate-900 mb-2">Signs of Dehydration in Dogs</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Loss of skin elasticity (if you gently pull up the skin on their back, it doesn't snap back immediately)</li>
                  <li>Dry, sticky gums or thick saliva</li>
                  <li>Lethargy and loss of appetite</li>
                  <li>Excessive, heavy panting</li>
                </ul>
              </div>

              {/* Verified Clinical Citations */}
              <AuthoritativeSourcesSection
                toolName="Dog Hydration Calculator"
                citations={citations}
              />
            </div>
          </div>

        </div>
      </div>
    </PageLayout>
  );
}
