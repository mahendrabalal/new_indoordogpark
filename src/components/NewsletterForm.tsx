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
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [parkName, setParkName] = useState('');
    const [website, setWebsite] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const emailInputRef = useRef<HTMLInputElement | null>(null);
    const nameInputRef = useRef<HTMLInputElement | null>(null);
    const parkNameInputRef = useRef<HTMLInputElement | null>(null);
    const cityInputRef = useRef<HTMLInputElement | null>(null);
    const stateInputRef = useRef<HTMLInputElement | null>(null);
    const zipInputRef = useRef<HTMLInputElement | null>(null);
    const formId = useId();

    const isDark = variant === 'dark';

    // US States for the dropdown
    const usStates = [
        'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
        'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
        'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
        'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
        'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'
    ];

    // If the user edits inputs after an error, reset to idle so styling + messaging stays responsive.
    useEffect(() => {
        if (status !== 'error') return;
        setStatus('idle');
        setMessage('');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [email, name, parkName, city, state, zipCode, phone, website, selectedType]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const trimmedEmail = email.trim();
        const trimmedName = name.trim();
        const trimmedParkName = parkName.trim();
        const trimmedCity = city.trim();
        const trimmedState = state.trim();
        const trimmedZip = zipCode.trim();
        const trimmedPhone = phone.trim();
        const trimmedWebsite = website.trim();
        const trimmedStreetAddress = streetAddress.trim();

        // Client-side validation
        if (!trimmedName) {
            setStatus('error');
            setMessage('Please enter your name.');
            nameInputRef.current?.focus();
            return;
        }
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
        if (selectedType === 'owner') {
            if (!trimmedParkName) {
                setStatus('error');
                setMessage('Please enter your dog park name.');
                parkNameInputRef.current?.focus();
                return;
            }
            if (!trimmedCity) {
                setStatus('error');
                setMessage('Please enter your city.');
                cityInputRef.current?.focus();
                return;
            }
            if (!trimmedState) {
                setStatus('error');
                setMessage('Please select your state.');
                stateInputRef.current?.focus();
                return;
            }
        }

        setStatus('loading');
        setMessage('');

        // Build location string from address fields
        const locationParts = [trimmedStreetAddress, trimmedCity, trimmedState, trimmedZip].filter(Boolean);
        const location = locationParts.join(', ');

        // Prepare body based on selectedType
        const requestBody: Record<string, string | undefined> = {
            email: trimmedEmail,
            type: selectedType,
            source,
        };

        // All metadata goes into the metadata JSON field on the backend
        if (selectedType === 'owner') {
            requestBody.parkName = trimmedParkName;
            requestBody.location = location;
        }

        // Additional fields will be stored in metadata
        const metadata: Record<string, string> = {};
        if (trimmedName) metadata.name = trimmedName;
        if (trimmedPhone) metadata.phone = trimmedPhone;
        if (trimmedWebsite) metadata.website = trimmedWebsite;
        if (trimmedStreetAddress) metadata.streetAddress = trimmedStreetAddress;
        if (trimmedCity) metadata.city = trimmedCity;
        if (trimmedState) metadata.state = trimmedState;
        if (trimmedZip) metadata.zipCode = trimmedZip;

        // Merge metadata into request body  
        Object.assign(requestBody, metadata);

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
                setName('');
                setPhone('');
                setParkName('');
                setWebsite('');
                setStreetAddress('');
                setCity('');
                setState('');
                setZipCode('');
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

    const inputBaseClass = `newsletter-premium-input ${isDark ? 'newsletter-premium-input--dark' : ''} ${status === 'error' ? 'newsletter-premium-input--error' : ''}`;
    const selectBaseClass = `newsletter-premium-select ${isDark ? 'newsletter-premium-select--dark' : ''} ${status === 'error' ? 'newsletter-premium-input--error' : ''}`;

    return (
        <div className={`newsletter-premium-wrapper newsletter-premium-wrapper--${variant} ${className}`}>
            {/* Decorative top accent */}
            <div className="newsletter-premium-accent" aria-hidden="true" />
            
            {/* User Type Toggle */}
            <div className="newsletter-premium-toggle" role="tablist" aria-label="Newsletter audience">
                <div
                    className={`newsletter-premium-toggle-thumb ${selectedType === 'consumer' ? 'newsletter-premium-toggle-thumb--left' : 'newsletter-premium-toggle-thumb--right'}`}
                    aria-hidden="true"
                />
                <button
                    type="button"
                    onClick={() => setSelectedType('consumer')}
                    className={`newsletter-premium-toggle-btn ${selectedType === 'consumer' ? 'newsletter-premium-toggle-btn--active' : ''}`}
                    role="tab"
                    aria-selected={selectedType === 'consumer'}
                    aria-controls={`${formId}-panel`}
                >
                    <svg className="newsletter-premium-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Dog Owner
                </button>
                <button
                    type="button"
                    onClick={() => setSelectedType('owner')}
                    className={`newsletter-premium-toggle-btn ${selectedType === 'owner' ? 'newsletter-premium-toggle-btn--active' : ''}`}
                    role="tab"
                    aria-selected={selectedType === 'owner'}
                    aria-controls={`${formId}-panel`}
                >
                    <svg className="newsletter-premium-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round" />
                        <polyline points="9 22 9 12 15 12 15 22" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Park Owner
                </button>
            </div>

            <form onSubmit={handleSubmit} className="newsletter-premium-form" aria-describedby={message ? `${formId}-message` : undefined}>
                <div id={`${formId}-panel`} role="tabpanel">
                    
                    {/* Section: Contact Information */}
                    <div className="newsletter-premium-section">
                        <div className="newsletter-premium-section-label">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Contact Information
                        </div>
                        
                        {/* Name */}
                        <div className="newsletter-premium-field">
                            <label htmlFor={`newsletter-name-${source}`} className="sr-only">Your Name</label>
                            <div className="newsletter-premium-input-wrap">
                                <input
                                    id={`newsletter-name-${source}`}
                                    type="text"
                                    value={name}
                                    ref={nameInputRef}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={selectedType === 'owner' ? "Contact name" : "Your name"}
                                    required
                                    disabled={status === 'loading' || status === 'success'}
                                    className={inputBaseClass}
                                />
                                <div className="newsletter-premium-input-icon" aria-hidden="true">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="newsletter-premium-field">
                            <label htmlFor={`newsletter-email-${source}`} className="sr-only">Your Email</label>
                            <div className="newsletter-premium-input-wrap">
                                <input
                                    id={`newsletter-email-${source}`}
                                    type="email"
                                    name="email"
                                    value={email}
                                    ref={emailInputRef}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={selectedType === 'owner' ? "Business email" : "Email address"}
                                    required
                                    disabled={status === 'loading' || status === 'success'}
                                    aria-invalid={status === 'error' ? true : undefined}
                                    className={inputBaseClass}
                                />
                                <div className="newsletter-premium-input-icon" aria-hidden="true">
                                    {status === 'loading' ? (
                                        <div className="newsletter-premium-spinner" />
                                    ) : (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="2" y="4" width="20" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M22 7l-10 7L2 7" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Phone (Owner only) */}
                        {selectedType === 'owner' && (
                            <div className="newsletter-premium-field">
                                <label htmlFor={`newsletter-phone-${source}`} className="sr-only">Phone Number</label>
                                <div className="newsletter-premium-input-wrap">
                                    <input
                                        id={`newsletter-phone-${source}`}
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Phone number (optional)"
                                        disabled={status === 'loading' || status === 'success'}
                                        className={inputBaseClass}
                                    />
                                    <div className="newsletter-premium-input-icon" aria-hidden="true">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Section: Park Details (Owner only) */}
                    {selectedType === 'owner' && (
                        <div className="newsletter-premium-section">
                            <div className="newsletter-premium-section-label">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round" />
                                    <polyline points="9 22 9 12 15 12 15 22" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Park Details
                            </div>

                            {/* Park Name */}
                            <div className="newsletter-premium-field">
                                <label htmlFor={`newsletter-park-${source}`} className="sr-only">Park Name</label>
                                <div className="newsletter-premium-input-wrap">
                                    <input
                                        id={`newsletter-park-${source}`}
                                        type="text"
                                        value={parkName}
                                        onChange={(e) => setParkName(e.target.value)}
                                        ref={parkNameInputRef}
                                        placeholder="Indoor dog park name"
                                        required
                                        disabled={status === 'loading' || status === 'success'}
                                        className={inputBaseClass}
                                    />
                                    <div className="newsletter-premium-input-icon" aria-hidden="true">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Website */}
                            <div className="newsletter-premium-field">
                                <label htmlFor={`newsletter-website-${source}`} className="sr-only">Website</label>
                                <div className="newsletter-premium-input-wrap">
                                    <input
                                        id={`newsletter-website-${source}`}
                                        type="url"
                                        value={website}
                                        onChange={(e) => setWebsite(e.target.value)}
                                        placeholder="Website URL (optional)"
                                        disabled={status === 'loading' || status === 'success'}
                                        className={inputBaseClass}
                                    />
                                    <div className="newsletter-premium-input-icon" aria-hidden="true">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
                                            <line x1="2" y1="12" x2="22" y2="12" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Section: Address */}
                    <div className="newsletter-premium-section">
                        <div className="newsletter-premium-section-label">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="12" cy="10" r="3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {selectedType === 'owner' ? 'Park Address' : 'Your Location'}
                        </div>

                        {/* Street Address (Owner only) */}
                        {selectedType === 'owner' && (
                            <div className="newsletter-premium-field">
                                <label htmlFor={`newsletter-street-${source}`} className="sr-only">Street Address</label>
                                <div className="newsletter-premium-input-wrap">
                                    <input
                                        id={`newsletter-street-${source}`}
                                        type="text"
                                        value={streetAddress}
                                        onChange={(e) => setStreetAddress(e.target.value)}
                                        placeholder="Street address (optional)"
                                        disabled={status === 'loading' || status === 'success'}
                                        className={inputBaseClass}
                                    />
                                    <div className="newsletter-premium-input-icon" aria-hidden="true">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeLinecap="round" strokeLinejoin="round" />
                                            <circle cx="12" cy="10" r="3" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* City + State Row */}
                        <div className="newsletter-premium-row">
                            <div className="newsletter-premium-field newsletter-premium-field--grow">
                                <label htmlFor={`newsletter-city-${source}`} className="sr-only">City</label>
                                <input
                                    id={`newsletter-city-${source}`}
                                    type="text"
                                    value={city}
                                    ref={cityInputRef}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder="City"
                                    required={selectedType === 'owner'}
                                    disabled={status === 'loading' || status === 'success'}
                                    className={inputBaseClass}
                                />
                            </div>
                            <div className="newsletter-premium-field newsletter-premium-field--state">
                                <label htmlFor={`newsletter-state-${source}`} className="sr-only">State</label>
                                <select
                                    id={`newsletter-state-${source}`}
                                    value={state}
                                    ref={stateInputRef as any}
                                    onChange={(e) => setState(e.target.value)}
                                    required={selectedType === 'owner'}
                                    disabled={status === 'loading' || status === 'success'}
                                    className={selectBaseClass}
                                >
                                    <option value="">State</option>
                                    {usStates.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Zip Code */}
                        <div className="newsletter-premium-field newsletter-premium-field--zip">
                            <label htmlFor={`newsletter-zip-${source}`} className="sr-only">Zip Code</label>
                            <input
                                id={`newsletter-zip-${source}`}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={10}
                                value={zipCode}
                                ref={zipInputRef}
                                onChange={(e) => setZipCode(e.target.value)}
                                placeholder={selectedType === 'owner' ? "Zip code" : "Zip code (for local alerts)"}
                                disabled={status === 'loading' || status === 'success'}
                                className={inputBaseClass}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="newsletter-premium-submit-wrap">
                        <button
                            type="submit"
                            disabled={status === 'loading' || status === 'success'}
                            className="newsletter-premium-submit"
                        >
                            {status === 'loading' ? (
                                <span className="newsletter-premium-submit-loading">
                                    <div className="newsletter-premium-spinner newsletter-premium-spinner--white" />
                                    Submitting…
                                </span>
                            ) : status === 'success' ? (
                                <span className="newsletter-premium-submit-success">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                                        <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Welcome to the Pack!
                                </span>
                            ) : (
                                <span className="newsletter-premium-submit-text">
                                    {selectedType === 'owner' ? 'Join Partner Network' : 'Join the Pack'}
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                                        <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" strokeLinejoin="round" />
                                        <polyline points="12 5 19 12 12 19" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                            )}
                        </button>

                        <p className="newsletter-premium-disclaimer">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Your information is secure. We&apos;ll only email you when we have something worth sharing. Unsubscribe anytime.
                        </p>
                    </div>
                </div>
            </form>

            {message && (
                <div
                    id={`${formId}-message`}
                    className={`newsletter-premium-message ${status === 'success' ? 'newsletter-premium-message--success' : 'newsletter-premium-message--error'}`}
                    role="alert"
                >
                    <div className="newsletter-premium-message-inner">
                        {status === 'success' ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" />
                                <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                                <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
                                <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" strokeLinejoin="round" />
                                <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                        <span>{message}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
