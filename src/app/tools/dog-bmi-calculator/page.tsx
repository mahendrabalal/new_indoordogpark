import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DogBmiCalculator from '@/components/DogBmiCalculator';
import VeterinaryReviewByline from '@/components/tools/VeterinaryReviewByline';
import EmbedToolModal from '@/components/tools/EmbedToolModal';
import AuthoritativeSourcesSection from '@/components/tools/AuthoritativeSourcesSection';
import ToolStructuredData from '@/components/tools/ToolStructuredData';
import { createCanonicalUrl } from '@/lib/seo-utils';

export const metadata: Metadata = {
  title: { absolute: 'Dog BMI & Healthy Weight Checker | Free Calculator' },
  description: 'Use our free interactive Dog BMI Calculator to assess your dog\'s Body Condition Score (BCS) and find their ideal healthy weight target. Based on WSAVA and AAHA clinical standards.',
  keywords: [
    'dog bmi calculator',
    'dog weight checker',
    'is my dog overweight',
    'dog body condition score',
    'healthy dog weight',
    'dog weight loss',
    'wsava bcs chart',
  ],
  alternates: {
    canonical: createCanonicalUrl('/tools/dog-bmi-calculator'),
  },
  openGraph: {
    title: 'Dog BMI & Healthy Weight Checker | IndoorDogPark.org',
    description: 'Find out if your dog is at a healthy weight using the veterinary Body Condition Score (BCS) method.',
    url: 'https://www.indoordogpark.org/tools/dog-bmi-calculator',
    type: 'website',
  },
};

const citations = [
  {
    organization: 'World Small Animal Veterinary Association (WSAVA)',
    title: 'Global Nutrition Committee: Canine Body Condition Score (BCS) 9-Point Chart',
    sourceUrl: 'https://wsava.org/global-guidelines/global-nutrition-guidelines/',
    description: 'Standardized clinical assessment metric utilized worldwide by veterinary clinicians to determine lean muscle vs adipose fat mass.',
  },
  {
    organization: 'American Animal Hospital Association (AAHA)',
    title: 'AAHA Weight Management Guidelines for Dogs and Cats',
    sourceUrl: 'https://www.aaha.org/resources/weight-management-guidelines-for-dogs-and-cats/',
    description: 'Evidence-based clinical guidelines on safe caloric deficit, metabolic testing, and joint preservation during canine weight reduction.',
  },
  {
    organization: 'Merck Veterinary Manual',
    title: 'Canine Obesity and Weight Management Protocols',
    sourceUrl: 'https://www.merckvetmanual.com/management-and-nutrition/nutrition-small-animals/nutritional-requirements-and-related-diseases-of-small-animals',
    description: 'Veterinary medical manual detailing metabolic comorbidities, orthopaedic risks, and target body mass metrics.',
  },
  {
    organization: 'American Veterinary Medical Association (AVMA)',
    title: 'Your Pet’s Healthy Weight: Clinical Assessment and Prevention',
    sourceUrl: 'https://www.avma.org/resources-tools/pet-owners/petcare/your-pets-healthy-weight',
    description: 'Authoritative pet owner guidelines for maintaining cardiovascular health, mobility, and lifespan through healthy weight management.',
  },
];

export default function DogBmiCalculatorPage() {
  const canonicalUrl = createCanonicalUrl('/tools/dog-bmi-calculator');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <ToolStructuredData
        name="Dog BMI & Healthy Weight Checker"
        description="Interactive veterinary calculator to evaluate Body Condition Score (BCS) and estimate ideal canine target weight."
        url={canonicalUrl}
        citations={citations.map((c) => ({ organization: c.organization, title: c.title, url: c.sourceUrl }))}
        lastReviewed="2026-08-01"
      />
      <Header variant="light" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-hero-gradient text-white py-20 px-4 pb-32">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm uppercase tracking-widest text-blue-200 mb-4">
              <Link href="/tools" className="hover:text-white transition-colors">Free Tools</Link> / Dog BMI Checker
            </p>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 animate-slide-in">
              Dog BMI & Healthy Weight Checker
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Is your dog carrying a few extra pounds? Use the veterinary Body Condition Score (BCS) to estimate your dog's ideal target weight.
            </p>
          </div>
        </section>

        {/* Calculator and Content */}
        <section className="px-4 pb-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Veterinary BCS Morphometric Tool
              </span>
              <EmbedToolModal
                toolName="Dog BMI & Body Condition Calculator"
                embedUrl="https://www.indoordogpark.org/tools/dog-bmi-calculator/embed"
                canonicalUrl={canonicalUrl}
                defaultHeight={680}
              />
            </div>

            {/* Prominent E-E-A-T Veterinary Review Byline */}
            <VeterinaryReviewByline
              title="WSAVA 9-Point Body Condition Score Standard"
              subtitle="Morphometric weight classification based on veterinary nutritional guidelines"
              reviewDate="Updated August 2026"
              evidenceBase="WSAVA Global Nutrition & AAHA Guidelines"
            />

            {/* The Interactive Calculator Component */}
            <DogBmiCalculator />

            {/* SEO Content Section */}
            <article className="prose prose-lg max-w-none prose-headings:text-primary prose-a:text-secondary hover:prose-a:text-primary bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 mt-16">
              <h2 className="text-3xl font-bold mb-6">Understanding Your Dog's BMI and Weight</h2>
              
              <p>
                Unlike humans, dogs don't have a standard Body Mass Index (BMI) chart because breeds vary so wildly in shape and size. A healthy weight for a Greyhound looks completely different than a healthy weight for an English Bulldog. That is why veterinarians use the <strong>Body Condition Score (BCS)</strong> instead of a traditional BMI.
              </p>

              <h3 className="text-2xl font-bold mt-10 mb-4">What is the Body Condition Score?</h3>
              <p>
                The BCS is a visual and tactile assessment of your dog's body fat. It is typically measured on a 9-point scale, where 1 is severely underweight, 4-5 is ideal, and 9 is morbidly obese. 
              </p>
              
              <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 my-8 not-prose">
                <h4 className="font-bold text-xl text-primary mb-2">The Rib Test</h4>
                <p className="text-gray-700 text-sm">
                  The easiest way to check your dog's BCS at home is the "Rib Test." Run your hands along your dog's sides. You should be able to feel their ribs easily without pressing hard, similar to the back of your hand. If you have to press firmly to feel the ribs (like pressing on your palm), your dog is likely overweight.
                </p>
              </div>

              <h3 className="text-2xl font-bold mt-10 mb-4">The Risks of Pet Obesity</h3>
              <p>
                Carrying excess weight is one of the most common health issues in modern dogs, affecting over 50% of pets in the US. Even being a few pounds overweight can significantly impact your dog's quality of life and lifespan.
              </p>
              <ul>
                <li><strong>Joint Stress:</strong> Excess weight exacerbates arthritis, hip dysplasia, and increases the risk of ACL (cruciate ligament) tears.</li>
                <li><strong>Heart & Respiratory Issues:</strong> Breathing becomes harder, especially for flat-faced (brachycephalic) breeds like Pugs and Frenchies.</li>
                <li><strong>Diabetes:</strong> Like humans, overweight dogs are at a much higher risk for metabolic diseases.</li>
              </ul>

              <h3 className="text-2xl font-bold mt-10 mb-4">How to Help Your Dog Lose Weight Safely</h3>
              <p>
                Weight loss for dogs comes down to two factors: <strong>caloric restriction and low-impact exercise</strong>.
              </p>
              <ol>
                <li><strong>Measure their food:</strong> Stop "eyeballing" their kibble. Use a measuring cup and consult your vet for a specific calorie target.</li>
                <li><strong>Cut the treats:</strong> Treats should make up no more than 10% of your dog's daily calories. Swap high-calorie treats for dog-safe veggies like carrots or green beans.</li>
                <li><strong>Safe Exercise:</strong> If your dog is overweight, forced running or repetitive fetching on hard surfaces can severely damage their joints. Instead, opt for swimming, underwater treadmills, or walking on the soft, shock-absorbing turf at an <Link href="/states" className="font-bold">indoor dog park</Link>.</li>
              </ol>

              <div className="bg-gray-50 border-l-4 border-accent p-6 mt-10 rounded-r-xl">
                <h4 className="font-bold text-lg m-0">Veterinary Disclaimer</h4>
                <p className="text-sm text-gray-600 mt-2 mb-0">
                  This calculator provides an estimation based on standard veterinary scaling guidelines from the WSAVA and AAHA. It is not a substitute for professional medical diagnosis. Always consult with your veterinarian before putting your dog on a calorie-restricted diet or starting an intensive exercise regimen.
                </p>
              </div>

              {/* Verified Clinical Citations */}
              <AuthoritativeSourcesSection
                toolName="Dog BMI & Weight Calculator"
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
