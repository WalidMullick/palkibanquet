import { useState, useEffect, useRef } from 'react';

export default function Carousel({ items = [], autoPlaySpeed = 6000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  const timerRef = useRef(null);

  useEffect(() => {
    if (items.length <= 1) return;

    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
      }, autoPlaySpeed);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [items, isPaused, autoPlaySpeed]);

  if (!items || items.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) handleNext();
    if (isRightSwipe) handlePrev();

    setTouchStart(0);
    setTouchEnd(0);
  };

  // Render Stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg
          key={i}
          viewBox="0 0 24 24"
          width="16"
          height="16"
          className={i < rating ? 'star active' : 'star'}
          fill="currentColor"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      );
    }
    return stars;
  };

  return (
    <div 
      className="carousel-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Testimonial Cards Wrapper */}
      <div className="carousel-stage">
        {items.map((item, index) => (
          <div 
            key={index}
            className={`carousel-slide ${index === currentIndex ? 'active' : ''} ${
              index === (currentIndex - 1 + items.length) % items.length ? 'prev' : ''
            } ${index === (currentIndex + 1) % items.length ? 'next' : ''}`}
          >
            <div className="testimonial-card glass-panel">
              <div className="quote-icon">“</div>
              <p className="testimonial-text">{item.text}</p>
              <div className="stars-container">{renderStars(item.rating)}</div>
              <div className="testimonial-author">
                <h4 className="author-name">{item.name}</h4>
                <span className="author-event">{item.event}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button className="carousel-nav-btn prev-btn" onClick={handlePrev} aria-label="Previous testimonial">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>
      <button className="carousel-nav-btn next-btn" onClick={handleNext} aria-label="Next testimonial">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>

      {/* Indicators Dots */}
      <div className="carousel-indicators">
        {items.map((_, index) => (
          <button
            key={index}
            className={`indicator-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>

      <style>{`
        .carousel-container {
          position: relative;
          max-width: 800px;
          margin: 0 auto;
          overflow: hidden;
          padding: 2rem 0;
        }

        .carousel-stage {
          position: relative;
          height: 380px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .carousel-slide {
          position: absolute;
          width: 85%;
          max-width: 650px;
          opacity: 0;
          visibility: hidden;
          transform: scale(0.85);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 1;
        }

        .carousel-slide.active {
          opacity: 1;
          visibility: visible;
          transform: scale(1);
          z-index: 3;
        }

        .carousel-slide.prev {
          opacity: 0.3;
          visibility: visible;
          transform: scale(0.85) translateX(-60%);
          z-index: 2;
          pointer-events: none;
        }

        .carousel-slide.next {
          opacity: 0.3;
          visibility: visible;
          transform: scale(0.85) translateX(60%);
          z-index: 2;
          pointer-events: none;
        }

        .testimonial-card {
          padding: 3rem 2.5rem;
          text-align: center;
          border-radius: 0px;
          position: relative;
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(197, 160, 89, 0.25);
          box-shadow: var(--shadow-premium);
        }

        .quote-icon {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          font-family: var(--font-heading);
          font-size: 6rem;
          color: rgba(197, 160, 89, 0.15);
          line-height: 1;
        }

        .testimonial-text {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          font-style: italic;
          line-height: 1.6;
          color: var(--color-charcoal-text);
          margin-bottom: 1.5rem;
        }

        .stars-container {
          display: flex;
          justify-content: center;
          gap: 4px;
          margin-bottom: 1.5rem;
        }

        .star {
          color: #DDD;
        }

        .star.active {
          color: var(--color-gold-luxury);
        }

        .testimonial-author {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .author-name {
          font-family: var(--font-body);
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--color-maroon-deep);
          letter-spacing: 0.5px;
        }

        .author-event {
          font-family: var(--font-body);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--color-gold-luxury);
        }

        .carousel-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          background-color: var(--color-white);
          border: 1px solid rgba(197, 160, 89, 0.25);
          color: var(--color-maroon-deep);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-smooth);
          z-index: 10;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .carousel-nav-btn:hover {
          background-color: var(--color-maroon-deep);
          color: var(--color-white);
          border-color: var(--color-maroon-deep);
        }

        .prev-btn {
          left: 10px;
        }

        .next-btn {
          right: 10px;
        }

        .carousel-indicators {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 1rem;
        }

        .indicator-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          background-color: rgba(197, 160, 89, 0.3);
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .indicator-dot.active {
          background-color: var(--color-maroon-deep);
          width: 24px;
          border-radius: 4px;
        }

        @media (max-width: 768px) {
          .carousel-stage {
            height: 400px;
          }
          .carousel-slide {
            width: 95%;
          }
          .testimonial-card {
            padding: 2.5rem 1.5rem;
          }
          .testimonial-text {
            font-size: 1.15rem;
          }
          .carousel-nav-btn {
            display: none; /* Hide arrows on touch mobile screens */
          }
        }
      `}</style>
    </div>
  );
}
