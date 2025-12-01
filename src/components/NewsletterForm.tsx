'use client';

import { useState, FormEvent } from 'react';

interface NewsletterFormProps {
    type: 'owner' | 'consumer';
    source: string;
    className?: string;
}

export default function NewsletterForm({ type, source, className = '' }: NewsletterFormProps) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            const response = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    type,
                    source,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage(data.message || 'Successfully subscribed!');
                setEmail(''); // Clear input on success
            } else {
                setStatus('error');
                setMessage(data.error || 'Failed to subscribe. Please try again.');
            }
        } catch (error) {
            console.error('Subscribe error:', error);
            setStatus('error');
            setMessage('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <label htmlFor={`newsletter-email-${source}`} className="sr-only">
                    Your Email
                </label>
                <div className="relative">
                    <input
                        id={`newsletter-email-${source}`}
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your Email"
                        required
                        disabled={status === 'loading' || status === 'success'}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 text-gray-900 placeholder:text-gray-500 focus:border-[#FF5722] focus:outline-none focus:ring-2 focus:ring-[#FF5722]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <i className="bi bi-envelope absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </div>

                <button
                    type="submit"
                    disabled={status === 'loading' || status === 'success'}
                    className="w-full rounded-lg bg-[#FF5722] px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-[#E64A19] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Subscribed! ✓' : 'Subscribe'}
                </button>
            </form>

            {message && (
                <div
                    className={`mt-4 rounded-lg p-4 text-sm ${status === 'success'
                            ? 'bg-green-50 text-green-800 border border-green-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                    role="alert"
                >
                    {message}
                </div>
            )}
        </div>
    );
}
