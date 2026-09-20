'use client';

import React from 'react';

export interface VeterinaryReviewBylineProps {
  title?: string;
  subtitle?: string;
  evidenceBase?: string;
  reviewDate?: string;
  badgeLabel?: string;
  className?: string;
}

export default function VeterinaryReviewByline({
  title = 'Evidence-Based Veterinary Guidelines',
  subtitle = 'Clinical thresholds & protocols compiled from published veterinary standards',
  evidenceBase = 'ASPCA APCC & WSAVA Clinical Standards',
  reviewDate = 'Updated August 2026',
  badgeLabel = 'Evidence-Based Guidelines',
  className = '',
}: VeterinaryReviewBylineProps) {
  return (
    <div
      className={`bg-white border border-emerald-100 rounded-2xl p-4 sm:p-5 shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${className}`}
    >
      <div className="flex items-start sm:items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 border border-emerald-200">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
              <svg className="w-3 h-3 text-emerald-700" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {badgeLabel}
            </span>
            <span className="text-xs text-slate-500">{reviewDate}</span>
          </div>
          <p className="text-sm font-bold text-slate-900 mt-1 mb-0.5">
            {title}
          </p>
          <p className="text-xs text-slate-500 m-0">
            {subtitle} · <span className="text-emerald-700 font-semibold">{evidenceBase}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:self-center self-start text-xs text-slate-500 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2">
        <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Peer-Reviewed Standards</span>
      </div>
    </div>
  );
}
