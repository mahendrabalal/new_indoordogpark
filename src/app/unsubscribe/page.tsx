'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function UnsubscribeContent() {
    const searchParams = useSearchParams();
    const emailParam = searchParams.get('email');

    const [email, setEmail] = useState(emailParam || '');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    // Auto-unsubscribe if email is present in URL? 
    // Better to ask for confirmation to prevent accidental unsubscribes from link scanners.

    const handleUnsubscribe = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!email) {
            setMessage('Please enter your email address.');
            return;
        }

        setStatus('loading');

        try {
            const response = await fetch('/api/newsletter/unsubscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage(data.message || 'You have been successfully unsubscribed.');
            } else {
                setStatus('error');
                setMessage(data.error || 'Failed to unsubscribe. Please try again.');
            }
        } catch (error) {
            console.error('Unsubscribe error:', error);
            setStatus('error');
            setMessage('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 mt-10">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Unsubscribe</h1>
                <p className="text-gray-600">
                    We&apos;re sorry to see you go. Enter your email below to unsubscribe from our newsletter.
                </p>
            </div>

            {status === 'success' ? (
                <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="bi bi-check-lg text-2xl text-green-600"></i>
                    </div>
                    <p className="text-green-800 font-medium mb-6">{message}</p>
                    <Link
                        href="/"
                        className="inline-block px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                    >
                        Return to Homepage
                    </Link>
                </div>
            ) : (
                <form onSubmit={handleUnsubscribe} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#FF5722] focus:border-[#FF5722]"
                            placeholder="you@example.com"
                        />
                    </div>

                    {status === 'error' && (
                        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full py-3 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition disabled:opacity-50"
                    >
                        {status === 'loading' ? 'Processing...' : 'Unsubscribe'}
                    </button>
                </form>
            )}
        </div>
    );
}

export default function UnsubscribePage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-grow flex items-center justify-center px-4 py-12">
                <Suspense fallback={<div className="text-center">Loading...</div>}>
                    <UnsubscribeContent />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
