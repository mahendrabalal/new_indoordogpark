'use client';

import { Suspense, useMemo, useState, type CSSProperties, type FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const heroPatternStyle: CSSProperties = {
  backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.35) 1px, transparent 0)',
  backgroundSize: '34px 34px',
};

const heroStats = [
  { value: '185+', label: 'Indoor-ready parks', helper: 'Owner-verified across CA' },
  { value: '48 hrs', label: 'Avg. vetting time', helper: 'Before parks go live' },
  { value: '92%', label: 'Weekly active members', helper: 'Stay ahead of weather' },
  { value: '4.9 / 5', label: 'Community rating', helper: 'Based on 2,400 reviews' },
] as const;

const benefitHighlights = [
  'Live indoor capacity & climate notes',
  'Member safety alerts & amenity audits',
  'Save favorite parks, waitlists, and filters',
  'Cancel anytime – concierge indoor support',
] as const;

const onboardingChecklist = [
  'Step-by-step onboarding email within 2 minutes',
  'Verified identity & pet profile lives in one place',
  'Access to members-only promos from vetted partners',
] as const;

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 text-[#FF5722]"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 10 3.25 3.25 7.75-7.5" />
    </svg>
  );
}

const passwordRequirementCopy: Record<
  'length' | 'uppercase' | 'number' | 'special',
  string
> = {
  length: 'At least 8 characters',
  uppercase: 'One uppercase letter',
  number: 'One number',
  special: 'One symbol (!@#$%)',
};

function SparklesIcon() {
  return (
    <svg aria-hidden="true" className="h-10 w-10 text-[#FFB74D]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 2.5 8.5 7 13 8.5 8.5 10 7 14.5 5.5 10 1 8.5 5.5 7 7 2.5Zm11 3 1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Zm-4 8.5 1.5 4.5 4.5 1.5-4.5 1.5L14 26l-1.5-4.5L8 20.5l4.5-1.5Z" />
    </svg>
  );
}

function SignupExperience() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();

  const passwordChecks = useMemo(
    () => ({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*]/.test(password),
    }),
    [password],
  );

  const satisfiedChecks = Object.values(passwordChecks).filter(Boolean).length;
  const passwordStrengthPercent = (satisfiedChecks / 4) * 100;
  const passwordStrengthLabel =
    satisfiedChecks === 0
      ? 'Start typing'
      : satisfiedChecks <= 2
        ? 'Keep going'
        : satisfiedChecks === 3
          ? 'Almost there'
          : 'Ready';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match. Make sure both fields use the same characters.');
      return;
    }

    if (!Object.values(passwordChecks).every(Boolean)) {
      setError('For security, please meet all password requirements before continuing.');
      return;
    }

    if (!termsAccepted) {
      setError('Kindly accept the membership terms to create your account.');
      return;
    }

    setLoading(true);

    const { error: signUpError } = await signUp(email, password);

    if (signUpError) {
      setError(signUpError.message);
    } else {
      setSuccess(true);
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F6F8] lg:flex-row">
      <section className="relative hidden min-h-screen flex-1 items-center justify-center overflow-hidden lg:flex">
        <Image
          src="/images/auth/login-hero.png"
          alt="Pet parents enjoying a modern indoor dog park"
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF784A] via-[#FF5722] to-[#E64A19] opacity-90" />
        <div className="absolute inset-0 opacity-40" style={heroPatternStyle} />

        <div className="relative z-10 flex max-w-xl flex-col gap-8 px-12 py-16 text-white">
          <Link
            href="/"
            className="w-fit rounded-full border border-white/30 bg-white/10 px-4 py-1 text-sm font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur"
          >
            IndoorDogPark
          </Link>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">Indoor members club</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight lg:text-5xl">
              Create a climate-ready indoor plan in just a few clicks
            </h1>
            <p className="mt-4 text-lg text-white/85">
              Know which venues are safe, staffed, and climate-controlled before you leash up. Membership unlocks live capacity, safety notes, and concierge alerts.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-white/20 bg-white/10 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.15)] backdrop-blur"
              >
                <p className="text-3xl font-semibold lg:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-white/80">{stat.label}</p>
                <p className="mt-1 text-sm text-white/75">{stat.helper}</p>
              </div>
            ))}
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
            <p className="text-base leading-relaxed text-white">
              “IndoorDogPark lets me check humidity-controlled play spaces before every storm. The data is accurate and the onboarding was painless.”
            </p>
            <p className="mt-4 text-sm font-semibold">Maya, Marin County member since 2023</p>
          </div>
        </div>
      </section>

      <section className="flex w-full flex-1 items-center justify-center bg-white px-4 py-12 sm:px-8 lg:px-16">
        <div className="w-full max-w-lg">
          <div className="mb-8 space-y-3">
            <Link
              href="/"
              className="text-sm font-medium text-[#FF5722] transition-colors hover:text-[#E64A19]"
            >
              ← Back to directory
            </Link>
            {!success && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#FF7043]">
                  Step 1 of 2 · Account setup
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-gray-900">Create your indoor membership</h2>
                <p className="mt-3 text-base text-gray-600">
                  Set up secure credentials now. We’ll guide you through pet and household details after email verification.
                </p>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white/90 p-6 shadow-xl shadow-gray-200/60 sm:p-8">
            {success ? (
              <div className="space-y-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF3E0] text-[#FF7043]">
                  <SparklesIcon />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#FF7043]">
                    Verify & activate
                  </p>
                  <h3 className="mt-3 text-3xl font-semibold text-gray-900">Check your inbox</h3>
                  <p className="mt-3 text-base text-gray-600">
                    We just sent a secure link to <span className="font-semibold text-gray-900">{email}</span>. Open it within 24 hours to confirm your membership.
                  </p>
                </div>
                <div className="space-y-4 text-sm text-gray-500">
                  <p>Didn’t see the email? Check your spam folder or request another link.</p>
                  <div className="flex flex-wrap justify-center gap-3 text-sm font-semibold text-[#FF5722]">
                    <button
                      type="button"
                      className="underline-offset-4 hover:underline"
                      onClick={() => setSuccess(false)}
                    >
                      Use a different email
                    </button>
                    <Link href="/login" className="underline-offset-4 hover:underline">
                      Ready? Sign in
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                {error && (
                  <div
                    role="alert"
                    aria-live="assertive"
                    className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    <p className="font-semibold">We couldn’t complete your signup</p>
                    <p className="mt-1">{error}</p>
                  </div>
                )}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 shadow-sm transition focus:border-[#FF5722] focus:outline-none focus:ring-4 focus:ring-[#FF5722]/15"
                      placeholder="you@indoordogpark.com"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        if (error) setError('');
                      }}
                    />
                    <p className="mt-2 text-sm text-gray-500">We’ll send verification and capacity alerts here.</p>
                  </div>

                  <div>
                    <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                      Password
                    </label>
                    <div className="relative mt-2">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 pr-28 text-base text-gray-900 shadow-sm transition focus:border-[#FF5722] focus:outline-none focus:ring-4 focus:ring-[#FF5722]/15"
                        placeholder="Create a secure password"
                        value={password}
                        onChange={(event) => {
                          setPassword(event.target.value);
                          if (error) setError('');
                        }}
                        aria-invalid={Boolean(error)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-3 flex items-center text-sm font-semibold text-[#FF5722] transition hover:text-[#E64A19]"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-gray-600">
                        <span>Password strength</span>
                        <span>{passwordStrengthLabel}</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-[#FF7043] transition-all"
                          style={{ width: `${passwordStrengthPercent}%` }}
                        />
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
                        {(Object.keys(passwordChecks) as Array<keyof typeof passwordChecks>).map((key) => (
                          <div key={key} className="flex items-center gap-2">
                            <span
                              className={`inline-flex h-4 w-4 items-center justify-center rounded-full border ${
                                passwordChecks[key]
                                  ? 'border-[#FF5722] bg-[#FFEDDE]'
                                  : 'border-gray-300 bg-white'
                              }`}
                            >
                              {passwordChecks[key] && <span className="h-2 w-2 rounded-full bg-[#FF5722]" />}
                            </span>
                            <span>{passwordRequirementCopy[key]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirm-password" className="text-sm font-semibold text-gray-700">
                      Confirm password
                    </label>
                    <div className="relative mt-2">
                      <input
                        id="confirm-password"
                        name="confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 pr-32 text-base text-gray-900 shadow-sm transition focus:border-[#FF5722] focus:outline-none focus:ring-4 focus:ring-[#FF5722]/15"
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(event) => {
                          setConfirmPassword(event.target.value);
                          if (error) setError('');
                        }}
                        aria-invalid={Boolean(error)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-3 flex items-center text-sm font-semibold text-[#FF5722] transition hover:text-[#E64A19]"
                      >
                        {showConfirmPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>

                </div>

                <div className="space-y-4">
                  <label className="flex items-start gap-3 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(event) => setTermsAccepted(event.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-[#FF5722] focus:ring-[#FF7043]"
                    />
                    <span>
                      I agree to the{' '}
                      <Link href="/terms" className="font-semibold text-[#FF5722] hover:text-[#E64A19]">
                        Membership Terms
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="font-semibold text-[#FF5722] hover:text-[#E64A19]">
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FF5722] px-4 py-3 text-base font-semibold text-white shadow-lg shadow-[#FF5722]/30 transition hover:bg-[#E64A19] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FF5722]/40 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading && (
                      <svg
                        className="h-5 w-5 animate-spin text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.75c-3.993 0-7.25 3.257-7.25 7.25s3.257 7.25 7.25 7.25 7.25-3.257 7.25-7.25"
                        />
                      </svg>
                    )}
                    {loading ? 'Creating secure account' : 'Create secure account'}
                  </button>

                  <p className="text-center text-sm text-gray-600">
                    Already a member?{' '}
                    <Link href="/login" className="font-semibold text-[#FF5722] hover:text-[#E64A19]">
                      Sign in instead
                    </Link>
                    .
                  </p>
                </div>
              </form>
            )}
          </div>

          {!success && (
            <>
              <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 px-5 py-5">
                <p className="text-sm font-semibold text-gray-900">Indoor essentials included:</p>
                <ul className="mt-4 grid gap-3 text-sm text-gray-600 sm:grid-cols-2">
                  {benefitHighlights.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckIcon />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 grid gap-4 rounded-2xl border border-gray-100 bg-white p-5 sm:grid-cols-2">
                {onboardingChecklist.map((item) => (
                  <div key={item} className="rounded-2xl bg-gray-50/70 p-4 text-sm text-gray-700">
                    {item}
                  </div>
                ))}
              </div>

              <p className="mt-6 text-center text-sm text-gray-500">
                Prefer concierge onboarding?{' '}
                <Link href="/contact" className="font-semibold text-[#FF5722] hover:text-[#E64A19]">
                  Chat with our team
                </Link>
                .
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F5F6F8]">
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-4 text-sm font-medium text-gray-600 shadow-sm">
            Loading a personalized signup experience…
          </div>
        </div>
      }
    >
      <SignupExperience />
    </Suspense>
  );
}
