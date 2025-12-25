'use client';

import Link from 'next/link';

type SeoSection = {
  heading: string;
  paragraphs: string[];
  listItems?: string[];
};

type SeoFaq = {
  question: string;
  answer: string;
};

type SeoLink = {
  href: string;
  title: string;
  description: string;
};

interface SeoContentSectionProps {
  eyebrow?: string;
  title: string;
  intro: string[];
  sections?: SeoSection[];
  faqs?: SeoFaq[];
  links?: SeoLink[];
  className?: string;
}

export default function SeoContentSection({
  eyebrow = 'Helpful guide',
  title,
  intro,
  sections = [],
  faqs = [],
  links = [],
  className = '',
}: SeoContentSectionProps) {
  const headingId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return (
    <section aria-labelledby={headingId} className={`bg-white ${className}`}>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold tracking-wide text-purple-700 uppercase">{eyebrow}</p>
          <h2 id={headingId} className="text-3xl font-bold text-gray-900 mt-2">
            {title}
          </h2>
          <div className="mt-4 space-y-3 text-gray-700 leading-relaxed">
            {intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>

        {sections.length > 0 && (
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sections.map((section) => (
              <div key={section.heading} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900">{section.heading}</h3>
                <div className="mt-3 space-y-3 text-gray-700 leading-relaxed">
                  {section.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                {section.listItems && section.listItems.length > 0 && (
                  <ul className="mt-4 list-disc pl-5 space-y-1 text-gray-700">
                    {section.listItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {faqs.length > 0 && (
          <div className="mt-12 max-w-4xl">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h3 className="text-2xl font-bold text-gray-900">Frequently asked questions</h3>
              <Link
                href="/faq"
                className="inline-flex items-center gap-2 text-purple-700 font-semibold hover:text-purple-800 transition-colors whitespace-nowrap"
              >
                More
                <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <summary className="cursor-pointer list-none font-semibold text-gray-900 flex items-start justify-between gap-4">
                    <span>{faq.question}</span>
                    <span className="mt-1 text-gray-500 group-open:rotate-180 transition-transform" aria-hidden="true">
                      ▾
                    </span>
                  </summary>
                  <div className="mt-3 text-gray-700 leading-relaxed">
                    <p>{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {links.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900">Next steps</h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h4 className="text-lg font-semibold text-gray-900">{link.title}</h4>
                  <p className="mt-2 text-gray-600">{link.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}














