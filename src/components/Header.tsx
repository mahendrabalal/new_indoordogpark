'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavbarScroll } from '@/hooks/useNavbarScroll';

interface HeaderProps {
  variant?: 'default' | 'light';
}

export default function Header({ variant = 'default' }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { user, signOut } = useAuth();
  const { isVisible, isScrolled } = useNavbarScroll();
  const navRef = useRef<HTMLElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openDropdown]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [openDropdown]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const toggleDropdown = (dropdownName: string) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const handleMouseEnter = (dropdownName: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenDropdown(dropdownName);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  return (
    <header className={`header ${isVisible ? 'header-visible' : 'header-hidden'} ${isScrolled ? 'header-scrolled' : ''}${variant === 'light' ? ' header-light' : ''}`}>
      <div className="header-container">
        <div className="header-left">
          <Link href="/" className="logo">
            <Image
              src="/images/logo/logo.png"
              alt="Indoor Dog Park logo"
              width={160}
              height={44}
              priority
              style={{ objectFit: 'contain' }}
            />
          </Link>
        </div>

        <div className="header-center">
          {/* Desktop navigation - hidden on mobile */}
          <nav className="header-nav" aria-label="Main navigation" ref={navRef}>

            {/* Locations Dropdown */}
            <div
              className="header-nav-item"
              onMouseEnter={() => handleMouseEnter('locations')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className="header-nav-link"
                aria-haspopup="true"
                aria-expanded={openDropdown === 'locations'}
                onClick={() => toggleDropdown('locations')}
              >
                Locations <i className={`bi bi-chevron-down dropdown-icon ${openDropdown === 'locations' ? 'rotated' : ''}`}></i>
              </button>
              <div className={`header-dropdown ${openDropdown === 'locations' ? 'open' : ''}`}>
                <Link href="/cities/san-francisco" className="header-dropdown-link" onClick={() => setOpenDropdown(null)}>San Francisco</Link>
                <Link href="/cities/los-angeles" className="header-dropdown-link" onClick={() => setOpenDropdown(null)}>Los Angeles</Link>
                <Link href="/cities/san-diego" className="header-dropdown-link" onClick={() => setOpenDropdown(null)}>San Diego</Link>
                <Link href="/cities/new-york" className="header-dropdown-link" onClick={() => setOpenDropdown(null)}>New York</Link>
                <Link href="/cities/seattle" className="header-dropdown-link" onClick={() => setOpenDropdown(null)}>Seattle</Link>
              </div>
            </div>

            {/* Discover Dropdown */}
            <div
              className="header-nav-item"
              onMouseEnter={() => handleMouseEnter('discover')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className="header-nav-link"
                aria-haspopup="true"
                aria-expanded={openDropdown === 'discover'}
                onClick={() => toggleDropdown('discover')}
              >
                Discover <i className={`bi bi-chevron-down dropdown-icon ${openDropdown === 'discover' ? 'rotated' : ''}`}></i>
              </button>
              <div className={`header-dropdown ${openDropdown === 'discover' ? 'open' : ''}`}>
                <Link href="/parks-with-bars" className="header-dropdown-link" onClick={() => setOpenDropdown(null)}>Parks with Bars</Link>
                <Link href="/training-facilities" className="header-dropdown-link" onClick={() => setOpenDropdown(null)}>Training Facilities</Link>
                <Link href="/off-leash-dog-park" className="header-dropdown-link" onClick={() => setOpenDropdown(null)}>Off-Leash Parks</Link>
                <Link href="/how-it-works" className="header-dropdown-link" onClick={() => setOpenDropdown(null)}>How It Works</Link>
              </div>
            </div>

            {/* Resources Dropdown */}
            <div
              className="header-nav-item"
              onMouseEnter={() => handleMouseEnter('resources')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className="header-nav-link"
                aria-haspopup="true"
                aria-expanded={openDropdown === 'resources'}
                onClick={() => toggleDropdown('resources')}
              >
                Resources <i className={`bi bi-chevron-down dropdown-icon ${openDropdown === 'resources' ? 'rotated' : ''}`}></i>
              </button>
              <div className={`header-dropdown ${openDropdown === 'resources' ? 'open' : ''}`}>
                <Link href="/tools" className="header-dropdown-link" onClick={() => setOpenDropdown(null)}>Free Tools & Calculators</Link>
                <Link href="/guides" className="header-dropdown-link" onClick={() => setOpenDropdown(null)}>Dog Guides</Link>
                <Link href="/reports" className="header-dropdown-link" onClick={() => setOpenDropdown(null)}>Industry Reports</Link>

              </div>
            </div>

            <Link href="/about" className="header-nav-link">About</Link>
            <Link href="/blog" prefetch={false} className="header-nav-link">Blog</Link>


          </nav>
        </div>

        <div className="header-right">
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
            <Link href="/login" className="header-link">Log in</Link>
          )}

          <Link href="/list-your-park" className="header-link header-link-primary">
            List your park
          </Link>

          <button
            className="menu-toggle"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              setOpenDropdown(null);
            }}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <i className={isMenuOpen ? 'bi bi-x' : 'bi bi-list'}></i>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`} aria-hidden={!isMenuOpen}>
        {/* Core Discovery */}
        <Link href="/cities/new-york" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>Locations</Link>
        <Link href="/parks-with-bars" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>Parks with Bars</Link>
        <Link href="/off-leash-dog-park" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>Off-Leash Parks</Link>
        

        
        {/* Resources */}
        <Link href="/tools" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>Free Tools</Link>
        <Link href="/guides" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>Guides</Link>
        <Link href="/reports" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>Industry Reports</Link>
        <Link href="/blog" prefetch={false} className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>Blog</Link>


        
        <Link href="/about" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>About Us</Link>
        <Link href="/contact" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>Contact</Link>
        <Link href="/list-your-park" className="mobile-menu-item font-bold text-orange-600" onClick={() => setIsMenuOpen(false)}>List your park</Link>

        {user ? (
          <>
            <span className="mobile-menu-item text-slate-500">Logged in as {user.email}</span>
            <button
              onClick={() => {
                signOut();
                setIsMenuOpen(false);
              }}
              className="mobile-menu-item"
              style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}
            >
              Log out
            </button>
          </>
        ) : (
          <Link href="/login" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>Log in / Sign up</Link>
        )}
      </div>
    </header>
  );
}
