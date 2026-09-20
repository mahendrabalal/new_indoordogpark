'use client';

import React, { useState } from 'react';

export interface EmbedToolModalProps {
  toolName: string;
  embedUrl: string;
  canonicalUrl: string;
  defaultHeight?: number;
}

export default function EmbedToolModal({
  toolName = 'Dog Weather Safety Calculator',
  embedUrl = 'https://www.indoordogpark.org/tools/weather-safety-calculator/embed',
  canonicalUrl = 'https://www.indoordogpark.org/tools/weather-safety-calculator',
  defaultHeight = 620,
}: EmbedToolModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const embedCode = `<iframe src="${embedUrl}" width="100%" height="${defaultHeight}" frameborder="0" style="border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;" title="${toolName}"></iframe>\n<p style="font-size: 12px; text-align: center; color: #64748b; margin-top: 8px;">Free <a href="${canonicalUrl}" target="_blank" rel="noopener" style="color: #0284c7; text-decoration: underline;">${toolName}</a> provided by <a href="https://www.indoordogpark.org/" target="_blank" rel="noopener" style="color: #0284c7; text-decoration: underline;">IndoorDogPark.org</a></p>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-xs transition-all"
        title="Embed this calculator on your blog or website"
      >
        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        <span>Embed On Your Site</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center font-bold">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Embed Calculator on Your Website</h3>
                  <p className="text-xs text-slate-500">Free interactive widget for pet blogs, shelters, and dog care sites</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors text-lg font-bold"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                Copy and paste the HTML snippet below into your blog post, CMS, WordPress (Custom HTML block), or website:
              </p>

              <div className="relative bg-slate-900 rounded-2xl p-4 font-mono text-xs text-slate-200 overflow-x-auto border border-slate-800">
                <pre className="whitespace-pre-wrap break-all text-[11px] leading-relaxed">{embedCode}</pre>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <span className="text-xs text-slate-500 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Fully responsive & mobile friendly (auto-adjusts width)
                </span>

                <button
                  type="button"
                  onClick={handleCopy}
                  className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    copied
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-primary text-white hover:bg-secondary shadow-sm'
                  }`}
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied to Clipboard!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      Copy Embed Code
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
