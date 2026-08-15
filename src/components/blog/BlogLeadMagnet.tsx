'use client';

import React, { useState } from 'react';
import {
  EnvelopeIcon,
  CheckCircleIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

interface BlogLeadMagnetProps {
  postTitle?: string;
  source?: string;
  compact?: boolean;
}

export default function BlogLeadMagnet({
  postTitle,
  source = 'blog_article_inline',
  compact = false,
}: BlogLeadMagnetProps) {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/newsletter/weather-guide-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          honeypot,
          postTitle,
          source,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to send guide. Please try again.');
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (compact) {
    return (
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-5 text-white shadow-md border border-indigo-700/50">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-yellow-400 text-indigo-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Free PDF
          </span>
          <span className="text-indigo-200 text-xs flex items-center gap-1">
            <SparklesIcon className="w-3.5 h-3.5 text-yellow-300" /> Essential Guide
          </span>
        </div>

        <h4 className="text-base font-bold text-white mb-1.5 leading-snug">
          Extreme Weather Dog Safety &amp; Play Guide
        </h4>
        <p className="text-xs text-indigo-200 mb-4 leading-relaxed">
          Get the 7-Second Asphalt Safety Chart + 12 bad-weather indoor energy burners sent to your inbox.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-2.5">
            <div style={{ display: 'none' }} aria-hidden="true">
              <input
                type="text"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <input
              type="email"
              required
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-white/10 border border-indigo-400/30 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-xs"
            />

            {errorMsg && (
              <p className="text-red-300 text-[11px] bg-red-900/40 p-1.5 rounded">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-indigo-950 font-bold py-2.5 rounded-lg text-xs shadow transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <EnvelopeIcon className="w-4 h-4" />
              {submitting ? 'Sending...' : 'Get Free Guide →'}
            </button>
          </form>
        ) : (
          <div className="bg-white/10 rounded-lg p-3 border border-emerald-400/40 text-center animate-fade-in">
            <CheckCircleIcon className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
            <p className="text-xs font-bold text-white">Guide Sent!</p>
            <p className="text-[11px] text-indigo-200">Check your inbox shortly.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="my-10 bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-950 rounded-2xl p-6 md:p-8 text-white shadow-xl border border-indigo-700/60 relative overflow-hidden not-prose">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="bg-yellow-400 text-indigo-950 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            Free Download
          </span>
          <span className="text-indigo-200 text-xs md:text-sm flex items-center gap-1">
            <SparklesIcon className="w-4 h-4 text-yellow-300" /> Free PDF Checklist &amp; Activity Guide
          </span>
        </div>

        <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2 leading-tight">
          🌧️ Extreme Weather Dog Safety &amp; Indoor Play Guide
        </h3>
        
        <p className="text-indigo-100 text-sm md:text-base mb-6 leading-relaxed max-w-2xl">
          Don&apos;t let scorching summer pavement or freezing winter storms compromise your dog&apos;s physical health and mental happiness. Get our comprehensive survival guide delivered instantly.
        </p>

        {/* Lead Form */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div style={{ display: 'none' }} aria-hidden="true">
              <input
                type="text"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3.5 rounded-xl bg-white/10 border border-indigo-400/30 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
              />
              <button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-indigo-950 font-extrabold px-6 py-3.5 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 text-sm flex-shrink-0 disabled:opacity-50"
              >
                <EnvelopeIcon className="w-4 h-4" />
                {submitting ? 'Sending...' : 'Email My Free Guide →'}
              </button>
            </div>

            {errorMsg && (
              <p className="text-red-300 text-xs bg-red-900/40 p-2 rounded-lg max-w-xl">{errorMsg}</p>
            )}
          </form>
        ) : (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-emerald-400/40 flex items-center gap-3 animate-fade-in max-w-xl">
            <CheckCircleIcon className="w-8 h-8 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="font-bold text-white text-base">Check Your Inbox! 🎉</p>
              <p className="text-xs text-indigo-200">
                The Extreme Weather Dog Safety Guide has been emailed to <strong>{email}</strong>.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
