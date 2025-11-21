'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

const helpTopics = [
  { 
    title: 'Account & profiles', 
    description: 'Update saved parks, notification preferences, and membership details.', 
    icon: 'bi-person-check',
    keywords: ['account', 'profile', 'settings', 'preferences', 'membership', 'saved parks', 'notifications']
  },
  { 
    title: 'Listing support', 
    description: 'Need edits or have a new photo set? Submit updates in minutes.', 
    icon: 'bi-building',
    keywords: ['listing', 'edit', 'update', 'photo', 'submit', 'park listing', 'property']
  },
  { 
    title: 'Billing & invoices', 
    description: 'Download receipts, update payment methods, or request tax forms.', 
    icon: 'bi-receipt',
    keywords: ['billing', 'invoice', 'payment', 'receipt', 'tax', 'subscription', 'pricing']
  },
  { 
    title: 'Trust & safety', 
    description: 'Report an issue, request moderation, or review our verification standards.', 
    icon: 'bi-shield-lock',
    keywords: ['safety', 'trust', 'report', 'moderation', 'verification', 'security', 'issue']
  },
  { 
    title: 'Technical help', 
    description: 'App issues, map errors, or trouble submitting reviews? We&rsquo;re on it.', 
    icon: 'bi-bug',
    keywords: ['technical', 'bug', 'error', 'app', 'map', 'review', 'troubleshoot', 'issue']
  },
  { 
    title: 'Community programs', 
    description: 'Join meetups, volunteer drives, or education workshops across California.', 
    icon: 'bi-people',
    keywords: ['community', 'meetup', 'volunteer', 'workshop', 'event', 'program', 'education']
  },
];

const contactOptions = [
  { channel: 'Email support', detail: 'support@indoordogpark.org', response: 'Replies within 24h', href: 'mailto:support@indoordogpark.org' },
  { channel: 'Live chat', detail: 'Weekdays 9 AM – 6 PM PT', response: 'Look for the bubble in the bottom right corner', href: '/contact' },
  { channel: 'SMS hotline', detail: '(415) 555-7410', response: 'Urgent listing or safety issues', href: 'tel:+14155557410' },
];

const statusNotices = [
  { system: 'Maps & search', state: 'Operational', detail: 'No incidents reported.' },
  { system: 'Owner dashboard', state: 'Operational', detail: 'Scheduled maintenance every Sunday 10–11 PM PT.' },
  { system: 'Payments & billing', state: 'Operational', detail: 'Stripe-powered billing with redundant monitoring.' },
];

export default function HelpPageClient() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) {
      return helpTopics;
    }

    const query = searchQuery.toLowerCase().trim();
    return helpTopics.filter(topic => {
      const searchableText = `${topic.title} ${topic.description} ${topic.keywords.join(' ')}`.toLowerCase();
      return searchableText.includes(query);
    });
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Search is handled by the filteredTopics useMemo, so we just prevent default form submission
  };

  return (
    <>
      <section className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-200">Support</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">Help center</h1>
          <p className="mt-4 text-lg text-slate-200">Find quick answers, send us a message, or check real-time platform status.</p>
          <form onSubmit={handleSearchSubmit} className="mt-8 flex flex-col gap-3 rounded-2xl border border-white/30 bg-white/10 p-4 backdrop-blur md:flex-row">
            <input 
              type="search" 
              name="q" 
              placeholder="Search articles or keywords" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 rounded-xl border border-transparent bg-white/80 px-4 py-3 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-400" 
            />
            <button 
              type="submit" 
              className="rounded-xl bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-violet-50 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          {searchQuery && (
            <div className="mb-6 text-sm text-slate-600">
              {filteredTopics.length > 0 ? (
                <p>Found {filteredTopics.length} {filteredTopics.length === 1 ? 'result' : 'results'} for &quot;{searchQuery}&quot;</p>
              ) : (
                <p>No results found for &quot;{searchQuery}&quot;. Try different keywords or <Link href="/contact" className="text-violet-700 hover:underline">contact support</Link>.</p>
              )}
            </div>
          )}
          <div className="grid gap-6 md:grid-cols-3">
            {filteredTopics.length > 0 ? (
              filteredTopics.map((topic) => (
                <div key={topic.title} className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                    <i className={`bi ${topic.icon} text-xl`} aria-hidden />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">{topic.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{topic.description}</p>
                  <Link href="/contact" className="mt-4 inline-flex items-center text-sm font-semibold text-violet-700 hover:text-violet-500">
                    View guides
                    <i className="bi bi-arrow-right-short text-xl" aria-hidden />
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-full rounded-3xl border border-slate-200 bg-slate-50/80 p-8 text-center">
                <i className="bi bi-search text-4xl text-slate-400 mb-4" aria-hidden />
                <p className="text-lg font-semibold text-slate-900 mb-2">No results found</p>
                <p className="text-sm text-slate-600 mb-4">Try searching with different keywords or browse all topics below.</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="rounded-xl bg-violet-700 px-6 py-2 text-sm font-semibold text-white hover:bg-violet-600 transition-colors"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-700">Contact options</p>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {contactOptions.map((option) => (
                <div key={option.channel} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                  <h3 className="text-lg font-semibold text-slate-900">{option.channel}</h3>
                  <a href={option.href} className="mt-2 inline-flex items-center text-sm font-semibold text-violet-700 hover:text-violet-500">
                    {option.detail}
                  </a>
                  <p className="mt-1 text-sm text-slate-500">{option.response}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-6 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">Emergency situations</p>
              <p className="mt-2">If there is an immediate safety concern at a park, contact the facility directly, notify local authorities if needed, and then email safety@indoordogpark.org so our team can investigate.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="rounded-3xl border border-slate-200 bg-slate-900/95 p-8 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-200">System status</p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {statusNotices.map((notice) => (
                <div key={notice.system} className="rounded-2xl border border-white/20 bg-white/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-200">{notice.system}</p>
                  <h3 className="mt-2 text-lg font-semibold">{notice.state}</h3>
                  <p className="mt-2 text-sm text-slate-200">{notice.detail}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-slate-200">Subscribe to proactive updates by emailing <a className="underline" href="mailto:support@indoordogpark.org?subject=Status%20updates">support@indoordogpark.org</a>.</p>
          </div>
        </div>
      </section>
    </>
  );
}











