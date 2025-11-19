'use client';

import Link from 'next/link';
import Image from 'next/image';
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
            <Image 
              src="/images/logo/logo.png" 
              alt="Indoor Dog Park logo" 
              width={220} 
              height={60} 
              priority 
              style={{ objectFit: 'contain', height: 'auto' }}
            />
          </Link>
        </div>

        <div className="header-center">
          {/* Desktop navigation - hidden on mobile */}
        </div>

        <div className="header-right">
          <Link href="/blog" className="header-link">Blog</Link>
          <Link href="/contact" className="header-link">Contact us</Link>
          <Link href="/list-your-park" className="header-link header-link-primary">
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
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <Link href="/blog" className="mobile-menu-item">Blog</Link>
          <Link href="/contact" className="mobile-menu-item">Contact us</Link>
          <Link href="/list-your-park" className="mobile-menu-item">List your park</Link>
          
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
    </header>
  );
}
