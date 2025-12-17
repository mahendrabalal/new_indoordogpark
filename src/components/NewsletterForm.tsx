'use client';

import { useEffect, useId, useMemo, useRef, useState, FormEvent } from 'react';

interface NewsletterFormProps {
    type: 'owner' | 'consumer';
    source: string;
    className?: string;
    variant?: 'light' | 'dark';
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterForm({
    type: initialType,
    source,
    className = '',
    variant = 'light',
}: NewsletterFormProps) {
    const [selectedType, setSelectedType] = useState<'owner' | 'consumer'>(initialType);
    const [email, setEmail] = useState('');
    const [parkName, setParkName] = useState('');
    const [location, setLocation] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const emailInputRef = useRef<HTMLInputElement | null>(null);
    const parkNameInputRef = useRef<HTMLInputElement | null>(null);
    const locationInputRef = useRef<HTMLInputElement | null>(null);
    const formId = useId();

    const isDark = variant === 'dark';

    const styles = useMemo(() => {
        const surface = isDark
            ? 'bg-white/10 border-white/15 text-white placeholder:text-white/50'
            : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400';
        const surfaceMuted = isDark ? 'text-white/70' : 'text-gray-600';
        const surfaceStrong = isDark ? 'text-white' : 'text-gray-900';
        const toggleTrack = isDark ? 'bg-white/10 border border-white/15' : 'bg-gray-100';
        const toggleThumb = isDark ? 'bg-white shadow-sm' : 'bg-white shadow-sm';
        const toggleActiveText = isDark ? 'text-gray-900' : 'text-gray-900';
        const toggleInactiveText = isDark ? 'text-white/70 hover:text-white' : 'text-gray-500 hover:text-gray-700';

        return {
            surface,
            surfaceMuted,
            surfaceStrong,
            toggleTrack,
            toggleThumb,
            toggleActiveText,
            toggleInactiveText,
        };
    }, [isDark]);

    // If the user edits inputs after an error, reset to idle so styling + messaging stays responsive.
    useEffect(() => {
        if (status !== 'error') return;
        setStatus('idle');
        setMessage('');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [email, parkName, location, selectedType]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const trimmedEmail = email.trim();
        const trimmedParkName = parkName.trim();
        const trimmedLocation = location.trim();

        // Client-side validation for a faster, more polished UX (API still validates).
        if (!trimmedEmail) {
            setStatus('error');
            setMessage('Please enter your email address.');
            emailInputRef.current?.focus();
            return;
        }
        if (!EMAIL_REGEX.test(trimmedEmail)) {
            setStatus('error');
            setMessage('Please enter a valid email address.');
            emailInputRef.current?.focus();
            return;
        }
        if (selectedType === 'owner' && !trimmedParkName) {
            setStatus('error');
            setMessage('Please enter your dog park name.');
            parkNameInputRef.current?.focus();
            return;
        }
        if (selectedType === 'owner' && !trimmedLocation) {
            setStatus('error');
            setMessage('Please enter your city and state.');
            locationInputRef.current?.focus();
            return;
        }

        setStatus('loading');
        setMessage('');

        // Prepare body based on selectedType
        const requestBody: Record<string, string | undefined> = {
            email: trimmedEmail,
            type: selectedType,
            source,
        };

        if (selectedType === 'owner') {
            requestBody.parkName = trimmedParkName;
            requestBody.location = trimmedLocation;
        }

        try {
            const response = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage(data.message || 'Successfully subscribed!');
                setEmail('');
                setParkName('');
                setLocation('');
                // Optional: reset type to initial? No, keep it.
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
        <div className={`${className} w-full`}>
            {/* User Type Toggle */}
            <div className={`mb-4 flex p-1 rounded-xl relative ${styles.toggleTrack}`} role="tablist" aria-label="Newsletter audience">
                <div
                    className={`absolute inset-y-1 w-[calc(50%-4px)] rounded-lg transition-all duration-300 ease-in-out ${styles.toggleThumb} ${selectedType === 'consumer' ? 'left-1' : 'left-[calc(50%+4px)]'}`}
                    aria-hidden="true"
                />
                <button
                    type="button"
                    onClick={() => setSelectedType('consumer')}
                    className={`relative z-10 w-1/2 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${selectedType === 'consumer' ? styles.toggleActiveText : styles.toggleInactiveText}`}
                    role="tab"
                    aria-selected={selectedType === 'consumer'}
                    aria-controls={`${formId}-panel`}
                >
                    Dog owner
                </button>
                <button
                    type="button"
                    onClick={() => setSelectedType('owner')}
                    className={`relative z-10 w-1/2 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${selectedType === 'owner' ? styles.toggleActiveText : styles.toggleInactiveText}`}
                    role="tab"
                    aria-selected={selectedType === 'owner'}
                    aria-controls={`${formId}-panel`}
                >
                    Park owner
                </button>
            </div>

            <form onSubmit={handleSubmit} className="relative transition-all duration-300" aria-describedby={message ? `${formId}-message` : undefined}>
                <div id={`${formId}-panel`} role="tabpanel">
                {/* Email Field - Always Visible */}
                <div className="relative z-10">
                    <label htmlFor={`newsletter-email-${source}`} className="sr-only">
                        Your Email
                    </label>
                    <div className="relative group focus-within:text-inherit">
                        <input
                            id={`newsletter-email-${source}`}
                            type="email"
                            name="email"
                            value={email}
                            ref={emailInputRef}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={selectedType === 'owner' ? "Enter your business email" : "Enter your email address"}
                            required
                            disabled={status === 'loading' || status === 'success'}
                            aria-invalid={status === 'error' ? true : undefined}
                            className={`peer w-full rounded-xl border px-4 py-3 pr-11 text-sm transition-all duration-200 outline-none shadow-sm
                                ${styles.surface}
                                ${status === 'error' ? 'border-red-400 focus:border-red-400 focus:ring-4 focus:ring-red-500/20' : (isDark ? 'hover:border-white/25 focus:border-white/35 focus:ring-4 focus:ring-white/10' : 'hover:border-gray-300 focus:border-[#FF5722] focus:ring-4 focus:ring-[#FF5722]/15')}
                            `}
                        />
                        <div className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-white/60' : 'text-gray-400'} ${status === 'error' ? 'text-red-500' : ''} group-hover:text-[#FF5722] peer-focus:text-[#FF5722]`}>
                            {status === 'loading' ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#FF5722] border-t-transparent" />
                            ) : (
                                <i className={`bi bi-envelope text-lg ${email ? 'text-[#FF5722]' : ''}`}></i>
                            )}
                        </div>
                    </div>
                </div>

                {/* Fields for Owners - Reveal when type is owner or expanded */}
                {selectedType === 'owner' && (
                    <div className="mt-3 space-y-3">
                            <div className="relative group">
                                <label htmlFor={`newsletter-park-${source}`} className="sr-only">Park Name</label>
                                <input
                                    id={`newsletter-park-${source}`}
                                    type="text"
                                    value={parkName}
                                    onChange={(e) => setParkName(e.target.value)}
                                ref={parkNameInputRef}
                                placeholder="Dog park name"
                                required
                                disabled={status === 'loading' || status === 'success'}
                                className={`w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 outline-none shadow-sm
                                    ${styles.surface}
                                    ${status === 'error' ? 'border-red-400 focus:border-red-400 focus:ring-4 focus:ring-red-500/20' : (isDark ? 'hover:border-white/25 focus:border-white/35 focus:ring-4 focus:ring-white/10' : 'hover:border-gray-300 focus:border-[#FF5722] focus:ring-4 focus:ring-[#FF5722]/15')}
                                `}
                                />
                            </div>
                            <div className="relative group">
                                <label htmlFor={`newsletter-location-${source}`} className="sr-only">City/State</label>
                                <input
                                    id={`newsletter-location-${source}`}
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                ref={locationInputRef}
                                placeholder="City, state"
                                required
                                disabled={status === 'loading' || status === 'success'}
                                className={`w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 outline-none shadow-sm
                                    ${styles.surface}
                                    ${status === 'error' ? 'border-red-400 focus:border-red-400 focus:ring-4 focus:ring-red-500/20' : (isDark ? 'hover:border-white/25 focus:border-white/35 focus:ring-4 focus:ring-white/10' : 'hover:border-gray-300 focus:border-[#FF5722] focus:ring-4 focus:ring-[#FF5722]/15')}
                                `}
                                />
                            </div>
                    </div>
                )}

                {/* Submit Button */}
                <div className="mt-4">
                    <button
                        type="submit"
                        disabled={status === 'loading' || status === 'success'}
                        className="w-full rounded-xl bg-[#FF5722] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#E64A19] hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FF5722]/25 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {status === 'loading'
                            ? 'Submitting…'
                            : status === 'success'
                                ? 'Subscribed'
                                : (selectedType === 'owner' ? 'Join partner updates' : 'Join the pack')}
                    </button>

                    <p className={`mt-3 text-center text-xs ${styles.surfaceMuted}`}>
                        We’ll only email you when we have something worth sharing. Unsubscribe anytime.
                    </p>
                </div>
                </div>
            </form>

            {message && (
                <div
                    id={`${formId}-message`}
                    className={`mt-4 rounded-xl p-4 text-sm font-medium ${status === 'success'
                        ? (isDark ? 'bg-green-500/15 text-green-50 border border-green-400/20' : 'bg-green-50 text-green-700 border border-green-100')
                        : (isDark ? 'bg-red-500/15 text-red-50 border border-red-400/20' : 'bg-red-50 text-red-700 border border-red-100')
                        }`}
                    role="alert"
                >
                    <div className="flex items-center gap-2">
                        {status === 'success' ? (
                            <i className="bi bi-check-circle-fill text-lg"></i>
                        ) : (
                            <i className="bi bi-exclamation-circle-fill text-lg"></i>
                        )}
                        {message}
                    </div>
                </div>
            )}
        </div>
    );
}
