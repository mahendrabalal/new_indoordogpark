import { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';

const termsSections = [
  {
    title: '1. Acceptance of terms',
    body: [
      'IndoorDogPark (“we”, “us”, “our”) operates a directory, content platform, and set of services that help dog owners discover indoor dog parks and dog-friendly establishments.',
      'By accessing our website, mobile experiences, APIs, or support channels you agree to these Terms of Service. If you represent a business listing, you also agree on behalf of that organization.',
    ],
  },
  {
    title: '2. Eligibility & acceptable use',
    body: [
      'You must be at least 18 years old to submit listings, reviews, or inquiries. Minors may browse the directory with guardian supervision.',
      'Do not misuse the service by scraping, attempting to access non-public areas, or uploading malicious code. We reserve the right to suspend or terminate accounts that violate these terms.',
    ],
  },
  {
    title: '3. Directory information',
    body: [
      'We strive to keep business information accurate through verification, owner submissions, and community feedback. However, details such as pricing, amenities, and availability may change without notice.',
      'Use listings as planning resources and contact the park directly to confirm critical details. IndoorDogPark is not liable for discrepancies between listings and real-world conditions.',
    ],
  },
  {
    title: '4. User contributions',
    body: [
      'Reviews, photos, and other contributions must be based on personal experiences, respect other community members, and comply with local laws.',
      'By submitting content you grant IndoorDogPark a non-exclusive, royalty-free license to display, reproduce, and distribute the material in connection with our services.',
    ],
  },
  {
    title: '5. Business listings & paid services',
    body: [
      'Owners confirm that they have the authority to represent the business and that all information provided is accurate. Paid placements and featured listings are clearly labeled.',
      'Fees are billed in advance according to the selected plan. Unless otherwise stated, subscriptions renew automatically. You may cancel future renewals anytime by contacting support.',
    ],
  },
  {
    title: '6. Disclaimers & limitation of liability',
    body: [
      'IndoorDogPark is provided “as is”. We do not guarantee continuous availability or error-free operation.',
      'To the fullest extent permitted by law, IndoorDogPark is not liable for indirect, incidental, or consequential damages arising from your use of the service.',
    ],
  },
  {
    title: '7. Privacy & data protection',
    body: [
      'We handle personal information as described in our Privacy Policy. Using the site indicates your consent to such processing.',
      'Businesses agree to handle any user data received through IndoorDogPark (such as inquiries or bookings) in compliance with applicable privacy laws.',
    ],
  },
  {
    title: '8. Changes to these terms',
    body: [
      'We may update these Terms of Service to reflect new features, regulatory requirements, or operational changes. When updates are material we will post an effective date and notify active account holders via email.',
      'Continued use of the service after changes become effective constitutes acceptance of the revised terms.',
    ],
  },
];

export const metadata: Metadata = {
  title: 'Terms of Service - IndoorDogPark',
  description: 'Legal terms governing the use of IndoorDogPark, including listings, reviews, and paid services.',
};

export default function TermsPage() {
  return (
    <PageLayout>
      <section className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-200">Legal</p>
          <h1 className="mt-4 text-4xl font-bold md:text-5xl">Terms of Service</h1>
          <p className="mt-4 text-lg text-slate-200">Effective date: January 10, 2025</p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 space-y-10 text-slate-700">
          {termsSections.map((section) => (
            <article key={section.title} className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6">
              <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-4 text-sm leading-relaxed">{paragraph}</p>
              ))}
            </article>
          ))}
          <article className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            <h2 className="text-xl font-semibold text-slate-900">Contact</h2>
            <p className="mt-3">IndoorDogPark, 548 Market St, PMB 23031, San Francisco, CA 94104</p>
            <p className="mt-1">Email: legal@indoordogpark.org</p>
          </article>
        </div>
      </section>
    </PageLayout>
  );
}

