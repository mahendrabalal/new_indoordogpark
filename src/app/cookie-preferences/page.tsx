import { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import CookiePreferencesForm from '@/components/CookiePreferencesForm';

const cookieCategories = [
  { 
    title: 'Strictly necessary', 
    detail: 'Keeps you signed in, remembers listings you create, and maintains site security. Required for core functionality. These cookies cannot be disabled.' 
  },
  { 
    title: 'Functional', 
    detail: 'Stores preferences such as preferred cities, saved parks, and accessibility settings so experiences feel familiar across your visits.' 
  },
  { 
    title: 'Analytics', 
    detail: 'Aggregated metrics that show which filters or guides are most helpful. We use privacy-focused tools like Google Analytics 4 (with IP anonymization) and Plausible to understand site usage patterns.' 
  },
  { 
    title: 'Marketing & Advertising', 
    detail: 'Enables personalized advertising through third-party advertising partners. These cookies help display relevant ads based on your browsing behavior. You can opt out at any time through your ad preferences or the Digital Advertising Alliance.' 
  },
];

export const metadata: Metadata = {
  title: 'Cookie Preferences | Privacy Settings - Indoor Dog Park',
  description: 'Manage your cookie preferences and privacy settings for IndoorDogPark. Control advertising cookies, analytics, and functionality preferences. Opt out of personalized advertising anytime.',
  keywords: [
    'cookie preferences',
    'privacy settings',
    'cookie policy',
    'data privacy',
    'website cookies',
    'privacy controls',
    'advertising cookies',
    'opt out ads',
    'personalized advertising',
    'third-party advertising'
  ],
  alternates: {
    canonical: '/cookie-preferences',
  },
  openGraph: {
    title: 'Cookie Preferences | Privacy Settings - Indoor Dog Park',
    description: 'Manage your cookie preferences and control advertising cookies. Opt out of personalized advertising anytime.',
    url: 'https://www.indoordogpark.org/cookie-preferences',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CookiePreferencesPage() {
  return (
    <PageLayout>
      <section className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-200">Privacy controls</p>
          <h1 className="mt-4 text-4xl font-bold md:text-5xl">Cookie preferences</h1>
          <p className="mt-4 text-lg text-slate-200">Choose how IndoorDogPark remembers your sessions, personalization settings, and marketing opt-ins.</p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4">
          <div className="grid gap-6 md:grid-cols-2">
            {cookieCategories.map((category, index) => (
              <article 
                key={category.title} 
                className={`rounded-3xl border p-6 transition-shadow hover:shadow-md ${
                  index === 3 // Marketing category
                    ? 'border-violet-200 bg-violet-50/30'
                    : 'border-slate-200 bg-slate-50/80'
                }`}
              >
                <div className="flex items-start gap-3">
                  {index === 3 && (
                    <div className="flex-shrink-0 mt-1">
                      <i className="bi bi-megaphone-fill text-violet-600 text-lg" aria-hidden="true"></i>
                    </div>
                  )}
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-slate-900">{category.title}</h2>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">{category.detail}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Advertising Information Banner */}
          <div className="rounded-3xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <i className="bi bi-info-circle-fill text-violet-600 text-2xl" aria-hidden="true"></i>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">About Personalized Advertising</h3>
                <p className="text-sm text-slate-700 leading-relaxed mb-3">
                  When you enable marketing cookies, our third-party advertising partners may use cookies and similar technologies to display personalized advertisements on our site. These ads are based on your browsing history and interests, making them more relevant to you.
                </p>
                <p className="text-sm text-slate-700 leading-relaxed mb-3">
                  <strong>You have full control:</strong> You can disable marketing cookies using the toggle above, or opt out of personalized advertising through{' '}
                  <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-violet-700 underline font-semibold hover:text-violet-800">
                    ad preference settings
                  </a>
                  {' '}at any time. Disabling marketing cookies will show you non-personalized ads instead.
                </p>
                <div className="mt-4 pt-4 border-t border-violet-200">
                  <p className="text-xs text-slate-600">
                    We work with trusted advertising partners who have their own privacy policies. You can learn more about how these partners use data through their respective privacy policies.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <CookiePreferencesForm />

          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Retention & Third-Party Services</h2>
            <div className="space-y-4 text-sm text-slate-600">
              <p>
                Cookie data is retained for up to 13 months unless you clear your browser or opt out. When marketing cookies are enabled, we work with third-party advertising partners to display personalized advertisements.
              </p>
              
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                <h3 className="font-semibold text-slate-900 mb-2">Advertising Partners</h3>
                <p className="mb-3">Our third-party advertising partners use cookies and similar technologies to:</p>
                <ul className="list-disc space-y-1 ml-5 mb-3">
                  <li>Display personalized advertisements based on your browsing history</li>
                  <li>Measure ad performance and effectiveness</li>
                  <li>Prevent fraud and ensure ad quality</li>
                </ul>
                <p className="text-xs text-slate-500">These partners have their own privacy policies. We do not share your personally identifiable information (name, email) directly with advertisers.</p>
              </div>

              <div className="rounded-xl border border-violet-200 bg-violet-50/50 p-4">
                <h3 className="font-semibold text-slate-900 mb-2">Opt-Out Options</h3>
                <p className="mb-2">You have several ways to control personalized advertising:</p>
                <ul className="space-y-2">
                  <li>
                    <strong>Ad Preference Settings:</strong>{' '}
                    <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-violet-700 underline hover:text-violet-800">
                      Manage your ad preferences
                    </a>
                  </li>
                  <li>
                    <strong>Digital Advertising Alliance:</strong>{' '}
                    <a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-violet-700 underline hover:text-violet-800">
                      Opt out of interest-based advertising
                    </a>
                  </li>
                  <li>
                    <strong>European Users:</strong>{' '}
                    <a href="https://www.youronlinechoices.eu" target="_blank" rel="noopener noreferrer" className="text-violet-700 underline hover:text-violet-800">
                      Your Online Choices (EU)
                    </a>
                  </li>
                  <li>
                    <strong>Browser Settings:</strong> You can also disable cookies entirely through your browser settings, though this may affect site functionality.
                  </li>
                </ul>
              </div>

              <p className="text-xs text-slate-500 pt-2 border-t border-slate-200">
                Our advertising partners have their own privacy policies that govern how they collect and use data. We encourage you to review these policies to understand how your information is used for advertising purposes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

