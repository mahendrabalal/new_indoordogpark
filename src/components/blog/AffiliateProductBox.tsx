import React from 'react';
import Link from 'next/link';
import { AffiliateProduct } from '@/lib/affiliate-products';

interface AffiliateProductBoxProps {
  product: AffiliateProduct;
  variant?: 'top' | 'bottom';
}

export default function AffiliateProductBox({ product, variant = 'top' }: AffiliateProductBoxProps) {
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.floor(product.rating));

  return (
    <aside
      aria-label={`Product Summary: ${product.productName}`}
      className="my-8 rounded-2xl border-2 border-amber-200/80 bg-gradient-to-b from-amber-50/40 via-white to-white p-6 md:p-8 shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 pb-5">
        <div>
          {product.badge && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-900 mb-2">
              <svg className="w-3.5 h-3.5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {product.badge}
            </span>
          )}
          <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
            {product.productName}
          </h3>
          <p className="text-sm text-gray-500 font-medium mt-0.5">By {product.brand}</p>
        </div>

        {/* Rating Score */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1">
            {stars.map((filled, idx) => (
              <svg
                key={idx}
                className={`w-5 h-5 ${filled ? 'text-amber-400 fill-current' : 'text-gray-300'}`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-1 text-sm font-bold text-gray-900">{product.rating} / 5.0</span>
          </div>
          <span className="text-xs text-gray-500 mt-0.5">({product.reviewCount} verified ratings)</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 text-base leading-relaxed my-5">
        {product.description}
      </p>

      {/* Features Grid */}
      {product.features && product.features.length > 0 && (
        <div className="mb-6 rounded-xl bg-gray-50 p-4 border border-gray-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">Key Highlights:</h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
            {product.features.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Best For Tag */}
      {product.bestFor && (
        <div className="mb-6 flex items-start gap-2 text-sm bg-blue-50/70 border border-blue-100 rounded-xl p-3.5 text-blue-900">
          <span className="font-bold flex-shrink-0">🎯 Best For:</span>
          <span>{product.bestFor}</span>
        </div>
      )}

      {/* CTA Buttons */}
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <a
          href={product.amazonUrl}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold px-7 py-3.5 text-base transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-amber-200"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
          <span>Check Current Price on Amazon</span>
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>

        <Link
          href="/cities"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-green-700 transition-colors py-2 px-3 rounded-lg hover:bg-gray-100"
        >
          <span>🐾 Find Indoor Dog Parks Near You →</span>
        </Link>
      </div>

      {/* Amazon Affiliate Legal Disclaimer */}
      <p className="mt-5 text-[11px] leading-normal text-gray-400 border-t border-gray-100 pt-3 italic">
        * As an Amazon Associate, we earn from qualifying purchases at no additional cost to you. Prices and availability are subject to change.
      </p>
    </aside>
  );
}
