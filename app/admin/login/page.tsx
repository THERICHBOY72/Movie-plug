"use client";

import { useState } from 'react';

export default function AdminLogin(): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const body = new URLSearchParams();
    for (const [k, v] of formData.entries()) body.append(k, String(v));

    try {
      const res = await fetch('/token', { method: 'POST', body, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
      if (!res.ok) {
        setError('Invalid credentials');
      } else {
        const data = await res.json();
        const token = data.access_token || data.token;
        if (token) {
          localStorage.setItem('token', token);
          window.location.href = '/admin';
        } else {
          setError('No token received');
        }
      }
    } catch (e) {
      setError('Login failed');
    }
    setLoading(false);
  }

  return (
    <div className="site-container">
      <div className="form-card">
        <h1>Admin login</h1>
        <p className="muted">Sign in with your admin credentials.</p>

        <form className="form-grid" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username</label>
            <input id="username" name="username" required />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required />
          </div>

          <div style={{display: 'flex', gap: '.6rem'}}>
            <button className="btn btn--primary" type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
          </div>
        </form>

        {error && <div style={{marginTop: 12}} className="muted">{error}</div>}
      </div>
    </div>
  );
}
