'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link href="/" className="logo">
            <i className="bi bi-geo-alt-fill"></i>
            <span>DogPlaces</span>
          </Link>
        </div>

        <div className="header-center">
          {/* Desktop navigation - hidden on mobile */}
        </div>

        <div className="header-right">
          <Link href="/contact" className="header-link">Contact us</Link>
          <Link href="/list-property" className="header-link header-link-primary">
            List your park
          </Link>
          
          {user ? (
            <>
              <span className="header-link">Welcome, {user.email}</span>
              <button
                onClick={signOut}
                className="header-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/signup" className="header-link">Sign up</Link>
              <Link href="/login" className="header-link">Log in</Link>
            </>
          )}

          <div className="header-divider"></div>

          <button className="language-selector">
            EN <i className="bi bi-chevron-down"></i>
          </button>

          <button
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <i className="bi bi-list"></i>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <Link href="/contact" className="mobile-menu-item">Contact us</Link>
          <Link href="/list-property" className="mobile-menu-item">List your park</Link>
          
          {user ? (
            <>
              <span className="mobile-menu-item">Welcome, {user.email}</span>
              <button
                onClick={signOut}
                className="mobile-menu-item"
                style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/signup" className="mobile-menu-item">Sign up</Link>
              <Link href="/login" className="mobile-menu-item">Log in</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
