import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer-new">
      <div className="footer-container">
        <div className="footer-grid">
          {/* DogPlaces Column */}
          <div className="footer-column">
            <h4 className="footer-heading">DogPlaces</h4>
            <ul className="footer-links">
              <li><Link href="/about">About us</Link></li>
              <li><Link href="/park-owners">Park owners</Link></li>
              <li><Link href="/partners">Partners</Link></li>
              <li><Link href="/media">Media</Link></li>
              <li><Link href="/careers">Careers</Link></li>
            </ul>
          </div>

          {/* Visitors Column */}
          <div className="footer-column">
            <h4 className="footer-heading">Visitors</h4>
            <ul className="footer-links">
              <li><Link href="/search">Search parks</Link></li>
              <li><Link href="/how-it-works">How it works</Link></li>
              <li><Link href="/guides">Guides</Link></li>
              <li><Link href="/group-visits">Group visits</Link></li>
            </ul>
          </div>

          {/* Landlords Column */}
          <div className="footer-column">
            <h4 className="footer-heading">Landlords</h4>
            <ul className="footer-links">
              <li><Link href="/list-park">List your park</Link></li>
              <li><Link href="/landlord-faq">FAQ</Link></li>
              <li><Link href="/landlord-portal">Landlord portal</Link></li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="footer-column">
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-links">
              <li><Link href="/contact">Contact support</Link></li>
              <li><Link href="/help">Help center</Link></li>
              <li><Link href="/talk-to-us">Talk to us</Link></li>
            </ul>
          </div>

          {/* Join us Column */}
          <div className="footer-column">
            <h4 className="footer-heading">Join us</h4>
            <ul className="footer-links">
              <li><Link href="/affiliate">Become an affiliate</Link></li>
              <li><Link href="/ambassador">Become an ambassador</Link></li>
              <li><Link href="/partnerships">B2B Partnerships</Link></li>
            </ul>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="footer-social">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <i className="bi bi-facebook"></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <i className="bi bi-instagram"></i>
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <i className="bi bi-youtube"></i>
          </a>
          <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">
            <i className="bi bi-pinterest"></i>
          </a>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>&copy; 2025 DogPlaces. All rights reserved</p>
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
