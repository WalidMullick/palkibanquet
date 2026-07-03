export default function TermsConditions({ config = {}, onNavigate }) {
  const handleBack = (e) => {
    e.preventDefault();
    if (onNavigate) onNavigate('home');
  };

  return (
    <div className="terms-page-container">
      <div className="terms-wrapper glass-panel">
        <a href="#home" onClick={handleBack} className="btn-back">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back to Website
        </a>

        <h1 className="terms-title">Terms & Conditions</h1>
        <span className="last-updated">Last Updated: July 3, 2026</span>
        <div className="gold-divider"><span className="diamond"></span></div>

        <div className="terms-content">
          <section>
            <h2>1. Agreement of Booking</h2>
            <p>
              By depositing the token advance payment to block a date at <strong>{config.businessName || 'PALKI BANQUET'}</strong>, the Host (referred to as "Client") enters into a legally binding contract under the terms outlined herein.
            </p>
          </section>

          <section>
            <h2>2. Payment & Token Policy</h2>
            <ul>
              <li><strong>Advance Payment:</strong> A booking is only locked and confirmed upon receipt of the agreed non-refundable token advance payment.</li>
              <li><strong>Installment Schedule:</strong> 50% of the estimated booking cost must be settled 30 days prior to the event. The final balance, including decor upgrades, must be fully cleared at least 7 days before the event date.</li>
              <li><strong>Delayed Payments:</strong> Failure to settle balance dues within the stipulated timeline may result in cancellation of booking and forfeiture of advanced deposits.</li>
            </ul>
          </section>

          <section>
            <h2>3. Cancellation & Postponement</h2>
            <ul>
              <li>All token advances deposited to lock dates are strictly non-refundable and non-transferable.</li>
              <li>Postponement requests are subject to date availability and management discretion. A rescheduling fee may apply if dates are modified within 60 days of the original event.</li>
            </ul>
          </section>

          <section>
            <h2>4. Decoration & Catering Guidelines</h2>
            <ul>
              <li><strong>In-house Decoration:</strong> Theme decorations are managed by our designated in-house florist panel. Custom modifications must be submitted at least 15 days before the event.</li>
              <li><strong>Catering:</strong> While clients can hire external caterers, they must comply with hygiene rules. The client is responsible for clean disposal of waste. A designated kitchen utility charge may apply.</li>
              <li><strong>Alcohol Policy:</strong> Serving alcohol is strictly prohibited unless the client obtains a valid temporary liquor license from local authorities and submits a copy to our office 3 days prior.</li>
            </ul>
          </section>

          <section>
            <h2>5. Infrastructure & Electric Usage</h2>
            <ul>
              <li>Air-conditioning is provided for the specified duration of the event (typically 8-10 hours). Additional hours will be billed pro-rata.</li>
              <li>We supply 100% generator power backup. Palki Banquet is not liable for temporary electrical trip-offs caused by external grid fluctuations or caterer heating appliances overloading boards.</li>
            </ul>
          </section>

          <section>
            <h2>6. Liability & Jurisdiction</h2>
            <ul>
              <li>Palki Banquet is not liable for losses, theft, or damages to guest properties, vehicles parked in the parking zone, or gifts brought to the venue.</li>
              <li>Any physical damage caused to the banquet hall property, chandeliers, lift, or guest rooms by client staff, caterers, or guests will be billed directly to the Client.</li>
              <li>All disputes are subject to the exclusive jurisdiction of the courts of <strong>Howrah, West Bengal</strong>.</li>
            </ul>
          </section>
        </div>
      </div>

      <style>{`
        .terms-page-container {
          padding: 8rem 1.5rem 4rem 1.5rem;
          min-height: 100vh;
          background-color: var(--color-cream-bg);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .terms-wrapper {
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

        .terms-title {
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

        .terms-content {
          margin-top: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          text-align: left;
        }

        .terms-content section h2 {
          font-family: var(--font-body);
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--color-maroon-deep);
          margin-bottom: 0.8rem;
          letter-spacing: 0.5px;
        }

        .terms-content section p {
          font-size: 0.92rem;
          line-height: 1.7;
          color: var(--color-charcoal-muted);
        }

        .terms-content section ul {
          margin-left: 1.5rem;
          font-size: 0.9rem;
          color: var(--color-charcoal-muted);
          display: flex;
          flex-direction: column;
          gap: 8px;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .terms-page-container {
            padding-top: 6rem;
          }
          .terms-wrapper {
            padding: 2.5rem 1.5rem;
          }
          .terms-title {
            font-size: 2.2rem;
          }
        }
      `}</style>
    </div>
  );
}
