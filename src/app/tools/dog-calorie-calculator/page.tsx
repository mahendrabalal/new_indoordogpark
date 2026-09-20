import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DogCalorieCalculator from '@/components/DogCalorieCalculator';
import VeterinaryReviewByline from '@/components/tools/VeterinaryReviewByline';
import EmbedToolModal from '@/components/tools/EmbedToolModal';
import AuthoritativeSourcesSection from '@/components/tools/AuthoritativeSourcesSection';
import ToolStructuredData from '@/components/tools/ToolStructuredData';
import { createCanonicalUrl } from '@/lib/seo-utils';

export const metadata: Metadata = {
  title: { absolute: 'Dog Calorie & Portion Calculator | IndoorDogPark.org' },
  description: 'Use our free interactive dog calorie calculator to find out exactly how much to feed your dog per day based on their weight, age, and activity level. Based on WSAVA and NRC veterinary nutritional guidelines.',
  keywords: [
    'dog calorie calculator',
    'dog food portion calculator',
    'how much to feed my dog',
    'dog feeding chart',
    'dog RER calculator',
    'dog nutrition calculator',
    'wsava rer mer formula',
  ],
  alternates: {
    canonical: createCanonicalUrl('/tools/dog-calorie-calculator'),
  },
  openGraph: {
    title: 'Daily Dog Calorie Calculator | IndoorDogPark.org',
    description: 'Find out exactly how many calories and cups of food your dog needs per day to stay at a healthy weight.',
    url: 'https://www.indoordogpark.org/tools/dog-calorie-calculator',
    type: 'website',
  },
};

const citations = [
  {
    organization: 'World Small Animal Veterinary Association (WSAVA)',
    title: 'WSAVA Nutritional Assessment Guidelines & Energy Calculation Formulas',
    sourceUrl: 'https://wsava.org/global-guidelines/global-nutrition-guidelines/',
    description: 'Standardized physiological Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER) clinical formulas.',
  },
  {
    organization: 'National Research Council (NRC)',
    title: 'Nutrient Requirements of Dogs and Cats',
    sourceUrl: 'https://nap.nationalacademies.org/catalog/10668/nutrient-requirements-of-dogs-and-cats',
    description: 'Peer-reviewed definitive academic standard on canine macronutrient, micronutrient, and metabolic baseline requirements.',
  },
  {
    organization: 'American College of Veterinary Internal Medicine (ACVIM)',
    title: 'Small Animal Clinical Nutrition and Metabolic Regulation',
    sourceUrl: 'https://www.acvim.org/',
    description: 'Specialist veterinary consensus on life-stage metabolic variance, spay/neuter metabolic reduction, and athletic dog fueling.',
  },
];

export default function DogCalorieCalculatorPage() {
  const canonicalUrl = createCanonicalUrl('/tools/dog-calorie-calculator');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <ToolStructuredData
        name="Daily Dog Calorie & Feeding Portion Calculator"
        description="Free clinical calculator to determine canine RER (Resting Energy Requirement) and MER (Maintenance Energy Requirement) caloric goals."
        url={canonicalUrl}
        citations={citations.map((c) => ({ organization: c.organization, title: c.title, url: c.sourceUrl }))}
        lastReviewed="2026-08-01"
      />
      <Header variant="light" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-hero-gradient text-white py-20 px-4 pb-32">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm uppercase tracking-widest text-emerald-200 mb-4">
              <Link href="/tools" className="hover:text-white transition-colors">Free Tools</Link> / Dog Calorie Calculator
            </p>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 animate-slide-in">
              Daily Dog Calorie Calculator
            </h1>
            <p className="text-xl md:text-2xl text-emerald-100 max-w-2xl mx-auto leading-relaxed">
              Find out exactly how much to feed your dog. Calculate their daily caloric needs and portion sizes based on veterinary formulas.
            </p>
          </div>
        </section>

        {/* Calculator and Content */}
        <section className="px-4 pb-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Canine Energy Requirement Model
              </span>
              <EmbedToolModal
                toolName="Daily Dog Calorie & Portion Calculator"
                embedUrl="https://www.indoordogpark.org/tools/dog-calorie-calculator/embed"
                canonicalUrl={canonicalUrl}
                defaultHeight={660}
              />
            </div>

            {/* Prominent E-E-A-T Veterinary Review Byline */}
            <VeterinaryReviewByline
              title="WSAVA & NRC Canine Nutritional Formulas"
              subtitle="RER and MER metabolic caloric formulas compiled from veterinary standards"
              reviewDate="Updated August 2026"
              evidenceBase="WSAVA Energy Requirements & NRC Standards"
            />

            {/* The Interactive Calculator Component */}
            <DogCalorieCalculator />

            {/* SEO Content Section */}
            <article className="prose prose-lg max-w-none prose-headings:text-primary prose-a:text-secondary hover:prose-a:text-primary bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 mt-16">
              <h2 className="text-3xl font-bold mb-6">How Much Should I Feed My Dog?</h2>
              
              <p>
                Knowing exactly how much to feed your dog can be incredibly confusing. The feeding charts on the back of commercial dog food bags are often based on broad averages, and relying on them can lead to unintentional weight gain. 
              </p>
              <p>
                To calculate precise feeding amounts, veterinarians use two specific formulas: <strong>RER (Resting Energy Requirement)</strong> and <strong>MER (Maintenance Energy Requirement)</strong>. Our calculator uses these exact formulas to give you a personalized caloric target.
              </p>

              <h3 className="text-2xl font-bold mt-10 mb-4">What is RER? (Resting Energy Requirement)</h3>
              <p>
                Your dog's RER is the base number of calories their body needs just to sustain essential bodily functions like breathing, digestion, and brain activity while at rest. Even if your dog slept on the couch for 24 hours straight, they would burn their RER in calories.
              </p>
              
              <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 my-8 not-prose">
                <h4 className="font-bold text-xl text-primary mb-2">The Veterinary RER Formula</h4>
                <p className="text-gray-700 text-sm font-mono bg-white p-3 rounded-lg border border-emerald-200 inline-block mt-2">
                  RER = 70 × (Body weight in kg)<sup>0.75</sup>
                </p>
              </div>

              <h3 className="text-2xl font-bold mt-10 mb-4">What is MER? (Maintenance Energy Requirement)</h3>
              <p>
                Since your dog doesn't just sleep all day, we have to multiply their RER by an "activity multiplier" to find their Maintenance Energy Requirement (MER). This multiplier changes drastically based on your dog's life stage and activity level.
              </p>
              <ul>
                <li><strong>Puppies:</strong> Growing requires massive amounts of energy. Puppies under 4 months old need nearly 3 times their RER!</li>
                <li><strong>Spayed/Neutered Adults:</strong> Hormonal changes after being fixed lower a dog's metabolism. They typically only need 1.6 times their RER.</li>
                <li><strong>Highly Active Dogs:</strong> If you take your dog on daily hikes, or they spend hours running at an <Link href="/states" className="font-bold">indoor dog park</Link>, they may need double their RER to maintain muscle mass.</li>
              </ul>

              <h3 className="text-2xl font-bold mt-10 mb-4">Converting Calories to Cups</h3>
              <p>
                Once you know how many <em>calories</em> (kcal) your dog needs, you need to figure out how many <em>cups</em> of food that translates to. Look at the nutritional label on the back of your dog food bag. You will see a number listed as "kcal/cup" or "kcal/kg" (usually between 300 - 500 kcal/cup for dry kibble). 
              </p>
              <p>
                Divide your dog's daily MER by the kcal/cup to find out exactly how many cups of food they should eat per day.
              </p>

              <div className="bg-gray-50 border-l-4 border-accent p-6 mt-10 rounded-r-xl">
                <h4 className="font-bold text-lg m-0">Veterinary Disclaimer</h4>
                <p className="text-sm text-gray-600 mt-2 mb-0">
                  This calculator provides an estimation based on standard World Small Animal Veterinary Association (WSAVA) formulas. Individual metabolisms can vary by up to 20%. Always monitor your dog's Body Condition Score (BCS) and consult with your veterinarian before making significant dietary changes.
                </p>
              </div>

              {/* Verified Clinical Citations */}
              <AuthoritativeSourcesSection
                toolName="Dog Calorie Calculator"
                citations={citations}
              />
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
