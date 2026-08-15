'use client';

import Link from 'next/link';
import { BoltIcon, SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function BlogSubscribe() {
  return (
    <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 rounded-xl p-5 text-white shadow-md border border-indigo-700/50">
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-yellow-400 text-indigo-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
          Free Interactive Tool
        </span>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <BoltIcon className="w-5 h-5 text-yellow-300 flex-shrink-0" />
        <h4 className="text-base font-bold text-white leading-snug">
          Dog Exercise Calculator
        </h4>
      </div>

      <p className="text-xs text-indigo-200 mb-4 leading-relaxed">
        How much daily exercise does your dog actually need? Calculate their custom physical &amp; mental activity target in 30 seconds.
      </p>

      <Link
        href="/tools/dog-exercise-calculator"
        className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-indigo-950 font-extrabold py-2.5 px-4 rounded-lg text-xs shadow transition-all flex items-center justify-center gap-1.5 transform hover:scale-[1.02]"
      >
        <span>Calculate Your Dog&apos;s Goal</span>
        <ArrowRightIcon className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

