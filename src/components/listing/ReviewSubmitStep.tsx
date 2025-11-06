import { useState } from 'react';
import type { ParkSubmissionForm } from '@/types/park-submission';

interface ReviewSubmitStepProps {
  formData: ParkSubmissionForm;
  onSubmit: (listingType: 'free' | 'featured') => Promise<void>;
  isSubmitting: boolean;
  errors: Record<string, string>;
}

export default function ReviewSubmitStep({ formData, onSubmit, isSubmitting, errors }: ReviewSubmitStepProps) {
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'featured' | null>(null);

  const handleSubmit = async () => {
    if (!selectedPlan) {
      alert('Please select a listing plan');
      return;
    }
    await onSubmit(selectedPlan);
  };

  return (
    <div className="space-y-8">
      {/* Review Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Your Listing</h3>
        <div className="space-y-3 text-sm">
          <div>
            <span className="font-medium text-gray-700">Park Name:</span>{' '}
            <span className="text-gray-900">{formData.name}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Type:</span>{' '}
            <span className="text-gray-900">{formData.businessType}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Location:</span>{' '}
            <span className="text-gray-900">{formData.city}, {formData.state}</span>
          </div>
          {formData.phone && (
            <div>
              <span className="font-medium text-gray-700">Phone:</span>{' '}
              <span className="text-gray-900">{formData.phone}</span>
            </div>
          )}
          {formData.email && (
            <div>
              <span className="font-medium text-gray-700">Email:</span>{' '}
              <span className="text-gray-900">{formData.email}</span>
            </div>
          )}
          {formData.photos && formData.photos.length > 0 && (
            <div>
              <span className="font-medium text-gray-700">Photos:</span>{' '}
              <span className="text-gray-900">{formData.photos.length} photo(s)</span>
            </div>
          )}
        </div>
      </div>

      {/* Pricing Plans */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Listing Plan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Plan */}
          <div
            onClick={() => setSelectedPlan('free')}
            className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
              selectedPlan === 'free'
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {selectedPlan === 'free' && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}

            <div className="mb-4">
              <h4 className="text-2xl font-bold text-gray-900">Free</h4>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                $0<span className="text-lg font-normal text-gray-600">/month</span>
              </p>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-700">Basic listing on the platform</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-700">Appears in search results</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-700">Shows on map</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-700">Pending admin approval</span>
              </li>
            </ul>

            <button
              type="button"
              onClick={() => setSelectedPlan('free')}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                selectedPlan === 'free'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {selectedPlan === 'free' ? 'Selected' : 'Select Free'}
            </button>
          </div>

          {/* Featured Plan */}
          <div
            onClick={() => setSelectedPlan('featured')}
            className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
              selectedPlan === 'featured'
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="absolute top-0 right-6 transform -translate-y-1/2">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold">
                RECOMMENDED
              </span>
            </div>

            {selectedPlan === 'featured' && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}

            <div className="mb-4 mt-4">
              <h4 className="text-2xl font-bold text-gray-900">Featured</h4>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                $9.99<span className="text-lg font-normal text-gray-600">/month</span>
              </p>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-700">Everything in Free plan</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-purple-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <span className="text-sm font-semibold text-gray-900">Featured section on homepage</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-purple-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <span className="text-sm font-semibold text-gray-900">Priority in search results</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-purple-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <span className="text-sm font-semibold text-gray-900">Featured badge on listing</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-purple-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <span className="text-sm font-semibold text-gray-900">Highlighted on map</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-700">Cancel anytime</span>
              </li>
            </ul>

            <button
              type="button"
              onClick={() => setSelectedPlan('featured')}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                selectedPlan === 'featured'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
              }`}
            >
              {selectedPlan === 'featured' ? 'Selected' : 'Select Featured'}
            </button>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6 border-t">
        {errors.submit && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{errors.submit}</p>
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!selectedPlan || isSubmitting}
          className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors ${
            !selectedPlan || isSubmitting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : selectedPlan === 'featured' ? (
            'Submit & Continue to Payment'
          ) : (
            'Submit Listing for Review'
          )}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          By submitting, you agree to our terms of service and listing guidelines.
          {selectedPlan === 'free' && ' Your listing will be reviewed by our team before going live.'}
          {selectedPlan === 'featured' && ' You\'ll be redirected to Stripe to complete your payment.'}
        </p>
      </div>
    </div>
  );
}
