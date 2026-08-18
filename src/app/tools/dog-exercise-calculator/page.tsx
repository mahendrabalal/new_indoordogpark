import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DogExerciseCalculator from '@/components/DogExerciseCalculator';

export const metadata: Metadata = {
  title: { absolute: 'Dog Exercise Calculator: How Much Exercise Does A Dog Need?' },
  description: 'Use our free interactive Dog Exercise Calculator to find out exactly how much daily physical and mental exercise your puppy, adult, or senior dog needs.',
  keywords: [
    'dog exercise calculator',
    'how much exercise does a dog need',
    'dog exercise requirements',
    'puppy exercise guidelines',
    'dog energy levels',
    'dog health'
  ],
  alternates: {
    canonical: '/tools/dog-exercise-calculator',
  },
  openGraph: {
    title: 'Dog Exercise Calculator | IndoorDogPark.org',
    description: 'Find out exactly how much physical and mental exercise your dog needs based on their age, size, and breed type.',
    url: 'https://www.indoordogpark.org/tools/dog-exercise-calculator',
    type: 'website',
  },
};

export default function DogExerciseCalculatorPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header variant="light" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-hero-gradient text-white py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm uppercase tracking-widest text-blue-200 mb-4">
              <Link href="/tools" className="hover:text-white transition-colors">Free Tools</Link> / Exercise Calculator
            </p>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 animate-slide-in">
              Dog Exercise Calculator
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Every dog is unique. Discover exactly how much physical activity and mental stimulation your dog needs to stay healthy and happy.
            </p>
          </div>
        </section>

        {/* Calculator and Content */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            {/* The Interactive Calculator Component */}
            <DogExerciseCalculator />

            {/* SEO Content Section (Replaces AKC Article) */}
            <article className="prose prose-lg max-w-none prose-headings:text-primary prose-a:text-secondary hover:prose-a:text-primary bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-3xl font-bold mb-6">How Much Exercise Does A Dog Need?</h2>
              
              <p>
                As a pet parent, ensuring your dog gets the right amount of exercise is one of the most important things you can do for their long-term health. While the general rule of thumb is <strong>30 to 60 minutes of exercise per day</strong>, the exact amount depends entirely on your dog&apos;s age, breed, and health status.
              </p>

              <h3 className="text-2xl font-bold mt-10 mb-4">Exercise Requirements by Age</h3>
              
              <div className="grid md:grid-cols-3 gap-6 my-8 not-prose">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <h4 className="font-bold text-xl text-primary mb-2">Puppies</h4>
                  <p className="text-gray-700 text-sm">Growing joints are fragile! A good rule is 5 minutes of exercise per month of age, twice a day. Avoid forced running or jumping until their growth plates close.</p>
                </div>
                <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                  <h4 className="font-bold text-xl text-primary mb-2">Adults</h4>
                  <p className="text-gray-700 text-sm">Most adult dogs are in their prime and can handle vigorous exercise like running, hiking, and agility training. Watch for signs of fatigue.</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                  <h4 className="font-bold text-xl text-primary mb-2">Seniors</h4>
                  <p className="text-gray-700 text-sm">Older dogs still need to move to prevent stiffness. Shift from high-impact activities to gentle walks, swimming, and mental enrichment.</p>
                </div>
              </div>

              <h3 className="text-2xl font-bold mt-10 mb-4">Breed and Energy Levels</h3>
              <p>
                Genetics play a massive role in your dog&apos;s energy tank. 
              </p>
              <ul>
                <li><strong>High Energy (Herding &amp; Sporting):</strong> Breeds like Border Collies, Australian Shepherds, and Pointers were bred to work all day. They often need 1.5 to 2+ hours of intense exercise and a &quot;job&quot; to do.</li>
                <li><strong>Medium Energy (Terriers &amp; Working):</strong> Boxers, Pit Bulls, and many Terriers need a solid 60 minutes of varied exercise, including fetch and tug.</li>
                <li><strong>Low Energy (Companion &amp; Giant):</strong> Pugs, Bulldogs, and Great Danes often do well with 30-45 minutes of leisurely walking to prevent obesity without straining joints.</li>
              </ul>

              <h3 className="text-2xl font-bold mt-10 mb-4">Indoor vs. Outdoor Exercise</h3>
              <p>
                You don&apos;t always need perfect weather to tire your dog out. On excessively hot or rainy days, consider visiting an <Link href="/states" className="font-bold">indoor dog park</Link> where your dog can run safely in a climate-controlled environment. 
              </p>
              <p>
                Mental stimulation is just as exhausting as physical exercise. Training sessions, snuffle mats, and puzzle toys can burn significant energy inside your living room.
              </p>

              <div className="bg-gray-50 border-l-4 border-accent p-6 mt-10 rounded-r-xl">
                <h4 className="font-bold text-lg m-0">Veterinary Disclaimer</h4>
                <p className="text-sm text-gray-600 mt-2 mb-0">
                  This calculator and guide are for educational purposes only. Always consult with your veterinarian before starting a new exercise regimen, especially if your dog has existing health conditions like arthritis or heart disease.
                </p>
              </div>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
