import { useState, useEffect } from 'react';

export default function Header({ config = {}, onNavigate }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Simple scroll-spy to set active section
      const sections = ['home', 'about', 'facilities', 'events', 'gallery', 'testimonials', 'faqs', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', target: 'home' },
    { label: 'About', target: 'about' },
    { label: 'Facilities', target: 'facilities' },
    { label: 'Events', target: 'events' },
    { label: 'Gallery', target: 'gallery' },
    { label: 'Testimonials', target: 'testimonials' },
    { label: 'FAQs', target: 'faqs' },
    { label: 'Contact', target: 'contact' },
  ];

  const handleLinkClick = (e, target) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (onNavigate) {
      // If we are on subpages (e.g. Admin or Privacy Policy), navigate to home first
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

  return (
    <header className={`header-container ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-wrapper">
        {/* Logo / Brand Name */}
        <a href="#home" className="logo" onClick={(e) => handleLinkClick(e, 'home')}>
          <span className="logo-text">{config.businessName || 'PALKI BANQUET'}</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          {navItems.map((item) => (
            <a
              key={item.target}
              href={`#${item.target}`}
              className={`nav-link ${activeSection === item.target ? 'active' : ''}`}
              onClick={(e) => handleLinkClick(e, item.target)}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#enquiry"
            className="nav-btn-cta btn-primary"
            onClick={(e) => handleLinkClick(e, 'enquiry')}
            style={{ padding: '0.6rem 1.4rem', fontSize: '0.75rem' }}
          >
            Book Now
          </a>
        </nav>

        {/* Hamburger Menu Toggle (Mobile) */}
        <button
          className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <div className={`mobile-nav-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          {navItems.map((item) => (
            <a
              key={item.target}
              href={`#${item.target}`}
              className={`mobile-nav-link ${activeSection === item.target ? 'active' : ''}`}
              onClick={(e) => handleLinkClick(e, item.target)}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#enquiry"
            className="btn-primary"
            onClick={(e) => handleLinkClick(e, 'enquiry')}
            style={{ width: '100%', marginTop: '1.5rem', textAlign: 'center' }}
          >
            Book Now
          </a>
        </nav>
      </div>

      <style>{`
        .header-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 80px;
          z-index: 1000;
          transition: var(--transition-smooth);
          background: transparent;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .header-container.scrolled {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          height: 70px;
          border-bottom: 1px solid rgba(197, 160, 89, 0.2);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.03);
        }

        .header-wrapper {
          max-width: 1200px;
          height: 100%;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          text-decoration: none;
          display: flex;
          align-items: center;
        }

        .logo-text {
          font-family: var(--font-heading);
          font-size: 1.8rem;
          font-weight: 700;
          letter-spacing: 2px;
          color: var(--color-white);
          transition: var(--transition-smooth);
        }

        .header-container.scrolled .logo-text {
          color: var(--color-maroon-deep);
          font-size: 1.6rem;
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 1.8rem;
        }

        .nav-link {
          font-family: var(--font-body);
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.85);
          text-decoration: none;
          transition: var(--transition-smooth);
          position: relative;
          padding: 0.5rem 0;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0%;
          height: 1px;
          background-color: var(--color-gold-luxury);
          transition: var(--transition-smooth);
        }

        .nav-link:hover::after,
        .nav-link.active::after {
          width: 100%;
        }

        .nav-link:hover,
        .nav-link.active {
          color: var(--color-white);
        }

        .header-container.scrolled .nav-link {
          color: var(--color-charcoal-muted);
        }

        .header-container.scrolled .nav-link:hover,
        .header-container.scrolled .nav-link.active {
          color: var(--color-maroon-deep);
        }

        .hamburger {
          display: none;
          background: transparent;
          border: none;
          cursor: pointer;
          flex-direction: column;
          gap: 5px;
          z-index: 1100;
        }

        .bar {
          width: 25px;
          height: 2px;
          background-color: var(--color-white);
          transition: var(--transition-smooth);
        }

        .header-container.scrolled .bar {
          background-color: var(--color-maroon-deep);
        }

        /* Mobile hamburger animations */
        .hamburger.open .bar:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
          background-color: var(--color-maroon-deep);
        }
        .hamburger.open .bar:nth-child(2) {
          opacity: 0;
        }
        .hamburger.open .bar:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
          background-color: var(--color-maroon-deep);
        }

        .mobile-nav-drawer {
          position: fixed;
          top: 0;
          right: -100%;
          width: 280px;
          height: 100vh;
          background-color: var(--color-cream-bg);
          z-index: 999;
          transition: var(--transition-smooth);
          box-shadow: -5px 0 25px rgba(0, 0, 0, 0.08);
          border-left: 1px solid rgba(197, 160, 89, 0.2);
          display: flex;
          padding: 6rem 2rem 2rem 2rem;
        }

        .mobile-nav-drawer.open {
          right: 0;
        }

        .mobile-nav {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          width: 100%;
        }

        .mobile-nav-link {
          font-family: var(--font-body);
          font-size: 0.95rem;
          font-weight: 500;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--color-charcoal-text);
          text-decoration: none;
          transition: var(--transition-smooth);
          border-bottom: 1px solid rgba(84, 11, 29, 0.05);
          padding-bottom: 0.8rem;
        }

        .mobile-nav-link:hover,
        .mobile-nav-link.active {
          color: var(--color-maroon-deep);
          padding-left: 5px;
          border-bottom-color: var(--color-gold-luxury);
        }

        @media (max-width: 992px) {
          .desktop-nav {
            display: none;
          }
          .hamburger {
            display: flex;
          }
        }
      `}</style>
    </header>
  );
}
