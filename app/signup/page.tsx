"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage(): JSX.Element {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            // Create account
            const res = await fetch('/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ username: email, password })
            });
            if (!res.ok) throw new Error('Signup failed');

            // Immediately request token (OAuth2 password grant)
            const tokenRes = await fetch('/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ username: email, password })
            });
            if (!tokenRes.ok) throw new Error('Login failed');
            const tok = await tokenRes.json();
            localStorage.setItem('token', tok.access_token);
            router.push('/');
        } catch (err: any) {
            setError(err?.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <section aria-labelledby="signup-heading">
            <header className="site-container" style={{ paddingTop: 8, paddingBottom: 0 }}>
                <div className="panel" style={{ padding: '1rem 1.25rem' }}>
                    <h1 id="signup-heading">Create your account</h1>
                    <p className="muted">Sign up now to access unlimited streaming on Movie Plug.</p>
                </div>
            </header>

            <div className="form-card">
                <form className="form-grid" onSubmit={handleSubmit} aria-label="Sign up form">
                    <div>
                        <label htmlFor="email">Email</label>
                        <input id="email" name="email" type="email" required placeholder="you@domain.com" value={email} onChange={e => setEmail(e.target.value)} />
                        <div className="field-help">We&apos;ll never share your email.</div>
                    </div>

                    <div>
                        <label htmlFor="password">Password</label>
                        <input id="password" name="password" type="password" required placeholder="Choose a strong password" value={password} onChange={e => setPassword(e.target.value)} />
                        <div className="field-help">Use 8+ characters with a mix of letters and numbers.</div>
                    </div>

                    <div style={{ display: 'flex', gap: '.6rem', alignItems: 'center', marginTop: '.25rem' }}>
                        <button className="btn btn--primary transition" type="submit" disabled={loading}>{loading ? 'Creating…' : 'Create account'}</button>
                        <Link href="/" className="btn btn--secondary">Cancel</Link>
                    </div>
                </form>

                {error && <div className="muted" style={{ marginTop: 10 }}>{error}</div>}
                <p style={{ marginTop: 12 }} className="muted">Already have an account? <Link href="/">Sign in</Link></p>
            </div>
        </section>
    );
}
