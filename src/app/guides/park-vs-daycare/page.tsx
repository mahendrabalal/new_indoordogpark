import { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import PrintButton from '@/components/PrintButton';

export const metadata: Metadata = {
  title: 'Indoor Dog Park vs. Doggy Daycare | Comparison Guide',
  description: 'Download or print our free comparison guide to understand the differences between indoor dog parks and doggy daycares, and choose the right option for your pup.',
  keywords: ['indoor dog park vs daycare', 'dog daycare alternative', 'indoor dog park', 'dog daycare', 'dog play options'],
  alternates: {
    canonical: '/guides/park-vs-daycare',
  },
};

export default function ParkVsDaycarePage() {
  return (
    <PageLayout>
      {/* Non-printable header */}
      <section className="print:hidden bg-gradient-to-br from-sky-700 to-blue-900 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-200">Free Resource</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">Indoor Park vs. Daycare</h1>
          <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">
            Not sure which environment is right for your dog? Print this visual comparison guide to help you make the best choice.
          </p>
          <div className="mt-8">
            <PrintButton />
          </div>
        </div>
      </section>

      {/* The Printable Checklist Area */}
      <section className="bg-slate-50 py-12 print:bg-white print:py-0">
        <div className="mx-auto max-w-4xl px-4 print:max-w-none print:px-0">
          
          {/* Printable Container */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-12 shadow-xl print:shadow-none print:border-none print:p-0">
            
            {/* Header (Only visible in print or main container) */}
            <div className="text-center mb-10 border-b-4 border-sky-500 pb-6">
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Indoor Dog Park</h2>
              <div className="flex items-center justify-center gap-4 mt-2">
                <span className="text-xl font-bold text-slate-400 uppercase">VS</span>
                <h3 className="text-2xl font-bold text-sky-500 uppercase tracking-widest">Doggy Daycare</h3>
              </div>
              <p className="text-slate-500 mt-4 font-medium italic">Provided by IndoorDogPark.org</p>
            </div>

            <div className="space-y-8">
              
              {/* Section 1: Supervision */}
              <div className="print:break-inside-avoid">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                    <i className="bi bi-eye-fill text-xl"></i>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 uppercase">1. Supervision & Attendance</h4>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 pl-12">
                  <div className="bg-sky-50 p-6 rounded-2xl border border-sky-100">
                    <h5 className="font-black text-sky-800 uppercase mb-2 flex items-center gap-2">
                      <i className="bi bi-building"></i> Daycare
                    </h5>
                    <p className="text-slate-700"><strong>You drop off your dog.</strong> Facility staff are entirely responsible for watching, managing, and correcting your dog while you are at work or running errands.</p>
                  </div>
                  <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                    <h5 className="font-black text-emerald-800 uppercase mb-2 flex items-center gap-2">
                      <i className="bi bi-tree"></i> Indoor Park
                    </h5>
                    <p className="text-slate-700"><strong>You stay with your dog.</strong> You act as the primary supervisor, actively monitoring your dog's play, picking up their waste, and stepping in if they get overwhelmed.</p>
                  </div>
                </div>
              </div>

              {/* Section 2: Play Structure */}
              <div className="print:break-inside-avoid">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                    <i className="bi bi-clock-history text-xl"></i>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 uppercase">2. Structure & Routine</h4>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 pl-12">
                  <div className="bg-sky-50 p-6 rounded-2xl border border-sky-100">
                    <h5 className="font-black text-sky-800 uppercase mb-2 flex items-center gap-2">
                      <i className="bi bi-building"></i> Daycare
                    </h5>
                    <p className="text-slate-700"><strong>Highly structured.</strong> Good daycares enforce strict schedules including mandatory nap times, rotation groups, and structured enrichment activities.</p>
                  </div>
                  <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                    <h5 className="font-black text-emerald-800 uppercase mb-2 flex items-center gap-2">
                      <i className="bi bi-tree"></i> Indoor Park
                    </h5>
                    <p className="text-slate-700"><strong>Unstructured free play.</strong> Dogs socialize at their own pace. You decide when to arrive, when to take a water break, and when it's time to leave.</p>
                  </div>
                </div>
              </div>

              {/* Section 3: Requirements */}
              <div className="print:break-inside-avoid">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                    <i className="bi bi-card-checklist text-xl"></i>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 uppercase">3. Entry Requirements</h4>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 pl-12">
                  <div className="bg-sky-50 p-6 rounded-2xl border border-sky-100">
                    <h5 className="font-black text-sky-800 uppercase mb-2 flex items-center gap-2">
                      <i className="bi bi-building"></i> Daycare
                    </h5>
                    <p className="text-slate-700"><strong>Strict evaluations.</strong> Usually requires a scheduled "temperament test" or trial day. Dogs must be extremely tolerant of high-arousal group environments.</p>
                  </div>
                  <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                    <h5 className="font-black text-emerald-800 uppercase mb-2 flex items-center gap-2">
                      <i className="bi bi-tree"></i> Indoor Park
                    </h5>
                    <p className="text-slate-700"><strong>Basic checks.</strong> Usually only requires signing a waiver and uploading proof of current vaccinations (Rabies, DHPP, Bordetella). Drop-ins are welcome.</p>
                  </div>
                </div>
              </div>

              {/* Section 4: Cost */}
              <div className="print:break-inside-avoid">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                    <i className="bi bi-wallet2 text-xl"></i>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 uppercase">4. Cost & Commitment</h4>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 pl-12">
                  <div className="bg-sky-50 p-6 rounded-2xl border border-sky-100">
                    <h5 className="font-black text-sky-800 uppercase mb-2 flex items-center gap-2">
                      <i className="bi bi-building"></i> Daycare
                    </h5>
                    <p className="text-slate-700"><strong>Higher cost.</strong> You are paying for childcare-level supervision. Typically billed in full/half-day increments ($35-$60/day) or monthly packages.</p>
                  </div>
                  <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                    <h5 className="font-black text-emerald-800 uppercase mb-2 flex items-center gap-2">
                      <i className="bi bi-tree"></i> Indoor Park
                    </h5>
                    <p className="text-slate-700"><strong>Lower cost.</strong> You are only paying for access to the facility. Typically billed as a cheap daily drop-in pass ($10-$20) or an unlimited monthly membership.</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="mt-12 pt-6 border-t-2 border-slate-100 text-center text-slate-500 font-medium">
              Find the best indoor dog parks near you at <span className="text-sky-500 font-bold">IndoorDogPark.org</span>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
