// Movie detail page (server component)
import Image from 'next/image';
import Link from 'next/link';

interface MovieDetails {
    id: string;
    title: string;
    posterUrl: string;
    description: string;
    cast: string[];
    duration: string;
    trailerUrl?: string;
}

const DEFAULT_MOVIE: MovieDetails = {
    id: 'unknown',
    title: 'Unknown Movie',
    posterUrl: '/movies/placeholder.jpg',
    description: 'Description not available.',
    cast: [],
    duration: 'Unknown',
    trailerUrl: '',
};

async function fetchMovie(id: string): Promise<MovieDetails | null> {
    try {
        const res = await fetch(`/videos`, { cache: 'no-store' });
        if (!res.ok) return null;
        const list = await res.json();
        const found = list.find((v: any) => String(v.id) === String(id));
        if (!found) return null;
        return {
            id: String(found.id),
            title: found.title || 'Untitled',
            posterUrl: found.posterUrl || '/movies/placeholder.jpg',
            description: found.description || '',
            cast: found.cast || [],
            duration: found.duration || 'Unknown',
            trailerUrl: found.trailerUrl || ''
        };
    } catch (err) {
        console.error('Error fetching movie details', err);
        return null;
    }
}

export default async function MovieDetailPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const movie = (await fetchMovie(id)) ?? { ...DEFAULT_MOVIE, id };

    return (
        <main className="movie-detail container">
            <header className="movie-detail__header">
                <h1 className="movie-detail__title">{movie.title}</h1>
            </header>

            <section className="movie-detail__body">
                <Image src={movie.posterUrl || '/movies/placeholder.jpg'} alt={movie.title} width={300} height={450} className="movie-detail__poster" />

                <div className="movie-detail__content">
                    <p className="movie-detail__description">{movie.description}</p>
                    <p className="movie-detail__meta"><strong>Duration:</strong> {movie.duration}</p>
                    <p className="movie-detail__meta"><strong>Cast:</strong> {movie.cast.length ? movie.cast.join(', ') : 'N/A'}</p>

                    <div className="movie-detail__actions">
                        {movie.trailerUrl ? (
                            <a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer" className="btn btn--outline">Watch Trailer</a>
                        ) : null}

                        <Link href={`/player/${movie.id}`} className="btn btn--primary">Stream</Link>
                        <button className="btn btn--secondary">Download</button>
                    </div>
                </div>
            </section>
        </main>
    );
}