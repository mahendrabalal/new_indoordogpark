'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { ParkSubmissionForm } from '@/types/park-submission';
// Step components
import BasicInfoStep from '@/components/listing/BasicInfoStep';
import LocationStep from '@/components/listing/LocationStep';
import ContactHoursStep from '@/components/listing/ContactHoursStep';
import AmenitiesStep from '@/components/listing/AmenitiesStep';
import PhotosPricingStep from '@/components/listing/PhotosPricingStep';
import ReviewSubmitStep from '@/components/listing/ReviewSubmitStep';

const STEPS = [
  { number: 1, title: 'Basic Info', description: 'Tell us about your dog park' },
  { number: 2, title: 'Location', description: 'Where is your park located?' },
  { number: 3, title: 'Contact & Hours', description: 'How can people reach you?' },
  { number: 4, title: 'Amenities', description: 'What features does your park have?' },
  { number: 5, title: 'Photos & Pricing', description: 'Show off your park' },
  { number: 6, title: 'Review & Submit', description: 'Choose your listing plan' },
];

export default function ListPropertyPage() {
  const router = useRouter();
  const { user, loading, getSessionTokens } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ParkSubmissionForm>(() => {
    // Load from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('parkSubmissionDraft');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return getInitialFormData();
        }
      }
    }
    return getInitialFormData();
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/list-your-park');
    }
  }, [user, loading, router]);

  // Save draft to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('parkSubmissionDraft', JSON.stringify(formData));
    }
  }, [formData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading state while redirecting to login
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const updateFormData = (data: Partial<ParkSubmissionForm>) => {
    setFormData(prev => ({ ...prev, ...data }));
    setErrors({});
  };

  const nextStep = () => {
    const stepErrors = validateCurrentStep();
    if (Object.keys(stepErrors).length === 0) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setErrors(stepErrors);
    }
  };

  const previousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const validateCurrentStep = (): Record<string, string> => {
    const stepErrors: Record<string, string> = {};

    switch (currentStep) {
      case 1:
        if (!formData.name?.trim()) stepErrors.name = 'Park name is required';
        if (!formData.businessType) stepErrors.businessType = 'Business type is required';
        if (!formData.description || formData.description.length < 50) {
          stepErrors.description = 'Description must be at least 50 characters';
        }
        break;

      case 2:
        if (!formData.city?.trim()) stepErrors.city = 'City is required';
        if (!formData.state) stepErrors.state = 'State is required';
        break;

      case 3:
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          stepErrors.email = 'Invalid email format';
        }
        break;

      // Steps 4, 5, and 6 are optional or have their own validation
    }

    return stepErrors;
  };

  const handleSubmit = async (listingType: 'free' | 'featured') => {
    setIsSubmitting(true);
    setErrors({});

    try {
      const { accessToken, refreshToken } = await getSessionTokens();
      const authHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...(refreshToken ? { 'x-refresh-token': refreshToken } : {}),
      };

      // Submit the park listing
      const response = await fetch('/api/parks/submit', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ ...formData, listingType }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          throw new Error(data.error || 'Submission failed');
        }
        setIsSubmitting(false);
        return;
      }

      // Clear draft from localStorage
      localStorage.removeItem('parkSubmissionDraft');

      // If featured listing, redirect to checkout
      if (listingType === 'featured') {
        const checkoutResponse = await fetch('/api/stripe/create-checkout', {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({ submissionId: data.submission.id }),
        });

        const checkoutData = await checkoutResponse.json();

        if (!checkoutResponse.ok) {
          throw new Error(checkoutData.error || 'Failed to create checkout session');
        }

        // Redirect to Stripe Checkout
        window.location.href = checkoutData.url;
      } else {
        // Free listing - redirect to dashboard
        router.push('/dashboard?submitted=true');
      }

    } catch (error) {
      console.error('Submission error:', error);
      const message = error instanceof Error ? error.message : 'Failed to submit listing';
      setErrors({ submit: message });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">List Your Dog Park</h1>
          <p className="text-lg text-gray-600">Share your park with dog lovers across California</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      currentStep >= step.number
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step.number}
                  </div>
                  <div className="text-xs mt-2 text-center hidden sm:block">
                    <div className="font-medium">{step.title}</div>
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 ${
                      currentStep > step.number ? 'bg-purple-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{STEPS[currentStep - 1].title}</h2>
          <p className="text-gray-600 mb-6">{STEPS[currentStep - 1].description}</p>

          {/* Step Content */}
          {currentStep === 1 && (
            <BasicInfoStep
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          )}
          {currentStep === 2 && (
            <LocationStep
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          )}
          {currentStep === 3 && (
            <ContactHoursStep
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          )}
          {currentStep === 4 && (
            <AmenitiesStep
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          )}
          {currentStep === 5 && (
            <PhotosPricingStep
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          )}
          {currentStep === 6 && (
            <ReviewSubmitStep
              formData={formData}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              errors={errors}
            />
          )}

          {/* Navigation Buttons */}
          {currentStep < 6 && (
            <div className="flex justify-between mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={previousStep}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-lg font-medium ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Previous
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
              >
                {currentStep === STEPS.length - 1 ? 'Review' : 'Next'}
              </button>
            </div>
          )}

          {currentStep === 6 && (
            <div className="flex justify-start mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={previousStep}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
              >
                Previous
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getInitialFormData(): ParkSubmissionForm {
  return {
    name: '',
    businessType: '',
    description: '',
    city: '',
    state: 'California',
    amenities: {},
    socialMedia: {},
    openingHours: {},
    hours24x7: false,
    pricingInfo: { isFree: true },
    photos: [],
    petFriendlyFeatures: [],
  };
}
