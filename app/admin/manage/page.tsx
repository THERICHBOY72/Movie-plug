"use client";

import { useEffect, useState } from 'react';
import AdminGuard from '../../../components /AdminGuard';

type VideoItem = {
  id: string;
  title: string;
  created_at?: string;
};

export default function AdminManage(): JSX.Element {
  const [items, setItems] = useState<VideoItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/admin/videos', { headers: token ? { Authorization: `Bearer ${token}` } : undefined });
      if (!res.ok) throw new Error(res.statusText || 'Failed');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Unable to load items — backend may be unavailable.');
      setItems([]);
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this item?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/admin/videos/${id}`, { method: 'DELETE', headers: token ? { Authorization: `Bearer ${token}` } : undefined });
      if (res.ok) setItems(prev => prev?.filter(i => i.id !== id) ?? null);
      else alert('Delete failed');
    } catch (e) {
      alert('Error deleting item');
    }
  }

  return (
    <AdminGuard>
    <div className="site-container">
      <h1>Manage Content</h1>
      <p className="muted">Edit or remove uploaded videos.</p>

      {loading && <div className="muted">Loading…</div>}
      {error && <div className="muted">{error}</div>}

      <div style={{display: 'grid', gap: '.75rem', marginTop: '.75rem'}}>
        {items && items.length === 0 && <div className="muted">No content found.</div>}
        {items?.map(item => (
          <div key={item.id} className="panel" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div>
              <div style={{fontWeight:700}}>{item.title}</div>
              <div className="muted" style={{fontSize: '.9rem'}}>{item.created_at ?? ''}</div>
            </div>
            <div style={{display:'flex',gap:'.5rem'}}>
              <button className="btn btn--secondary" onClick={() => alert('Edit UI not implemented')}>Edit</button>
              <button className="btn btn--ghost" onClick={() => handleDelete(item.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </AdminGuard>
  );
}
