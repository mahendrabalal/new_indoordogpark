'use client';

import NewsletterForm from '@/components/NewsletterForm';

export default function BlogSubscribe() {
  return (
    <div className="bg-[#FFF5F2] border-2 border-[#FF5722]/20 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Subscribe Now</h3>
      <p className="text-sm text-gray-600 mb-4">
        Get indoor dog park updates and new openings.
      </p>
      <NewsletterForm type="consumer" source="blog_subscribe_widget" />
    </div>
  );
}

