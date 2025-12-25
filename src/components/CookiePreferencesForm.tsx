'use client';

import { FormEvent, useState } from 'react';

type PreferenceKey = 'necessary' | 'functional' | 'analytics' | 'marketing';

const defaultPreferences: Record<PreferenceKey, boolean> = {
  necessary: true,
  functional: true,
  analytics: true,
  marketing: false,
};

const preferenceCopy: Record<PreferenceKey, { title: string; description: string; note?: string }> = {
  necessary: {
    title: 'Strictly necessary',
    description: 'Required for authentication, security, and remembering your basic site preferences. These cookies are always on and cannot be disabled.',
    note: 'Required for site reliability',
  },
  functional: {
    title: 'Functional experience',
    description: 'Helps us remember saved parks, recently viewed content, and personalization preferences across sessions.',
  },
  analytics: {
    title: 'Analytics & performance',
    description: 'Allows us to understand usage patterns so we can improve maps, search speed, and park discovery journeys. We use Google Analytics 4 with IP anonymization enabled.',
  },
  marketing: {
    title: 'Marketing & advertising',
    description: 'Enables personalized advertising through third-party advertising partners. These cookies help display relevant ads based on your browsing behavior. You can opt out anytime.',
    note: 'Third-party advertising',
  },
};

export default function CookiePreferencesForm() {
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleToggle = (key: PreferenceKey) => {
    if (key === 'necessary') return;
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
    setStatus('idle');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('saving');
    setTimeout(() => {
      setStatus('saved');
    }, 600);
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    setStatus('idle');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-lg shadow-slate-900/5 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-violet-700">Manage consent</p>
          <h3 className="text-2xl font-bold text-slate-900">Customize cookie settings</h3>
          <p className="text-sm text-slate-500">Adjust how we remember your preferences. Changes apply the next time you use the directory.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={resetPreferences}
            className="inline-flex items-center rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:border-slate-400"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={status === 'saving'}
            className="inline-flex items-center rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-violet-400"
          >
            {status === 'saving' ? 'Saving...' : status === 'saved' ? 'Preferences saved' : 'Save preferences'}
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {(Object.keys(preferenceCopy) as PreferenceKey[]).map((key) => {
          const isLocked = key === 'necessary';
          const isMarketing = key === 'marketing';
          return (
            <label
              key={key}
              htmlFor={`cookie-${key}`}
              className={`group relative flex cursor-pointer flex-col gap-3 rounded-2xl border p-5 transition-all ${
                isMarketing
                  ? 'border-violet-300 bg-violet-50/50 hover:border-violet-400 hover:bg-violet-50 hover:shadow-md'
                  : 'border-slate-200 bg-white/70 hover:border-violet-200 hover:bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {isMarketing && (
                      <i className="bi bi-megaphone-fill text-violet-600 text-sm" aria-hidden="true"></i>
                    )}
                    <p className={`text-base font-semibold ${isMarketing ? 'text-violet-900' : 'text-slate-900'}`}>
                      {preferenceCopy[key].title}
                    </p>
                  </div>
                  <p className={`text-sm leading-relaxed ${isMarketing ? 'text-slate-700' : 'text-slate-500'}`}>
                    {preferenceCopy[key].description}
                  </p>
                  {isMarketing && (
                    <p className="mt-2 text-xs text-slate-600 italic">
                      When enabled, third-party advertising partners may use cookies to personalize ads.
                    </p>
                  )}
                </div>
                <input
                  id={`cookie-${key}`}
                  type="checkbox"
                  checked={preferences[key]}
                  onChange={() => handleToggle(key)}
                  disabled={isLocked}
                  className={`h-5 w-5 rounded border-slate-300 text-violet-600 focus:ring-violet-500 disabled:cursor-not-allowed flex-shrink-0 ${
                    isMarketing ? 'border-violet-400' : ''
                  }`}
                />
              </div>
              {preferenceCopy[key].note && (
                <span className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                  isLocked 
                    ? 'bg-slate-100 text-slate-600' 
                    : isMarketing
                    ? 'bg-violet-100 text-violet-800'
                    : 'bg-violet-50 text-violet-700'
                }`}>
                  <i className={`bi ${isLocked ? 'bi-shield-lock' : isMarketing ? 'bi-megaphone' : 'bi-info-circle'}`} aria-hidden />
                  {preferenceCopy[key].note}
                </span>
              )}
            </label>
          );
        })}
      </div>

      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-600">
        <p className="font-semibold text-slate-800">Current summary</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {(Object.entries(preferences) as [PreferenceKey, boolean][]).map(([key, enabled]) => (
            <li key={key}>
              <span className="font-medium capitalize">{key}</span> &mdash; {enabled ? 'enabled' : 'disabled'}
            </li>
          ))}
        </ul>
        {status === 'saved' && (
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
            <i className="bi bi-check2-circle" aria-hidden />
            Preferences updated. You can change them at any time.
          </p>
        )}
      </div>
    </form>
  );
}

