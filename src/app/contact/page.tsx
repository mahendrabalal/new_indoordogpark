import { Metadata } from 'next';
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
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="contact-hero">
          <div className="contact-hero-content">
            <h1>Get in Touch</h1>
            <p>We&rsquo;d love to hear from you. Send us a message and we&rsquo;ll respond as soon as possible.</p>
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
                    <p><a href="mailto:support@indoordogpark.org">support@indoordogpark.org</a></p>
                    <p className="contact-info-subtitle">We&rsquo;ll respond within 24 hours</p>
                  </div>
                </div>

                <div className="contact-info-card">
                  <div className="contact-info-icon">
                    <i className="bi bi-telephone"></i>
                  </div>
                  <div className="contact-info-content">
                    <h3>Phone</h3>
                    <p><a href="tel:+1-555-123-4567">(555) 123-4567</a></p>
                    <p className="contact-info-subtitle">Monday - Friday, 9 AM - 5 PM PST</p>
                  </div>
                </div>

                <div className="contact-info-card">
                  <div className="contact-info-icon">
                    <i className="bi bi-geo-alt"></i>
                  </div>
                  <div className="contact-info-content">
                    <h3>Location</h3>
                    <p>San Francisco, CA 94102</p>
                    <p className="contact-info-subtitle">United States</p>
                  </div>
                </div>

                <div className="contact-info-card">
                  <div className="contact-info-icon">
                    <i className="bi bi-clock"></i>
                  </div>
                  <div className="contact-info-content">
                    <h3>Business Hours</h3>
                    <p>Mon - Fri: 9 AM - 5 PM</p>
                    <p>Sat - Sun: 10 AM - 4 PM</p>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="contact-form-section">
                <h2>Send us a Message</h2>
                <ContactForm />
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
                <p>We typically respond to inquiries within 24 business hours. For urgent matters, please call us during business hours.</p>
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
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
