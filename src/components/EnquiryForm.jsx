import { useState } from 'react';
import { saveEnquiry } from '../utils/configManager';
import { postToGoogleSheets } from '../utils/sheetIntegration';
import { showToast } from './Toast';

export default function EnquiryForm({ config = {} }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    eventType: '',
    eventDate: '',
    guests: '',
    budget: '',
    preferredContactTime: '',
    message: '',
    agreeContact: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const budgetOptions = [
    'Below Rs. 1,00,000',
    'Rs. 1,00,000 - Rs. 2,00,000',
    'Rs. 2,00,000 - Rs. 3,50,000',
    'Rs. 3,50,000 - Rs. 5,00,000',
    'Above Rs. 5,00,000'
  ];

  const eventTypes = [
    { value: 'wedding', label: 'Wedding' },
    { value: 'reception', label: 'Reception' },
    { value: 'birthday', label: 'Birthday Party' },
    { value: 'engagement', label: 'Engagement' },
    { value: 'anniversary', label: 'Anniversary' },
    { value: 'corporate', label: 'Corporate Event' },
    { value: 'babyshower', label: 'Baby Shower' },
    { value: 'riceceremony', label: 'Rice Ceremony' },
    { value: 'family', label: 'Family Gathering' }
  ];

  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Full name is required';
    
    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formData.phone.trim()) {
      tempErrors.phone = 'Mobile number is required';
    } else if (!phoneRegex.test(formData.phone)) {
      tempErrors.phone = 'Please enter a valid 10-digit mobile number';
    }

    // Email validation (optional but verified if inputted)
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        tempErrors.email = 'Please enter a valid email address';
      }
    }

    if (!formData.eventType) tempErrors.eventType = 'Please select an event type';
    
    // Date validation
    if (!formData.eventDate) {
      tempErrors.eventDate = 'Event date is required';
    } else {
      const selectedDate = new Date(formData.eventDate);
      const today = new Date();
      today.setHours(0,0,0,0);
      if (selectedDate < today) {
        tempErrors.eventDate = 'Event date must be in the future';
      }
    }

    if (!formData.guests.trim()) {
      tempErrors.guests = 'Estimated guest count is required';
    } else if (isNaN(formData.guests) || parseInt(formData.guests) <= 0) {
      tempErrors.guests = 'Please enter a valid guest count';
    }

    if (!formData.agreeContact) {
      tempErrors.agreeContact = 'You must agree to be contacted to proceed';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error on keypress
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please correct the validation errors in the form.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Save locally so it appears in the admin panel immediately
      saveEnquiry(formData);

      // 2. Post to Google Sheets if endpoint is configured
      const endpoint = config.googleSheets?.endpointUrl;
      let sheetSuccess = false;
      
      if (endpoint && endpoint.trim()) {
        const result = await postToGoogleSheets(endpoint, formData);
        sheetSuccess = result.success;
      }

      // 3. Complete and show feedback
      setIsSubmitting(false);
      setShowThankYou(true);
      showToast('Enquiry submitted successfully! Our team will contact you.', 'success');

      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        eventType: '',
        eventDate: '',
        guests: '',
        budget: '',
        preferredContactTime: '',
        message: '',
        agreeContact: false
      });
    } catch (error) {
      setIsSubmitting(false);
      showToast('Submission failed. Please try again.', 'error');
      console.error(error);
    }
  };

  return (
    <>
      <div className="enquiry-card-wrapper glass-panel">
        <h3 className="form-title">Request a Royal Callback</h3>
        <p className="form-subtitle">Fill in the details below to receive a custom quote and venue tour slot.</p>
        
        <form onSubmit={handleSubmit} className="premium-form">
          <div className="form-grid">
            {/* Full Name */}
            <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
              <label className="form-label" htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g. Sayan Sen"
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            {/* Mobile Number */}
            <div className={`form-group ${errors.phone ? 'has-error' : ''}`}>
              <label className="form-label" htmlFor="phone">Mobile Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g. 9836929210"
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            {/* Email Address */}
            <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g. name@example.com"
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            {/* Event Type */}
            <div className={`form-group ${errors.eventType ? 'has-error' : ''}`}>
              <label className="form-label" htmlFor="eventType">Event Type *</label>
              <select
                id="eventType"
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                className="form-input form-select"
              >
                <option value="">Select Event Category</option>
                {eventTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              {errors.eventType && <span className="error-text">{errors.eventType}</span>}
            </div>

            {/* Event Date */}
            <div className={`form-group ${errors.eventDate ? 'has-error' : ''}`}>
              <label className="form-label" htmlFor="eventDate">Preferred Event Date *</label>
              <input
                type="date"
                id="eventDate"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                className="form-input"
              />
              {errors.eventDate && <span className="error-text">{errors.eventDate}</span>}
            </div>

            {/* Expected Guests */}
            <div className={`form-group ${errors.guests ? 'has-error' : ''}`}>
              <label className="form-label" htmlFor="guests">Expected Guests *</label>
              <input
                type="number"
                id="guests"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g. 500"
              />
              {errors.guests && <span className="error-text">{errors.guests}</span>}
            </div>

            {/* Budget Range */}
            <div className="form-group">
              <label className="form-label" htmlFor="budget">Estimated Budget</label>
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="form-input form-select"
              >
                <option value="">Select Budget Range</option>
                {budgetOptions.map((opt, i) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Preferred Contact Time */}
            <div className="form-group">
              <label className="form-label" htmlFor="preferredContactTime">Best Time to Call</label>
              <select
                id="preferredContactTime"
                name="preferredContactTime"
                value={formData.preferredContactTime}
                onChange={handleChange}
                className="form-input form-select"
              >
                <option value="">Any Time</option>
                <option value="Morning">Morning (9 AM - 12 PM)</option>
                <option value="Afternoon">Afternoon (12 PM - 4 PM)</option>
                <option value="Evening">Evening (4 PM - 8 PM)</option>
              </select>
            </div>
          </div>

          {/* Message */}
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label" htmlFor="message">Special Instructions / Requirements</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="form-input"
              rows="3"
              placeholder="e.g. Need details for catering area, flower theme options..."
            ></textarea>
          </div>

          {/* Consent Checkbox */}
          <div className={`form-group checkbox-group ${errors.agreeContact ? 'has-error' : ''}`}>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="agreeContact"
                checked={formData.agreeContact}
                onChange={handleChange}
                className="form-checkbox"
              />
              <span className="checkbox-custom-text">
                I agree to be contacted by Palki Banquet representatives via Phone, WhatsApp or Email.
              </span>
            </label>
            {errors.agreeContact && <span className="error-text block-err">{errors.agreeContact}</span>}
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-primary form-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="loader-text">
                <svg className="spinner" viewBox="0 0 50 50">
                  <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                </svg>
                Transmitting...
              </span>
            ) : (
              'Book My Event callback'
            )}
          </button>
        </form>
      </div>

      {/* Thank You Modal */}
      {showThankYou && (
        <div className="modal-overlay" onClick={() => setShowThankYou(false)}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowThankYou(false)}>&times;</button>
            <div className="success-icon-wrapper">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h2>Thank You For Contacting Us</h2>
            <div className="gold-divider"><span className="diamond"></span></div>
            <p className="modal-desc">Your enquiry has been securely saved. Our booking concierge team will call you back shortly.</p>

            <h4 className="next-steps-title">What Happens Next?</h4>
            <div className="steps-container">
              <div className="step-card">
                <div className="step-num">1</div>
                <h4>Callback</h4>
                <p>We'll call you to understand your requirements.</p>
              </div>
              <div className="step-card">
                <div className="step-num">2</div>
                <h4>Venue Tour</h4>
                <p>Visit Palki Banquet in Munshirhat to inspect facilities.</p>
              </div>
              <div className="step-card">
                <div className="step-num">3</div>
                <h4>Booking Lock</h4>
                <p>Select package and deposit advance to block date.</p>
              </div>
            </div>

            <button className="btn-primary" onClick={() => setShowThankYou(false)} style={{ marginTop: '1.5rem' }}>
              Close Window
            </button>
          </div>
        </div>
      )}

      <style>{`
        .enquiry-card-wrapper {
          padding: 3rem;
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(197, 160, 89, 0.3);
          box-shadow: var(--shadow-premium);
        }

        .form-title {
          font-size: 2.2rem;
          font-weight: 500;
          color: var(--color-maroon-deep);
          margin-bottom: 0.5rem;
          text-align: center;
        }

        .form-subtitle {
          text-align: center;
          font-size: 0.9rem;
          color: var(--color-charcoal-muted);
          margin-bottom: 2.5rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .has-error .form-input {
          border-color: #d32f2f;
          background-color: rgba(211, 47, 47, 0.02);
        }

        .error-text {
          font-size: 0.72rem;
          color: #d32f2f;
          font-weight: 600;
          margin-top: 0.3rem;
          display: block;
        }

        .block-err {
          margin-top: 0.5rem;
        }

        .checkbox-group {
          margin-top: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          cursor: pointer;
        }

        .form-checkbox {
          width: 16px;
          height: 16px;
          margin-top: 3px;
          accent-color: var(--color-maroon-deep);
        }

        .checkbox-custom-text {
          font-size: 0.82rem;
          color: var(--color-charcoal-muted);
          line-height: 1.4;
        }

        .form-submit-btn {
          width: 100%;
          padding: 1.1rem;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loader-text {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .spinner {
          width: 20px;
          height: 20px;
          animation: rotate 2s linear infinite;
        }

        .spinner .path {
          stroke: var(--color-white);
          stroke-linecap: round;
          animation: dash 1.5s ease-in-out infinite;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(15, 3, 6, 0.75);
          backdrop-filter: blur(8px);
          z-index: 3000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          animation: modalFadeIn 0.3s ease;
        }

        .modal-content {
          background-color: var(--color-cream-bg);
          border: 1px solid var(--color-gold-luxury);
          width: 100%;
          max-width: 650px;
          padding: 3rem 2.5rem;
          text-align: center;
          position: relative;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          animation: modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .modal-close {
          position: absolute;
          top: 15px;
          right: 20px;
          font-size: 2rem;
          background: transparent;
          border: none;
          color: var(--color-maroon-deep);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .modal-close:hover {
          color: var(--color-gold-luxury);
        }

        .success-icon-wrapper {
          color: #2e7d32;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.2rem;
        }

        .modal-content h2 {
          font-size: 2.2rem;
          font-weight: 500;
          color: var(--color-maroon-deep);
        }

        .modal-desc {
          font-size: 0.95rem;
          color: var(--color-charcoal-muted);
          margin-bottom: 2rem;
        }

        .next-steps-title {
          font-family: var(--font-body);
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--color-gold-luxury);
          margin-bottom: 1.5rem;
        }

        .steps-container {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .step-card {
          background: rgba(255,255,255,0.6);
          border: 1px solid rgba(84, 11, 29, 0.05);
          padding: 1.2rem 0.8rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .step-num {
          width: 26px;
          height: 26px;
          background-color: var(--color-gold-luxury);
          color: var(--color-white);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .step-card h4 {
          font-family: var(--font-body);
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-maroon-deep);
        }

        .step-card p {
          font-size: 0.72rem;
          line-height: 1.4;
        }

        @keyframes rotate {
          100% { transform: rotate(360deg); }
        }

        @keyframes dash {
          0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
          50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
          100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
        }

        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modalSlideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @media (max-width: 768px) {
          .enquiry-card-wrapper {
            padding: 2rem 1.5rem;
          }
          .form-grid {
            grid-template-columns: 1fr;
            gap: 1.2rem;
          }
          .form-group[style] {
            grid-column: span 1 !important;
          }
          .steps-container {
            grid-template-columns: 1fr;
            gap: 0.8rem;
          }
          .modal-content {
            padding: 2.5rem 1.5rem;
          }
        }
      `}</style>
    </>
  );
}
