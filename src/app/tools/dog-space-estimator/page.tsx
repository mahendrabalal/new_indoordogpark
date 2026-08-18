import { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import SpaceEstimator from '@/components/tools/SpaceEstimator';

export const metadata: Metadata = {
  title: { absolute: 'Indoor Dog Space Estimator | Room Size Calculator' },
  description: 'Use our free interactive space estimator to calculate exactly how much open square footage your dog needs to safely play fetch or sprint indoors.',
  alternates: {
    canonical: '/tools/dog-space-estimator',
  },
};

export default function SpaceEstimatorPage() {
  return (
    <PageLayout>
      <div className="bg-slate-50 min-h-screen pb-24 font-sans">
        
        {/* Simple Page Header */}
        <section className="bg-white py-16 lg:py-24 border-b border-slate-200 mb-12">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h1 className="text-4xl font-black leading-tight md:text-5xl text-slate-900 tracking-tight mb-6">
              "Tire Out Your Dog" Space Estimator
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Living in an apartment or planning an indoor play area? Find out exactly how much unobstructed square footage your dog needs to play safely.
            </p>
          </div>
        </section>

        {/* Tool Container */}
        <div className="mx-auto max-w-4xl px-4">
          
          <SpaceEstimator />

          {/* Educational Content Below Tool */}
          <div className="mt-16 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">The Physics of Indoor Play</h3>
            <div className="space-y-6 text-slate-700 leading-relaxed">
              <p>
                When a dog is fully aroused and chasing a ball, their spatial awareness drops dramatically. They are focused entirely on the prey object (the toy), not the edge of your coffee table or the drywall.
              </p>
              <p>
                <strong>Braking Distance is Critical:</strong> A large dog sprinting at full speed needs up to 15 feet just to safely decelerate and stop. Without adequate braking distance, they are forced to crash into walls or abruptly twist their joints to stop, which is a leading cause of cranial cruciate ligament (CCL) tears in indoor environments.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-xl">
                  <h4 className="font-bold text-slate-900 mb-2">Safe Flooring Checklist</h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    <li>Rubberized gym mats or EVA foam</li>
                    <li>Low-pile carpet or rugs (secured with grip pads)</li>
                    <li>Indoor sports turf</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl">
                  <h4 className="font-bold text-slate-900 mb-2">Dangerous Flooring</h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    <li>Hardwood or laminate (extreme slip hazard)</li>
                    <li>Tile or polished concrete</li>
                    <li>Loose rugs that can slide under them</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </PageLayout>
  );
}
