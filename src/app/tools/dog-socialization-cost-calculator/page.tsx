import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DogSocializationCostCalculator from '@/components/DogSocializationCostCalculator';

export const metadata: Metadata = {
  title: { absolute: 'Dog Daycare vs Dog Walker Cost Calculator | IndoorDogPark.org' },
  description: 'Compare the true annual cost of doggy daycare, dog walkers, and indoor dog park memberships. Find out how much you could save with our free calculator.',
  keywords: [
    'dog daycare cost calculator',
    'dog walker cost calculator',
    'how much is doggy daycare',
    'cost of indoor dog park',
    'dog socialization cost',
    'cheaper alternative to doggy daycare',
  ],
  alternates: {
    canonical: '/tools/dog-socialization-cost-calculator',
  },
  openGraph: {
    title: 'Dog Daycare vs Dog Walker Cost Calculator | IndoorDogPark.org',
    description: 'Find out exactly how much you spend on doggy daycare and see cheaper alternatives.',
    url: 'https://www.indoordogpark.org/tools/dog-socialization-cost-calculator',
    type: 'website',
  },
};

export default function DogSocializationCostCalculatorPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header variant="light" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="text-white py-20 px-4" style={{ background: 'linear-gradient(135deg, #059669 0%, #065f46 100%)' }}>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm uppercase tracking-widest text-emerald-200 mb-4">
              <Link href="/tools" className="hover:text-white transition-colors">Free Tools</Link> / Cost Calculator
            </p>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Dog Care Cost Calculator
            </h1>
            <p className="text-xl md:text-2xl text-emerald-100 max-w-2xl mx-auto leading-relaxed">
              Compare the real annual cost of doggy daycare, dog walkers, and indoor dog park memberships. See how much you could save!
            </p>
          </div>
        </section>

        {/* Calculator and Content */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <DogSocializationCostCalculator />

            {/* SEO Content */}
            <article className="prose prose-lg max-w-none prose-headings:text-primary prose-a:text-secondary hover:prose-a:text-primary bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-3xl font-bold mb-6">The High Cost of Dog Socialization</h2>

              <p>
                Every dog needs exercise and socialization to remain happy and healthy. However, traditional options like doggy daycare and daily dog walkers can quickly become one of your largest household expenses. 
              </p>
              
              <p>
                According to recent national averages, dog owners spend between <strong>$3,000 and $8,000 per year</strong> just on daytime pet care while they are at work!
              </p>

              <h3 className="text-2xl font-bold mt-10 mb-4">Doggy Daycare Costs Explained</h3>
              <p>
                Doggy daycare is fantastic for high-energy dogs that need constant supervision and play. However, at an average of <strong>$35 to $45 per day</strong>, taking your dog to daycare just three days a week can cost upwards of $6,000 annually. Furthermore, many daycares charge extra for things like medication administration, special feeding times, or "cuddle time."
              </p>

              <h3 className="text-2xl font-bold mt-10 mb-4">Dog Walker Costs Explained</h3>
              <p>
                Hiring a daily dog walker provides a great break for your pup while you are at work. A standard 30-minute walk typically costs <strong>$20 to $30</strong> depending on your city. While slightly cheaper than daycare, a dog walker still represents an annual expense of nearly $6,500 if utilized five days a week.
              </p>

              <h3 className="text-2xl font-bold mt-10 mb-4">The Indoor Dog Park Alternative</h3>
              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-xl my-6">
                <h4 className="font-bold text-lg m-0 text-emerald-800">Massive Annual Savings</h4>
                <p className="text-sm text-emerald-700 mt-2 mb-0">
                  Most indoor dog parks offer unlimited monthly memberships ranging from <strong>$30 to $60 per month</strong>. That comes out to less than $720 per year for unlimited socialization and exercise!
                </p>
              </div>

              <p>
                If you work from home, or have flexible hours, replacing just one or two days of doggy daycare with a trip to the local indoor dog park can save you thousands of dollars a year. Many modern indoor dog parks also feature:
              </p>
              <ul>
                <li>Free Wi-Fi and work-from-home lounge areas</li>
                <li>Climate-controlled play zones so weather is never an issue</li>
                <li>Coffee bars and adult beverages</li>
                <li>Separate play areas for large and small dogs</li>
              </ul>
              
              <p className="mt-8 font-bold">
                Ready to start saving? <Link href="/">Search our directory</Link> to find a climate-controlled indoor dog park near you today!
              </p>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
