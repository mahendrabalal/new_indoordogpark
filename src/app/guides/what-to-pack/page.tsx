import { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import PrintButton from '@/components/PrintButton';

export const metadata: Metadata = {
  title: 'What to Pack for an Indoor Dog Park | Checklist',
  description: 'Download or print our free indoor dog park packing list. Don\'t forget these essentials before your next visit to the indoor park.',
  keywords: ['dog park packing list', 'what to bring to dog park', 'indoor dog park essentials', 'dog park checklist', 'first time dog park'],
  alternates: {
    canonical: '/guides/what-to-pack',
  },
};

export default function WhatToPackPage() {
  return (
    <PageLayout>
      {/* Non-printable header */}
      <section className="print:hidden bg-gradient-to-br from-pink-700 to-rose-900 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-pink-200">Free Resource</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">Indoor Dog Park Packing Checklist</h1>
          <p className="mt-4 text-lg text-rose-100 max-w-2xl mx-auto">
            Make sure you have everything you need for a stress-free trip. Print this checklist and keep it by the door!
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
            <div className="text-center mb-10 border-b-4 border-rose-500 pb-6">
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Indoor Dog Park</h2>
              <h3 className="text-2xl font-bold text-rose-500 uppercase tracking-widest mt-1">Packing Checklist</h3>
              <p className="text-slate-500 mt-2 font-medium italic">Provided by IndoorDogPark.org</p>
            </div>

            <div className="space-y-10">
              
              {/* Section 1 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <i className="bi bi-star-fill text-xl"></i>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 uppercase">1. The Absolute Essentials</h4>
                </div>
                <div className="space-y-4 pl-12">
                  <label className="flex items-start gap-4 cursor-pointer group print:break-inside-avoid">
                    <input type="checkbox" className="mt-1 h-6 w-6 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-lg group-hover:text-emerald-700">Proof of Vaccinations</span>
                      <span className="text-slate-600 text-sm">Physical paper or a digital copy on your phone (Rabies, DHPP, Bordetella).</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-4 cursor-pointer group print:break-inside-avoid">
                    <input type="checkbox" className="mt-1 h-6 w-6 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-lg group-hover:text-emerald-700">Flat Collar or Harness</span>
                      <span className="text-slate-600 text-sm">With up-to-date ID tags attached. No prong or choke collars allowed.</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-4 cursor-pointer group print:break-inside-avoid">
                    <input type="checkbox" className="mt-1 h-6 w-6 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-lg group-hover:text-emerald-700">Standard 6-Foot Leash</span>
                      <span className="text-slate-600 text-sm">No retractable (flexi) leashes. They are dangerous in crowded lobbies.</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Section 2 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                    <i className="bi bi-droplet-fill text-xl"></i>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 uppercase">2. Comfort & Cleanup</h4>
                </div>
                <div className="space-y-4 pl-12">
                  <label className="flex items-start gap-4 cursor-pointer group print:break-inside-avoid">
                    <input type="checkbox" className="mt-1 h-6 w-6 rounded border-slate-300 text-sky-600 focus:ring-sky-600" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-lg group-hover:text-sky-700">Poop Bags</span>
                      <span className="text-slate-600 text-sm">Parks usually provide them, but always bring a backup roll just in case.</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-4 cursor-pointer group print:break-inside-avoid">
                    <input type="checkbox" className="mt-1 h-6 w-6 rounded border-slate-300 text-sky-600 focus:ring-sky-600" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-lg group-hover:text-sky-700">Small Microfiber Towel</span>
                      <span className="text-slate-600 text-sm">To wipe off drool or clean paws if your dog stepped in a puddle before entering.</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-4 cursor-pointer group print:break-inside-avoid">
                    <input type="checkbox" className="mt-1 h-6 w-6 rounded border-slate-300 text-sky-600 focus:ring-sky-600" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-lg group-hover:text-sky-700">Collapsible Water Bowl</span>
                      <span className="text-slate-600 text-sm">If your dog is hesitant to drink from communal water fountains.</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Section 3 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                    <i className="bi bi-person-check-fill text-xl"></i>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 uppercase">3. For The Human</h4>
                </div>
                <div className="space-y-4 pl-12">
                  <label className="flex items-start gap-4 cursor-pointer group print:break-inside-avoid">
                    <input type="checkbox" className="mt-1 h-6 w-6 rounded border-slate-300 text-violet-600 focus:ring-violet-600" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-lg group-hover:text-violet-700">Clean Indoor Shoes</span>
                      <span className="text-slate-600 text-sm">Some turf parks ask you to wipe your shoes or wear clean ones to protect the grass.</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-4 cursor-pointer group print:break-inside-avoid">
                    <input type="checkbox" className="mt-1 h-6 w-6 rounded border-slate-300 text-violet-600 focus:ring-violet-600" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-lg group-hover:text-violet-700">Fanny Pack or Crossbody Bag</span>
                      <span className="text-slate-600 text-sm">To keep your hands completely free while supervising your dog.</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-4 cursor-pointer group print:break-inside-avoid">
                    <input type="checkbox" className="mt-1 h-6 w-6 rounded border-slate-300 text-violet-600 focus:ring-violet-600" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-lg group-hover:text-violet-700">ID / Membership Card</span>
                      <span className="text-slate-600 text-sm">If the park requires a day pass or membership check-in.</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Section 4 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-700">
                    <i className="bi bi-x-octagon-fill text-xl"></i>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 uppercase">4. Leave At Home (Do NOT Bring)</h4>
                </div>
                <div className="space-y-4 pl-12">
                  <label className="flex items-start gap-4 cursor-pointer group print:break-inside-avoid">
                    <input type="checkbox" className="mt-1 h-6 w-6 rounded border-slate-300 text-rose-600 focus:ring-rose-600" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-lg group-hover:text-rose-700 line-through text-slate-500">Squeaky Toys & Tennis Balls</span>
                      <span className="text-slate-600 text-sm">High-value toys can trigger resource guarding and fights between strange dogs.</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-4 cursor-pointer group print:break-inside-avoid">
                    <input type="checkbox" className="mt-1 h-6 w-6 rounded border-slate-300 text-rose-600 focus:ring-rose-600" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-lg group-hover:text-rose-700 line-through text-slate-500">Treats & Food</span>
                      <span className="text-slate-600 text-sm">Most parks ban food entirely. If allowed for training, it must be kept hidden.</span>
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
