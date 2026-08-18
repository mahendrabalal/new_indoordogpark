import { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import PrintButton from '@/components/PrintButton';

export const metadata: Metadata = {
  title: { absolute: 'Dog Body Language at the Park | Visual Guide' },
  description: 'Learn how to read your dog\'s body language to ensure safe, mutual play at the indoor dog park. Download our free quick-reference poster.',
  keywords: ['dog body language', 'dog park safety', 'reading dog body language', 'is my dog playing', 'dog behavior'],
  alternates: {
    canonical: '/guides/body-language',
  },
};

export default function BodyLanguagePage() {
  return (
    <PageLayout>
      {/* Non-printable header */}
      <section className="print:hidden bg-gradient-to-br from-amber-600 to-orange-800 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-200">Free Resource</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">Dog Body Language Guide</h1>
          <p className="mt-4 text-lg text-orange-100 max-w-2xl mx-auto">
            Not sure if they are playing or fighting? Print this visual guide to understand green flags (play) vs. red flags (tension).
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
            <div className="text-center mb-10 border-b-4 border-amber-500 pb-6">
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Indoor Dog Park</h2>
              <div className="flex items-center justify-center gap-4 mt-2">
                <span className="text-xl font-bold text-slate-400 uppercase">Body Language</span>
                <h3 className="text-2xl font-bold text-amber-500 uppercase tracking-widest">Quick Reference</h3>
              </div>
              <p className="text-slate-500 mt-4 font-medium italic">Provided by IndoorDogPark.org</p>
            </div>

            <div className="space-y-8">
              
              {/* Section 1: Posture & Stance */}
              <div className="print:break-inside-avoid">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                    <i className="bi bi-person-arms-up text-xl"></i>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 uppercase">1. Posture & Stance</h4>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 pl-12">
                  <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                    <h5 className="font-black text-emerald-800 uppercase mb-2 flex items-center gap-2">
                      <i className="bi bi-check-circle-fill"></i> Playful (Green Flag)
                    </h5>
                    <p className="text-slate-700">Loose, wiggly body. Noticeable "play bows" (front end down, rear end up). Bouncy, exaggerated movements that switch back and forth.</p>
                  </div>
                  <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
                    <h5 className="font-black text-rose-800 uppercase mb-2 flex items-center gap-2">
                      <i className="bi bi-exclamation-triangle-fill"></i> Tense (Red Flag)
                    </h5>
                    <p className="text-slate-700">Stiff, rigid body with weight shifted forward. Suddenly freezing in place when approached by another dog.</p>
                  </div>
                </div>
              </div>

              {/* Section 2: Tail Position */}
              <div className="print:break-inside-avoid">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                    <i className="bi bi-arrow-left-right text-xl"></i>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 uppercase">2. Tail Position</h4>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 pl-12">
                  <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                    <h5 className="font-black text-emerald-800 uppercase mb-2 flex items-center gap-2">
                      <i className="bi bi-check-circle-fill"></i> Playful (Green Flag)
                    </h5>
                    <p className="text-slate-700">Broad, sweeping wags that often involve the entire rear end. Tail is held at a neutral or slightly elevated level.</p>
                  </div>
                  <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
                    <h5 className="font-black text-rose-800 uppercase mb-2 flex items-center gap-2">
                      <i className="bi bi-exclamation-triangle-fill"></i> Tense (Red Flag)
                    </h5>
                    <p className="text-slate-700">Tail tucked tight under the belly (fear), or stiffly flagged straight up and vibrating at the tip (over-arousal or aggression).</p>
                  </div>
                </div>
              </div>

              {/* Section 3: Facial Expressions */}
              <div className="print:break-inside-avoid">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                    <i className="bi bi-emoji-smile text-xl"></i>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 uppercase">3. Facial Expressions</h4>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 pl-12">
                  <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                    <h5 className="font-black text-emerald-800 uppercase mb-2 flex items-center gap-2">
                      <i className="bi bi-check-circle-fill"></i> Playful (Green Flag)
                    </h5>
                    <p className="text-slate-700">Soft eyes (almond shaped), relaxed ears, and an open mouth (often looking like a "doggy smile" with the tongue lolling out).</p>
                  </div>
                  <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
                    <h5 className="font-black text-rose-800 uppercase mb-2 flex items-center gap-2">
                      <i className="bi bi-exclamation-triangle-fill"></i> Tense (Red Flag)
                    </h5>
                    <p className="text-slate-700">Hard staring ("whale eye" where the whites of the eyes show). Ears pinned completely flat back. Tight closed mouth or rapid lip licking.</p>
                  </div>
                </div>
              </div>

              {/* Section 4: Vocalizations */}
              <div className="print:break-inside-avoid">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                    <i className="bi bi-megaphone-fill text-xl"></i>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 uppercase">4. Vocalizations</h4>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 pl-12">
                  <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                    <h5 className="font-black text-emerald-800 uppercase mb-2 flex items-center gap-2">
                      <i className="bi bi-check-circle-fill"></i> Playful (Green Flag)
                    </h5>
                    <p className="text-slate-700">High-pitched, exaggerated sneezes (this is a dog's way of saying "I'm just playing!"). Soft grunts, play growls, or bouncy barks.</p>
                  </div>
                  <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
                    <h5 className="font-black text-rose-800 uppercase mb-2 flex items-center gap-2">
                      <i className="bi bi-exclamation-triangle-fill"></i> Tense (Red Flag)
                    </h5>
                    <p className="text-slate-700">Low, continuous rumbling growl accompanied by a stiff body. Sharp, high-pitched yelps of pain or fear. Snarling with bared teeth.</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="mt-12 pt-6 border-t-2 border-slate-100 text-center text-slate-500 font-medium">
              Find the best indoor dog parks near you at <span className="text-amber-500 font-bold">IndoorDogPark.org</span>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
