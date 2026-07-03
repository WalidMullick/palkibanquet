import { useState } from 'react';

export default function FAQAccordion({ items = [] }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = (index) => {
    setActiveIndex(prevIndex => (prevIndex === index ? null : index));
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="faq-accordion">
      {items.map((item, index) => {
        const isOpen = activeIndex === index;
        return (
          <div 
            key={index} 
            className={`faq-item ${isOpen ? 'active' : ''}`}
          >
            {/* FAQ Header */}
            <button 
              className="faq-trigger"
              onClick={() => handleToggle(index)}
              aria-expanded={isOpen}
            >
              <span className="faq-question">{item.question}</span>
              <span className="faq-icon-wrapper">
                <svg 
                  viewBox="0 0 24 24" 
                  width="20" 
                  height="20" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  fill="none" 
                  className="faq-arrow"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
            </button>

            {/* FAQ Panel */}
            <div 
              className="faq-panel"
              style={{
                maxHeight: isOpen ? '250px' : '0px',
                opacity: isOpen ? 1 : 0
              }}
            >
              <div className="faq-content">
                <p>{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}

      <style>{`
        .faq-accordion {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .faq-item {
          background-color: var(--color-white);
          border: 1px solid rgba(84, 11, 29, 0.08);
          box-shadow: 0 4px 15px rgba(84, 11, 29, 0.02);
          transition: var(--transition-smooth);
        }

        .faq-item:hover {
          border-color: rgba(197, 160, 89, 0.4);
          box-shadow: 0 6px 20px rgba(84, 11, 29, 0.04);
        }

        .faq-item.active {
          border-color: var(--color-gold-luxury);
          box-shadow: var(--shadow-premium);
        }

        .faq-trigger {
          width: 100%;
          padding: 1.25rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: transparent;
          border: none;
          outline: none;
          cursor: pointer;
          text-align: left;
        }

        .faq-question {
          font-family: var(--font-body);
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--color-maroon-deep);
          letter-spacing: 0.2px;
          padding-right: 1.5rem;
        }

        .faq-icon-wrapper {
          color: var(--color-gold-luxury);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-smooth);
        }

        .faq-arrow {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .faq-item.active .faq-arrow {
          transform: rotate(180deg);
          color: var(--color-maroon-deep);
        }

        .faq-panel {
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .faq-content {
          padding: 0 1.5rem 1.5rem 1.5rem;
          border-top: 1px solid rgba(84, 11, 29, 0.04);
          padding-top: 1rem;
        }

        .faq-content p {
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--color-charcoal-muted);
        }

        @media (max-width: 576px) {
          .faq-trigger {
            padding: 1rem 1.2rem;
          }
          .faq-content {
            padding: 0 1.2rem 1.2rem 1.2rem;
            padding-top: 0.8rem;
          }
          .faq-question {
            font-size: 0.88rem;
          }
        }
      `}</style>
    </div>
  );
}
