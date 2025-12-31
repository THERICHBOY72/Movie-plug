"use client";

import { useEffect, useState } from 'react';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }

    // verify token by calling backend user endpoint
    (async () => {
      try {
        const res = await fetch('/users/me', { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) {
          localStorage.removeItem('token');
          window.location.href = '/admin/login';
          return;
        }
        setReady(true);
      } catch (e) {
        localStorage.removeItem('token');
        window.location.href = '/admin/login';
      }
    })();
  }, []);

  if (!ready) return null;
  return <>{children}</>;
}
