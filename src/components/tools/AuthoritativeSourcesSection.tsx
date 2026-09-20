'use client';

import React from 'react';

export interface CitationItem {
  organization: string;
  title: string;
  sourceUrl?: string;
  description?: string;
}

export interface AuthoritativeSourcesSectionProps {
  toolName: string;
  citations: CitationItem[];
  className?: string;
}

export default function AuthoritativeSourcesSection({
  toolName,
  citations,
  className = '',
}: AuthoritativeSourcesSectionProps) {
  return (
    <section className={`bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 mt-12 not-prose ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 m-0">
            Authoritative Veterinary References & Clinical Guidelines
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 m-0">
            The formulas and clinical thresholds in this {toolName} are derived from peer-reviewed veterinary literature and guidelines from accredited institutions:
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {citations.map((cite, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-colors shadow-2xs flex flex-col justify-between"
          >
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md inline-block mb-1.5">
                {cite.organization}
              </span>
              <h4 className="text-sm font-bold text-slate-900 leading-snug m-0">
                {cite.title}
              </h4>
              {cite.description && (
                <p className="text-xs text-slate-600 mt-1 mb-2 leading-relaxed">
                  {cite.description}
                </p>
              )}
            </div>
            {cite.sourceUrl && (
              <a
                href={cite.sourceUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 mt-2 pt-2 border-t border-slate-100"
              >
                <span>View Clinical Reference</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
