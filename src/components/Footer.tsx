import Link from 'next/link';
import NewsletterForm from '@/components/NewsletterForm';

export default function Footer() {
  return (
    <footer className="footer-new">
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
              <li><Link href="/how-it-works">How it works</Link></li>

              <li><Link href="/blog">Blog</Link></li>
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

          {/* Subscribe Column */}
          <div className="footer-column col-span-full md:col-span-2 lg:col-span-1">
            <h4 className="footer-heading">Join the Pack</h4>
            <p className="mb-4 text-sm text-white/70">Get the latest indoor dog park news and updates.</p>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <NewsletterForm type="consumer" source="footer" variant="dark" />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        {(process.env.NEXT_PUBLIC_SOCIAL_TWITTER || process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || process.env.NEXT_PUBLIC_SOCIAL_DIGG) && (
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
            {process.env.NEXT_PUBLIC_SOCIAL_DIGG && (
              <a
                href={process.env.NEXT_PUBLIC_SOCIAL_DIGG}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Digg"
                title="Follow us on Digg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi" viewBox="0 0 512 512">
                  <path d="M81.7 172.3l-81.7 0 0 174.4 132.7 0 0-250.7-51 0 0 76.3zm0 133.4l-30.8 0 0-92.3 30.8 0 0 92.3zM378.9 172.3l0 174.4 81.8 0 0 28.5-81.8 0 0 40.8 133.1 0 0-243.7-133.1 0zm81.8 133.4l-30.8 0 0-92.3 30.8 0 0 92.3zm-235.6 41l82.1 0 0 28.5-82.1 0 0 40.8 133.3 0 0-243.7-133.3 0 0 174.4zm51.2-133.3l30.8 0 0 92.3-30.8 0 0-92.3zM153.3 96l51.3 0 0 51-51.3 0 0-51zm0 76.3l51.3 0 0 174.4-51.3 0 0-174.4z" />
                </svg>
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
