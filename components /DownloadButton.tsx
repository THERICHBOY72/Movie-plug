// Create a secure download button.
// Behavior:
// - Validate subscription via API
// - Request signed download URL
// - Handle expired links
import React, { useState } from 'react';
import axios from 'axios';
import styles from './DownloadButton.module.css';

interface DownloadButtonProps {
    fileId: string;
    buttonText?: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ fileId, buttonText = "Download" }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDownload = async () => {
        setLoading(true);
        setError(null);
        try {
            // Validate subscription and get signed URL
            const response = await axios.post('/api/get-signed-url', { fileId });
            const { signedUrl } = response.data;

            // Initiate download
            const link = document.createElement('a');
            link.href = signedUrl;
            link.setAttribute('download', '');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    return (
        } catch (err) {
            setError('Failed to initiate download. Please try again later.');
        }
        setLoading(false);
    }
    return (
        <div className={styles.downloadContainer}>
            <button
                className={styles.downloadButton}
                onClick={handleDownload}
                disabled={loading}
            >
                {loading ? 'Preparing Download...' : buttonText}
            </button>
            {error && <div className={styles.errorMessage}>{error}</div>}
        </div>
    );
};

export default DownloadButton;
                ref={videoRef}
                className={styles.videoPlayer}
                poster={poster}
                controls
                onContextMenu={handleContextMenu}
            />
        </div>
    );
};

export default VideoPlayer;
        </div>
    );
};

export default DownloadButton;
            <button
                className={styles.downloadButton}
                onClick={handleDownload}
                disabled={loading}
            >
                {loading ? 'Preparing Download...' : buttonText}
            </button>
            {error && <div className={styles.errorMessage}>{error}</div>}
        </div>
    );
};

export default DownloadButton;
