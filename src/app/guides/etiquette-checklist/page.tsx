import { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import PrintButton from '@/components/PrintButton';

export const metadata: Metadata = {
  title: 'Indoor Dog Park Etiquette Checklist | Printable Guide',
  description: 'Download or print our free indoor dog park etiquette checklist. Ensure a safe, fun, and respectful visit for your dog and others.',
  keywords: ['dog park etiquette', 'indoor dog park rules', 'dog park checklist', 'dog park safety', 'first time dog park'],
  alternates: {
    canonical: '/guides/etiquette-checklist',
  },
};

export default function EtiquetteChecklistPage() {
  return (
    <PageLayout>
      {/* Non-printable header */}
      <section className="print:hidden bg-gradient-to-br from-violet-900 to-indigo-900 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-200">Free Resource</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">The Ultimate Indoor Dog Park Etiquette Checklist</h1>
          <p className="mt-4 text-lg text-slate-200 max-w-2xl mx-auto">
            A visual guide to keeping your dog safe, happy, and polite at the indoor park. Print this out or save it as a PDF!
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
          <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-12 shadow-xl print:shadow-none print:border-none print:p-0">
            
            {/* Header (Only visible in print or main container) */}
            <div className="text-center mb-10 border-b-4 border-violet-600 pb-6">
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Indoor Dog Park</h2>
              <h3 className="text-2xl font-bold text-violet-600 uppercase tracking-widest mt-1">Etiquette Checklist</h3>
              <p className="text-slate-500 mt-2 font-medium italic">Provided by IndoorDogPark.org</p>
            </div>

            <div className="space-y-10">
              
              {/* Section 1 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                    <i className="bi bi-clipboard-check-fill text-xl"></i>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 uppercase">1. Before You Go (Preparation)</h4>
                </div>
                <div className="space-y-4 pl-12">
                  <label className="flex items-start gap-4 cursor-pointer group print:break-inside-avoid">
                    <input type="checkbox" className="mt-1 h-6 w-6 rounded border-slate-300 text-violet-600 focus:ring-violet-600" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-lg group-hover:text-violet-700">Vaccinations Up To Date</span>
                      <span className="text-slate-600 text-sm">Ensure Rabies, DHPP, and Bordetella are current.</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-4 cursor-pointer group print:break-inside-avoid">
                    <input type="checkbox" className="mt-1 h-6 w-6 rounded border-slate-300 text-violet-600 focus:ring-violet-600" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-lg group-hover:text-violet-700">Burn Off Excess Energy</span>
                      <span className="text-slate-600 text-sm">Take a short 10-minute walk before arriving to prevent over-arousal at entry.</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-4 cursor-pointer group print:break-inside-avoid">
                    <input type="checkbox" className="mt-1 h-6 w-6 rounded border-slate-300 text-violet-600 focus:ring-violet-600" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-lg group-hover:text-violet-700">Leave Toys & Treats in the Car</span>
                      <span className="text-slate-600 text-sm">Avoid bringing high-value items inside to prevent resource guarding fights.</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Section 2 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                    <i className="bi bi-door-open-fill text-xl"></i>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 uppercase">2. Upon Arrival (The Lobby)</h4>
                </div>
                <div className="space-y-4 pl-12">
                  <label className="flex items-start gap-4 cursor-pointer group print:break-inside-avoid">
                    <input type="checkbox" className="mt-1 h-6 w-6 rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-lg group-hover:text-blue-700">Leash Up Until the Double Gates</span>
                      <span className="text-slate-600 text-sm">Keep your dog leashed in the lobby. Only unleash in the designated transition area.</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-4 cursor-pointer group print:break-inside-avoid">
                    <input type="checkbox" className="mt-1 h-6 w-6 rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-lg group-hover:text-blue-700">Remove Training Collars</span>
                      <span className="text-slate-600 text-sm">Take off prong, pinch, or choke collars. They are a serious hazard during play.</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Section 3 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-700">
                    <i className="bi bi-heart-pulse-fill text-xl"></i>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 uppercase">3. Inside the Park (Playtime)</h4>
                </div>
                <div className="space-y-4 pl-12">
                  <label className="flex items-start gap-4 cursor-pointer group print:break-inside-avoid">
                    <input type="checkbox" className="mt-1 h-6 w-6 rounded border-slate-300 text-rose-600 focus:ring-rose-600" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-lg group-hover:text-rose-700">Put Your Phone Away</span>
                      <span className="text-slate-600 text-sm">Constant supervision is your #1 job. Don't rely on staff to watch your dog.</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-4 cursor-pointer group print:break-inside-avoid">
                    <input type="checkbox" className="mt-1 h-6 w-6 rounded border-slate-300 text-rose-600 focus:ring-rose-600" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-lg group-hover:text-rose-700">Keep Moving</span>
                      <span className="text-slate-600 text-sm">Walking around prevents your dog from becoming territorial over one corner.</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-4 cursor-pointer group print:break-inside-avoid">
                    <input type="checkbox" className="mt-1 h-6 w-6 rounded border-slate-300 text-rose-600 focus:ring-rose-600" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-lg group-hover:text-rose-700">Clean Up Instantly</span>
                      <span className="text-slate-600 text-sm">Indoor parks rely on hygiene. Grab a bag and clean up accidents immediately.</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-4 cursor-pointer group print:break-inside-avoid">
                    <input type="checkbox" className="mt-1 h-6 w-6 rounded border-slate-300 text-rose-600 focus:ring-rose-600" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-lg group-hover:text-rose-700">Perform the Consent Test</span>
                      <span className="text-slate-600 text-sm">If play gets rough, separate the dogs. If both eagerly return, it's mutual play.</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Section 4 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                    <i className="bi bi-clock-history text-xl"></i>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 uppercase">4. Knowing When to Leave</h4>
                </div>
                <div className="space-y-4 pl-12">
                  <label className="flex items-start gap-4 cursor-pointer group print:break-inside-avoid">
                    <input type="checkbox" className="mt-1 h-6 w-6 rounded border-slate-300 text-amber-600 focus:ring-amber-600" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-lg group-hover:text-amber-700">Leave on a High Note</span>
                      <span className="text-slate-600 text-sm">Depart before your dog becomes overtired and cranky (usually 45-60 mins).</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-4 cursor-pointer group print:break-inside-avoid">
                    <input type="checkbox" className="mt-1 h-6 w-6 rounded border-slate-300 text-amber-600 focus:ring-amber-600" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-lg group-hover:text-amber-700">Watch for Stress Signals</span>
                      <span className="text-slate-600 text-sm">Excessive panting, hiding behind your legs, or snapping means it's time to go home.</span>
                    </div>
                  </label>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="mt-12 pt-6 border-t-2 border-slate-100 text-center text-slate-500 font-medium">
              Find the best indoor dog parks near you at <span className="text-violet-600 font-bold">IndoorDogPark.org</span>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
