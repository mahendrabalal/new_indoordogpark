import { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import CookiePreferencesForm from '@/components/CookiePreferencesForm';

const cookieCategories = [
  { title: 'Strictly necessary', detail: 'Keeps you signed in, remembers listings you create, and maintains site security. Required for core functionality.' },
  { title: 'Functional', detail: 'Stores preferences such as preferred cities, saved parks, and accessibility settings so experiences feel familiar.' },
  { title: 'Analytics', detail: 'Aggregated metrics that show which filters or guides are most helpful. We use tools like Plausible and privacy-focused GA4 settings.' },
  { title: 'Marketing', detail: 'Helps us show relevant partnership offers or event reminders on our site and select dog-friendly channels.' },
];

export const metadata: Metadata = {
  title: 'Cookie Preferences | Privacy Settings - Indoor Dog Park',
  description: 'Manage your cookie preferences and privacy settings for IndoorDogPark. Control how we use cookies for functionality, analytics, and marketing.',
  keywords: [
    'cookie preferences',
    'privacy settings',
    'cookie policy',
    'data privacy',
    'website cookies',
    'privacy controls'
  ],
  alternates: {
    canonical: '/cookie-preferences',
  },
  openGraph: {
    title: 'Cookie Preferences | Privacy Settings - Indoor Dog Park',
    description: 'Manage your cookie preferences and privacy settings for IndoorDogPark.',
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
            {cookieCategories.map((category) => (
              <article key={category.title} className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6">
                <h2 className="text-xl font-semibold text-slate-900">{category.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{category.detail}</p>
              </article>
            ))}
          </div>

          <CookiePreferencesForm />

          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            <h2 className="text-xl font-semibold text-slate-900">Retention & third parties</h2>
            <p className="mt-3">Cookie data is retained for up to 13 months unless you clear your browser or opt out. We rely on privacy-first analytics providers (Plausible, GA4 with IP anonymization) and industry-standard advertising platforms when marketing cookies are enabled.</p>
            <p className="mt-3">You can also manage cookies at the browser level or opt out of interest-based advertising via <a className="text-violet-700 underline" href="https://optout.aboutads.info">optout.aboutads.info</a>.</p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

