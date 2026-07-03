export default function PrivacyPolicy({ config = {}, onNavigate }) {
  const handleBack = (e) => {
    e.preventDefault();
    if (onNavigate) onNavigate('home');
  };

  return (
    <div className="policy-page-container">
      <div className="policy-wrapper glass-panel">
        <a href="#home" onClick={handleBack} className="btn-back">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back to Website
        </a>

        <h1 className="policy-title">Privacy Policy</h1>
        <span className="last-updated">Last Updated: July 3, 2026</span>
        <div className="gold-divider"><span className="diamond"></span></div>

        <div className="policy-content">
          <section>
            <h2>1. Introduction</h2>
            <p>
              Welcome to <strong>{config.businessName || 'PALKI BANQUET'}</strong>. We respect your privacy and are committed to protecting the personal data you share with us. This Privacy Policy explains how we collect, use, store, and safeguard your information when you visit our website or submit an enquiry for event bookings.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            <p>
              We collect information that you voluntarily provide to us when submitting an enquiry through our Booking Enquiry Form, including:
            </p>
            <ul>
              <li><strong>Personal Identifiers:</strong> Full Name, Email Address, Mobile/Phone Number.</li>
              <li><strong>Event Details:</strong> Event Type, Preferred Date, Expected Guest Count, Estimated Budget.</li>
              <li><strong>Communication Preferences:</strong> Preferred time to call, custom messages, and your explicit consent to be contacted.</li>
            </ul>
          </section>

          <section>
            <h2>3. How We Use Your Information</h2>
            <p>
              We use the collected information solely for hospitality and booking operations, including:
            </p>
            <ul>
              <li>Contacting you to discuss your event details, packages, and custom quotes.</li>
              <li>Scheduling venue walkthrough tours at our Munshirhat address.</li>
              <li>Maintaining internal records of event inquiries and bookings.</li>
              <li>Sending transaction updates or notifications regarding confirmed dates.</li>
            </ul>
            <p>
              We <strong>never</strong> sell, lease, or distribute your personal information to third-party advertisers or external marketing lists.
            </p>
          </section>

          <section>
            <h2>4. Data Storage and Integration</h2>
            <p>
              To ensure seamless coordination, our enquiry forms are integrated with <strong>Google Sheets</strong> using a secure Google Apps Script endpoint. 
            </p>
            <ul>
              <li>The data is recorded in a private spreadsheet accessible only by authorized Palki Banquet administrators.</li>
              <li>We implement local security protocols to protect physical and digital records from unauthorized access, alteration, or disclosure.</li>
            </ul>
          </section>

          <section>
            <h2>5. Cookies</h2>
            <p>
              Our website uses basic session cookies and local storage parameters (such as `localStorage` and `sessionStorage`) to enhance website performance, remember your preferences, and prevent repeating popups (like our exit-intent offer banner) during a single browser visit.
            </p>
          </section>

          <section>
            <h2>6. Contact Us</h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data records, please contact our administrative team:
            </p>
            <p className="contact-block">
              <strong>{config.businessName || 'PALKI BANQUET'}</strong><br/>
              Address: {config.contact?.address}<br/>
              Landmark: {config.contact?.landmark}<br/>
              Phone: {config.contact?.phoneFormatted || '9836929210'}<br/>
              Email: {config.contact?.email || 'info@palkibanquet.com'}
            </p>
          </section>
        </div>
      </div>

      <style>{`
        .policy-page-container {
          padding: 8rem 1.5rem 4rem 1.5rem;
          min-height: 100vh;
          background-color: var(--color-cream-bg);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .policy-wrapper {
          max-width: 800px;
          width: 100%;
          padding: 4rem 3.5rem;
          background-color: var(--color-white);
          border: 1px solid rgba(197, 160, 89, 0.25);
          box-shadow: var(--shadow-premium);
        }

        .btn-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-body);
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--color-maroon-deep);
          text-decoration: none;
          margin-bottom: 2rem;
          transition: var(--transition-fast);
        }

        .btn-back:hover {
          color: var(--color-gold-luxury);
          transform: translateX(-4px);
        }

        .policy-title {
          font-size: 2.8rem;
          font-weight: 500;
          color: var(--color-maroon-deep);
          margin-bottom: 0.2rem;
        }

        .last-updated {
          font-family: var(--font-body);
          font-size: 0.8rem;
          color: var(--color-charcoal-muted);
          display: block;
          margin-bottom: 1rem;
        }

        .policy-content {
          margin-top: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          text-align: left;
        }

        .policy-content section h2 {
          font-family: var(--font-body);
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--color-maroon-deep);
          margin-bottom: 0.8rem;
          letter-spacing: 0.5px;
        }

        .policy-content section p {
          font-size: 0.92rem;
          line-height: 1.7;
          color: var(--color-charcoal-muted);
          margin-bottom: 1rem;
        }

        .policy-content section ul {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          color: var(--color-charcoal-muted);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .contact-block {
          background-color: var(--color-cream-bg);
          border-left: 3px solid var(--color-gold-luxury);
          padding: 1.2rem;
          margin-top: 1rem;
          font-size: 0.9rem !important;
          color: var(--color-charcoal-text) !important;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .policy-page-container {
            padding-top: 6rem;
          }
          .policy-wrapper {
            padding: 2.5rem 1.5rem;
          }
          .policy-title {
            font-size: 2.2rem;
          }
        }
      `}</style>
    </div>
  );
}
