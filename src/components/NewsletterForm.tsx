'use client';

import { useState, FormEvent } from 'react';

interface NewsletterFormProps {
    type: 'owner' | 'consumer';
    source: string;
    className?: string;
}

export default function NewsletterForm({ type: initialType, source, className = '' }: NewsletterFormProps) {
    const [selectedType, setSelectedType] = useState<'owner' | 'consumer'>(initialType);
    const [email, setEmail] = useState('');
    const [parkName, setParkName] = useState('');
    const [location, setLocation] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    // Expand if user focuses email or has entered any data, OR if they are an owner (since fields are required now)
    // Actually, for progressive disclosure, we can still hide them until interaction, but since they are required, 
    // it might be better to show them or just reveal them when they pick "Park Owner".
    // Let's keep the reveal-on-focus for email, but if they switch to "Park Owner", maybe auto-expand or keep logic same?
    // User asked for "Compulsory field", implying they should definitely see them or be blocked.
    // Let's reveal fields immediately if "Park Owner" is selected to ensure they know it's required.
    const isExpanded = isFocused || email.length > 0 || parkName.length > 0 || location.length > 0 || selectedType === 'owner';

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        // Prepare body based on selectedType
        const requestBody: Record<string, string | undefined> = {
            email,
            type: selectedType,
            source,
        };

        if (selectedType === 'owner') {
            requestBody.parkName = parkName;
            requestBody.location = location;
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
            <div className="mb-4 flex p-1 bg-gray-100 rounded-xl relative">
                <div
                    className={`absolute inset-y-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-in-out ${selectedType === 'consumer' ? 'left-1' : 'left-[calc(50%+4px)]'}`}
                ></div>

                <button
                    type="button"
                    onClick={() => setSelectedType('consumer')}
                    className={`relative z-10 w-1/2 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${selectedType === 'consumer' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    🐶 Dog Owner
                </button>
                <button
                    type="button"
                    onClick={() => setSelectedType('owner')}
                    className={`relative z-10 w-1/2 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${selectedType === 'owner' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    🏞️ Park Owner
                </button>
            </div>

            <form onSubmit={handleSubmit} className="relative transition-all duration-300">
                {/* Email Field - Always Visible */}
                <div className="relative z-10">
                    <label htmlFor={`newsletter-email-${source}`} className="sr-only">
                        Your Email
                    </label>
                    <div className="relative group">
                        <input
                            id={`newsletter-email-${source}`}
                            type="email"
                            name="email"
                            value={email}
                            onFocus={() => setIsFocused(true)}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={selectedType === 'owner' ? "Enter your business email" : "Enter your email address"}
                            required
                            disabled={status === 'loading' || status === 'success'}
                            className={`w-full rounded-lg border-2 bg-white px-5 py-4 pr-12 text-gray-900 placeholder:text-gray-400 transition-all duration-200 outline-none
                                ${status === 'error' ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-100 hover:border-purple-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100'}
                                shadow-sm hover:shadow-md
                            `}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-hover:text-purple-500 peer-focus:text-purple-600">
                            {status === 'loading' ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
                            ) : (
                                <i className={`bi bi-envelope text-xl ${email ? 'text-purple-600' : ''}`}></i>
                            )}
                        </div>
                    </div>
                </div>

                {/* Fields for Owners - Reveal when type is owner or expanded */}
                {/* Note: User asked for 'compulsory' fields for owners. We render them if selectedType === 'owner' */}
                {selectedType === 'owner' && (
                    <div
                        className={`grid transition-all duration-500 ease-in-out overflow-hidden ${
                            // Always show implementation for owners to make it clear what is required? 
                            // Or keep disclosure? "progressive disclosure" was requested.
                            // But "compulsory field" implies high visibility.
                            // Let's auto-expand if 'owner' is selected.
                            (isExpanded || selectedType === 'owner') ? 'grid-rows-[1fr] opacity-100 mt-3 pb-1' : 'grid-rows-[0fr] opacity-0 mt-0'
                            }`}
                    >
                        <div className="min-h-0 space-y-3">
                            <div className="relative group">
                                <label htmlFor={`newsletter-park-${source}`} className="sr-only">Park Name</label>
                                <input
                                    id={`newsletter-park-${source}`}
                                    type="text"
                                    value={parkName}
                                    onChange={(e) => setParkName(e.target.value)}
                                    placeholder="Dog Park Name (Required)"
                                    required // Compulsory field
                                    className="w-full rounded-lg border-2 border-gray-100 bg-gray-50/50 px-5 py-3 text-gray-900 placeholder:text-gray-400 transition-all outline-none focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                                />
                            </div>
                            <div className="relative group">
                                <label htmlFor={`newsletter-location-${source}`} className="sr-only">City/State</label>
                                <input
                                    id={`newsletter-location-${source}`}
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="City, State (Required)"
                                    required // Compulsory field
                                    className="w-full rounded-lg border-2 border-gray-100 bg-gray-50/50 px-5 py-3 text-gray-900 placeholder:text-gray-400 transition-all outline-none focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${selectedType ? 'max-h-20 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0 hidden'
                        }`}
                >
                    <button
                        type="submit"
                        disabled={status === 'loading' || status === 'success'}
                        className="w-full rounded-xl bg-gradient-to-r from-[#FF5722] to-[#FF7043] px-6 py-4 font-bold text-white shadow-lg shadow-orange-200 transition-all hover:shadow-xl hover:shadow-orange-300 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none active:translate-y-0"
                    >
                        {status === 'loading' ? 'Joining...' : status === 'success' ? 'Welcome! 🎉' : (selectedType === 'owner' ? 'Join Partner Network' : 'Join the Pack')}
                    </button>

                    {selectedType === 'owner' && (
                        <p className="mt-3 text-center text-xs text-gray-400">
                            🔒 Your info is safe. Unsubscribe at any time.
                        </p>
                    )}
                </div>
            </form>

            {message && (
                <div
                    className={`mt-4 rounded-xl p-4 text-sm font-medium animate-in fade-in slide-in-from-top-2 ${status === 'success'
                        ? 'bg-green-50 text-green-700 border border-green-100 shadow-sm'
                        : 'bg-red-50 text-red-700 border border-red-100 shadow-sm'
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
