import { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import PrintButton from '@/components/PrintButton';

export const metadata: Metadata = {
  title: 'Safety Assessment Guide for Indoor Dog Parks | Checklist',
  description: 'Download or print our free safety assessment checklist. Learn how to quickly evaluate if a new indoor dog park is safe and well-managed before letting your dog off-leash.',
  keywords: ['dog park safety', 'safe dog park', 'evaluate dog park', 'indoor dog park checklist', 'dog park rules'],
  alternates: {
    canonical: '/guides/safety-assessment',
  },
};

export default function SafetyAssessmentPage() {
  return (
    <PageLayout>
      {/* Non-printable header */}
      <section className="print:hidden bg-gradient-to-br from-teal-700 to-emerald-900 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-200">Free Resource</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">Safety Assessment Guide</h1>
          <p className="mt-4 text-lg text-emerald-100 max-w-2xl mx-auto">
            Not all indoor dog parks are created equal. Use this checklist to quickly assess if a facility is safe, clean, and well-managed before you unclip the leash.
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
            <div className="text-center mb-10 border-b-4 border-emerald-500 pb-6">
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Indoor Dog Park</h2>
              <h3 className="text-2xl font-bold text-emerald-500 uppercase tracking-widest mt-1">Safety Assessment</h3>
              <p className="text-slate-500 mt-2 font-medium italic">Provided by IndoorDogPark.org</p>
            </div>

            <div className="space-y-10">
              
              {/* Section 1 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <i className="bi bi-eye-fill text-xl"></i>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 uppercase">1. First Impressions (The Lobby)</h4>
                </div>
                <div className="space-y-4 pl-12">
                  <label className="flex items-start gap-4 cursor-pointer group print:break-inside-avoid">
                    <input type="checkbox" className="mt-1 h-6 w-6 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-lg group-hover:text-emerald-700">Cleanliness & Smell</span>
                      <span className="text-slate-600 text-sm">The facility should smell like cleaning supplies or fresh air, not overpowering urine or feces.</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-4 cursor-pointer group print:break-inside-avoid">
                    <input type="checkbox" className="mt-1 h-6 w-6 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-lg group-hover:text-emerald-700">Staff Presence</span>
                      <span className="text-slate-600 text-sm">Are there staff members actively monitoring the lobby, checking vaccines, and controlling the entry gates?</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Section 2 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                    <i className="bi bi-building-fill-check text-xl"></i>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 uppercase">2. Facility Structure</h4>
                </div>
                <div className="space-y-4 pl-12">
                  <label className="flex items-start gap-4 cursor-pointer group print:break-inside-avoid">
                    <input type="checkbox" className="mt-1 h-6 w-6 rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-lg group-hover:text-blue-700">Secure Double Gates</span>
                      <span className="text-slate-600 text-sm">Mandatory for entry/exit. There should be a "sally port" to prevent escape artists from bolting.</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-4 cursor-pointer group print:break-inside-avoid">
                    <input type="checkbox" className="mt-1 h-6 w-6 rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-lg group-hover:text-blue-700">Floor Material</span>
                      <span className="text-slate-600 text-sm">Look for non-slip flooring (like rubberized agility mats) or specialized, clean K9 turf. Hard, slippery concrete is a red flag for joint injuries.</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-4 cursor-pointer group print:break-inside-avoid">
                    <input type="checkbox" className="mt-1 h-6 w-6 rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-lg group-hover:text-blue-700">Separate Size Areas</span>
                      <span className="text-slate-600 text-sm">There must be strict physical separation and enforcement between Small/Shy dogs and Large/Active dogs.</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Section 3 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                    <i className="bi bi-people-fill text-xl"></i>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 uppercase">3. Dog Dynamics</h4>
                </div>
                <div className="space-y-4 pl-12">
                  <label className="flex items-start gap-4 cursor-pointer group print:break-inside-avoid">
                    <input type="checkbox" className="mt-1 h-6 w-6 rounded border-slate-300 text-amber-600 focus:ring-amber-600" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-lg group-hover:text-amber-700">Capacity Limits</span>
                      <span className="text-slate-600 text-sm">Does the space look overcrowded? Overcrowding drastically increases tension and the likelihood of fights.</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-4 cursor-pointer group print:break-inside-avoid">
                    <input type="checkbox" className="mt-1 h-6 w-6 rounded border-slate-300 text-amber-600 focus:ring-amber-600" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-lg group-hover:text-amber-700">Active Supervision</span>
                      <span className="text-slate-600 text-sm">Are staff or "park rangers" inside the play area actively redirecting dogs and enforcing rules, or are they just standing at a desk?</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-4 cursor-pointer group print:break-inside-avoid">
                    <input type="checkbox" className="mt-1 h-6 w-6 rounded border-slate-300 text-amber-600 focus:ring-amber-600" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-lg group-hover:text-amber-700">Healthy Play Styles</span>
                      <span className="text-slate-600 text-sm">Watch the dogs currently playing. Is the play mutual, bouncy, and taking turns? Unaddressed bullying is a warning sign.</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Section 4 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-700">
                    <i className="bi bi-bandaid-fill text-xl"></i>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 uppercase">4. Emergency Preparedness</h4>
                </div>
                <div className="space-y-4 pl-12">
                  <label className="flex items-start gap-4 cursor-pointer group print:break-inside-avoid">
                    <input type="checkbox" className="mt-1 h-6 w-6 rounded border-slate-300 text-rose-600 focus:ring-rose-600" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-lg group-hover:text-rose-700">Visible First Aid</span>
                      <span className="text-slate-600 text-sm">Look for visible pet first-aid kits and emergency protocol signs.</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-4 cursor-pointer group print:break-inside-avoid">
                    <input type="checkbox" className="mt-1 h-6 w-6 rounded border-slate-300 text-rose-600 focus:ring-rose-600" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-lg group-hover:text-rose-700">Staff Intervention Tools</span>
                      <span className="text-slate-600 text-sm">Do staff carry air horns, slip leads, or citronella spray to quickly and safely break up a scuffle?</span>
                    </div>
                  </label>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="mt-12 pt-6 border-t-2 border-slate-100 text-center text-slate-500 font-medium">
              Find the best indoor dog parks near you at <span className="text-emerald-500 font-bold">IndoorDogPark.org</span>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
