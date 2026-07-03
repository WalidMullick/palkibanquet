import { useEffect, useState } from 'react';

export default function Lightbox({ images = [], currentIndex = -1, onClose, onPrev, onNext }) {
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (currentIndex === -1) return;

    // Reset zoom on image change
    setScale(1);
    setPosition({ x: 0, y: 0 });

    // Keyboard handlers
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [currentIndex, onClose, onPrev, onNext]);

  if (currentIndex === -1 || !images[currentIndex]) return null;

  const currentImg = images[currentIndex];

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => {
    setScale(prev => {
      const nextScale = Math.max(prev - 0.5, 1);
      if (nextScale === 1) setPosition({ x: 0, y: 0 });
      return nextScale;
    });
  };

  const handleMouseDown = (e) => {
    if (scale === 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
        {/* Top Controls Bar */}
        <div className="lightbox-controls">
          <div className="lightbox-index">
            Image {currentIndex + 1} of {images.length}
          </div>
          <div className="control-buttons">
            <button onClick={handleZoomOut} disabled={scale === 1} className="control-btn" aria-label="Zoom Out">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M19 13H5v-2h14v2z"/></svg>
            </button>
            <button onClick={handleZoomIn} disabled={scale === 3} className="control-btn" aria-label="Zoom In">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            </button>
            <button onClick={onClose} className="control-btn close-btn" aria-label="Close Lightbox">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
            </button>
          </div>
        </div>

        {/* Previous Button */}
        <button className="nav-arrow prev-arrow" onClick={onPrev} aria-label="Previous Image">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>

        {/* Image Display */}
        <div 
          className="lightbox-stage"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            src={currentImg.url}
            alt={currentImg.alt || 'Gallery item'}
            className="lightbox-image"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
              transition: isDragging ? 'none' : 'transform 0.2s ease-out'
            }}
            onMouseDown={handleMouseDown}
            draggable={false}
          />
        </div>

        {/* Next Button */}
        <button className="nav-arrow next-arrow" onClick={onNext} aria-label="Next Image">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>

        {/* Caption Bar */}
        <div className="lightbox-caption">
          <h3>{currentImg.alt || 'Palki Banquet Setup'}</h3>
          <span className="caption-tag">{currentImg.category}</span>
        </div>
      </div>

      <style>{`
        .lightbox-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(15, 3, 6, 0.95); /* Extremely dark deep maroon/black */
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease;
        }

        .lightbox-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .lightbox-controls {
          height: 60px;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(180deg, rgba(0,0,0,0.5), transparent);
          z-index: 2010;
        }

        .lightbox-index {
          color: var(--color-gold-light);
          font-family: var(--font-body);
          font-size: 0.85rem;
          letter-spacing: 1px;
        }

        .control-buttons {
          display: flex;
          gap: 1.2rem;
        }

        .control-btn {
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.7);
          cursor: pointer;
          transition: var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .control-btn:hover:not(:disabled) {
          color: var(--color-gold-luxury);
        }

        .control-btn:disabled {
          color: rgba(255,255,255,0.2);
          cursor: not-allowed;
        }

        .close-btn {
          margin-left: 0.5rem;
        }

        .nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 50px;
          height: 50px;
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(197, 160, 89, 0.2);
          color: var(--color-white);
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2010;
          transition: var(--transition-smooth);
        }

        .nav-arrow:hover {
          background-color: var(--color-gold-luxury);
          color: var(--color-maroon-deep);
          border-color: var(--color-gold-luxury);
        }

        .prev-arrow {
          left: 2rem;
        }

        .next-arrow {
          right: 2rem;
        }

        .lightbox-stage {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
          padding: 2rem;
        }

        .lightbox-image {
          max-width: 90%;
          max-height: 80vh;
          object-fit: contain;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
          user-select: none;
        }

        .lightbox-caption {
          height: 80px;
          padding: 0 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(0deg, rgba(0,0,0,0.5), transparent);
          z-index: 2010;
          text-align: center;
          gap: 5px;
        }

        .lightbox-caption h3 {
          color: var(--color-white);
          font-family: var(--font-heading);
          font-weight: 500;
          font-size: 1.3rem;
          letter-spacing: 0.5px;
        }

        .caption-tag {
          font-family: var(--font-body);
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--color-gold-luxury);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (max-width: 768px) {
          .nav-arrow {
            width: 40px;
            height: 40px;
          }
          .prev-arrow { left: 1rem; }
          .next-arrow { right: 1rem; }
          .lightbox-image {
            max-width: 95%;
          }
          .lightbox-controls, .lightbox-caption {
            padding: 0 1rem;
          }
        }
      `}</style>
    </div>
  );
}
