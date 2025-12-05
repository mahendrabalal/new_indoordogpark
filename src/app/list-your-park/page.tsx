'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { ParkSubmissionForm } from '@/types/park-submission';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
// Step components
import PlanSelectionStep from '@/components/listing/PlanSelectionStep';
import BasicInfoStep from '@/components/listing/BasicInfoStep';
import LocationStep from '@/components/listing/LocationStep';
import ContactHoursStep from '@/components/listing/ContactHoursStep';
import AmenitiesStep from '@/components/listing/AmenitiesStep';
import PhotosPricingStep from '@/components/listing/PhotosPricingStep';
import ReviewSubmitStep from '@/components/listing/ReviewSubmitStep';
import NewsletterForm from '@/components/NewsletterForm';

const STEPS = [
  { number: 0, title: 'Choose Plan', description: 'Select your listing plan' },
  { number: 1, title: 'Basic Info', description: 'Tell us about your dog park' },
  { number: 2, title: 'Location', description: 'Where is your park located?' },
  { number: 3, title: 'Contact & Hours', description: 'How can people reach you?' },
  { number: 4, title: 'Amenities', description: 'What features does your park have?' },
  { number: 5, title: 'Photos & Pricing', description: 'Show off your park' },
  { number: 6, title: 'Review & Submit', description: 'Review and submit your listing' },
];

export default function ListPropertyPage() {
  const router = useRouter();
  const { user, loading, getSessionTokens } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'featured' | null>(null);
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

  // Load selected plan and step from URL params if available (coming back from login)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check URL params (in case user came back from login)
      const urlParams = new URLSearchParams(window.location.search);
      const planParam = urlParams.get('plan');
      const stepParam = urlParams.get('step');

      if (planParam === 'free' || planParam === 'featured') {
        setSelectedPlan(planParam);
        // Restore to saved step (usually step 6 review page) or default to step 1
        const savedStep = stepParam ? parseInt(stepParam, 10) : 6;
        setCurrentStep(savedStep >= 1 && savedStep <= 6 ? savedStep : 6);
        // Clean up URL
        window.history.replaceState({}, '', '/list-your-park');
        return;
      }

      // For fresh visits, clear any old plan selection and start at step 0
      try {
        localStorage.removeItem('selectedListingPlan');
      } catch (error) {
        console.warn('Failed to clear localStorage on page load:', error);
      }
      setCurrentStep(0);
    }
  }, []);

  // Save draft to localStorage with error handling
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('parkSubmissionDraft', JSON.stringify(formData));
      } catch (error) {
        console.warn('Failed to save draft to localStorage:', error);
      }
    }
  }, [formData]);

  // Save selected plan to localStorage with error handling
  useEffect(() => {
    if (typeof window !== 'undefined' && selectedPlan) {
      try {
        localStorage.setItem('selectedListingPlan', selectedPlan);
      } catch (error) {
        console.warn('Failed to save selected plan to localStorage:', error);
      }
    }
  }, [selectedPlan]);

  const handlePlanSelection = useCallback((plan: 'free' | 'featured') => {
    setSelectedPlan(plan);
    // Clear any old draft when starting fresh
    try {
      localStorage.removeItem('parkSubmissionDraft');
    } catch (error) {
      console.warn('Failed to clear localStorage draft:', error);
    }
    setFormData(getInitialFormData());
    setCurrentStep(1); // Move to first form step
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const updateFormData = useCallback((data: Partial<ParkSubmissionForm>) => {
    setFormData(prev => ({ ...prev, ...data }));
    setErrors({});
  }, []);

  const validateCurrentStep = useCallback((): Record<string, string> => {
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
  }, [currentStep, formData]);

  const nextStep = useCallback(() => {
    const stepErrors = validateCurrentStep();
    if (Object.keys(stepErrors).length === 0) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setErrors(stepErrors);
    }
  }, [validateCurrentStep]);

  const previousStep = useCallback(() => {
    if (currentStep === 1) {
      // Go back to plan selection
      setCurrentStep(0);
      setSelectedPlan(null);
      try {
        localStorage.removeItem('selectedListingPlan');
      } catch (error) {
        console.warn('Failed to remove selected plan from localStorage:', error);
      }
    } else {
      setCurrentStep(prev => Math.max(prev - 1, 0));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const loadingState = useMemo(
    () => (
      <div className="min-h-screen flex items-center justify-center" role="status" aria-live="polite">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"
            aria-hidden="true"
          />
          <p className="mt-4 text-gray-600">Loading...</p>
          <span className="sr-only">Loading page content</span>
        </div>
      </div>
    ),
    []
  );

  // Early return must come AFTER all hooks
  if (loading) {
    return loadingState;
  }


  const handleSubmit = async (listingType: 'free' | 'featured') => {
    // Require login before submission
    if (!user) {
      // Include step in redirect so user returns to review page
      // URL encode the redirect path to ensure params are preserved
      const redirectPath = `/list-your-park?plan=${listingType}&step=6`;
      router.push(`/login?redirect=${encodeURIComponent(redirectPath)}`);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const { accessToken, refreshToken } = await getSessionTokens();
      if (!accessToken) {
        const redirectPath = `/list-your-park?plan=${listingType}&step=6`;
        router.push(`/login?redirect=${encodeURIComponent(redirectPath)}`);
        setIsSubmitting(false);
        return;
      }

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

      // Clear draft and plan from localStorage with error handling
      try {
        localStorage.removeItem('parkSubmissionDraft');
        localStorage.removeItem('selectedListingPlan');
      } catch (error) {
        console.warn('Failed to clear localStorage after submission:', error);
        // Non-critical error, continue with redirect
      }

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
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">List Your Dog Park</h1>
            <p className="text-lg text-gray-600">Share your park with dog lovers across California</p>
          </div>

          {/* Owner Newsletter Signup - Lead Magnet */}
          {currentStep === 0 && (
            <div className="mb-8 bg-white rounded-lg shadow-lg p-6 border-2 border-purple-200">
              <div className="max-w-2xl mx-auto text-center">
                <div className="mb-4 flex items-center justify-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600">
                    <i className="bi bi-envelope-check text-white"></i>
                  </div>
                  <span className="text-sm font-semibold text-purple-600 uppercase tracking-wide">Partner Network</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  📈 Get Industry Insights & Tips
                </h2>
                <p className="text-gray-600 mb-6">
                  Join our partner network to receive exclusive revenue optimization tips, marketing strategies, and early access to new features.
                </p>
                <NewsletterForm type="owner" source="list_your_park" />
              </div>
            </div>
          )}

          {/* Progress Steps - Only show if past plan selection */}
          {currentStep > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {STEPS.filter(step => step.number > 0).map((step, index, filteredSteps) => (
                  <div key={step.number} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${currentStep >= step.number
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
                    {index < filteredSteps.length - 1 && (
                      <div
                        className={`h-1 flex-1 mx-2 ${currentStep > step.number ? 'bg-purple-600' : 'bg-gray-200'
                          }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form Container */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            {currentStep > 0 && (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{STEPS[currentStep].title}</h2>
                <p className="text-gray-600 mb-6">{STEPS[currentStep].description}</p>
              </>
            )}

            {/* Step Content */}
            {currentStep === 0 && (
              <PlanSelectionStep onSelectPlan={handlePlanSelection} isLoggedIn={!!user} />
            )}
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
            {currentStep === 6 && selectedPlan && (
              <ReviewSubmitStep
                formData={formData}
                onSubmit={(listingType) => handleSubmit(listingType || selectedPlan)}
                isSubmitting={isSubmitting}
                errors={errors}
                preselectedPlan={selectedPlan}
              />
            )}

            {/* Navigation Buttons */}
            {currentStep > 0 && currentStep < 6 && (
              <div className="flex justify-between mt-8 pt-6 border-t">
                <button
                  type="button"
                  onClick={previousStep}
                  disabled={currentStep === 1}
                  className={`px-6 py-3 rounded-lg font-medium ${currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  {currentStep === 1 ? 'Back to Plans' : 'Previous'}
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
      </main>
      <Footer />
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
