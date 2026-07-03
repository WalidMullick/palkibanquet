import { useState, useEffect } from 'react';

export default function ExitIntentModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only apply to desktop screens
    const isMobile = window.matchMedia('(max-width: 1024px)').matches;
    if (isMobile) return;

    // Check if user has already seen the popup in this session
    const hasSeenPopup = sessionStorage.getItem('palki_exit_intent_seen');
    if (hasSeenPopup) return;

    const handleMouseLeave = (e) => {
      // e.clientY < 5 detects cursor leaving the top viewport boundary (e.g., heading to close tab/URL bar)
      if (e.clientY < 5) {
        setIsOpen(true);
        sessionStorage.setItem('palki_exit_intent_seen', 'true');
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  if (!isOpen) return null;

  const handleActionClick = () => {
    setIsOpen(false);
    // Smooth scroll to enquiry form
    const el = document.getElementById('enquiry');
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="exit-overlay" onClick={() => setIsOpen(false)}>
      <div className="exit-modal glass-panel" onClick={(e) => e.stopPropagation()}>
        <button className="exit-close-btn" onClick={() => setIsOpen(false)} aria-label="Close offer popup">
          &times;
        </button>
        
        <div className="exit-content">
          <span className="exit-badge">Exclusive Celebration Offer</span>
          <h2 className="exit-title">Plan Your Royal Event</h2>
          <div className="gold-divider"><span className="diamond"></span></div>
          
          <p className="exit-desc">
            Book a venue site-visit tour this week and receive a <strong>Complimentary Stage & Theme Decor Consultation</strong> (valued at Rs. 15,000) for your event!
          </p>

          <div className="exit-actions">
            <button className="btn-primary" onClick={handleActionClick}>
              Claim Offer & Book Visit
            </button>
            <button className="btn-exit-dismiss" onClick={() => setIsOpen(false)}>
              No thanks, I will explore more
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .exit-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(15, 3, 6, 0.8);
          backdrop-filter: blur(6px);
          z-index: 3500;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          animation: exitFadeIn 0.3s ease;
        }

        .exit-modal {
          background-color: var(--color-cream-bg);
          border: 1px solid var(--color-gold-luxury);
          width: 100%;
          max-width: 550px;
          padding: 3rem 2.5rem;
          position: relative;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
          animation: exitSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          text-align: center;
        }

        .exit-close-btn {
          position: absolute;
          top: 15px;
          right: 20px;
          font-size: 2rem;
          background: transparent;
          border: none;
          color: var(--color-maroon-deep);
          cursor: pointer;
          line-height: 1;
          transition: var(--transition-fast);
        }

        .exit-close-btn:hover {
          color: var(--color-gold-luxury);
        }

        .exit-badge {
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--color-gold-luxury);
          background-color: rgba(197, 160, 89, 0.1);
          padding: 0.4rem 1rem;
          display: inline-block;
          margin-bottom: 1.2rem;
        }

        .exit-title {
          font-size: 2.2rem;
          color: var(--color-maroon-deep);
          font-weight: 500;
          line-height: 1.2;
        }

        .exit-desc {
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--color-charcoal-muted);
          margin-top: 1.2rem;
          margin-bottom: 2rem;
        }

        .exit-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .exit-actions .btn-primary {
          width: 100%;
          padding: 1.1rem;
          font-size: 0.85rem;
        }

        .btn-exit-dismiss {
          background: transparent;
          border: none;
          color: var(--color-charcoal-muted);
          font-family: var(--font-body);
          font-size: 0.8rem;
          text-decoration: underline;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .btn-exit-dismiss:hover {
          color: var(--color-maroon-deep);
        }

        @keyframes exitFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes exitSlideIn {
          from { transform: scale(0.9) translateY(30px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
