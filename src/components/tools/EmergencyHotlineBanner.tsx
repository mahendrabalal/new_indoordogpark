'use client';

import React from 'react';

export interface EmergencyHotlineBannerProps {
  toolType?: 'chocolate' | 'general' | 'heatstroke';
  className?: string;
}

export default function EmergencyHotlineBanner({
  toolType = 'chocolate',
  className = '',
}: EmergencyHotlineBannerProps) {
  return (
    <div
      className={`bg-gradient-to-br from-red-600 via-rose-600 to-amber-700 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-red-400/30 my-8 ${className}`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-amber-200 border border-amber-300/30">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            24/7 Veterinary Emergency Hotlines
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white m-0">
            {toolType === 'chocolate'
              ? 'Suspect Acute Poisoning or High Toxicity?'
              : 'Immediate Pet Health Emergency?'}
          </h3>
          <p className="text-sm sm:text-base text-rose-100 leading-relaxed m-0">
            If your dog is experiencing severe symptoms (tremors, seizures, collapse, rapid breathing, or repeated vomiting), do not wait for symptoms to worsen. Call a certified veterinary toxicologist or visit your local emergency vet clinic immediately.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 flex-shrink-0">
          <a
            href="tel:18884264435"
            className="inline-flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-red-700 font-bold px-5 py-3.5 rounded-xl shadow-md transition-transform active:scale-95 text-sm sm:text-base text-center group"
          >
            <svg className="w-5 h-5 text-red-600 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-2.2 2.2a15.053 15.053 0 01-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1.01A11.36 11.36 0 018.57 3.9c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.52c0-.55-.45-1-1-1z" />
            </svg>
            <span>
              ASPCA Poison Control: <span className="underline decoration-red-300 underline-offset-2">(888) 426-4435</span>
            </span>
          </a>

          <a
            href="tel:18557647661"
            className="inline-flex items-center justify-center gap-3 bg-red-950/40 hover:bg-red-950/60 border border-red-300/40 text-white font-semibold px-5 py-3.5 rounded-xl transition-transform active:scale-95 text-sm sm:text-base text-center group"
          >
            <svg className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-2.2 2.2a15.053 15.053 0 01-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1.01A11.36 11.36 0 018.57 3.9c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.52c0-.55-.45-1-1-1z" />
            </svg>
            <span>
              Pet Poison Helpline: <span className="underline decoration-amber-300 underline-offset-2">(855) 764-7661</span>
            </span>
          </a>
        </div>
      </div>
      <p className="text-[11px] text-rose-200/80 mt-4 m-0">
        * National animal poison control hotlines operate 24/7/365 across the US and Canada. A standard consultation fee may apply for clinical triage.
      </p>
    </div>
  );
}
