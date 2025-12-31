import Link from 'next/link';
import AdminGuard from '../../components /AdminGuard';

export default function AdminIndex(): JSX.Element {
  return (
    <AdminGuard>
    <div className="site-container">
      <div className="panel" style={{display: 'flex', gap: '1.25rem', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap'}}>
        <div style={{flex: '1 1 420px'}}>
          <h1>Admin Dashboard</h1>
          <p className="muted">Upload and manage video content — admin-only interface (UI only).</p>
        </div>
        <div style={{display: 'flex', gap: '.6rem'}}>
          <Link href="/admin/upload" className="btn btn--primary">Upload Content</Link>
          <Link href="/admin/manage" className="btn btn--secondary">Manage Content</Link>
          <Link href="/admin/analytics" className="btn btn--ghost">Analytics</Link>
        </div>
      </div>
    </div>
    </AdminGuard>
  );
}
