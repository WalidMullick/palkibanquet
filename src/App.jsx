import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingWidgets from './components/FloatingWidgets';
import Toast from './components/Toast';
import ExitIntentModal from './components/ExitIntentModal';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import SEO from './utils/seoHelper';
import { loadConfig } from './utils/configManager';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [config, setConfig] = useState({});
  const [scrollProgress, setScrollProgress] = useState(0);

  // Load config initially
  useEffect(() => {
    async function initConfig() {
      const cfg = await loadConfig();
      setConfig(cfg || {});
    }
    initConfig();

    // Listen for admin configuration overrides
    const handleConfigChange = async () => {
      const cfg = await loadConfig();
      setConfig(cfg || {});
    };
    window.addEventListener('configUpdated', handleConfigChange);

    // Scroll progress handler
    const handleScrollProgress = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const scrolled = (window.scrollY / totalScroll) * 100;
        setScrollProgress(scrolled);
      }
    };
    window.addEventListener('scroll', handleScrollProgress);

    return () => {
      window.removeEventListener('configUpdated', handleConfigChange);
      window.removeEventListener('scroll', handleScrollProgress);
    };
  }, []);

  const handleNavigation = (target) => {
    if (target === 'admin' || target === 'privacy' || target === 'terms' || target === 'home') {
      setCurrentPage(target);
      window.scrollTo(0, 0);
    } else {
      // If we are navigating to an ID section from a subpage
      if (currentPage !== 'home') {
        setCurrentPage('home');
        // Let landing page mount first, then scroll
        setTimeout(() => {
          const el = document.getElementById(target);
          if (el) {
            window.scrollTo({
              top: el.offsetTop - 80,
              behavior: 'smooth'
            });
          }
        }, 100);
      } else {
        const el = document.getElementById(target);
        if (el) {
          window.scrollTo({
            top: el.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      }
    }
  };

  const isAdmin = currentPage === 'admin';

  return (
    <>
      {/* Dynamic SEO Injection */}
      <SEO 
        config={config} 
        title={
          currentPage === 'admin' ? 'Admin Console | Palki Banquet' :
          currentPage === 'privacy' ? 'Privacy Policy | Palki Banquet' :
          currentPage === 'terms' ? 'Terms & Conditions | Palki Banquet' :
          config.seo?.metaTitle
        }
        schemaType={currentPage === 'home' ? 'LocalBusiness' : 'None'}
      />

      {/* Global Scroll Progress Indicator */}
      {!isAdmin && (
        <div className="scroll-progress-container">
          <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }}></div>
        </div>
      )}

      {/* Global Notification Alerts container */}
      <Toast />

      {/* Sticky Navigation - Hidden on Admin Dashboard */}
      {!isAdmin && <Header config={config} onNavigate={handleNavigation} />}

      {/* Main Pages Router Switch */}
      {currentPage === 'home' && <LandingPage config={config} />}
      {currentPage === 'admin' && <AdminDashboard onLogout={() => handleNavigation('home')} />}
      {currentPage === 'privacy' && <PrivacyPolicy config={config} onNavigate={handleNavigation} />}
      {currentPage === 'terms' && <TermsConditions config={config} onNavigate={handleNavigation} />}

      {/* Floating Call, WhatsApp, Scroll elevator - Hidden on Admin Dashboard */}
      {!isAdmin && <FloatingWidgets config={config} />}

      {/* Exit Intent Modal - Hidden on Admin Dashboard */}
      {!isAdmin && <ExitIntentModal />}

      {/* Global Footer - Hidden on Admin Dashboard */}
      {!isAdmin && <Footer config={config} onNavigate={handleNavigation} />}
    </>
  );
}
