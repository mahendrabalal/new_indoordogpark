import { Metadata } from 'next';
import Image from 'next/image';
import PageLayout from '@/components/PageLayout';

const termsSections = [
  {
    title: '1. Acceptance of Terms',
    body: [
      'When you access or utilize IndoorDogPark (referred to as "the Service"), you acknowledge that you have read, understood, and agree to comply with these Terms of Service (referred to as "Terms"). Should you disagree with any portion of these Terms, you must refrain from using the Service. We retain the right to update, modify, or revise these Terms at our discretion, and any such changes become effective as soon as they are published on the Service. Your ongoing use of the Service following any modifications indicates your acceptance of the updated Terms.',
      'Note: These Terms serve as a foundational framework. We recommend consulting with qualified legal counsel to develop comprehensive Terms of Service that are specifically tailored to your unique service offerings, data processing methods, applicable legal jurisdiction, and business operations, particularly when handling user data, integrating external services, or monetizing through advertising.',
    ],
  },
  {
    title: '2. Use of the Service',
    body: [
      'IndoorDogPark operates as a digital platform designed to help users locate and learn about indoor dog parks and pet-friendly venues. When using our Service, you commit to engaging with it solely for legitimate purposes that align with these Terms. All content you contribute—including but not limited to reviews, photographs, business listings, and comments—remains your responsibility.',
      'The following activities are strictly prohibited:',
    ],
    list: [
      'Publishing, uploading, or sharing any material that violates applicable laws, contains threats, harassment, discriminatory language, obscene content, invades privacy, or is otherwise inappropriate or offensive.',
      'Posting content that violates intellectual property rights, including copyrights, trademarks, patents, trade secrets, or other proprietary interests belonging to others.',
      'Providing deceptive, fraudulent, or factually incorrect information regarding businesses, facilities, or services listed on the platform.',
      'Attempting to breach security measures, access restricted areas, compromise user accounts, or infiltrate systems or networks associated with the Service.',
      'Employing methods that could compromise, overload, degrade, or otherwise negatively impact the Service\'s performance or interfere with other users\' access.',
      'Utilizing automated tools such as bots, crawlers, scrapers, or similar technologies to extract, monitor, or duplicate Service content without obtaining explicit written permission from us.',
      'Participating in actions that consume excessive computational resources or create disruptions that affect other users\' experience.',
      'Systematically gathering, extracting, or harvesting data from the Service for commercial or competitive purposes without proper authorization.',
      'Misrepresenting your identity, falsely claiming association with any individual or organization, or engaging in impersonation.',
    ],
    footer: 'Users must be 18 years of age or older to create accounts, submit listings, or post reviews. Individuals under 18 may access the directory for browsing purposes only, under appropriate adult supervision.',
  },
  {
    title: '3. Intellectual Property',
    body: [
      'All proprietary elements of the Service—including original content, design features, functionality, and infrastructure (excluding user-generated content)—are owned exclusively by IndoorDogPark and its licensors. These elements are safeguarded under copyright, trademark, and other applicable intellectual property laws.',
      'While you maintain ownership rights to the content you contribute (such as reviews, photos, listings, and comments), by submitting content to our Service, you automatically grant IndoorDogPark a comprehensive, non-exclusive, worldwide, royalty-free, perpetual, transferable, and fully sublicensable right and license. This license permits us to utilize, copy, edit, adapt, publish, translate, develop derivative works, distribute, perform, and exhibit your content across all media formats globally, both in connection with the Service and our broader business operations, including marketing and promotional activities.',
      'By submitting content, you affirm that you possess all necessary rights, authorizations, consents, and permissions to grant the license outlined above, and that your content does not infringe upon the rights of any third party.',
    ],
  },
  {
    title: '4. Third-Party Services',
    body: [
      'Our Service incorporates various external services, application programming interfaces (APIs), and integrated solutions, including but not limited to mapping platforms, payment processing systems, and analytics tools. When you interact with features that rely on these external services, you acknowledge that your data may be transmitted to and processed by these third-party systems in accordance with their own terms of service and privacy policies.',
      'Although we make reasonable efforts to ensure the quality and dependability of third-party integrations, IndoorDogPark cannot guarantee the continuous availability, precision, or proper functioning of these external services. We exercise no direct control over these services and therefore cannot be held responsible for problems, outages, or issues that may arise from their use.',
      'For comprehensive information regarding how third-party providers manage your data and their operational terms, we encourage you to review the privacy policies and terms of service documents published by each respective provider.',
    ],
  },
  {
    title: '5. Directory Information and Business Listings',
    body: [
      'We endeavor to maintain accurate and up-to-date business information through a combination of verification processes, direct submissions from business owners, and feedback from our user community. Nevertheless, business details—including pricing structures, available amenities, operating schedules, and service availability—are subject to change at any time, and we may not be immediately notified of such changes.',
      'Our directory listings are intended to serve as informational resources to assist in planning your visits. We strongly recommend that you directly contact the park or business establishment to verify essential details—such as current pricing, hours of operation, reservation requirements, or special conditions—prior to your visit. IndoorDogPark cannot be held responsible for any differences between the information displayed in our listings and actual on-site conditions, pricing variations, temporary closures, or permanent business shutdowns.',
      'Business owners who create or manage listings on our platform warrant that they possess the legal authority to represent the business entity and that all submitted information is truthful and accurate. Premium or featured listing placements are distinctly marked to ensure transparency. Subscription fees for enhanced listing services are charged upfront based on the chosen subscription tier. Subscriptions will automatically renew at the end of each billing cycle unless you actively cancel future renewals through our support channels.',
    ],
  },
  {
    title: '6. Disclaimers and Limitation of Liability',
    body: [
      'The Service is made available to you on an "AS IS" and "AS AVAILABLE" basis, without any representations or warranties of any kind, whether express or implied. IndoorDogPark disclaims all warranties regarding the Service\'s operation, availability, reliability, accuracy, completeness, or the quality of any information, content, or materials accessible through the Service.',
      'To the maximum extent allowed by applicable law, IndoorDogPark explicitly disclaims all warranties, whether express or implied, including without limitation warranties of merchantability, fitness for a particular purpose, non-infringement, and any warranties arising from course of dealing or usage of trade. Under no circumstances shall IndoorDogPark be liable for any form of damages—whether direct, indirect, incidental, special, punitive, or consequential—that result from your use of or inability to use the Service, including but not limited to data loss, service interruptions, or system failures.',
      'We do not warrant that the Service will be available continuously, without interruption, or free from errors, defects, or security vulnerabilities. Additionally, IndoorDogPark bears no responsibility for any injuries, property damage, financial losses, or other harm that may occur at facilities listed on our platform or that may result from reliance on information obtained through the Service.',
    ],
  },
  {
    title: '7. Privacy',
    body: [
      'Your privacy and the protection of your personal information are important to us. Our Privacy Policy, which is incorporated into these Terms by reference, comprehensively describes how we collect, use, store, share, and safeguard your information. This includes detailed explanations of our cookie practices, advertising data collection methods, and our relationships with third-party service providers.',
      'By accessing or using the Service, you explicitly consent to the collection, processing, and use of your information as described in our Privacy Policy. We encourage you to review the Privacy Policy carefully to understand your rights and our obligations regarding your personal data.',
    ],
  },
  {
    title: '8. Advertising',
    body: [
      'To support the free and open access nature of our directory, the Service may display commercial advertisements. These advertisements are typically delivered through third-party advertising networks and platforms, such as Google AdSense. Our advertising partners employ various tracking technologies, including cookies, web beacons, and similar mechanisms, to deliver advertisements that are relevant to your interests based on your browsing patterns and online behavior.',
      'All interactions you have with advertisements displayed on our Service are subject to the terms of service and privacy policies established by the respective advertising providers. For detailed information about how advertising data is collected and used, including options for personalized advertising, we direct you to review our Privacy Policy as well as the advertising policies published by Google and other relevant providers.',
      'If you prefer not to receive personalized advertisements, you have the option to opt out by adjusting your preferences through Google\'s Ad Settings or by utilizing the opt-out tools provided by the Digital Advertising Alliance.',
    ],
  },
  {
    title: '9. Governing Law',
    body: [
      'These Terms are interpreted, governed, and enforced in accordance with the laws of the United States of America and the State of California, without giving effect to any principles of conflicts of law. In the event of any legal disputes, claims, or controversies arising from or relating to these Terms or your use of the Service, such matters shall be subject to the exclusive jurisdiction of the state and federal courts located within the State of California.',
    ],
  },
  {
    title: '10. Contact Information',
    body: [
      'Should you have any questions, concerns, or require clarification regarding these Terms of Service, we invite you to reach out to us through the Contact Us form provided on our website.',
    ],
  },
];

export const metadata: Metadata = {
  title: 'Terms of Service | Legal Terms - Indoor Dog Park',
  description: 'Legal terms and conditions governing the use of IndoorDogPark directory, including listings, reviews, and paid services for dog park businesses.',
  keywords: [
    'terms of service',
    'legal terms',
    'user agreement',
    'service terms',
    'dog park directory terms',
    'business listing terms'
  ],
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: 'Terms of Service | Legal Terms - Indoor Dog Park',
    description: 'Legal terms and conditions for using the IndoorDogPark directory and services.',
    url: 'https://www.indoordogpark.org/terms',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <PageLayout>
      {/* Page Title Section */}
      <section className="terms-title-section">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <h1 className="terms-page-title">Terms of Service</h1>
          <p className="terms-page-date">Last Updated: December 25, 2025</p>
        </div>
      </section>

      {/* Hero Image Section */}
      <section className="terms-hero-section">
        <div className="mx-auto max-w-4xl px-4">
          <div className="terms-hero-background">
            <Image
              src="/images/terms/hero-indoor-dog-park.jpeg"
              alt="Indoor dog park facility with play structures and agility equipment"
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
          {termsSections.map((section) => (
            <article key={section.title} className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6">
              <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
              {section.body.map((paragraph, index) => (
                <p key={index} className="mt-4 text-sm leading-relaxed">{paragraph}</p>
              ))}
              {section.list && (
                <ul className="mt-4 ml-6 list-disc space-y-2 text-sm text-slate-600">
                  {section.list.map((item, index) => (
                    <li key={index} className="leading-relaxed">{item}</li>
                  ))}
                </ul>
              )}
              {section.footer && (
                <p className="mt-4 text-sm leading-relaxed">{section.footer}</p>
              )}
            </article>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}

