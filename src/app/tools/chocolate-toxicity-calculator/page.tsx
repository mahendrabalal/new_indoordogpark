import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChocolateToxicityCalculator from '@/components/ChocolateToxicityCalculator';

export const metadata: Metadata = {
  title: { absolute: 'Chocolate Toxicity Calculator for Dogs | Is Chocolate Poisonous to Dogs?' },
  description: 'Use our free Chocolate Toxicity Calculator to find out if the amount of chocolate your dog ate is dangerous. Includes theobromine dose levels, symptoms, and emergency vet contacts.',
  keywords: [
    'chocolate toxicity calculator dogs',
    'is chocolate poisonous to dogs',
    'my dog ate chocolate',
    'dog chocolate calculator',
    'theobromine toxicity dogs',
    'chocolate poisoning dogs',
    'how much chocolate is toxic to dogs',
  ],
  alternates: {
    canonical: '/tools/chocolate-toxicity-calculator',
  },
  openGraph: {
    title: 'Chocolate Toxicity Calculator for Dogs | IndoorDogPark.org',
    description: 'Find out instantly if the chocolate your dog ate is dangerous. Free calculator with emergency vet contacts.',
    url: 'https://www.indoordogpark.org/tools/chocolate-toxicity-calculator',
    type: 'website',
  },
};

export default function ChocolateToxicityCalculatorPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header variant="light" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="text-white py-20 px-4" style={{ background: 'linear-gradient(135deg, #5D4037 0%, #3E2723 100%)' }}>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm uppercase tracking-widest text-amber-200 mb-4">
              <Link href="/tools" className="hover:text-white transition-colors">Free Tools</Link> / Chocolate Toxicity
            </p>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Chocolate Toxicity Calculator
            </h1>
            <p className="text-xl md:text-2xl text-amber-100 max-w-2xl mx-auto leading-relaxed">
              My dog ate chocolate — is it dangerous? Enter the details below to find out immediately.
            </p>
          </div>
        </section>

        {/* Calculator and Content */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <ChocolateToxicityCalculator />

            {/* SEO Content */}
            <article className="prose prose-lg max-w-none prose-headings:text-primary prose-a:text-secondary hover:prose-a:text-primary bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-3xl font-bold mb-6">Why Is Chocolate Toxic to Dogs?</h2>

              <p>
                Chocolate contains <strong>theobromine</strong> and caffeine, both of which are methylxanthines that dogs metabolize much more slowly than humans. While a human can process theobromine in 6-10 hours, a dog&apos;s body can take up to <strong>18 hours</strong> to clear it — giving the toxin far more time to do damage.
              </p>

              <h3 className="text-2xl font-bold mt-10 mb-4">Theobromine Levels by Chocolate Type</h3>

              <div className="not-prose overflow-x-auto my-8">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="py-3 px-4 font-bold text-gray-800">Chocolate Type</th>
                      <th className="py-3 px-4 font-bold text-gray-800">Theobromine (mg/oz)</th>
                      <th className="py-3 px-4 font-bold text-gray-800">Danger Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-700">White Chocolate</td>
                      <td className="py-3 px-4 text-gray-700">0.25</td>
                      <td className="py-3 px-4"><span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">Very Low</span></td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-700">Milk Chocolate</td>
                      <td className="py-3 px-4 text-gray-700">58</td>
                      <td className="py-3 px-4"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">Moderate</span></td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-700">Dark Chocolate (60-70%)</td>
                      <td className="py-3 px-4 text-gray-700">155</td>
                      <td className="py-3 px-4"><span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-bold">High</span></td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-700">Baking / Unsweetened</td>
                      <td className="py-3 px-4 text-gray-700">420</td>
                      <td className="py-3 px-4"><span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-bold">Very High</span></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-700">Dry Cocoa Powder</td>
                      <td className="py-3 px-4 text-gray-700">570</td>
                      <td className="py-3 px-4"><span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-bold">Extreme</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-2xl font-bold mt-10 mb-4">Symptoms of Chocolate Poisoning in Dogs</h3>
              <p>
                Symptoms typically appear within <strong>6-12 hours</strong> of ingestion and can last up to 72 hours. The severity depends on the amount consumed relative to your dog&apos;s body weight.
              </p>
              <ul>
                <li><strong>Mild (20 mg/kg):</strong> Vomiting, diarrhea, excessive thirst, restlessness</li>
                <li><strong>Moderate (40 mg/kg):</strong> Rapid heart rate, hyperactivity, frequent urination, muscle tremors</li>
                <li><strong>Severe (60+ mg/kg):</strong> Seizures, cardiac arrhythmia, internal bleeding, cardiac arrest</li>
              </ul>

              <h3 className="text-2xl font-bold mt-10 mb-4">What to Do If Your Dog Eats Chocolate</h3>
              <ol>
                <li><strong>Stay calm</strong> and note the type of chocolate, approximate amount, and your dog&apos;s weight.</li>
                <li><strong>Use the calculator above</strong> to assess the risk level.</li>
                <li><strong>Call your vet or an emergency poison hotline</strong> — the ASPCA Poison Control Center at <strong>(888) 426-4435</strong> or Pet Poison Helpline at <strong>(855) 764-7661</strong>.</li>
                <li><strong>Do NOT induce vomiting</strong> unless specifically instructed by a veterinarian.</li>
                <li><strong>Monitor your dog</strong> closely for at least 24 hours, watching for vomiting, tremors, or rapid breathing.</li>
              </ol>

              <h3 className="text-2xl font-bold mt-10 mb-4">Prevention Tips</h3>
              <p>
                The best treatment is prevention. Keep all chocolate products stored securely out of your dog&apos;s reach — especially during holidays like Easter, Halloween, Christmas, and Valentine&apos;s Day when chocolate is abundant. If you visit an <Link href="/states" className="font-bold">indoor dog park</Link> or daycare, make sure no other guests are bringing chocolate treats.
              </p>

              <div className="bg-red-50 border-l-4 border-red-500 p-6 mt-10 rounded-r-xl">
                <h4 className="font-bold text-lg m-0 text-red-800">⚠️ Important Medical Disclaimer</h4>
                <p className="text-sm text-red-700 mt-2 mb-0">
                  This calculator provides general guidance based on published theobromine toxicity thresholds. It is <strong>not a substitute for professional veterinary advice</strong>. Individual dogs may react differently based on health conditions, age, and sensitivity. When in doubt, always contact your veterinarian or an emergency animal poison hotline immediately.
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
