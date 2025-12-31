// Implement a secure HLS video player.
// Requirements:
// - Adaptive bitrate streaming
// - Resume playback
// - Disable right-click
// - Prevent download via browser
// - Display playback errors gracefully
import React, { useRef, useEffect, useState } from 'react';
import Hls from 'hls.js';
import styles from './VideoPlayer.module.css';

interface VideoPlayerProps {
    src: string;
    poster?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let hls: Hls | null = null;

        if (Hls.isSupported() && videoRef.current) {
            hls = new Hls({
                capLevelToPlayerSize: true,
                maxBufferLength: 30,
            });
            hls.loadSource(src);
            hls.attachMedia(videoRef.current);

            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            setError('Network error occurred while streaming the video.');
                            hls?.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            setError('Media error occurred. Attempting to recover...');
                            hls?.recoverMediaError();
                            break;
                        default:
                            setError('An unrecoverable error occurred.');
                            hls?.destroy();
                            break;
                    }
                }
            }
            );
        }
        return () => {
            hls?.destroy();
        }
    }, [src]);

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
    };

    return (
        <div className={styles.videoContainer}>
            {error && <div className={styles.errorOverlay}>{error}</div>}
            <video
                ref={videoRef}
                className={styles.videoPlayer}
                poster={poster}
                controls
                onContextMenu={handleContextMenu}
                disablePictureInPicture
                controlsList="nodownload nofullscreen noremoteplayback"
            />
        </div>
    );
}
export default VideoPlayer;
            <div className={styles.details}>
                <p className={styles.description}>{movie.description}</p>
                <p><strong>Genre:</strong> {movie.genre.join(', ')}</p>
                <p><strong>Release Year:</strong> {movie.year}</p>
                <p><strong>Rating:</strong> {movie.rating}</p>
                <div className={styles.actions}>
                    <button onClick={handleStream} className={styles.streamButton}>Stream Now</button>
                    <button onClick={handleDownload} className={styles.downloadButton}>Download</button>
                </div>
                </div>
        </div>
    );
}
export default VideoPlayer;
            </div>
        </div>
    );
}
export default VideoPlayer;
            </div>
        </div>
    );
}
