"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Video = { id: number; title: string; description?: string };

export default function SeriesPage(): JSX.Element {
  const [videos, setVideos] = useState<Video[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/videos');
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        setVideos(data || []);
      } catch (e) {
        setVideos([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="site-container">
      <h1>Series</h1>
      <p className="muted">All series organized by genre and newest seasons.</p>
      {loading && <div className="muted">Loading…</div>}
      <div className="featured__list">
        {videos?.length === 0 && !loading && <div className="muted">No videos available.</div>}
        {videos?.map(v => (
          <article key={v.id} className="movie-card">
            <div className="movie-card__img-wrapper">
              <div className="movie-card__poster" style={{ height: 200 }} />
            </div>
            <div className="movie-card__title">{v.title}</div>
            <div className="muted" style={{ fontSize: '.9rem' }}>{v.description}</div>
          </article>
        ))}
      </div>
    </div>
  )
}
