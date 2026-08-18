import { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import PrintButton from '@/components/PrintButton';

export const metadata: Metadata = {
  title: { absolute: 'Dog Park First-Aid Quick Reference | Guide' },
  description: 'Download our free quick-reference guide for handling common dog park emergencies like overheating, cuts, and choking.',
  keywords: ['dog first aid', 'dog park emergencies', 'overheating dog', 'dog choking', 'dog park safety'],
  alternates: {
    canonical: '/guides/first-aid',
  },
};

export default function FirstAidPage() {
  return (
    <PageLayout>
      {/* Non-printable header */}
      <section className="print:hidden bg-gradient-to-br from-rose-700 to-red-900 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-200">Free Resource</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">Dog Park First-Aid Guide</h1>
          <p className="mt-4 text-lg text-red-100 max-w-2xl mx-auto">
            A printable quick-reference sheet for handling common dog park emergencies. Keep a copy in your car or training bag.
          </p>
          <div className="mt-8">
            <PrintButton />
          </div>
        </div>
      </section>

      {/* The Printable Checklist Area */}
      <section className="bg-slate-50 py-12 print:bg-white print:py-0">
        <div className="mx-auto max-w-3xl px-4 print:max-w-none print:px-0">
          
          {/* Printable Container */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 md:p-12 shadow-xl print:shadow-none print:border-none print:p-0">
            
            {/* Header (Only visible in print or main container) */}
            <div className="text-center mb-10 border-b-4 border-rose-500 pb-6">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">Indoor Dog Park</h2>
              <h3 className="text-2xl font-bold text-rose-500 uppercase tracking-widest mt-1">First-Aid Quick Reference</h3>
              <p className="text-slate-500 mt-2 font-medium italic">Provided by IndoorDogPark.org</p>
            </div>

            <div className="space-y-10">
              
              {/* Section 1 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-700">
                    <i className="bi bi-thermometer-sun text-xl"></i>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 uppercase">1. Heat Exhaustion (Overheating)</h4>
                </div>
                <div className="space-y-4 sm:pl-[52px]">
                  <label className="flex items-start gap-4 cursor-pointer group print:break-inside-avoid">
                    <input type="checkbox" className="mt-1 h-6 w-6 rounded border-slate-300 text-orange-600 focus:ring-orange-600" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-lg group-hover:text-orange-700">Symptoms</span>
                      <span className="text-slate-600 text-sm">Excessive, uncontrollable panting. Thick drool. Dark red or purple gums. Extreme lethargy or stumbling.</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-4 cursor-pointer group print:break-inside-avoid">
                    <input type="checkbox" className="mt-1 h-6 w-6 rounded border-slate-300 text-orange-600 focus:ring-orange-600" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-lg group-hover:text-orange-700">Immediate Action</span>
                      <span className="text-slate-600 text-sm">Remove from the play area immediately. Offer cool (not ice cold) water. Wet their paw pads and belly with cool water. Get them into an air-conditioned environment immediately.</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Section 2 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                    <i className="bi bi-bandaid-fill text-xl"></i>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 uppercase">2. Cuts & Scrapes (Paw Pads)</h4>
                </div>
                <div className="space-y-4 sm:pl-[52px]">
                  <label className="flex items-start gap-4 cursor-pointer group print:break-inside-avoid">
                    <input type="checkbox" className="mt-1 h-6 w-6 rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-lg group-hover:text-blue-700">Symptoms</span>
                      <span className="text-slate-600 text-sm">Sudden limping. Leaving bloody paw prints on the turf or concrete. Excessive licking of the paws.</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-4 cursor-pointer group print:break-inside-avoid">
                    <input type="checkbox" className="mt-1 h-6 w-6 rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-lg group-hover:text-blue-700">Immediate Action</span>
                      <span className="text-slate-600 text-sm">Apply gentle pressure with a clean towel to stop bleeding. Do not let them continue playing (turf harbors bacteria). Clean thoroughly with warm water at home or seek a vet if the cut is deep.</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Section 3 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-700">
                    <i className="bi bi-exclamation-circle-fill text-xl"></i>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 uppercase">3. Choking (Toys or Treats)</h4>
                </div>
                <div className="space-y-4 sm:pl-[52px]">
                  <label className="flex items-start gap-4 cursor-pointer group print:break-inside-avoid">
                    <input type="checkbox" className="mt-1 h-6 w-6 rounded border-slate-300 text-rose-600 focus:ring-rose-600" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-lg group-hover:text-rose-700">Symptoms</span>
                      <span className="text-slate-600 text-sm">Frantic pawing at the mouth. Pacing in distress. Blue or pale gums. Coughing sounds, but unable to draw breath.</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-4 cursor-pointer group print:break-inside-avoid">
                    <input type="checkbox" className="mt-1 h-6 w-6 rounded border-slate-300 text-rose-600 focus:ring-rose-600" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-lg group-hover:text-rose-700">Immediate Action</span>
                      <span className="text-slate-600 text-sm">Open the mouth and sweep gently with a finger if the object is visible. If not, perform the dog Heimlich maneuver (gentle but firm upward thrusts under the rib cage). Head to emergency vet.</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Section 4 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-700">
                    <i className="bi bi-shield-shaded text-xl"></i>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 uppercase">4. After a Scuffle (Bite Wounds)</h4>
                </div>
                <div className="space-y-4 sm:pl-[52px]">
                  <label className="flex items-start gap-4 cursor-pointer group print:break-inside-avoid">
                    <input type="checkbox" className="mt-1 h-6 w-6 rounded border-slate-300 text-slate-600 focus:ring-slate-600" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-lg group-hover:text-slate-700">Symptoms</span>
                      <span className="text-slate-600 text-sm">Visible puncture wounds. Matted fur with hidden bleeding underneath. Symptoms of shock (pale gums, shivering).</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-4 cursor-pointer group print:break-inside-avoid">
                    <input type="checkbox" className="mt-1 h-6 w-6 rounded border-slate-300 text-slate-600 focus:ring-slate-600" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-lg group-hover:text-slate-700">Immediate Action</span>
                      <span className="text-slate-600 text-sm">Separate dogs instantly using the "wheelbarrow" method (lifting hind legs). Exchange contact and vaccine info with the other owner. Do not use hydrogen peroxide on puncture wounds. Flush with saline and head to the vet immediately.</span>
                    </div>
                  </label>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="mt-12 pt-6 border-t-2 border-slate-100 text-center text-slate-500 font-medium">
              Find the best indoor dog parks near you at <span className="text-rose-500 font-bold">IndoorDogPark.org</span>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
