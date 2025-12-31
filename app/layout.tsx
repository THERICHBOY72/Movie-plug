import './globals.css';
import Link from 'next/link';
import ThemeToggle from '../components /ThemeToggle';
import MobileMenu from '../components /MobileMenu';

export const metadata = {
  title: 'Movie Plug',
  description: 'Stream movies and shows',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <header className="site-container app-header">
          <Link href="/" className="brand">
            <span className="brand__logo" aria-hidden="true" />
            <span>Movie Plug</span>
          </Link>
          <nav className="nav">
            <Link href="/">Home</Link>
            <Link href="/tvshows">TV Shows</Link>
            <Link href="/movies">Movies</Link>
            <Link href="/series">Series</Link>
            <Link href="/signup">Sign up</Link>
            <Link href="/video">Watch</Link>
            <ThemeToggle />
          </nav>
          <MobileMenu />
        </header>

        <main className="site-container">
          {children}
        </main>
      </body>
    </html>
  )
}
