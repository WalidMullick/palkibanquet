import { useState, useEffect } from 'react';

export default function FloatingWidgets({ config = {} }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const phone = config.contact?.phone || '9836929210';
  const whatsapp = config.contact?.whatsapp || '9836929210';
  const whatsappMsg = encodeURIComponent(config.contact?.whatsappMessage || 'Hello, I would like to enquire about booking Palki Banquet.');

  const handleBookClick = (e) => {
    e.preventDefault();
    const el = document.getElementById('enquiry');
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      {/* Floating Buttons Group */}
      <div className="floating-actions-container">
        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/91${whatsapp}?text=${whatsappMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="floating-btn whatsapp-btn"
          aria-label="Chat on WhatsApp"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.019-5.117-2.875-6.976C16.592 1.898 14.1 1.838 12.01 1.838c-5.439 0-9.862 4.421-9.867 9.866-.001 1.802.5 3.526 1.449 5.093l-.974 3.557 3.649-.958zm11.238-7.797c-.3-.15-1.772-.875-2.046-.975-.276-.1-.477-.15-.677.15-.2.3-.777.975-.951 1.176-.176.2-.351.225-.651.075-1.026-.515-1.74-1.006-2.427-2.184-.175-.3-.175-.544-.025-.694.135-.135.3-.35.45-.525.15-.175.2-.3.3-.5s.05-.375-.025-.525c-.075-.15-.677-1.633-.926-2.233-.24-.576-.482-.497-.661-.506-.17-.008-.367-.01-.563-.01-.197 0-.518.073-.789.37-.27.297-1.033 1.01-1.033 2.46s1.056 2.85 1.204 3.05c.149.2 2.079 3.175 5.038 4.453.704.304 1.254.486 1.681.621.708.226 1.353.193 1.863.118.571-.085 1.772-.725 2.022-1.425.25-.7.25-1.299.175-1.424-.076-.125-.275-.2-.575-.35z"/>
          </svg>
        </a>

        {/* Phone Button */}
        <a
          href={`tel:${phone}`}
          className="floating-btn call-btn"
          aria-label="Call Us Now"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
        </a>

        {/* Book Now Button (Mobile sticky CTA dock alternative) */}
        <a
          href="#enquiry"
          onClick={handleBookClick}
          className="floating-btn book-btn"
          aria-label="Book Now"
        >
          <span className="book-text">Book Visit</span>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5z"/>
          </svg>
        </a>

        {/* Back to Top Button */}
        <button
          onClick={scrollToTop}
          className={`floating-btn scroll-to-top-btn ${isVisible ? 'visible' : ''}`}
          aria-label="Scroll to top"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </button>
      </div>

      <style>{`
        .floating-actions-container {
          position: fixed;
          bottom: 25px;
          right: 25px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          z-index: 999;
          align-items: flex-end;
        }

        .floating-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          color: var(--color-white);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          transition: var(--transition-smooth);
          text-decoration: none;
          border: none;
          cursor: pointer;
        }

        .floating-btn:hover {
          transform: scale(1.1) translateY(-3px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
        }

        .whatsapp-btn {
          background-color: #25D366;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .call-btn {
          background: linear-gradient(135deg, var(--color-maroon-deep), var(--color-maroon-light));
          border: 1px solid rgba(197, 160, 89, 0.3);
        }

        .book-btn {
          width: auto;
          height: 46px;
          padding: 0 1.2rem;
          border-radius: 25px;
          background: linear-gradient(135deg, var(--color-gold-luxury), #a88440);
          gap: 8px;
          font-family: var(--font-body);
          font-weight: 700;
          font-size: 0.75rem;
          letter-spacing: 1px;
          text-transform: uppercase;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .book-text {
          display: inline;
        }

        .scroll-to-top-btn {
          background-color: var(--color-white);
          color: var(--color-maroon-deep);
          border: 1px solid rgba(197, 160, 89, 0.3);
          opacity: 0;
          transform: translateY(30px);
          pointer-events: none;
          visibility: hidden;
        }

        .scroll-to-top-btn.visible {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
          visibility: visible;
        }

        .scroll-to-top-btn:hover {
          background-color: var(--color-maroon-deep);
          color: var(--color-white);
        }

        @media (max-width: 576px) {
          .floating-actions-container {
            bottom: 20px;
            right: 20px;
            gap: 10px;
          }
          .floating-btn {
            width: 46px;
            height: 46px;
          }
          .book-btn {
            height: 40px;
            padding: 0 1rem;
          }
          .book-text {
            display: none; /* Hide text on small screens, show icon only */
          }
        }
      `}</style>
    </>
  );
}
