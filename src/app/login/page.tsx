'use client';

import { Suspense, useEffect, useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const heroPatternStyle: CSSProperties = {
  backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.35) 1px, transparent 0)',
  backgroundSize: '36px 36px',
};

const heroStats = [
  { value: '185+', label: 'Verified parks', helper: 'Spanning 36 CA cities' },
  { value: '4.9 / 5', label: 'Member rating', helper: 'Based on 2,400 reviews' },
  { value: '12', label: 'New indoor hubs', helper: 'Added this quarter' },
  { value: '< 8 hrs', label: 'Support response', helper: 'Average weekday time' },
] as const;

const loginChecklist = [
  'Realtime indoor capacity + climate notes',
  'Owner-verified amenities & safety alerts',
  'Favorites, waitlist status, and saved filters',
] as const;

function ShieldIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 flex-none text-emerald-600"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 2.5 3.75 4.5v5.4c0 3.75 2.8 7.2 6.25 7.8 3.45-.6 6.25-4.05 6.25-7.8V4.5L10 2.5Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m7.5 10 1.75 1.75L12.5 8.5"
      />
    </svg>
  );
}

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

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const savedRemember = localStorage.getItem('indoorDogPark:rememberMe') === 'true';
    const savedEmail = localStorage.getItem('indoorDogPark:rememberedEmail') ?? '';

    if (savedRemember && savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (rememberMe) {
      localStorage.setItem('indoorDogPark:rememberMe', 'true');
      if (email) {
        localStorage.setItem('indoorDogPark:rememberedEmail', email);
      }
      return;
    }

    localStorage.setItem('indoorDogPark:rememberMe', 'false');
    localStorage.removeItem('indoorDogPark:rememberedEmail');
  }, [rememberMe, email]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
    } else {
      const redirectTo = searchParams.get('redirect');
      const safeRedirect =
        redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//')
          ? redirectTo
          : '/';
      router.push(safeRedirect);
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 flex-col bg-[#F5F6F8] lg:flex-row">
        <section className="relative hidden flex-1 items-center justify-center overflow-hidden lg:flex">
        <Image
          src="/images/auth/login-hero.webp"
          alt="Dogs enjoying a modern indoor dog park"
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF784A] via-[#FF5722] to-[#E64A19] opacity-80" />
        <div className="absolute inset-0 opacity-35" style={heroPatternStyle} />
        <div className="relative z-10 flex max-w-xl flex-col gap-10 px-12 py-16 text-white">
          <Link
            href="/"
            className="w-fit rounded-full border border-white/30 bg-white/10 px-4 py-1 text-sm font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur"
          >
            IndoorDogPark
          </Link>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
              California indoor network
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight lg:text-5xl">
              Plan safe indoor play sessions with confidence
            </h1>
            <p className="mt-4 text-lg text-white/85">
              Unlock climate-friendly venues, member-only perks, and live capacity alerts for your
              pup’s next adventure.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-white/20 bg-white/10 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.15)] backdrop-blur"
              >
                <p className="text-3xl font-semibold lg:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-white/80">
                  {stat.label}
                </p>
                <p className="mt-1 text-sm text-white/75">{stat.helper}</p>
              </div>
            ))}
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
            <p className="text-base leading-relaxed text-white">
              “IndoorDogPark is the fastest way to see which climate-controlled parks are open before
              I leave home. The data is consistently accurate.”
            </p>
            <p className="mt-4 text-sm font-semibold">Ariana, East Bay Member</p>
          </div>
        </div>
      </section>
      <section className="flex w-full flex-1 items-center justify-center bg-white px-4 py-12 sm:px-8 lg:px-16">
        <div className="w-full max-w-md">
          <div className="mb-8 space-y-3">
            <Link
              href="/"
              className="text-sm font-medium text-[#FF5722] transition-colors hover:text-[#E64A19]"
            >
              ← Back to directory
            </Link>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#FF7043]">
                Welcome back
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-gray-900">
                Sign in to your account
              </h2>
              <p className="mt-3 text-base text-gray-600">
                Continue tracking indoor capacity, park amenities, and curated owner resources.
              </p>
            </div>
          </div>
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-900">
            <ShieldIcon />
            <div>
              <p className="font-semibold">Secure login & encrypted credentials</p>
              <p className="text-emerald-900/80">
                Powered by Supabase Auth with TLS 1.3, device fingerprinting, and bot protection.
              </p>
            </div>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            {error && (
              <div
                role="alert"
                aria-live="assertive"
                className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                <p className="font-semibold">We couldn’t sign you in</p>
                <p className="mt-1">{error}</p>
              </div>
            )}
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
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 shadow-sm transition focus:border-[#FF5722] focus:outline-none focus:ring-4 focus:ring-[#FF5722] focus:ring-opacity-20"
                placeholder="founder@indoordogpark.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (error) setError('');
                }}
                aria-invalid={Boolean(error)}
              />
              <p className="mt-2 text-sm text-gray-500">Use the email you used when creating your membership.</p>
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
                  autoComplete="current-password"
                  required
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 pr-28 text-base text-gray-900 shadow-sm transition focus:border-[#FF5722] focus:outline-none focus:ring-4 focus:ring-[#FF5722] focus:ring-opacity-20"
                  placeholder="••••••••"
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
                  {showPassword ? 'Hide' : 'Show'} password
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">Minimum 8 characters with at least one number.</p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <label className="flex items-center gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#FF5722] focus:ring-[#FF7043]"
                />
                Remember this device
              </label>
              <Link
                href="/help?topic=account"
                className="text-sm font-semibold text-[#FF5722] transition-colors hover:text-[#E64A19]"
              >
                Need help signing in?
              </Link>
            </div>
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
              {loading ? 'Signing in' : 'Sign in securely'}
            </button>
          </form>
          <p className="mt-6 text-sm text-gray-500">
            By continuing you agree to our{' '}
            <Link href="/terms" className="font-semibold text-[#FF5722] hover:text-[#E64A19]">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="font-semibold text-[#FF5722] hover:text-[#E64A19]">
              Privacy Policy
            </Link>
            .
          </p>
          <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4">
            <p className="text-sm font-semibold text-gray-900">Indoor essentials included:</p>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              {loginChecklist.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-6 text-center text-sm text-gray-700">
            New to IndoorDogPark?{' '}
            <Link href="/signup" className="font-semibold text-[#FF5722] hover:text-[#E64A19]">
              Create a member account
            </Link>
            .
          </p>
          <p className="mt-4 text-center text-sm text-gray-500">
            Just browsing?{' '}
            <Link href="/" className="font-semibold text-gray-700 hover:text-gray-900">
              Explore parks without signing in
            </Link>
            .
          </p>
        </div>
      </section>
      </div>
      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F5F6F8]">
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-4 text-sm font-medium text-gray-600 shadow-sm">
            Loading a secure login experience…
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}