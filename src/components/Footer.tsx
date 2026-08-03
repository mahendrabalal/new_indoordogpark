import Link from 'next/link';
import NewsletterForm from '@/components/NewsletterForm';

export default function Footer() {
  return (
    <footer className="footer-new footer-premium">
      {/* Decorative gradient line at top */}
      <div className="footer-premium-topline" aria-hidden="true" />
      
      <div className="footer-container">
        <div className="footer-grid">
          {/* IndoorDogPark Column */}
          <div className="footer-column">
            <h4 className="footer-heading">IndoorDogPark</h4>
            <ul className="footer-links">
              <li><Link href="/about">About us</Link></li>
              <li><Link href="/partners">Partners</Link></li>
            </ul>
          </div>

          {/* Discover Column */}
          <div className="footer-column">
            <h4 className="footer-heading">Discover</h4>
            <ul className="footer-links">
              <li><Link href="/">Browse parks</Link></li>
              <li><Link href="/indoor-agility-courses">Agility Courses</Link></li>
              <li><Link href="/small-dog-areas">Small Dog Areas</Link></li>
              <li><Link href="/how-it-works">How it works</Link></li>

              <li><Link href="/blog" prefetch={false}>Blog</Link></li>
              <li><Link href="/guides">Guides</Link></li>

              <li><Link href="/tools">Tools</Link></li>
              <li><Link href="/reports">Research Reports</Link></li>
            </ul>
          </div>

          {/* Park Owners Column */}
          <div className="footer-column">
            <h4 className="footer-heading">Park Owners</h4>
            <ul className="footer-links">
              <li><Link href="/list-your-park">List your park</Link></li>
              <li><Link href="/owner-resources">Owner resources</Link></li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="footer-column">
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-links">
              <li><Link href="/contact">Contact us</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
            </ul>
          </div>

          {/* Subscribe Column - Premium */}
          <div className="footer-column footer-column--subscribe col-span-full lg:col-span-2">
            <div className="footer-subscribe-header">
              <h4 className="footer-heading footer-heading--premium">Join the Pack</h4>
              <p className="footer-subscribe-subtitle">Get the latest indoor dog park news, exclusive offers, and updates delivered to your inbox.</p>
            </div>
            <div className="newsletter-premium-card">
              <NewsletterForm type="consumer" source="footer" variant="dark" />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        {(process.env.NEXT_PUBLIC_SOCIAL_TWITTER || process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || process.env.NEXT_PUBLIC_SOCIAL_PINTEREST) && (
          <div className="footer-social">
            {process.env.NEXT_PUBLIC_SOCIAL_TWITTER && (
              <a
                href={process.env.NEXT_PUBLIC_SOCIAL_TWITTER}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on X (Twitter)"
                title="Follow us on X (Twitter)"
              >
                <i className="bi bi-twitter"></i>
              </a>
            )}
            {process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK && (
              <a
                href={process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
                title="Follow us on Facebook"
              >
                <i className="bi bi-facebook"></i>
              </a>
            )}
            {process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM && (
              <a
                href={process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                title="Follow us on Instagram"
              >
                <i className="bi bi-instagram"></i>
              </a>
            )}
            {process.env.NEXT_PUBLIC_SOCIAL_PINTEREST && (
              <a
                href={process.env.NEXT_PUBLIC_SOCIAL_PINTEREST}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Pinterest"
                title="Follow us on Pinterest"
              >
                <i className="bi bi-pinterest"></i>
              </a>
            )}
            {process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN && (
              <a
                href={process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on LinkedIn"
                title="Follow us on LinkedIn"
              >
                <i className="bi bi-linkedin"></i>
              </a>
            )}
            {process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE && (
              <a
                href={process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Subscribe to our YouTube channel"
                title="Subscribe to our YouTube channel"
              >
                <i className="bi bi-youtube"></i>
              </a>
            )}

          </div>
        )}

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>&copy; 2025 IndoorDogPark. All rights reserved</p>
          <div className="footer-bottom-links">
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/cookie-preferences">Cookie Preferences</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
