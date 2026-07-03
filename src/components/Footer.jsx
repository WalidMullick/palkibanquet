export default function Footer({ config = {}, onNavigate }) {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (e, target) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(target);
    } else {
      const el = document.getElementById(target);
      if (el) {
        window.scrollTo({
          top: el.offsetTop - 80,
          behavior: 'smooth',
        });
      }
    }
  };

  const handlePageClick = (e, page) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <footer className="footer-container">
      <div className="footer-top">
        {/* Brand Info */}
        <div className="footer-brand">
          <h3 className="footer-logo">{config.businessName || 'PALKI BANQUET'}</h3>
          <p className="footer-desc">
            A premium luxury banquet venue located in Munshirhat, Howrah. We specialize in making your weddings, receptions, and celebrations truly royal.
          </p>
          <div className="social-icons">
            {config.socialLinks?.facebook && (
              <a href={config.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/></svg>
              </a>
            )}
            {config.socialLinks?.instagram && (
              <a href={config.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              </a>
            )}
            {config.socialLinks?.youtube && (
              <a href={config.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="YouTube">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.002 3.002 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-links-col">
          <h4 className="footer-col-title">Quick Links</h4>
          <ul className="footer-links">
            <li><a href="#home" onClick={(e) => handleLinkClick(e, 'home')}>Home</a></li>
            <li><a href="#about" onClick={(e) => handleLinkClick(e, 'about')}>About Us</a></li>
            <li><a href="#events" onClick={(e) => handleLinkClick(e, 'events')}>Events</a></li>
            <li><a href="#gallery" onClick={(e) => handleLinkClick(e, 'gallery')}>Photo Gallery</a></li>
            <li><a href="#faqs" onClick={(e) => handleLinkClick(e, 'faqs')}>FAQs</a></li>
            <li><a href="#admin" onClick={(e) => handlePageClick(e, 'admin')}>Admin Login</a></li>
          </ul>
        </div>

        {/* Facilities Preview */}
        <div className="footer-links-col">
          <h4 className="footer-col-title">Facilities</h4>
          <ul className="footer-links">
            <li><a href="#facilities" onClick={(e) => handleLinkClick(e, 'facilities')}>AC Banquet Hall</a></li>
            <li><a href="#facilities" onClick={(e) => handleLinkClick(e, 'facilities')}>Rooftop Garden</a></li>
            <li><a href="#facilities" onClick={(e) => handleLinkClick(e, 'facilities')}>Deluxe Guest Rooms</a></li>
            <li><a href="#facilities" onClick={(e) => handleLinkClick(e, 'facilities')}>Modern Stage & Lighting</a></li>
            <li><a href="#facilities" onClick={(e) => handleLinkClick(e, 'facilities')}>Ample Parking Area</a></li>
            <li><a href="#facilities" onClick={(e) => handleLinkClick(e, 'facilities')}>Full Generator Backup</a></li>
          </ul>
        </div>

        {/* Contact Info & Working Hours */}
        <div className="footer-links-col footer-contact-col">
          <h4 className="footer-col-title">Working Hours</h4>
          <p className="working-hours-text">
            <span>Weekdays:</span> {config.businessHours?.weekdays || '10:00 AM - 10:00 PM'}<br/>
            <span>Weekends:</span> {config.businessHours?.weekends || '09:00 AM - 11:00 PM'}<br/>
            <span style={{ fontSize: '0.8rem', fontStyle: 'italic', opacity: 0.8 }}>{config.businessHours?.note}</span>
          </p>

          <h4 className="footer-col-title" style={{ marginTop: '1.5rem' }}>Location</h4>
          <p className="contact-details-text">
            {config.contact?.address}<br/>
            <strong>{config.contact?.landmark}</strong>
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-wrapper">
          <p className="copyright-text">
            &copy; {currentYear} {config.businessName || 'PALKI BANQUET'}. All Rights Reserved. Designed with elegance.
          </p>
          <div className="footer-legal-links">
            <a href="#privacy" onClick={(e) => handlePageClick(e, 'privacy')}>Privacy Policy</a>
            <span className="bullet">&bull;</span>
            <a href="#terms" onClick={(e) => handlePageClick(e, 'terms')}>Terms & Conditions</a>
          </div>
        </div>
      </div>

      <style>{`
        .footer-container {
          background-color: var(--color-maroon-deep);
          color: rgba(255, 255, 255, 0.7);
          padding: 5rem 1.5rem 1.5rem 1.5rem;
          border-top: 3px solid var(--color-gold-luxury);
        }

        .footer-top {
          max-width: 1200px;
          margin: 0 auto 4rem auto;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 3rem;
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .footer-logo {
          color: var(--color-gold-light);
          font-size: 2.2rem;
          font-weight: 700;
          letter-spacing: 2px;
        }

        .footer-desc {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.9rem;
          line-height: 1.6;
        }

        .social-icons {
          display: flex;
          gap: 1rem;
          margin-top: 0.5rem;
        }

        .social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          background-color: rgba(255, 255, 255, 0.05);
          color: var(--color-gold-light);
          border: 1px solid rgba(197, 160, 89, 0.2);
          border-radius: 50%;
          transition: var(--transition-smooth);
          text-decoration: none;
        }

        .social-icon:hover {
          background-color: var(--color-gold-luxury);
          color: var(--color-maroon-deep);
          transform: translateY(-3px);
        }

        .footer-links-col {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .footer-col-title {
          color: var(--color-white);
          font-size: 1.2rem;
          font-weight: 500;
          letter-spacing: 1px;
          position: relative;
          padding-bottom: 0.5rem;
        }

        .footer-col-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 30px;
          height: 1px;
          background-color: var(--color-gold-luxury);
        }

        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .footer-links a {
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          font-size: 0.9rem;
          transition: var(--transition-smooth);
        }

        .footer-links a:hover {
          color: var(--color-gold-light);
          padding-left: 5px;
        }

        .working-hours-text,
        .contact-details-text {
          font-size: 0.9rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.6);
        }

        .working-hours-text span {
          color: var(--color-white);
          font-weight: 600;
        }

        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .footer-bottom-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .copyright-text {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
        }

        .footer-legal-links {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .footer-legal-links a {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
          text-decoration: none;
          transition: var(--transition-smooth);
        }

        .footer-legal-links a:hover {
          color: var(--color-gold-light);
        }

        .bullet {
          color: rgba(255, 255, 255, 0.2);
          font-size: 0.8rem;
        }

        @media (max-width: 992px) {
          .footer-top {
            grid-template-columns: 1fr 1fr;
            gap: 2.5rem;
          }
        }

        @media (max-width: 576px) {
          .footer-top {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .footer-bottom-wrapper {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
