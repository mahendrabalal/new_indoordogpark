'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Get session_id from URL parameters
    const sessionIdParam = searchParams.get('session_id');
    if (sessionIdParam) {
      setSessionId(sessionIdParam);
      console.log('Payment session completed:', sessionIdParam);
    }

    // Store success state for dashboard if user is not authenticated
    if (!loading && !user && sessionIdParam) {
      sessionStorage.setItem('paymentSuccess', 'true');
      sessionStorage.setItem('successMessage', 'Payment successful! Your featured listing is now active.');
      sessionStorage.setItem('sessionId', sessionIdParam);
    }
  }, [searchParams, user, loading]);

  const handleGoToDashboard = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      // Redirect to login with dashboard redirect
      router.push('/login?redirect=/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <svg
            className="w-16 h-16 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>

        <p className="text-gray-600 mb-8">
          Thank you for upgrading to a featured listing. Your payment has been processed successfully.
        </p>

        {sessionId && (
          <div className="mb-6 p-3 bg-gray-50 rounded-md">
            <p className="text-xs text-gray-500">
              Transaction ID: {sessionId.slice(0, 8)}...{sessionId.slice(-8)}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {user ? (
            <button
              onClick={handleGoToDashboard}
              className="block w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 transition-colors text-center font-medium"
            >
              View Your Dashboard
            </button>
          ) : (
            <button
              onClick={handleGoToDashboard}
              className="block w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 transition-colors text-center font-medium"
            >
              Login to View Dashboard
            </button>
          )}

          <Link
            href="/"
            className="block w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-300 transition-colors text-center font-medium"
          >
            Back to Home
          </Link>
        </div>

        <div className="mt-8 p-4 bg-purple-50 rounded-md border border-purple-200">
          <h3 className="font-semibold text-purple-900 mb-2">What happens next?</h3>
          <ul className="text-sm text-purple-800 text-left space-y-1">
            <li>• Your featured listing will be activated immediately</li>
            <li>• Your park will appear at the top of search results</li>
            <li>• You can manage your listing from your dashboard</li>
            <li>• Cancel anytime from your account settings</li>
          </ul>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Need help? <Link href="/contact" className="text-purple-600 hover:underline">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
