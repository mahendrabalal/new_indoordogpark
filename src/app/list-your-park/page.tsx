'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { ParkSubmissionForm } from '@/types/park-submission';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SeoContentSection from '@/components/SeoContentSection';
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
  { number: 1, title: 'Basic Info & Location', description: 'Tell us about your dog park and where it\'s located' },
  { number: 2, title: 'Details', description: 'Contact info, hours, amenities, photos & pricing' },
  { number: 3, title: 'Review & Submit', description: 'Review and submit your listing' },
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

      // Case 1: Both plan and step in URL (e.g., from review submit redirect)
      if (planParam === 'free' || planParam === 'featured') {
        setSelectedPlan(planParam);
        const savedStep = stepParam ? parseInt(stepParam, 10) : 3;
        setCurrentStep(savedStep >= 1 && savedStep <= 3 ? savedStep : 3);
        // Clean up URL
        window.history.replaceState({}, '', '/list-your-park');
        return;
      }

      // Case 2: Only step in URL (e.g., from photo upload sign-in redirect)
      // Restore plan from localStorage
      if (stepParam) {
        const savedPlan = localStorage.getItem('selectedListingPlan') as 'free' | 'featured' | null;
        if (savedPlan === 'free' || savedPlan === 'featured') {
          setSelectedPlan(savedPlan);
          const savedStep = parseInt(stepParam, 10);
          setCurrentStep(savedStep >= 1 && savedStep <= 3 ? savedStep : 1);
          // Clean up URL
          window.history.replaceState({}, '', '/list-your-park');
          return;
        }
      }

      // Case 3: Check if there's a saved draft and plan from a previous session
      const savedPlan = localStorage.getItem('selectedListingPlan') as 'free' | 'featured' | null;
      const savedDraft = localStorage.getItem('parkSubmissionDraft');
      if (savedPlan && savedDraft) {
        // User has an existing draft - restore their session
        setSelectedPlan(savedPlan);
        // Start at step 1 (they can navigate from there)
        setCurrentStep(1);
        return;
      }

      // Case 4: Fresh visit with no saved data - start at plan selection
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
        // Step 1: Basic Info + Location combined
        if (!formData.name?.trim()) stepErrors.name = 'Park name is required';
        if (!formData.businessType) stepErrors.businessType = 'Business type is required';
        if (!formData.description || formData.description.length < 50) {
          stepErrors.description = 'Description must be at least 50 characters';
        }
        if (!formData.city?.trim()) stepErrors.city = 'City is required';
        if (!formData.state) stepErrors.state = 'State is required';
        break;

      case 2:
        // Step 2: Details - optional email validation
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          stepErrors.email = 'Invalid email format';
        }
        break;

      // Step 3 is review - no validation needed
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
      const redirectPath = `/list-your-park?plan=${listingType}&step=3`;
      router.push(`/login?redirect=${encodeURIComponent(redirectPath)}`);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const { accessToken, refreshToken } = await getSessionTokens();
      if (!accessToken) {
        const redirectPath = `/list-your-park?plan=${listingType}&step=3`;
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
      <Header variant="light" />
      <main className="flex-1 bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">List Your Dog Park</h1>
            <p className="text-lg text-gray-600">Share your park with dog lovers across the country</p>
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
              <div className="space-y-8">
                <BasicInfoStep
                  formData={formData}
                  updateFormData={updateFormData}
                  errors={errors}
                />
                <hr className="border-gray-200" />
                <LocationStep
                  formData={formData}
                  updateFormData={updateFormData}
                  errors={errors}
                />
              </div>
            )}
            {currentStep === 2 && (
              <div className="space-y-8">
                <ContactHoursStep
                  formData={formData}
                  updateFormData={updateFormData}
                  errors={errors}
                />
                <hr className="border-gray-200" />
                <AmenitiesStep
                  formData={formData}
                  updateFormData={updateFormData}
                  errors={errors}
                />
                <hr className="border-gray-200" />
                <PhotosPricingStep
                  formData={formData}
                  updateFormData={updateFormData}
                  errors={errors}
                />
              </div>
            )}
            {currentStep === 3 && selectedPlan && (
              <ReviewSubmitStep
                formData={formData}
                onSubmit={(listingType) => handleSubmit(listingType || selectedPlan)}
                isSubmitting={isSubmitting}
                errors={errors}
                preselectedPlan={selectedPlan}
              />
            )}

            {/* Navigation Buttons */}
            {currentStep > 0 && currentStep < 3 && (
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
                  {currentStep === 2 ? 'Review' : 'Next'}
                </button>
              </div>
            )}

            {currentStep === 3 && (
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

          <SeoContentSection
            eyebrow="For venue owners"
            title="List your dog park on IndoorDogPark: how it works"
            intro={[
              'A complete listing helps dog owners find safe, well-run spaces—and it helps your venue attract the right customers. On IndoorDogPark, listings are used by people searching by city, browsing the map, and filtering by type, rating, and price.',
              'Use the form above to submit your venue. Below are practical tips on what information matters most, what to expect after submission, and how to make your listing stand out.',
            ]}
            sections={[
              {
                heading: 'What information to include (and why it matters)',
                paragraphs: [
                  'The most helpful listings answer the questions people ask before visiting: where is it, what does it cost, what are the rules, and what amenities are available. Clear details reduce last-minute calls and help visitors arrive prepared.',
                ],
                listItems: [
                  'Accurate location details (city, address, and map pin).',
                  'A short description that explains your space, size separation, and vibe.',
                  'Hours of operation (including special hours and closures).',
                  'Pricing details (free vs paid entry, memberships, day passes, add-ons).',
                  'Photos that show the play zones, seating, and entry/check-in area.',
                ],
              },
              {
                heading: 'Tips to make your listing convert',
                paragraphs: [
                  'Think of your listing as your “first impression” for new customers. Helpful photos and clear policies build trust, especially for indoor venues where owners want to understand cleanliness and safety.',
                  'If your venue has unique features—turf vs rubber flooring, staff monitoring, separate small-dog areas, training classes, or a café/bar—call that out in the description.',
                ],
                listItems: [
                  'Add multiple photos from different angles (play area + seating + signage).',
                  'Mention vaccination requirements and age minimums if applicable.',
                  'State whether reservations, waivers, or memberships are required.',
                  'Describe how you handle safety (supervision, separation, timeouts).',
                  'Include links and contact info so customers can verify details quickly.',
                ],
              },
              {
                heading: 'Free vs featured listings',
                paragraphs: [
                  'Free listings make your venue discoverable in search and on the map. Featured listings are designed for owners who want extra visibility and higher-intent traffic from people actively comparing options.',
                  'You can start free and upgrade later if you want more exposure—your core listing information stays the same.',
                ],
                listItems: [
                  'Free: get discovered and show the essentials.',
                  'Featured: increased visibility and priority placement (when available).',
                  'Both: keep your details accurate to reduce support requests and bad experiences.',
                ],
              },
              {
                heading: 'After you submit',
                paragraphs: [
                  'After submission, we review the details for completeness and consistency. If something is unclear (for example, missing city/state, incomplete hours, or unclear pricing), we may reach out for clarification so the listing is accurate for visitors.',
                  'Keeping your listing current is one of the best ways to build trust with new customers.',
                ],
                listItems: [
                  'Make sure your website and phone number are correct.',
                  'Update your listing when you change hours or pricing.',
                  'Share high-quality photos that reflect the current space.',
                ],
              },
            ]}
            faqs={[
              {
                question: 'Do I need an account to submit a listing?',
                answer:
                  'You can fill out the form at any time, but you’ll be asked to sign in before final submission so we can link the listing to your account and follow up if we have questions.',
              },
              {
                question: 'How long does approval take?',
                answer:
                  'Timing can vary based on completeness and current volume. Submissions with accurate location details, clear hours, and a solid description typically move through faster than listings missing key information.',
              },
              {
                question: 'What types of venues are allowed?',
                answer:
                  'We focus on indoor dog parks, dog parks, and dog-friendly establishments that provide a safe, pet-friendly experience. If you’re unsure, submit your venue with a clear description and we’ll review it.',
              },
              {
                question: 'Can I edit my listing later?',
                answer:
                  'Yes. The best listings stay up to date. If you need to change hours, pricing, photos, or contact information, use your account dashboard (or contact us) and we’ll help you update it.',
              },
            ]}
            links={[
              {
                href: '/owner-resources',
                title: 'Owner resources',
                description: 'Browse tips for operations, safety, marketing, and improving your listing performance.',
              },
              {
                href: '/contact',
                title: 'Contact support',
                description: 'Have questions about submission or upgrades? Send us a message and we’ll help.',
              },
              {
                href: '/parks-with-bars',
                title: 'Parks with bars',
                description: 'If your venue includes food or drinks, see how visitors browse these listings.',
              },
            ]}
            className="mt-10 rounded-lg border border-gray-200 shadow-sm overflow-hidden"
          />
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
