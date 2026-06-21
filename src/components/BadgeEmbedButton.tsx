'use client';

import { useState } from 'react';

interface BadgeEmbedButtonProps {
  parkSlug: string;
  parkName: string;
}

export default function BadgeEmbedButton({ parkSlug, parkName }: BadgeEmbedButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Use the canonical domain if NEXT_PUBLIC_SITE_URL isn't available
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indoordogpark.org';
  const badgeUrl = `${baseUrl}/images/badge-featured.svg`;
  const parkUrl = `${baseUrl}/parks/${parkSlug}`;

  const embedCode = `<a href="${parkUrl}" target="_blank" rel="noopener noreferrer"><img src="${badgeUrl}" alt="Featured on IndoorDogPark.org 2026" width="182" height="210" style="border:none;" /></a>`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="mt-4 sm:mt-0 inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition-colors w-full sm:w-auto"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        Get Your Free Badge
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" onClick={() => setIsOpen(false)}></div>

          <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg font-semibold leading-6 text-gray-900" id="modal-title">
                    Your Free Directory Badge
                  </h3>
                  <div className="mt-2 text-sm text-gray-500 mb-4">
                    Add this badge to your website footer, sidebar, or &quot;About&quot; page. It works like a TripAdvisor or Yelp sticker — a quick trust signal that tells customers you&apos;re part of a verified directory. Copy the HTML below and paste it anywhere on your site.
                  </div>
                  
                  <div className="flex justify-center items-center my-6 bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-xl border border-slate-700 shadow-inner">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/images/badge-featured.svg?v=${Date.now()}`}
                      alt="Featured on IndoorDogPark.org 2026 badge preview"
                      width={182}
                      height={210}
                      className="drop-shadow-2xl"
                    />
                  </div>

                  <div className="mt-4">
                    <label htmlFor="embed-code" className="block text-sm font-medium text-gray-700 mb-2">HTML Embed Code</label>
                    <div className="relative">
                      <textarea
                        id="embed-code"
                        rows={4}
                        readOnly
                        className="block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm font-mono text-xs p-3 text-gray-600 border"
                        value={embedCode}
                      />
                      <button
                        onClick={copyToClipboard}
                        className={`absolute bottom-3 right-3 rounded px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors ${copied ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-800 hover:bg-gray-700'}`}
                      >
                        {copied ? 'Copied!' : 'Copy Code'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-200">
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
