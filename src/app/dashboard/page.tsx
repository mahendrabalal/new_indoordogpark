'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { ParkSubmission } from '@/types/park-submission';
import Link from 'next/link';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, getSessionTokens } = useAuth();
  const [submissions, setSubmissions] = useState<ParkSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      // Check if we have success parameters and preserve them
      const hasSuccessParams = searchParams.get('success') === 'true' || searchParams.get('submitted') === 'true';

      if (hasSuccessParams) {
        // Store success state in sessionStorage to preserve after login
        sessionStorage.setItem('paymentSuccess', 'true');
        sessionStorage.setItem('successMessage', searchParams.get('success') === 'true'
          ? 'Payment successful! Your featured listing is now active.'
          : 'Your listing has been submitted successfully! It will be reviewed by our team.'
        );
        sessionStorage.setItem('sessionId', searchParams.get('session_id') || '');
      }

      router.push('/login?redirect=/dashboard');
    }
  }, [user, loading, router, searchParams]);

  useEffect(() => {
    // Check for success messages from URL params
    if (searchParams.get('submitted') === 'true') {
      setSuccessMessage('Your listing has been submitted successfully! It will be reviewed by our team.');
    }
    if (searchParams.get('success') === 'true') {
      setSuccessMessage('Payment successful! Your featured listing is now active.');
    }
  }, [searchParams]);

  // Check for success state from sessionStorage (preserved during login redirect)
  useEffect(() => {
    if (user && sessionStorage.getItem('paymentSuccess') === 'true') {
      const storedMessage = sessionStorage.getItem('successMessage');
      const sessionId = sessionStorage.getItem('sessionId');

      if (storedMessage) {
        setSuccessMessage(storedMessage);
      }

      // Clean up sessionStorage after retrieving the data
      sessionStorage.removeItem('paymentSuccess');
      sessionStorage.removeItem('successMessage');
      sessionStorage.removeItem('sessionId');

      // Optionally, you could verify the session with Stripe here using the sessionId
      if (sessionId) {
        console.log('Payment session ID:', sessionId);
      }
    }
  }, [user]);

  const buildAuthHeaders = useCallback(
    async (options?: { json?: boolean }) => {
      const { accessToken, refreshToken } = await getSessionTokens();
      const headers: Record<string, string> = {};

      if (options?.json) {
        headers['Content-Type'] = 'application/json';
      }
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }
      if (refreshToken) {
        headers['x-refresh-token'] = refreshToken;
      }

      return headers;
    },
    [getSessionTokens]
  );

  const fetchSubmissions = useCallback(async () => {
    try {
      setIsLoading(true);
      const headers = await buildAuthHeaders();
      const response = await fetch('/api/parks/submit', { headers });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch submissions');
      }

      setSubmissions(data.submissions || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch submissions';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [buildAuthHeaders]);

  useEffect(() => {
    if (user) {
      fetchSubmissions();
    }
  }, [user, fetchSubmissions]);

  const handleUpgrade = async (submissionId: string) => {
    try {
      const headers = await buildAuthHeaders({ json: true });
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers,
        body: JSON.stringify({ submissionId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create checkout session';
      alert(message);
    }
  };

  const handleManageSubscription = async (submissionId: string) => {
    try {
      const headers = await buildAuthHeaders({ json: true });
      const response = await fetch('/api/stripe/customer-portal', {
        method: 'POST',
        headers,
        body: JSON.stringify({ submissionId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to open customer portal');
      }

      // Redirect to Stripe Customer Portal
      window.location.href = data.url;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to open customer portal';
      alert(message);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-lg text-gray-600">Manage your park listings</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mb-6">
          <Link
            href="/list-your-park"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
          >
            + Add New Listing
          </Link>
        </div>

        {/* Submissions List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your listings...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No listings yet</h3>
            <p className="mt-2 text-gray-600">Get started by creating your first dog park listing.</p>
            <Link
              href="/list-your-park"
              className="mt-6 inline-block px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
            >
              Create Your First Listing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {submissions.map((submission) => (
              <div key={submission.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{submission.name}</h3>

                        {/* Status Badge */}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          submission.status === 'approved' ? 'bg-green-100 text-green-800' :
                          submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {submission.status.toUpperCase()}
                        </span>

                        {/* Listing Type Badge */}
                        {submission.listingType === 'featured' && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            FEATURED
                          </span>
                        )}
                      </div>

                      <p className="text-gray-600 mb-2">{submission.businessType}</p>
                      <p className="text-sm text-gray-500">
                        {submission.city}, {submission.state}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Submitted: {new Date(submission.createdAt).toLocaleDateString()}
                      </p>

                      {submission.rejectionReason && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                          <p className="text-sm text-red-800">
                            <strong>Rejection Reason:</strong> {submission.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 ml-4">
                      {submission.listingType === 'free' && submission.status === 'approved' && (
                        <button
                          onClick={() => handleUpgrade(submission.id)}
                          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700"
                        >
                          Upgrade to Featured
                        </button>
                      )}

                      {submission.listingType === 'featured' && submission.stripeCustomerId && (
                        <button
                          onClick={() => handleManageSubscription(submission.id)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                        >
                          Manage Subscription
                        </button>
                      )}

                      {submission.subscriptionStatus === 'active' && submission.subscriptionCurrentPeriodEnd && (
                        <p className="text-xs text-gray-500 mt-1">
                          Renews: {new Date(submission.subscriptionCurrentPeriodEnd).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
