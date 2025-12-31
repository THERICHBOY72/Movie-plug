"use client";

import { useState } from 'react';
import AdminGuard from '../../../components /AdminGuard';

export default function AdminUpload(): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    const form = e.currentTarget;
    const fd = new FormData(form);

    try {
      // Post to backend endpoint with Authorization header
      const token = localStorage.getItem('token');
      const res = await fetch('/admin/videos/upload', { method: 'POST', body: fd, headers: token ? { Authorization: `Bearer ${token}` } : undefined });
      if (res.ok) {
        setMessage('Upload successful.');
        form.reset();
      } else {
        const text = await res.text();
        setMessage('Upload failed: ' + (text || res.statusText));
      }
    } catch (err) {
      setMessage('Upload error — check backend or network.');
    }

    setLoading(false);
  }

  return (
    <AdminGuard>
    <div className="site-container">
      <div className="form-card">
        <h1>Upload Video</h1>
        <p className="muted">Fill in metadata and upload poster + video file.</p>

        <form className="form-grid" onSubmit={handleSubmit} encType="multipart/form-data">
          <div>
            <label htmlFor="title">Title</label>
            <input id="title" name="title" required />
          </div>

          <div>
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" rows={3} />
          </div>

          <div>
            <label htmlFor="poster">Poster (jpg/png)</label>
            <input id="poster" name="poster" type="file" accept="image/*" />
          </div>

          <div>
            <label htmlFor="video">Video file</label>
            <input id="video" name="file" type="file" accept="video/*" />
          </div>

          <div style={{display: 'flex', gap: '.6rem', alignItems: 'center'}}>
            <button className="btn btn--primary" type="submit" disabled={loading}>{loading ? 'Uploading…' : 'Upload'}</button>
            <button className="btn btn--secondary" type="reset">Reset</button>
          </div>
        </form>

        {message && <div style={{marginTop: 12}} className="muted">{message}</div>}
      </div>
    </div>
    </AdminGuard>
  );
}
