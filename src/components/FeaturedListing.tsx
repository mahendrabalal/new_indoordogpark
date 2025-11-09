'use client';

import { useState } from 'react';
import StripePayment from './StripePayment';

interface FeaturedListingProps {
  parkId: string;
  parkName: string;
  price?: number;
}

export default function FeaturedListing({
  parkId,
  parkName,
  price = 20,
}: FeaturedListingProps) {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showPayment, setShowPayment] = useState(false);

  const handlePurchaseFeatured = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/payment/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: price,
          currency: 'usd',
          parkId,
          parkName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment intent');
      }

      setClientSecret(data.clientSecret);
      setShowPayment(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    // Handle successful payment (e.g., show success message, redirect)
    alert('Payment successful! Your park will be featured soon.');
    setShowPayment(false);
    setClientSecret('');
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4">Feature Your Park</h3>
      
      <div className="mb-4">
        <p className="text-gray-600 mb-2">
          Get your park featured on our homepage and increase visibility!
        </p>
        <div className="bg-blue-50 p-4 rounded-md">
          <p className="text-2xl font-bold text-blue-600">${price}</p>
          <p className="text-sm text-gray-600">One-time featured listing</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {!showPayment ? (
        <button
          onClick={handlePurchaseFeatured}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Processing...' : 'Feature This Park'}
        </button>
      ) : (
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-4">Complete Payment</h4>
          <StripePayment
            clientSecret={clientSecret}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </div>
      )}
    </div>
  );
}
