'use client';

import Link from 'next/link';
import { useCallback } from 'react';

type ListingPlan = 'free' | 'featured';

interface PlanSelectionStepProps {
  onSelectPlan: (plan: ListingPlan) => void;
  isLoggedIn?: boolean;
}

export default function PlanSelectionStep({ onSelectPlan, isLoggedIn = false }: PlanSelectionStepProps) {
  const handleFreePlanSelect = useCallback(() => {
    onSelectPlan('free');
  }, [onSelectPlan]);

  const handleFeaturedPlanSelect = useCallback(() => {
    onSelectPlan('featured');
  }, [onSelectPlan]);

  const handleKeyDown = useCallback(
    (plan: ListingPlan) => (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onSelectPlan(plan);
      }
    },
    [onSelectPlan]
  );

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Listing Plan</h2>
        <p className="text-gray-600">
          Select the plan that works best for your dog park. You can always upgrade later.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" role="radiogroup" aria-label="Listing plan selection">
        {/* Free Plan */}
        <article
          role="radio"
          aria-checked="false"
          tabIndex={0}
          onClick={handleFreePlanSelect}
          onKeyDown={handleKeyDown('free')}
          className="relative border-2 rounded-lg p-6 cursor-pointer transition-all hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 border-gray-200"
          aria-label="Free listing plan"
        >
          <div className="mb-4">
            <h4 className="text-2xl font-bold text-gray-900">Free Listing</h4>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              $0<span className="text-lg font-normal text-gray-600">/month</span>
            </p>
          </div>

          <ul className="space-y-3 mb-6">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-gray-700">Basic listing on the platform</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-gray-700">Appears in search results</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-gray-700">Shows on map</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-gray-700">Pending admin approval</span>
            </li>
          </ul>

          <button
            type="button"
            onClick={handleFreePlanSelect}
            className="w-full py-3 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
            aria-label="Select free listing plan"
          >
            Choose Free Listing
          </button>
        </article>

        {/* Featured Plan */}
        <article
          role="radio"
          aria-checked="false"
          tabIndex={0}
          onClick={handleFeaturedPlanSelect}
          onKeyDown={handleKeyDown('featured')}
          className="relative border-2 rounded-lg p-6 cursor-pointer transition-all hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 border-purple-300 bg-purple-50"
          aria-label="Premium featured listing plan"
        >
          <div className="absolute top-0 right-6 transform -translate-y-1/2">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold">
              RECOMMENDED
            </span>
          </div>

          <div className="mb-4 mt-4">
            <h4 className="text-2xl font-bold text-gray-900">Premium / Featured</h4>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              $9.99<span className="text-lg font-normal text-gray-600">/month</span>
            </p>
          </div>

          <ul className="space-y-3 mb-6">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-gray-700">Everything in Free plan</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span className="text-sm font-semibold text-gray-900">Featured section on homepage</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span className="text-sm font-semibold text-gray-900">Priority in search results</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span className="text-sm font-semibold text-gray-900">Featured badge on listing</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span className="text-sm font-semibold text-gray-900">Highlighted on map</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-gray-700">Cancel anytime</span>
            </li>
          </ul>

          <button
            type="button"
            onClick={handleFeaturedPlanSelect}
            className="w-full py-3 rounded-lg font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
            aria-label="Select premium featured listing plan"
          >
            Choose Premium Listing
          </button>
        </article>
      </div>

      {!isLoggedIn && (
        <footer className="text-center pt-4 border-t">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              href="/login?redirect=/list-your-park"
              className="text-purple-600 hover:text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded font-medium"
            >
              Sign in
            </Link>
          </p>
        </footer>
      )}
    </div>
  );
}

