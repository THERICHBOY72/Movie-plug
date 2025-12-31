// Build a premium landing page for a subscription-based video streaming platform.
// Include hero section, featured movies carousel, pricing plans,
// call-to-action buttons, and responsive dark theme styling
// This UI must match top-tier consumer products (Netflix, MovieBox Apple TV, Stripe).
// Priorities: clean layout, perfect spacing, premium typography,
// subtle animations, responsive behavior, and accessibility.
// Refactor and improve styling without changing business logic.
import React from 'react';
import Link from 'next/link';

export default function HomePage(): JSX.Element {
  return (
    <div>
      <section className="panel" aria-labelledby="home-hero" style={{marginBottom: '1rem'}}>
        <div className="site-container">
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap'}}>
            <div style={{flex: '1 1 380px'}}>
              <h1 id="home-hero">Watch anywhere. Cancel anytime.</h1>
              <p className="muted">Stream thousands of movies and TV shows in stunning quality. No commitments — start your free trial today.</p>
              <div style={{display: 'flex', gap: '.6rem', marginTop: '.6rem'}}>
                <Link href="/signup" className="btn btn--primary transition">Start free trial</Link>
                <Link href="/browse" className="btn btn--secondary">Browse catalogue</Link>
              </div>
            </div>
            <div style={{width: 320, minWidth: 220}} aria-hidden>
              <div style={{height: 180, borderRadius: 10, background: 'linear-gradient(90deg, rgba(124,92,255,0.16), rgba(0,212,255,0.06))'}} />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="featured-heading" style={{marginTop: '1rem'}}>
        <div className="site-container">
          <div className="hero__title" style={{marginBottom: '.5rem'}}>
            <h2 id="featured-heading">Featured movies</h2>
          </div>
          <div className="featured__list">
            {Array.from({length:6}).map((_, i) => (
              <article key={i} className="movie-card" aria-hidden={false}>
                <div className="movie-card__img-wrapper">
                  <div className="movie-card__poster" style={{width: '100%', height: 220, background: 'linear-gradient(180deg, rgba(255,255,255,0.02), transparent)'}} />
                </div>
                <div className="movie-card__title">Movie Title {i+1}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="pricing-heading" style={{marginTop: '1.25rem'}}>
        <div className="site-container">
          <h2 id="pricing-heading">Plans that fit your life</h2>
          <div className="pricing__grid" style={{marginTop: '.75rem'}}>
            <div className="pricing-card panel">
              <div className="pricing-card__name">Basic</div>
              <div className="pricing-card__price">Free</div>
              <p className="muted">Limited access with ads.</p>
              <div style={{marginTop: '.5rem'}}>
                <Link href="/signup" className="btn btn--ghost">Get started</Link>
              </div>
            </div>
            <div className="pricing-card panel">
              <div className="pricing-card__name">Standard</div>
              <div className="pricing-card__price">$8.99/mo</div>
              <p className="muted">HD streaming on two devices.</p>
              <div style={{marginTop: '.5rem'}}>
                <Link href="/signup" className="btn btn--primary">Choose plan</Link>
              </div>
            </div>
            <div className="pricing-card panel">
              <div className="pricing-card__name">Premium</div>
              <div className="pricing-card__price">$13.99/mo</div>
              <p className="muted">Ultra HD and downloads.</p>
              <div style={{marginTop: '.5rem'}}>
                <Link href="/signup" className="btn btn--primary">Choose plan</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{marginTop: '1.5rem'}}>
        <div className="site-container panel" style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'1rem',flexWrap:'wrap'}}>
          <div style={{flex:'1 1 320px'}}>
            <h3>Ready to start watching?</h3>
            <p className="muted">Join Movie Plug and get your first month free.</p>
          </div>
          <div>
            <Link href="/signup" className="btn btn--primary">Create account</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

