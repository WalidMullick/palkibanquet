import { useEffect } from 'react';

export default function VideoPlayer({ videoUrl = '', title = '', onClose }) {
  useEffect(() => {
    if (!videoUrl) return;

    // Prevent body scroll while video is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [videoUrl]);

  if (!videoUrl) return null;

  // Helper to format YouTube urls to embed-safe format
  const getEmbedUrl = (url) => {
    if (!url) return '';
    try {
      // If already embed url, return it
      if (url.includes('embed/')) return url;

      let videoId = '';
      if (url.includes('youtube.com/watch')) {
        const urlParams = new URLSearchParams(new URL(url).search);
        videoId = urlParams.get('v');
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0];
      }
      
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }
      return url; // Fallback
    } catch {
      return url;
    }
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <div className="video-player-overlay" onClick={onClose}>
      <div className="video-player-container" onClick={(e) => e.stopPropagation()}>
        {/* Header Bar */}
        <div className="video-player-header">
          <h3>{title || 'Palki Banquet Tour'}</h3>
          <button className="video-close-btn" onClick={onClose} aria-label="Close video player">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>

        {/* Video Stage */}
        <div className="video-iframe-wrapper">
          {embedUrl.includes('youtube.com') || embedUrl.includes('youtube-nocookie.com') ? (
            <iframe
              src={embedUrl}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          ) : (
            // For direct video links / mp4 format
            <video src={embedUrl} controls autoPlay className="local-video-tag"></video>
          )}
        </div>
      </div>

      <style>{`
        .video-player-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(15, 3, 6, 0.95);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease;
          padding: 2rem;
        }

        .video-player-container {
          width: 100%;
          max-width: 960px;
          background-color: #000;
          border: 1px solid rgba(197, 160, 89, 0.3);
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          display: flex;
          flex-direction: column;
        }

        .video-player-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          background-color: rgba(84, 11, 29, 0.2);
          border-bottom: 1px solid rgba(197, 160, 89, 0.2);
        }

        .video-player-header h3 {
          color: var(--color-white);
          font-family: var(--font-heading);
          font-size: 1.2rem;
          font-weight: 500;
          letter-spacing: 0.5px;
        }

        .video-close-btn {
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.7);
          cursor: pointer;
          transition: var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .video-close-btn:hover {
          color: var(--color-gold-luxury);
        }

        .video-iframe-wrapper {
          position: relative;
          padding-top: 56.25%; /* 16:9 Aspect Ratio */
          height: 0;
          width: 100%;
        }

        .video-iframe-wrapper iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 0;
        }

        .local-video-tag {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (max-width: 576px) {
          .video-player-overlay {
            padding: 1rem;
          }
          .video-player-header {
            padding: 0.8rem 1rem;
          }
        }
      `}</style>
    </div>
  );
}
