'use client';

import Link from 'next/link';
import { BoltIcon, SparklesIcon, ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function BlogSubscribe() {
  return (
    <div className="bg-gradient-to-b from-orange-50/80 via-white to-amber-50/60 rounded-2xl p-5 border-2 border-orange-200/90 shadow-lg shadow-orange-500/5 relative overflow-hidden">
      {/* Top Accent Pill */}
      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex items-center gap-1 bg-[#FF5722] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
          <BoltIcon className="w-3 h-3" />
          Interactive Tool
        </span>
        <span className="text-[11px] font-semibold text-orange-600 flex items-center gap-0.5">
          <SparklesIcon className="w-3.5 h-3.5" /> 100% Free
        </span>
      </div>

      {/* Title */}
      <h4 className="text-lg font-extrabold text-gray-900 mb-1.5 leading-tight">
        Dog Exercise Calculator
      </h4>

      <p className="text-xs text-gray-600 mb-4 leading-relaxed">
        Discover your dog&apos;s exact daily physical and mental exercise target based on age, breed size, and energy level.
      </p>

      {/* Mini Interactive Preview Tags */}
      <div className="grid grid-cols-3 gap-1.5 mb-4 text-center">
        <div className="bg-white border border-orange-200 py-1.5 px-1 rounded-lg text-[11px] font-bold text-gray-700 shadow-2xs">
          🐶 Puppy
        </div>
        <div className="bg-orange-100/70 border border-orange-300 py-1.5 px-1 rounded-lg text-[11px] font-bold text-[#FF5722] shadow-2xs">
          🐕 Adult
        </div>
        <div className="bg-white border border-orange-200 py-1.5 px-1 rounded-lg text-[11px] font-bold text-gray-700 shadow-2xs">
          🐾 Senior
        </div>
      </div>

      {/* Call to Action Button */}
      <Link
        href="/tools/dog-exercise-calculator"
        className="w-full bg-gradient-to-r from-[#FF5722] to-[#FF7043] hover:from-[#E64A19] hover:to-[#F4511E] text-white font-extrabold py-3 px-4 rounded-xl text-xs shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-1.5 transform hover:scale-[1.02]"
      >
        <span>Calculate Exercise Goal</span>
        <ArrowRightIcon className="w-3.5 h-3.5" />
      </Link>

      <p className="text-[10px] text-gray-400 text-center mt-2.5">
        ⚡ Takes only 30 seconds • Instant customized result
      </p>
    </div>
  );
}


