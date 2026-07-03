import { useState, useEffect } from 'react';

// Helper to trigger toasts from anywhere in the app
export function showToast(message, type = 'success') {
  window.dispatchEvent(
    new CustomEvent('show-toast', {
      detail: { message, type }
    })
  );
}

export default function Toast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToastEvent = (e) => {
      const { message, type } = e.detail;
      const id = Date.now() + Math.random().toString(36).substr(2, 9);
      
      setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

      // Auto remove after 4.5 seconds
      setTimeout(() => {
        setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
      }, 4500);
    };

    window.addEventListener('show-toast', handleToastEvent);
    return () => window.removeEventListener('show-toast', handleToastEvent);
  }, []);

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
  };

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-card ${toast.type}`}>
          <div className="toast-icon">
            {toast.type === 'success' && (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            )}
            {toast.type === 'error' && (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
            )}
            {toast.type === 'warning' && (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
            )}
          </div>
          <div className="toast-message">{toast.message}</div>
          <button className="toast-close" onClick={() => removeToast(toast.id)} aria-label="Close alert">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>
      ))}

      <style>{`
        .toast-container {
          position: fixed;
          top: 90px;
          right: 25px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 9999;
          pointer-events: none;
          max-width: 380px;
          width: calc(100% - 50px);
        }

        .toast-card {
          pointer-events: auto;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 1rem 1.2rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(84, 11, 29, 0.15);
          box-shadow: 0 10px 30px rgba(84, 11, 29, 0.08);
          transform: translateX(120%);
          animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          position: relative;
          overflow: hidden;
        }

        .toast-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 4px;
        }

        .toast-card.success::before {
          background-color: #2e7d32;
        }

        .toast-card.success .toast-icon {
          color: #2e7d32;
        }

        .toast-card.error::before {
          background-color: #d32f2f;
        }

        .toast-card.error .toast-icon {
          color: #d32f2f;
        }

        .toast-card.warning::before {
          background-color: #f57c00;
        }

        .toast-card.warning .toast-icon {
          color: #f57c00;
        }

        .toast-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .toast-message {
          font-family: var(--font-body);
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--color-charcoal-text);
          flex: 1;
        }

        .toast-close {
          background: transparent;
          border: none;
          color: var(--color-charcoal-muted);
          cursor: pointer;
          opacity: 0.5;
          transition: var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .toast-close:hover {
          opacity: 1;
        }

        @keyframes slideIn {
          from {
            transform: translateX(120%);
          }
          to {
            transform: translateX(0);
          }
        }

        @media (max-width: 576px) {
          .toast-container {
            top: 20px;
            right: 25px;
          }
        }
      `}</style>
    </div>
  );
}
