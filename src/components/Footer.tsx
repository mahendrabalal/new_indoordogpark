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
