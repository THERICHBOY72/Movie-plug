"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function MobileMenu(): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <div className="mobile-menu-root">
      <button
        className="hamburger"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
      >
        <span className={`hamburger__box ${open ? 'is-open' : ''}`}>
          <span className="hamburger__inner" />
        </span>
      </button>

      <div className={`mobile-menu ${open ? 'open' : ''}`} role="dialog" aria-modal="true">
        <div className="mobile-menu__panel">
          <nav className="mobile-menu__nav">
            <Link href="/" onClick={() => setOpen(false)}>Home</Link>
            <Link href="/tvshows" onClick={() => setOpen(false)}>TV Shows</Link>
            <Link href="/movies" onClick={() => setOpen(false)}>Movies</Link>
            <Link href="/series" onClick={() => setOpen(false)}>Series</Link>
            <Link href="/admin" onClick={() => setOpen(false)}>Admin</Link>
            <Link href="/signup" onClick={() => setOpen(false)}>Sign up</Link>
          </nav>

          <div style={{marginTop: 'auto', paddingTop: '1rem'}}>
            <ThemeToggle />
          </div>
        </div>

        <div className="mobile-menu__backdrop" onClick={() => setOpen(false)} />
      </div>
    </div>
  );
}
