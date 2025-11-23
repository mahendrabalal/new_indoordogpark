'use client';

export default function BlogSubscribe() {
  return (
    <div className="bg-[#FFF5F2] border-2 border-[#FF5722]/20 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Subscribe Now</h3>
      <p className="text-sm text-gray-600 mb-4">
        Stay up to date with Enterprisetube&apos;s latest news:
      </p>
      <form action="/api/newsletter" method="POST" className="space-y-3">
        <label htmlFor="blog-subscribe-email" className="sr-only">
          Email Address
        </label>
        <input
          id="blog-subscribe-email"
          type="email"
          name="email"
          placeholder="Enter your Email Address"
          required
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-[#FF5722] focus:outline-none focus:ring-2 focus:ring-[#FF5722]/20"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-[#FF5722] px-4 py-2 text-sm font-semibold text-white hover:bg-[#E64A19] transition-colors flex items-center justify-center gap-2"
        >
          Subscribe Now
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </form>
    </div>
  );
}

