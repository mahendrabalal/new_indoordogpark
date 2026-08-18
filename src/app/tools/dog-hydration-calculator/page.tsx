import { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import HydrationCalculator from '@/components/tools/HydrationCalculator';

export const metadata: Metadata = {
  title: { absolute: 'Dog Hydration Calculator | How Much Water Does My Dog Need?' },
  description: 'Use our free interactive Dog Hydration Calculator to find out exactly how many ounces and cups of water your dog should drink per day based on their weight and activity level.',
  alternates: {
    canonical: '/tools/dog-hydration-calculator',
  },
};

export default function HydrationCalculatorPage() {
  return (
    <PageLayout>
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
            </div>
          </div>

        </div>
      </div>
    </PageLayout>
  );
}
