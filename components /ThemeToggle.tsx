"use client";

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('theme');
      if (stored) {
        setTheme(stored);
        document.documentElement.setAttribute('data-theme', stored);
        return;
      }
      const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
      const initial = prefersLight ? 'light' : 'dark';
      setTheme(initial);
      document.documentElement.setAttribute('data-theme', initial);
    } catch (e) {
      /* ignore */
    }
  }, []);

  function toggle() {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    try {
      localStorage.setItem('theme', next);
    } catch (e) {}
    document.documentElement.setAttribute('data-theme', next);
  }

  return (
    <button aria-pressed={theme === 'light'} onClick={toggle} className="btn btn--ghost" title="Toggle theme">
      {theme === 'light' ? 'Light' : 'Dark'}
    </button>
  );
}
