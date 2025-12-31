// Movie catalog page (client component)

"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Movie {
  id: number | string;
  title: string;
  image: string;
  category?: string;
  year?: number;
  popularity?: number;
}

function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden>
      <div className="skeleton-image" />
      <div className="skeleton-text" />
    </div>
  );
}

export default function BrowsePage(): JSX.Element {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    let isActive = true;

    async function fetchMovies() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/videos`, { signal });
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const data = await res.json();
        if (!isActive) return;
        // simple client-side pagination: load first (page * pageSize)
        const pageSize = 12;
        const start = 0;
        const end = page * pageSize;
        setMovies(Array.isArray(data) ? (data as any[]).slice(start, end) : []);
        setHasMore(Array.isArray(data) ? end < (data as any[]).length : false);
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.error('BrowsePage fetch error', err);
        setError('Unable to load movies.');
      } finally {
        if (isActive) setLoading(false);
      }
    }

    fetchMovies();
    return () => {
      isActive = false;
      controller.abort();
    };
  }, [page]);

  function loadMore() {
    if (hasMore && !loading) setPage(p => p + 1);
  }

  return (
    <main className="site-container browse-page" aria-labelledby="browse-heading">
      <header className="browse-header">
        <h1 id="browse-heading" className="browse-title">Browse Movies</h1>
        <p className="browse-subtitle">Hand-picked and personalized — explore trending and new releases.</p>
      </header>

      {error && <div role="alert" className="error">{error}</div>}

      <section className="browse-grid" aria-live="polite" aria-busy={loading}>
        {movies.map(movie => (
          <Link
            key={movie.id}
            href={`/video/${movie.id}`}
            className="movie-card"
            aria-label={`${movie.title}${movie.year ? `, ${movie.year}` : ''}`}
          >
            <div className="movie-card__img-wrapper">
              <Image
                src={movie.image || '/movies/placeholder.jpg'}
                alt={movie.title}
                width={400}
                height={600}
                className="movie-card__poster"
              />
            </div>

            <div className="movie-card__meta">
              <span className="movie-title">{movie.title}</span>
              <span className="muted" aria-hidden>{movie.year ?? ''}</span>
            </div>
          </Link>
        ))}

        {loading && Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={`s-${i}`} />)}
      </section>

      <div className="browse-actions">
        {hasMore ? (
          <button
            onClick={loadMore}
            className="btn btn--primary btn--cta"
            disabled={loading}
            aria-busy={loading}
            aria-label="Load more movies"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        ) : (
          <p className="muted">No more movies to load.</p>
        )}
      </div>
    </main>
  );
}


