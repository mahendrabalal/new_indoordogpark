import { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';

const dataWeCollect = [
  { title: 'Account & contact data', detail: 'Name, email, phone number, business details, and communication preferences when you create an account or submit a listing.' },
  { title: 'Usage data', detail: 'Pages visited, search queries, device information, approximate location, and interactions with maps or filters.' },
  { title: 'Content submissions', detail: 'Reviews, photos, and listing information you voluntarily provide, plus metadata such as timestamps.' },
  { title: 'Payment data', detail: 'Billing details processed securely by our payment partners (Stripe). We do not store full payment credentials.' },
];

const dataUsage = [
  'Operate and improve the IndoorDogPark directory, APIs, and support experiences.',
  'Verify businesses, prevent fraud, and enforce our community guidelines.',
  'Send transactional messages (account notifications, receipts, status updates).',
  'Provide personalized recommendations, guides, and marketing communications when permitted.',
  'Conduct research and analytics to understand park demand and program performance.',
];

const sharingPartners = [
  'Service providers such as hosting, email, analytics, and payment processing platforms under contractual confidentiality obligations.',
  'Park owners or partners when you intentionally request information, submit a booking inquiry, or interact with a listing form.',
  'Regulators or law enforcement if required to comply with legal obligations or protect rights, property, or safety.',
  'In connection with a merger, acquisition, or financing event, subject to continued protection of personal data.',
];

export const metadata: Metadata = {
  title: 'Privacy Policy - IndoorDogPark',
  description: 'Learn how IndoorDogPark collects, uses, and protects personal information for visitors and business partners.',
};

export default function PrivacyPage() {
  return (
    <PageLayout>
      <section className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-200">Privacy</p>
          <h1 className="mt-4 text-4xl font-bold md:text-5xl">Privacy policy</h1>
          <p className="mt-4 text-lg text-slate-200">Effective date: January 10, 2025</p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl space-y-8 px-4 text-slate-700">
          <article className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6">
            <h2 className="text-2xl font-bold text-slate-900">Information we collect</h2>
            <p className="mt-3 text-sm">We collect personal and usage information when you browse IndoorDogPark, create an account, submit a listing, or interact with our support team.</p>
            <ul className="mt-4 space-y-3 text-sm">
              {dataWeCollect.map((item) => (
                <li key={item.title} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-slate-600">{item.detail}</p>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-bold text-slate-900">How we use your data</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-sm text-slate-600">
              {dataUsage.map((use) => (
                <li key={use}>{use}</li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6">
            <h2 className="text-2xl font-bold text-slate-900">Sharing & disclosures</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-sm text-slate-600">
              {sharingPartners.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 text-sm leading-relaxed">
            <h2 className="text-2xl font-bold text-slate-900">Your choices</h2>
            <p className="mt-3">You may request access, corrections, or deletion of your personal information by emailing privacy@indoordogpark.org. We respond within 30 days unless additional verification is required.</p>
            <p className="mt-3">Marketing emails include an unsubscribe link. For cookies and similar technologies, visit the Cookie Preferences page to manage consent.</p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6 text-sm leading-relaxed">
            <h2 className="text-2xl font-bold text-slate-900">Data retention & security</h2>
            <p className="mt-3">We retain personal data for as long as needed to provide services, comply with legal obligations, resolve disputes, and enforce agreements. Data is stored on encrypted infrastructure with access restricted to authorized personnel.</p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 text-sm leading-relaxed">
            <h2 className="text-2xl font-bold text-slate-900">Children&rsquo;s privacy</h2>
            <p className="mt-3">IndoorDogPark does not knowingly collect personal information from children under 13. If you believe a child has provided data, contact us and we will delete it.</p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6 text-sm leading-relaxed">
            <h2 className="text-2xl font-bold text-slate-900">Updates to this policy</h2>
            <p className="mt-3">We may update this policy to reflect product changes or regulatory requirements. Significant changes will be announced on this page and emailed to registered users.</p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 text-sm leading-relaxed">
            <h2 className="text-xl font-semibold text-slate-900">Contact us</h2>
            <p className="mt-2">IndoorDogPark Privacy Team</p>
            <p>548 Market St, PMB 23031, San Francisco, CA 94104</p>
            <p>Email: privacy@indoordogpark.org</p>
          </article>
        </div>
      </section>
    </PageLayout>
  );
}

