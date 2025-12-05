import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '403 Forbidden | Access Denied',
  description: 'You do not have permission to access this resource.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100">
            <svg
              className="h-12 w-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">403 Forbidden</h1>
        <p className="text-lg text-gray-600 mb-2">Access Denied</p>
        <p className="text-sm text-gray-500 mb-8">
          You do not have permission to access this resource. This area is restricted to administrators only.
        </p>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
          >
            Go to Homepage
          </Link>
          <div>
            <Link
              href="/login"
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              Sign in with a different account
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            If you believe you should have access to this resource, please contact the administrator.
          </p>
        </div>
      </div>
    </div>
  );
}














