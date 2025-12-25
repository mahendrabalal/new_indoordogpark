import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PageLayout from '@/components/PageLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy | Indoor Dog Park',
  description: 'Learn how IndoorDogPark collects, uses, discloses, and safeguards your information when you visit our website and use our directory services.',
  keywords: [
    'privacy policy',
    'data protection',
    'privacy rights',
    'GDPR',
    'CCPA',
    'data privacy',
    'cookie policy',
    'personal information'
  ],
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | Indoor Dog Park',
    description: 'Learn how IndoorDogPark collects, uses, discloses, and safeguards your information when you visit our website and use our directory services.',
    url: 'https://www.indoordogpark.org/privacy',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <PageLayout>
      {/* Page Title Section */}
      <section className="terms-title-section">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <h1 className="terms-page-title">Privacy Policy</h1>
          <p className="terms-page-date">Last Updated: January 10, 2025</p>
        </div>
      </section>

      {/* Hero Image Section */}
      <section className="terms-hero-section">
        <div className="mx-auto max-w-4xl px-4">
          <div className="terms-hero-background">
            <Image
              src="/images/privacy/privacy.webp"
              alt="Privacy and data protection illustration"
              fill
              priority
              className="terms-hero-image"
              sizes="(max-width: 768px) 100vw, 896px"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      <section className="bg-white pt-8 pb-16">
        <div className="mx-auto max-w-4xl px-4 space-y-10 text-slate-700">
          {/* Section 1: Introduction */}
          <article className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6">
            <h2 className="text-2xl font-bold text-slate-900">1. Introduction</h2>
            <p className="mt-4 text-sm leading-relaxed">
              Welcome to IndoorDogPark (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;). We are committed to protecting your privacy and handling your data in an open and transparent manner. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <a href="https://www.indoordogpark.org" className="text-violet-600 hover:text-violet-700 underline">https://www.indoordogpark.org</a> (the &quot;Site&quot;) and use our directory services (the &quot;Services&quot;).
            </p>
            <p className="mt-4 text-sm leading-relaxed">
              Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the Site or use our Services. By using our Site and Services, you signify your acceptance of this Privacy Policy.
            </p>
            <p className="mt-4 text-sm leading-relaxed">
              We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the &quot;Last Updated&quot; date of this Privacy Policy. You are encouraged to periodically review this Privacy Policy to stay informed of updates.
            </p>
          </article>

          {/* Section 2: Information We Collect */}
          <article className="rounded-3xl border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-bold text-slate-900">2. Information We Collect</h2>
            <p className="mt-4 text-sm leading-relaxed">
              We may collect information about you in a variety of ways. The information we may collect on the Site includes:
            </p>

            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">A. Personal Data You Provide to Us</h3>
                <p className="mt-3 text-sm leading-relaxed">
                  We collect personally identifiable information that you voluntarily give to us when you:
                </p>
                <ul className="mt-3 ml-6 list-disc space-y-2 text-sm text-slate-600">
                  <li>Create an account (name, email address, phone number)</li>
                  <li>Submit a park listing (business details, contact information, park descriptions)</li>
                  <li>Submit reviews, photos, or other content</li>
                  <li>Use our contact forms or communicate with our support team</li>
                  <li>Subscribe to newsletters or marketing communications</li>
                  <li>Make payments for premium services (billing details processed securely by our payment partners like Stripe; we do not store full payment credentials)</li>
                </ul>
                <p className="mt-3 text-sm leading-relaxed">
                  You are under no obligation to provide us with personal information of any kind; however, your refusal to do so may prevent you from using certain features of the Site, such as submitting listings, posting reviews, or receiving responses to your inquiries.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900">B. Derivative Data (Usage Data & Analytics)</h3>
                <p className="mt-3 text-sm leading-relaxed">
                  Our servers (or servers of our hosting providers and analytics services like Google Analytics) may automatically collect standard log information when you access the Site. This can include:
                </p>
                <ul className="mt-3 ml-6 list-disc space-y-2 text-sm text-slate-600">
                  <li>Your IP address (which may be anonymized by analytics services)</li>
                  <li>Browser type and version</li>
                  <li>Operating system</li>
                  <li>Access times and pages viewed</li>
                  <li>Referring URLs</li>
                  <li>Device information (device type, screen resolution)</li>
                  <li>Approximate location data</li>
                  <li>Interactions with site features (searches, filters, map interactions)</li>
                </ul>
                <p className="mt-3 text-sm leading-relaxed">
                  This data is generally aggregated and anonymized where possible and is used for:
                </p>
                <ul className="mt-3 ml-6 list-disc space-y-2 text-sm text-slate-600">
                  <li>Analytics to understand how users interact with our Site and improve our Services</li>
                  <li>Monitoring site performance, identifying technical issues, and ensuring security</li>
                  <li>Understanding trends to enhance user experience and develop new features</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900">C. Cookies and Tracking Technologies</h3>
                <p className="mt-3 text-sm leading-relaxed">
                  We and our third-party partners, including advertising partners like Google AdSense and analytics providers like Google Analytics, may use cookies, web beacons, tracking pixels, and other tracking technologies on the Site. These technologies help customize the Site, improve your experience, measure the effectiveness of advertising campaigns, and display relevant advertisements.
                </p>
                <div className="mt-4 space-y-3">
                  <p className="text-sm font-semibold text-slate-900">Essential Cookies:</p>
                  <p className="text-sm text-slate-600">Some cookies are necessary for the basic functionality of the Site, such as remembering your preferences, keeping you signed in, and maintaining site security.</p>
                  
                  <p className="text-sm font-semibold text-slate-900">Analytics Cookies:</p>
                  <p className="text-sm text-slate-600">We use services like Google Analytics to collect information about your use of the Site (e.g., pages visited, time spent). This information is aggregated and helps us understand user behavior and improve our Services.</p>
                  
                  <p className="text-sm font-semibold text-slate-900">Advertising Cookies:</p>
                  <p className="text-sm text-slate-600">Third-party vendors, including Google (via AdSense), use cookies to serve ads based on a user&apos;s prior visits to our website or other websites. Google&apos;s use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our Site and/or other sites on the Internet.</p>
                </div>
                <p className="mt-4 text-sm leading-relaxed">
                  You can manage your ad preferences:
                </p>
                <ul className="mt-3 ml-6 list-disc space-y-2 text-sm text-slate-600">
                  <li>Opt out of personalized advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:text-violet-700 underline">Google Ad Settings</a></li>
                  <li>Alternatively, you can opt out of many third-party vendor&apos;s use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:text-violet-700 underline">www.aboutads.info/choices</a> or <a href="https://www.youronlinechoices.eu" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:text-violet-700 underline">www.youronlinechoices.eu</a> (for European users)</li>
                  <li>For more information on how Google uses data when you use our partners&apos; sites or apps, please see <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:text-violet-700 underline">Google&apos;s Privacy & Terms</a></li>
                </ul>
                <p className="mt-4 text-sm leading-relaxed">
                  You can typically remove or reject cookies via your browser settings. To do this, follow the instructions provided by your browser (usually located within the &quot;settings,&quot; &quot;help,&quot; &quot;tools,&quot; or &quot;edit&quot; facility). Most browsers are set to accept cookies by default. Note that if you remove or reject cookies, it could affect the availability and functionality of the Site. You can also manage your cookie preferences by visiting our <Link href="/cookie-preferences" className="text-violet-600 hover:text-violet-700 underline">Cookie Preferences</Link> page.
                </p>
              </div>
            </div>
          </article>

          {/* Section 3: How We Use Your Information */}
          <article className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6">
            <h2 className="text-2xl font-bold text-slate-900">3. How We Use Your Information</h2>
            <p className="mt-4 text-sm leading-relaxed">
              Having accurate information permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
            </p>
            <ul className="mt-4 ml-6 list-disc space-y-2 text-sm text-slate-600">
              <li>Provide, operate, and maintain our Site and Services, including displaying park listings, reviews, and directory information</li>
              <li>Improve, personalize, and expand our Site and Services based on user interaction and feedback</li>
              <li>Understand and analyze how you use our Site and Services to enhance user experience, develop new features, and optimize existing ones</li>
              <li>Respond to your comments, questions, and requests submitted via contact forms or other communication channels</li>
              <li>Verify businesses, prevent fraud, and enforce our community guidelines</li>
              <li>Send transactional messages (account notifications, receipts, status updates) and marketing communications when permitted</li>
              <li>Monitor and analyze usage patterns and trends to improve the Site&apos;s functionality, security, and performance</li>
              <li>Prevent fraudulent activity, protect the security of our Site and users, and investigate potential violations of our terms</li>
              <li>Display advertisements (e.g., via Google AdSense) to support the free nature of our Services and cover operational costs</li>
              <li>Comply with legal obligations, resolve disputes, and enforce our terms and conditions</li>
              <li>Send you technical notices, updates, security alerts, and support messages if necessary</li>
            </ul>
          </article>

          {/* Section 4: Disclosure of Your Information */}
          <article className="rounded-3xl border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-bold text-slate-900">4. Disclosure of Your Information</h2>
            <p className="mt-4 text-sm leading-relaxed">
              We do not sell, trade, rent, or otherwise transfer your personally identifiable information (like name and email) to outside parties for their marketing purposes without your consent. We may share information under the following circumstances:
            </p>

            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">By Law or to Protect Rights</h3>
                <p className="mt-3 text-sm leading-relaxed">
                  If we believe the release of information about you is necessary to respond to legal process (e.g., subpoena, court order), to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of IndoorDogPark, our users, or others, we may share your information as permitted or required by any applicable law, rule, or regulation.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900">Third-Party Service Providers</h3>
                <p className="mt-3 text-sm leading-relaxed">
                  We may share your information with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf and require access to such information to do that work. Examples include:
                </p>
                <ul className="mt-3 ml-6 list-disc space-y-2 text-sm text-slate-600">
                  <li>Data analysis and website analytics (e.g., Google Analytics)</li>
                  <li>Email delivery for contact form responses and newsletters</li>
                  <li>Hosting services and cloud infrastructure providers</li>
                  <li>Payment processing services (e.g., Stripe)</li>
                  <li>Map and geolocation services</li>
            </ul>
                <p className="mt-3 text-sm leading-relaxed">
                  We only share the minimum information necessary for them to perform their designated functions, and we make reasonable efforts to ensure they are obligated to maintain the confidentiality and security of your information.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900">Advertising Partners</h3>
                <p className="mt-3 text-sm leading-relaxed">
                  As mentioned, we allow third-party advertising partners like Google AdSense to use tracking technologies on the Site. This allows them to collect information about your interaction with our Site and other websites to display relevant advertisements. This information is collected directly by these third parties, and their use of it is governed by their own privacy policies. We do not share your personally identifiable information (like name or email) directly with advertisers.
                </p>
                <p className="mt-3 text-sm leading-relaxed">
                  Specifically, Google and other third-party vendors may place and read cookies on your browser, or use web beacons to collect information, as a result of ad serving on our website. This includes collecting device-specific information (such as device type, operating system, and browser type), IP addresses, and approximate location data to deliver relevant advertisements.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900">Park Owners or Partners</h3>
                <p className="mt-3 text-sm leading-relaxed">
                  When you intentionally request information, submit a booking inquiry, or interact with a listing form, we may share your contact information with the relevant park owner or partner to facilitate your request.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900">Business Transfers</h3>
                <p className="mt-3 text-sm leading-relaxed">
                  We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company. We will notify you before your personal information is transferred and becomes subject to a different privacy policy if applicable.
                </p>
                <p className="mt-3 text-sm leading-relaxed">
                  Non-personally identifiable visitor information (e.g., aggregated analytics data) may be provided to other parties for marketing, advertising, or other uses, but this will not include information that can identify you personally.
                </p>
              </div>
            </div>
          </article>

          {/* Section 5: Data Security */}
          <article className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6">
            <h2 className="text-2xl font-bold text-slate-900">5. Data Security</h2>
            <p className="mt-4 text-sm leading-relaxed">
              We use administrative, technical, and physical security measures to help protect your personal information. This includes using HTTPS (SSL/TLS) for data transmission between your browser and our Site, and relying on the security practices of our hosting providers and service partners.
            </p>
            <p className="mt-4 text-sm leading-relaxed">
              However, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse. Any information disclosed online is vulnerable to interception and misuse by unauthorized parties. Therefore, we cannot guarantee absolute security if you provide personal information.
            </p>
          </article>

          {/* Section 6: Your Data Rights */}
          <article className="rounded-3xl border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-bold text-slate-900">6. Your Data Rights (e.g., GDPR, CCPA)</h2>
            <p className="mt-4 text-sm leading-relaxed">
              Depending on your geographic location and applicable data protection laws, you may have certain rights regarding your personal information. These may include:
            </p>
            <ul className="mt-4 ml-6 list-disc space-y-2 text-sm text-slate-600">
              <li><strong>The right to access</strong> – You have the right to request copies of your personal data that we hold</li>
              <li><strong>The right to rectification</strong> – You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete</li>
              <li><strong>The right to erasure (Right to be Forgotten)</strong> – You have the right to request that we erase your personal data that we hold, under certain conditions</li>
              <li><strong>The right to restrict processing</strong> – You have the right to request that we restrict the processing of your personal data, under certain conditions</li>
              <li><strong>The right to object to processing</strong> – You have the right to object to our processing of your personal data, under certain conditions</li>
              <li><strong>The right to data portability</strong> – You have the right to request that we transfer the data that we have collected (that pertains to you) to another organization, or directly to you, under certain conditions</li>
            </ul>
            <p className="mt-4 text-sm leading-relaxed">
              If you are a resident of the European Economic Area (EEA), you are covered by the General Data Protection Regulation (GDPR). If you are a California resident, you are covered by the California Consumer Privacy Act (CCPA) / California Privacy Rights Act (CPRA).
            </p>
            <p className="mt-4 text-sm leading-relaxed">
              To exercise these rights, or to make inquiries about your data, please contact us at <a href="mailto:media@indoordogpark.org" className="text-violet-600 hover:text-violet-700 underline">media@indoordogpark.org</a>. We respond within 30 days unless additional verification is required. For managing advertising preferences related to cookies, please refer to the &quot;Cookies and Tracking Technologies&quot; section and the opt-out links provided.
            </p>
            <p className="mt-4 text-sm leading-relaxed">
              We do not &quot;sell&quot; your personal information in the traditional sense of exchanging it for monetary compensation. However, the use of advertising cookies by third parties like Google AdSense for personalized advertising may be considered a &quot;sale&quot; or &quot;sharing&quot; under laws like the CCPA/CPRA. You can opt-out of such personalized advertising as described in the &quot;Cookies and Tracking Technologies&quot; section.
            </p>
          </article>

          {/* Section 7: Children's Privacy */}
          <article className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6">
            <h2 className="text-2xl font-bold text-slate-900">7. Children&apos;s Privacy</h2>
            <p className="mt-4 text-sm leading-relaxed">
              Our Site and Services are not directed to, and we do not knowingly collect personally identifiable information from, children under the age of 13 (or a higher age threshold as required by applicable law, e.g., 16 in certain EEA jurisdictions). If we become aware that we have inadvertently collected personal information from a child under the relevant age without verifiable parental consent, we will take commercially reasonable steps to delete that information from our records as quickly as possible.
            </p>
            <p className="mt-4 text-sm leading-relaxed">
              If you believe we might have any information from or about a child under the relevant age, please contact us at <a href="mailto:media@indoordogpark.org" className="text-violet-600 hover:text-violet-700 underline">media@indoordogpark.org</a> so we can take appropriate action.
            </p>
          </article>

          {/* Section 8: Third-Party Websites */}
          <article className="rounded-3xl border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-bold text-slate-900">8. Third-Party Websites</h2>
            <p className="mt-4 text-sm leading-relaxed">
              The Site may contain links to third-party websites and applications of interest, including advertisements and external services (e.g., social media platforms, park websites), that are not affiliated with us or operated by us. Once you have used these links to leave the Site, any information you provide to these third parties is not covered by this Privacy Policy, and we cannot guarantee the safety and privacy of your information.
            </p>
            <p className="mt-4 text-sm leading-relaxed">
              Before visiting and providing any information to any third-party websites, you should inform yourself of the privacy policies and practices (if any) of the third party responsible for that website, and should take those steps necessary to, in your discretion, protect the privacy of your information. We are not responsible for the content or privacy and security practices and policies of any third parties, including other sites, services, or applications that may be linked to or from the Site.
            </p>
          </article>

          {/* Section 9: Changes to This Privacy Policy */}
          <article className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6">
            <h2 className="text-2xl font-bold text-slate-900">9. Changes to This Privacy Policy</h2>
            <p className="mt-4 text-sm leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes to our practices, new features, or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date at the top. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
            <p className="mt-4 text-sm leading-relaxed">
              Your continued use of our Site or Services after such modifications will constitute your: (a) acknowledgment of the modified Privacy Policy; and (b) agreement to abide and be bound by that Policy.
            </p>
          </article>

          {/* Section 10: Contact Us */}
          <article className="rounded-3xl border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-bold text-slate-900">10. Contact Us</h2>
            <p className="mt-4 text-sm leading-relaxed">
              If you have questions, comments, or concerns about this Privacy Policy, our data handling practices, or your choices, please contact us using the <Link href="/contact" className="text-violet-600 hover:text-violet-700 underline">Contact Us</Link> form available on our Site.
            </p>
          </article>
        </div>
      </section>
    </PageLayout>
  );
}
