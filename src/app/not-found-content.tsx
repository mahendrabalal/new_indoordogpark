'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFoundContent() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-2xl text-center">
            {/* 404 Error Icon */}
            <div className="mb-8">
              <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-purple-100">
                <svg
                  className="h-16 w-16 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Error Message */}
            <h1 className="mb-4 text-6xl font-bold text-gray-900">404</h1>
            <h2 className="mb-4 text-3xl font-semibold text-gray-800">
              Oops! Page Not Found
            </h2>
            <p className="mb-8 text-lg text-gray-600">
              We couldn&apos;t find the page you&apos;re looking for. The park might have moved, or the URL might be incorrect. Use the search below to find dog parks near you.
            </p>

            {/* Quick Actions */}
            <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full bg-purple-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition hover:bg-purple-700"
              >
                <svg
                  className="mr-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Go to Homepage
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center justify-center rounded-full border-2 border-purple-600 bg-white px-8 py-3 text-lg font-semibold text-purple-600 transition hover:bg-purple-50"
              >
                Browse Blog
              </Link>
            </div>

            {/* Search Section */}
            <div className="mb-12 rounded-3xl border border-gray-200 bg-white p-8 shadow-lg">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">
                Search for Dog Parks
              </h3>
              <form action="/" method="get" className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="search"
                    placeholder="Search by park name, city, or state..."
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* Helpful Links */}
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-lg">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">
                Looking for something specific?
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Link
                  href="/?search="
                  className="group flex items-center rounded-2xl border border-gray-200 p-4 transition hover:border-purple-300 hover:bg-purple-50"
                >
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 group-hover:bg-purple-200">
                    <svg
                      className="h-6 w-6 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Search Parks</div>
                    <div className="text-sm text-gray-600">Find dog parks near you</div>
                  </div>
                </Link>

                <Link
                  href="/about"
                  className="group flex items-center rounded-2xl border border-gray-200 p-4 transition hover:border-purple-300 hover:bg-purple-50"
                >
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 group-hover:bg-purple-200">
                    <svg
                      className="h-6 w-6 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">About Us</div>
                    <div className="text-sm text-gray-600">Learn about our mission</div>
                  </div>
                </Link>

                <Link
                  href="/list-your-park"
                  className="group flex items-center rounded-2xl border border-gray-200 p-4 transition hover:border-purple-300 hover:bg-purple-50"
                >
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 group-hover:bg-purple-200">
                    <svg
                      className="h-6 w-6 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">List Your Park</div>
                    <div className="text-sm text-gray-600">Add your facility</div>
                  </div>
                </Link>

                <Link
                  href="/contact"
                  className="group flex items-center rounded-2xl border border-gray-200 p-4 transition hover:border-purple-300 hover:bg-purple-50"
                >
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 group-hover:bg-purple-200">
                    <svg
                      className="h-6 w-6 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Contact Us</div>
                    <div className="text-sm text-gray-600">Get in touch</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Popular Searches */}
            <div className="mt-8">
              <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
                Popular Searches
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Link
                  href="/cities/los-angeles"
                  className="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:border-purple-500 hover:text-purple-600"
                >
                  Los Angeles Dog Parks
                </Link>
                <Link
                  href="/cities/san-francisco"
                  className="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:border-purple-500 hover:text-purple-600"
                >
                  San Francisco
                </Link>
                <Link
                  href="/cities/san-diego"
                  className="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:border-purple-500 hover:text-purple-600"
                >
                  San Diego
                </Link>
                <Link
                  href="/blog"
                  className="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:border-purple-500 hover:text-purple-600"
                >
                  Dog Park Tips
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
