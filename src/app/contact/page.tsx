import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us | Indoor Dog Park Support & Feedback',
  description: 'Have questions about our dog park directory? Contact the IndoorDogPark team for support, park listings, or partnership inquiries. We respond within 24 hours.',
  keywords: [
    'contact indoor dog park',
    'customer support',
    'list a dog park',
    'report issue',
    'partnership inquiries',
    'feedback'
  ],
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Us | Indoor Dog Park',
    description: 'Get in touch with the IndoorDogPark team. We are here to help with directory listings, support, and partnerships.',
    url: 'https://www.indoordogpark.org/contact',
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header variant="light" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="contact-hero">
          <div className="contact-hero-content">
            <h1>Get in Touch</h1>
            <p>At IndoorDogPark, we&rsquo;re committed to providing you with the most comprehensive directory of indoor dog parks and play areas. Whether you&rsquo;re a dog owner looking for the perfect spot, a business owner wanting to list your facility, or have questions about our platform, we&rsquo;re here to help. Our team typically responds within 24 hours. For the fastest response, please use the contact form below or email us directly.</p>
          </div>
        </section>

        {/* Main Contact Section */}
        <section className="contact-main">
          <div className="contact-container">
            <div className="contact-grid">
              {/* Contact Information */}
              <div className="contact-info-section">
                <h2>Contact Information</h2>

                <div className="contact-info-card">
                  <div className="contact-info-icon">
                    <i className="bi bi-envelope"></i>
                  </div>
                  <div className="contact-info-content">
                    <h3>Email</h3>
                    <p><a href="mailto:media@indoordogpark.org">media@indoordogpark.org</a></p>
                  </div>
                </div>

                <div className="contact-info-card">
                  <div className="contact-info-icon">
                    <i className="bi bi-clock"></i>
                  </div>
                  <div className="contact-info-content">
                    <h3>Response Time</h3>
                    <p>Within 24 hours</p>
                    <p className="contact-info-subtitle">Email is the fastest way to reach us</p>
                  </div>
                </div>

                <div className="contact-info-card">
                  <div className="contact-info-icon">
                    <i className="bi bi-info-circle"></i>
                  </div>
                  <div className="contact-info-content">
                    <h3>What We Can Help With</h3>
                    <ul className="contact-help-list">
                      <li>Park listings and submissions</li>
                      <li>Directory information updates</li>
                      <li>Technical support</li>
                      <li>Partnership opportunities</li>
                      <li>General inquiries</li>
                    </ul>
                  </div>
                </div>

                {/* Social Media Links */}
                {(process.env.NEXT_PUBLIC_SOCIAL_TWITTER || process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || process.env.NEXT_PUBLIC_SOCIAL_DIGG) && (
                  <div className="contact-info-card">
                    <div className="contact-info-icon">
                      <i className="bi bi-share-fill"></i>
                    </div>
                    <div className="contact-info-content">
                      <h3>Connect With Us</h3>
                      <div className="flex flex-wrap gap-4 mt-3">
                        {process.env.NEXT_PUBLIC_SOCIAL_TWITTER && (
                          <a
                            href={process.env.NEXT_PUBLIC_SOCIAL_TWITTER}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                            aria-label="Follow us on X (Twitter)"
                          >
                            <i className="bi bi-twitter"></i>
                            <span>X (Twitter)</span>
                          </a>
                        )}
                        {process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK && (
                          <a
                            href={process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                            aria-label="Follow us on Facebook"
                          >
                            <i className="bi bi-facebook"></i>
                            <span>Facebook</span>
                          </a>
                        )}
                        {process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM && (
                          <a
                            href={process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                            aria-label="Follow us on Instagram"
                          >
                            <i className="bi bi-instagram"></i>
                            <span>Instagram</span>
                          </a>
                        )}
                        {process.env.NEXT_PUBLIC_SOCIAL_DIGG && (
                          <a
                            href={process.env.NEXT_PUBLIC_SOCIAL_DIGG}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                            aria-label="Follow us on Digg"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi" viewBox="0 0 24 24">
                              <path d="M5.76 0v4.608h2.048V0H5.76zM.64 4.608v6.784H3.2V8.96h2.56v2.432h2.56V4.608H.64zm2.56 2.56H2.688v-1.024h.512v1.024zm5.12 4.224v4.608h5.632v-2.176h-2.56v-.256h2.56V9.216H8.32v2.176zm2.56 1.024H10.624v-1.024h.256v1.024zm5.12-5.248v4.608h5.632v-2.176h-2.56v-.256h2.56V9.216H16v2.176zm2.56 1.024H18.304v-1.024h.256v1.024z" />
                            </svg>
                            <span>Digg</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Form */}
              <div className="contact-form-section">
                <h2>Send us a Message</h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>

        {/* What Can You Contact Us About Section */}
        <section className="contact-topics">
          <div className="contact-container">
            <h2 className="text-center">What Can You Contact Us About?</h2>
            <div className="contact-topics-grid">
              <div className="contact-topic-card">
                <h3>List Your Park</h3>
                <p>Add your indoor dog park to our directory and reach thousands of dog owners. Select &ldquo;List a Park&rdquo; in the contact form to get started.</p>
              </div>
              <div className="contact-topic-card">
                <h3>Report an Issue</h3>
                <p>Found incorrect information or have a concern? Use the contact form and select &ldquo;Report an Issue&rdquo; to let us know.</p>
              </div>
              <div className="contact-topic-card">
                <h3>Partnership Opportunities</h3>
                <p>Interested in collaborating? Select &ldquo;Partnership&rdquo; in the contact form to discuss opportunities with our team.</p>
              </div>
              <div className="contact-topic-card">
                <h3>Technical Support</h3>
                <p>Experiencing issues with the website or app? Select &ldquo;Technical Support&rdquo; and we&rsquo;ll help troubleshoot.</p>
              </div>
              <div className="contact-topic-card">
                <h3>Feedback & Suggestions</h3>
                <p>Have ideas to improve IndoorDogPark? Select &ldquo;Feedback&rdquo; to share your thoughts and suggestions.</p>
              </div>
              <div className="contact-topic-card">
                <h3>General Inquiries</h3>
                <p>Have a question that doesn&rsquo;t fit into other categories? Select &ldquo;General Inquiry&rdquo; and we&rsquo;ll be happy to help.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="contact-faq">
          <div className="contact-container">
            <h2>Frequently Asked Questions</h2>

            <div className="faq-grid">
              <div className="faq-item">
                <h3>What should I do if I find incorrect information about a park?</h3>
                <p>Please use the contact form above and select &ldquo;Report an Issue&rdquo; as your category. Include details about which park and what information needs to be corrected.</p>
              </div>

              <div className="faq-item">
                <h3>How can I list my dog park on IndoorDogPark?</h3>
                <p>Select &ldquo;List a Park&rdquo; from the category dropdown in the contact form, or visit our dedicated <a href="/list-your-park">listing page</a> for more information about the process.</p>
              </div>

              <div className="faq-item">
                <h3>How long does it take to get a response?</h3>
                <p>We typically respond to inquiries within 24 business hours. Please mark your message as urgent if you need a faster response.</p>
              </div>

              <div className="faq-item">
                <h3>Do you offer partnership opportunities?</h3>
                <p>Yes! We&rsquo;re always interested in partnerships. Please select &ldquo;Partnership&rdquo; in the contact form to discuss potential collaboration opportunities.</p>
              </div>

              <div className="faq-item">
                <h3>I&rsquo;m having technical issues. How can I get help?</h3>
                <p>Select &ldquo;Technical Support&rdquo; in the contact form and describe the issue in detail. Our support team will help troubleshoot as quickly as possible.</p>
              </div>

              <div className="faq-item">
                <h3>Can I provide feedback or suggestions?</h3>
                <p>We&rsquo;d love to hear your ideas! Select &ldquo;Feedback&rdquo; in the contact form to share your thoughts on how we can improve IndoorDogPark.</p>
              </div>

              <div className="faq-item">
                <h3>Can I request a park to be added if it&rsquo;s not in the directory?</h3>
                <p>Absolutely! Use the contact form and select &ldquo;List a Park&rdquo; or &ldquo;General Inquiry&rdquo; to request that we add a park to our directory.</p>
              </div>

              <div className="faq-item">
                <h3>How do I update information about my listed park?</h3>
                <p>Use the contact form and select &ldquo;List a Park&rdquo; or &ldquo;Report an Issue&rdquo; to request updates. Include the park name and the information that needs to be changed.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Related Resources Section */}
        <section className="contact-faq" style={{ backgroundColor: '#f9fafb' }}>
          <div className="contact-container">
            <h2 className="text-center mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/faq" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">FAQ</h3>
                <p className="text-gray-600">Find answers to common questions about using our directory and finding the perfect indoor dog park for your pet.</p>
              </Link>
              <Link href="/list-your-park" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">List Your Park</h3>
                <p className="text-gray-600">Add your dog park to our directory and reach thousands of dog owners searching for quality indoor play spaces.</p>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
