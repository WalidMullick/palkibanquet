import { useState, useEffect, useRef } from 'react';
import EnquiryForm from '../components/EnquiryForm';
import Carousel from '../components/Carousel';
import FAQAccordion from '../components/FAQAccordion';
import Lightbox from '../components/Lightbox';
import VideoPlayer from '../components/VideoPlayer';

// Facility SVG Icons dictionary
const SVG_ICONS = {
  ac: () => (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M17 5H7a3 3 0 00-3 3v8a3 3 0 003 3h10a3 3 0 003-3V8a3 3 0 00-3-3zM8 12h8M12 8l-3 4 3 4"/></svg>
  ),
  rooftop: () => (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 9h20L12 2zm-8 7v13h16V9M8 13h8v4H8v-4z"/></svg>
  ),
  lighting: () => (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v3M5.6 5.6l2.1 2.1M2 12h3M18.4 5.6l-2.1 2.1M22 12h-3M12 15a3 3 0 100-6 3 3 0 000 6zM9 18h6M10 21h4"/></svg>
  ),
  audio: () => (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3zM19 10v1a7 7 0 01-14 0v-1M12 18v5M8 23h8"/></svg>
  ),
  seating: () => (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 18v3M20 18v3M4 11h16M4 6h16M6 6v5M18 6v5M8 14h8v4H8v-4z"/></svg>
  ),
  stage: () => (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 17h20v4H2zm3-4h14M8 6h8M6 6v7M18 6v7"/></svg>
  ),
  bed: () => (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 20V5h3v9h14V5h3v15M4 9h16M2 14h20"/></svg>
  ),
  camera: () => (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2v11zM12 16a4 4 0 100-8 4 4 0 000 8z"/></svg>
  ),
  elevator: () => (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 3h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1zm5 9l3-3 3 3m-6 3l3 3 3-3"/></svg>
  ),
  parking: () => (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zm7 3v6h3a2.5 2.5 0 000-5H12zm0 0H9v12"/></svg>
  ),
  backup: () => (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
  ),
  flower: () => (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22a4 4 0 004-4v-4H8v4a4 4 0 004 4zM12 2a5 5 0 015 5c0 4-5 9-5 9s-5-5-5-9a5 5 0 015-5z"/></svg>
  ),
  dining: () => (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M5 7h14M3 11h18M7 16h10M9 16v4M15 16v4"/></svg>
  )
};

// Animated Stats Counter component
function StatItem({ label, value, suffix }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);

  useEffect(() => {
    let observer;
    let startTimestamp = null;
    const duration = 2000; // 2 seconds animation

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        window.requestAnimationFrame(step);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, [value]);

  return (
    <div className="stat-card glass-panel" ref={elementRef}>
      <h3 className="stat-value">{count}{suffix}</h3>
      <p className="stat-label">{label}</p>
    </div>
  );
}

export default function LandingPage({ config = {} }) {
  // Hero Carousel State
  const [heroSlide, setHeroSlide] = useState(0);
  
  // Gallery State
  const [galleryFilter, setGalleryFilter] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  // Video State
  const [activeVideo, setActiveVideo] = useState(null);

  // Scroll Reveal Animations
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
      reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        const elementVisible = 120;
        if (elementTop < windowHeight - elementVisible) {
          el.classList.add('active');
        }
      });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on mount
    return () => window.removeEventListener('scroll', revealOnScroll);
  }, [config]);

  // Hero Banner Autoplay
  useEffect(() => {
    if (!config.hero?.slides || config.hero.slides.length <= 1) return;
    const timer = setInterval(() => {
      setHeroSlide(prev => (prev + 1) % config.hero.slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [config]);

  const handleHeroScroll = (e, target) => {
    e.preventDefault();
    const el = document.getElementById(target);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  // Gallery Filtering
  const filteredGallery = config.gallery?.filter(img => 
    galleryFilter === 'all' || img.category.toLowerCase() === galleryFilter.toLowerCase()
  ) || [];

  const galleryCategories = [
    'all',
    'wedding',
    'reception',
    'engagement',
    'birthday',
    'decoration',
    'stage',
    'dining',
    'rooftop',
    'guest rooms',
    'corporate events'
  ];

  return (
    <main className="landing-container">
      {/* 1. Cinematic Hero Section */}
      <section id="home" className="hero-section">
        {config.hero?.slides?.map((slide, index) => (
          <div 
            key={index}
            className={`hero-bg-slide ${index === heroSlide ? 'active' : ''}`}
            style={{ backgroundImage: `linear-gradient(rgba(15, 3, 6, 0.45), rgba(15, 3, 6, 0.65)), url(${slide.image})` }}
          />
        ))}

        <div className="hero-content-wrapper">
          <span className="hero-welcome">WELCOME TO THE EPITOME OF GRANDEUR</span>
          <h1 className="hero-title">{config.hero?.heading}</h1>
          <div className="gold-divider"><span className="diamond"></span></div>
          <p className="hero-subtitle">{config.hero?.subheading}</p>
          
          <div className="hero-buttons">
            <a href="#enquiry" className="btn-primary" onClick={(e) => handleHeroScroll(e, 'enquiry')}>
              Book Your Event
            </a>
            <a href={`tel:${config.contact?.phone}`} className="btn-secondary">
              Call Now
            </a>
            <a href="#gallery" className="btn-secondary" onClick={(e) => handleHeroScroll(e, 'gallery')}>
              Watch Gallery
            </a>
          </div>
        </div>

        {/* Hero Slider Dots */}
        <div className="hero-slider-dots">
          {config.hero?.slides?.map((_, idx) => (
            <button
              key={idx}
              className={`hero-dot ${idx === heroSlide ? 'active' : ''}`}
              onClick={() => setHeroSlide(idx)}
              aria-label={`Go to hero slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. Elegant About Section */}
      <section id="about" className="section reveal">
        <div className="section-header">
          <span className="section-subtitle">{config.about?.subtitle || 'Luxury Hospitality'}</span>
          <h2 className="section-title">{config.about?.title || 'Welcome to PALKI BANQUET'}</h2>
          <div className="gold-divider"><span className="diamond"></span></div>
        </div>

        <div className="about-grid">
          <div className="about-text-content">
            <p className="about-desc">{config.about?.description}</p>
            
            <h3 className="highlights-title">Premium Features We Offer</h3>
            <div className="highlights-grid">
              {config.about?.highlights?.map((highlight, idx) => (
                <div key={idx} className="highlight-item">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="check-gold">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
            
            <a href="#enquiry" className="btn-outline-maroon" style={{ marginTop: '2rem' }} onClick={(e) => handleHeroScroll(e, 'enquiry')}>
              Request Customized Quotation
            </a>
          </div>

          <div className="about-image-frame">
            <div className="frame-border">
              <img 
                src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=700&q=80" 
                alt="Banquet Hall Interior" 
                className="about-frame-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Statistics Section (Counters) */}
      <section className="stats-section reveal">
        <div className="stats-grid">
          {config.stats?.map((stat, idx) => (
            <StatItem 
              key={idx}
              label={stat.label}
              value={stat.value}
              suffix={stat.suffix}
            />
          ))}
        </div>
      </section>

      {/* 4. Facilities Section */}
      <section id="facilities" className="section reveal">
        <div className="section-header">
          <span className="section-subtitle">Exquisite Amenities</span>
          <h2 className="section-title">Grand Facilities Offered</h2>
          <div className="gold-divider"><span className="diamond"></span></div>
        </div>

        <div className="facilities-grid">
          {config.facilities?.map((facility) => {
            const IconComponent = SVG_ICONS[facility.icon] || SVG_ICONS.ac;
            return (
              <div key={facility.id} className="facility-card glass-panel">
                <div className="facility-icon-container">
                  <IconComponent />
                </div>
                <h3>{facility.title}</h3>
                <p>{facility.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Event Categories Section */}
      <section id="events" className="section reveal">
        <div className="section-header">
          <span className="section-subtitle">Memorable Celebrations</span>
          <h2 className="section-title">Event Categories</h2>
          <div className="gold-divider"><span className="diamond"></span></div>
        </div>

        <div className="events-grid">
          {config.eventCategories?.map((event) => (
            <div key={event.id} className="event-card">
              <div 
                className="event-card-img" 
                style={{ backgroundImage: `url(${event.image})` }}
              />
              <div className="event-card-overlay">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <a href="#enquiry" className="event-card-link" onClick={(e) => handleHeroScroll(e, 'enquiry')}>
                  Enquire Now
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Why Choose Palki Banquet */}
      <section className="section reveal choose-section">
        <div className="section-header">
          <span className="section-subtitle">The Palki Distinction</span>
          <h2 className="section-title">Why Choose Palki Banquet?</h2>
          <div className="gold-divider"><span className="diamond"></span></div>
        </div>

        <div className="choose-grid">
          <div className="choose-card glass-panel">
            <h3>Luxury Interiors</h3>
            <p>Immaculately detailed designs, grand chandeliers, and premium seating arrangements that radiate sophistication.</p>
          </div>
          <div className="choose-card glass-panel">
            <h3>Professional Service</h3>
            <p>Highly trained hospitality team, event coordinators, and catering execution specialists focused on absolute comfort.</p>
          </div>
          <div className="choose-card glass-panel">
            <h3>Prime Location</h3>
            <p>Situated conveniently in Munshirhat, Howrah, near the Electric Office, with easy highway connectivity for guests.</p>
          </div>
          <div className="choose-card glass-panel">
            <h3>Affordable Packages</h3>
            <p>Bespoke pricing options that guarantee luxury, grand decorations, and amenities without breaking your budget.</p>
          </div>
        </div>
      </section>

      {/* 7. Premium Photo Gallery Section */}
      <section id="gallery" className="section reveal">
        <div className="section-header">
          <span className="section-subtitle">A Visual Symphony</span>
          <h2 className="section-title">Branded Photo Gallery</h2>
          <div className="gold-divider"><span className="diamond"></span></div>
        </div>

        {/* Categories Tab Selector */}
        <div className="gallery-filter-tabs">
          {galleryCategories.map(cat => (
            <button
              key={cat}
              className={`filter-tab ${galleryFilter === cat ? 'active' : ''}`}
              onClick={() => setGalleryFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Masonry Layout */}
        <div className="gallery-masonry">
          {filteredGallery.map((img, index) => (
            <div 
              key={index} 
              className="gallery-item-wrapper"
              onClick={() => setLightboxIndex(config.gallery.indexOf(img))}
            >
              <img 
                src={img.url} 
                alt={img.alt || 'Palki Banquet Showcase'} 
                className="gallery-img"
                loading="lazy"
              />
              <div className="gallery-img-overlay">
                <span className="overlay-icon">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                </span>
                <span className="overlay-cat">{img.category}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Premium Video Gallery Section */}
      <section className="section reveal video-section">
        <div className="section-header">
          <span className="section-subtitle">Cinematic Tours</span>
          <h2 className="section-title">Video Gallery</h2>
          <div className="gold-divider"><span className="diamond"></span></div>
        </div>

        <div className="videos-grid">
          {config.videos?.map((vid) => (
            <div key={vid.id} className="video-card glass-panel" onClick={() => setActiveVideo(vid)}>
              <div className="video-thumb-container">
                <img src={vid.thumbnail} alt={vid.title} className="video-thumbnail" />
                <div className="video-play-overlay">
                  <span className="play-pulse-btn">
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  </span>
                </div>
              </div>
              <h3 className="video-card-title">{vid.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Booking Process Timeline */}
      <section className="section reveal process-section">
        <div className="section-header">
          <span className="section-subtitle">Effortless Planning</span>
          <h2 className="section-title">Our Booking Process</h2>
          <div className="gold-divider"><span className="diamond"></span></div>
        </div>

        <div className="process-timeline">
          <div className="process-step">
            <div className="process-badge">1</div>
            <h3>Submit Enquiry</h3>
            <p>Fill out our simple premium booking callback form online.</p>
          </div>
          <div className="process-arrow">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 4l-1.41 1.41L15.17 10H3v2h12.17l-4.58 4.59L12 20l8-8z"/></svg>
          </div>
          <div className="process-step">
            <div className="process-badge">2</div>
            <h3>Consultation</h3>
            <p>Our concierge contacts you to discuss custom options.</p>
          </div>
          <div className="process-arrow">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 4l-1.41 1.41L15.17 10H3v2h12.17l-4.58 4.59L12 20l8-8z"/></svg>
          </div>
          <div className="process-step">
            <div className="process-badge">3</div>
            <h3>Venue Visit</h3>
            <p>Schedule a guided tour of our facilities at Munshirhat.</p>
          </div>
          <div className="process-arrow">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 4l-1.41 1.41L15.17 10H3v2h12.17l-4.58 4.59L12 20l8-8z"/></svg>
          </div>
          <div className="process-step">
            <div className="process-badge">4</div>
            <h3>Lock Date</h3>
            <p>Verify contract, make deposit, and confirm dates!</p>
          </div>
        </div>
      </section>

      {/* 10. Booking Enquiry Form Section (Most Important) */}
      <section id="enquiry" className="section reveal enquiry-section">
        <EnquiryForm config={config} />
      </section>

      {/* 11. Testimonials Section */}
      <section id="testimonials" className="section reveal testimonial-section">
        <div className="section-header">
          <span className="section-subtitle">Real Celebrations, Pure Love</span>
          <h2 className="section-title">What Families Say</h2>
          <div className="gold-divider"><span className="diamond"></span></div>
        </div>
        <Carousel items={config.testimonials} />
      </section>

      {/* 12. FAQ Section */}
      <section id="faqs" className="section reveal faq-section">
        <div className="section-header">
          <span className="section-subtitle">Got Questions?</span>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="gold-divider"><span className="diamond"></span></div>
        </div>
        <FAQAccordion items={config.faqs} />
      </section>

      {/* 13. Contact & Maps Section */}
      <section id="contact" className="section reveal contact-section">
        <div className="section-header">
          <span className="section-subtitle">Plan Your Visit</span>
          <h2 className="section-title">Contact & Directions</h2>
          <div className="gold-divider"><span className="diamond"></span></div>
        </div>

        <div className="contact-grid">
          {/* Map display */}
          <div className="map-wrapper glass-panel">
            <iframe
              src={config.contact?.googleMapsEmbedUrl}
              width="100%"
              height="380"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Palki Banquet Location Map"
            ></iframe>
          </div>

          {/* Contact Details Card */}
          <div className="contact-details-card glass-panel">
            <h3>Palki Banquet Office</h3>
            <div className="details-list">
              <div className="detail-item">
                <div className="detail-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                </div>
                <div className="detail-content">
                  <h4>Address</h4>
                  <p>{config.contact?.address}</p>
                  <span className="landmark-badge">{config.contact?.landmark}</span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                </div>
                <div className="detail-content">
                  <h4>Call Concierge</h4>
                  <p>{config.contact?.phoneFormatted}</p>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                </div>
                <div className="detail-content">
                  <h4>Email Address</h4>
                  <p>{config.contact?.email}</p>
                </div>
              </div>
            </div>

            <div className="action-buttons-group">
              <a href={`tel:${config.contact?.phone}`} className="btn-primary">
                Call Now
              </a>
              <a 
                href={config.contact?.googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ color: 'var(--color-maroon-deep)', borderColor: 'var(--color-maroon-deep)' }}
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Fullscreen Lightbox for Photo Gallery */}
      {lightboxIndex !== -1 && (
        <Lightbox
          images={config.gallery}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(-1)}
          onPrev={() => setLightboxIndex(prev => (prev - 1 + config.gallery.length) % config.gallery.length)}
          onNext={() => setLightboxIndex(prev => (prev + 1) % config.gallery.length)}
        />
      )}

      {/* Fullscreen Video Player */}
      {activeVideo && (
        <VideoPlayer
          videoUrl={activeVideo.videoUrl}
          title={activeVideo.title}
          onClose={() => setActiveVideo(null)}
        />
      )}

      <style>{`
        /* 1. Hero Styles */
        .hero-section {
          position: relative;
          height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .hero-bg-slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          opacity: 0;
          transform: scale(1.05);
          transition: opacity 1.5s ease-in-out, transform 7s linear;
          z-index: 0;
        }

        .hero-bg-slide.active {
          opacity: 1;
          transform: scale(1);
          z-index: 1;
        }

        .hero-content-wrapper {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: 0 1.5rem;
          max-width: 900px;
          color: var(--color-white);
        }

        .hero-welcome {
          font-family: var(--font-body);
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 3px;
          color: var(--color-gold-light);
          margin-bottom: 1.5rem;
          display: block;
        }

        .hero-title {
          font-size: 4rem;
          font-weight: 400;
          line-height: 1.1;
          color: var(--color-white);
          margin-bottom: 0.5rem;
        }

        .hero-subtitle {
          font-family: var(--font-body);
          font-size: 1.1rem;
          line-height: 1.6;
          color: rgba(255,255,255,0.8);
          max-width: 700px;
          margin: 0 auto 2.5rem auto;
        }

        .hero-buttons {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .hero-slider-dots {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 12px;
          z-index: 10;
        }

        .hero-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 1px solid var(--color-white);
          background: transparent;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .hero-dot.active {
          background-color: var(--color-gold-luxury);
          border-color: var(--color-gold-luxury);
          width: 30px;
          border-radius: 5px;
        }

        /* 2. About Section */
        .about-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .about-desc {
          font-size: 1.05rem;
          line-height: 1.8;
          margin-bottom: 2rem;
        }

        .highlights-title {
          font-family: var(--font-body);
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--color-maroon-deep);
          margin-bottom: 1.2rem;
          border-bottom: 1px solid rgba(84, 11, 29, 0.08);
          padding-bottom: 0.5rem;
        }

        .highlights-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .highlight-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--color-charcoal-text);
        }

        .check-gold {
          color: var(--color-gold-luxury);
          flex-shrink: 0;
        }

        .about-image-frame {
          position: relative;
        }

        .frame-border {
          border: 1px solid var(--color-gold-luxury);
          padding: 1.2rem;
          position: relative;
        }

        .frame-border::before {
          content: '';
          position: absolute;
          top: -15px;
          left: -15px;
          right: 15px;
          bottom: 15px;
          border: 1px solid rgba(197, 160, 89, 0.3);
          pointer-events: none;
        }

        .about-frame-img {
          width: 100%;
          height: auto;
          display: block;
          filter: grayscale(15%);
          transition: var(--transition-smooth);
        }

        .about-frame-img:hover {
          filter: grayscale(0%);
        }

        /* 3. Stats Section */
        .stats-section {
          background-color: var(--color-maroon-deep);
          padding: 4rem 1.5rem;
        }

        .stats-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }

        .stat-card {
          padding: 2.5rem 1.5rem;
          text-align: center;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255,255,255,0.06);
          box-shadow: none;
        }

        .stat-value {
          font-size: 3.5rem;
          font-weight: 300;
          color: var(--color-gold-light);
          margin-bottom: 0.5rem;
          line-height: 1;
        }

        .stat-label {
          color: rgba(255,255,255,0.7);
          font-family: var(--font-body);
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }

        /* 4. Facilities Section */
        .facilities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1.5rem;
        }

        .facility-card {
          padding: 2.5rem 2rem;
          transition: var(--transition-smooth);
          height: 100%;
          border-radius: 0;
        }

        .facility-icon-container {
          color: var(--color-gold-luxury);
          margin-bottom: 1.5rem;
          display: inline-block;
          transition: var(--transition-smooth);
        }

        .facility-card h3 {
          font-family: var(--font-body);
          font-size: 1.15rem;
          font-weight: 600;
          margin-bottom: 0.8rem;
          color: var(--color-maroon-deep);
        }

        .facility-card p {
          font-size: 0.85rem;
          line-height: 1.6;
        }

        .facility-card:hover {
          background-color: var(--color-white);
          transform: translateY(-5px);
          border-color: var(--color-gold-luxury);
          box-shadow: var(--shadow-premium);
        }

        .facility-card:hover .facility-icon-container {
          transform: scale(1.1) rotate(5deg);
        }

        /* 5. Event Categories */
        .events-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .event-card {
          position: relative;
          height: 380px;
          overflow: hidden;
          box-shadow: var(--shadow-premium);
        }

        .event-card-img {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          transition: transform 6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .event-card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(0deg, rgba(84, 11, 29, 0.95) 15%, rgba(0,0,0,0.2) 70%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 2rem;
          color: var(--color-white);
          transition: var(--transition-smooth);
        }

        .event-card h3 {
          color: var(--color-white);
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
          font-weight: 400;
        }

        .event-card p {
          color: rgba(255,255,255,0.75);
          font-size: 0.85rem;
          margin-bottom: 1.5rem;
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          transition: max-height 0.4s ease, opacity 0.4s ease;
        }

        .event-card-link {
          color: var(--color-gold-light);
          text-decoration: none;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 5px;
          transform: translateY(10px);
          opacity: 0;
          transition: var(--transition-smooth);
        }

        .event-card:hover .event-card-img {
          transform: scale(1.15);
        }

        .event-card:hover .event-card-overlay {
          background: linear-gradient(0deg, rgba(84, 11, 29, 0.98) 35%, rgba(0,0,0,0.3) 100%);
        }

        .event-card:hover p {
          max-height: 80px;
          opacity: 1;
        }

        .event-card:hover .event-card-link {
          transform: translateY(0);
          opacity: 1;
        }

        /* 6. Why Choose Palki */
        .choose-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .choose-card {
          padding: 2.2rem 1.8rem;
          text-align: center;
          background: rgba(255,255,255,0.6);
        }

        .choose-card h3 {
          font-family: var(--font-body);
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--color-maroon-deep);
          margin-bottom: 0.8rem;
        }

        .choose-card p {
          font-size: 0.82rem;
          line-height: 1.5;
        }

        /* 7. Gallery Filter Tabs */
        .gallery-filter-tabs {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 3rem;
        }

        .filter-tab {
          padding: 0.6rem 1.4rem;
          background: transparent;
          border: 1px solid rgba(84, 11, 29, 0.15);
          color: var(--color-charcoal-muted);
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 0.75rem;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .filter-tab:hover,
        .filter-tab.active {
          background-color: var(--color-maroon-deep);
          color: var(--color-white);
          border-color: var(--color-maroon-deep);
        }

        /* Gallery Masonry */
        .gallery-masonry {
          column-count: 4;
          column-gap: 1.5rem;
        }

        .gallery-item-wrapper {
          break-inside: avoid;
          margin-bottom: 1.5rem;
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-premium);
          cursor: pointer;
        }

        .gallery-img {
          width: 100%;
          height: auto;
          display: block;
          transition: transform 0.6s ease;
        }

        .gallery-img-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(84, 11, 29, 0.88);
          opacity: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: var(--color-white);
          transition: var(--transition-smooth);
        }

        .overlay-icon {
          color: var(--color-gold-light);
          transform: translateY(15px);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .overlay-cat {
          font-family: var(--font-body);
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          transform: translateY(15px);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.1s;
        }

        .gallery-item-wrapper:hover .gallery-img {
          transform: scale(1.08);
        }

        .gallery-item-wrapper:hover .gallery-img-overlay {
          opacity: 1;
        }

        .gallery-item-wrapper:hover .overlay-icon,
        .gallery-item-wrapper:hover .overlay-cat {
          transform: translateY(0);
        }

        /* 8. Videos Grid */
        .videos-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .video-card {
          padding: 1.2rem;
          background-color: var(--color-white);
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .video-thumb-container {
          position: relative;
          padding-top: 56.25%;
          overflow: hidden;
          width: 100%;
        }

        .video-thumbnail {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .video-play-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(15, 3, 6, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-smooth);
        }

        .play-pulse-btn {
          width: 60px;
          height: 60px;
          background-color: var(--color-white);
          color: var(--color-maroon-deep);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-left: 4px;
          transition: var(--transition-smooth);
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }

        .video-card:hover {
          transform: translateY(-5px);
          border-color: var(--color-gold-luxury);
        }

        .video-card:hover .video-thumbnail {
          transform: scale(1.05);
        }

        .video-card:hover .video-play-overlay {
          background-color: rgba(84, 11, 29, 0.6);
        }

        .video-card:hover .play-pulse-btn {
          background-color: var(--color-gold-luxury);
          color: var(--color-white);
          transform: scale(1.1);
        }

        .video-card-title {
          font-family: var(--font-body);
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--color-maroon-deep);
          margin-top: 1.2rem;
          letter-spacing: 0.3px;
        }

        /* 9. Booking Process Stepper */
        .process-timeline {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1000px;
          margin: 0 auto;
          gap: 1rem;
        }

        .process-step {
          flex: 1;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .process-badge {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: var(--color-maroon-deep);
          border: 1px solid var(--color-gold-luxury);
          color: var(--color-gold-light);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          font-weight: 600;
          box-shadow: var(--shadow-premium);
        }

        .process-step h3 {
          font-family: var(--font-body);
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--color-maroon-deep);
        }

        .process-step p {
          font-size: 0.8rem;
          line-height: 1.5;
        }

        .process-arrow {
          color: var(--color-gold-luxury);
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* 13. Contact & Map Section */
        .contact-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 3rem;
          align-items: center;
        }

        .map-wrapper {
          padding: 1rem;
          background-color: var(--color-white);
        }

        .contact-details-card {
          padding: 3rem 2.5rem;
          background: rgba(255,255,255,0.7);
        }

        .contact-details-card h3 {
          font-size: 1.8rem;
          margin-bottom: 2rem;
          font-weight: 500;
        }

        .details-list {
          display: flex;
          flex-direction: column;
          gap: 1.8rem;
          margin-bottom: 2.5rem;
        }

        .detail-item {
          display: flex;
          gap: 15px;
          align-items: flex-start;
        }

        .detail-icon {
          color: var(--color-gold-luxury);
          flex-shrink: 0;
          margin-top: 3px;
        }

        .detail-content h4 {
          font-family: var(--font-body);
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--color-maroon-deep);
          margin-bottom: 0.3rem;
          letter-spacing: 1px;
        }

        .detail-content p {
          font-size: 0.92rem;
          color: var(--color-charcoal-text);
          line-height: 1.5;
        }

        .landmark-badge {
          display: inline-block;
          font-size: 0.72rem;
          background-color: rgba(84, 11, 29, 0.05);
          color: var(--color-maroon-deep);
          padding: 0.2rem 0.6rem;
          margin-top: 0.5rem;
          font-weight: 600;
        }

        .action-buttons-group {
          display: flex;
          gap: 1.2rem;
        }

        .action-buttons-group .btn-primary,
        .action-buttons-group .btn-secondary {
          flex: 1;
        }

        /* RESPONSIVE LAYOUT MEDIA QUERIES */
        @media (max-width: 1024px) {
          .hero-title {
            font-size: 3.2rem;
          }
          .about-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          .stats-grid {
            grid-template-columns: 1fr 1fr;
          }
          .events-grid {
            grid-template-columns: 1fr 1fr;
          }
          .choose-grid {
            grid-template-columns: 1fr 1fr;
          }
          .gallery-masonry {
            column-count: 3;
          }
          .process-timeline {
            flex-direction: column;
            gap: 2rem;
          }
          .process-arrow {
            transform: rotate(90deg);
          }
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
          .hero-subtitle {
            font-size: 0.95rem;
          }
          .stats-grid {
            gap: 1rem;
          }
          .stat-value {
            font-size: 2.8rem;
          }
          .events-grid {
            grid-template-columns: 1fr;
          }
          .gallery-masonry {
            column-count: 2;
          }
          .videos-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 576px) {
          .choose-grid {
            grid-template-columns: 1fr;
          }
          .gallery-masonry {
            column-count: 1;
          }
          .highlights-grid {
            grid-template-columns: 1fr;
          }
          .contact-details-card {
            padding: 2rem 1.2rem;
          }
          .action-buttons-group {
            flex-direction: column;
            gap: 0.8rem;
          }
        }
      `}</style>
    </main>
  );
}
