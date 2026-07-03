import { useState, useEffect } from 'react';
import { 
  loadConfig, 
  saveConfigOverride, 
  resetConfigToDefault, 
  getEnquiries, 
  updateEnquiryStatus, 
  deleteEnquiry 
} from '../utils/configManager';
import { showToast } from '../components/Toast';

export default function AdminDashboard({ onLogout }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [activeTab, setActiveTab] = useState('enquiries');
  const [config, setConfig] = useState({});
  const [enquiries, setEnquiries] = useState([]);
  
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Media Form States
  const [newImage, setNewImage] = useState({ category: 'wedding', url: '', alt: '' });
  const [newVideo, setNewVideo] = useState({ title: '', thumbnail: '', videoUrl: '' });
  const [newFAQ, setNewFAQ] = useState({ question: '', answer: '' });
  const [newTestimonial, setNewTestimonial] = useState({ name: '', event: '', rating: '5', text: '' });

  // Load config & enquiries
  useEffect(() => {
    async function fetchData() {
      const cfg = await loadConfig();
      setConfig(cfg || {});
      setEnquiries(getEnquiries());
    }
    
    // Check if user is already logged in for this session
    const auth = sessionStorage.getItem('palki_admin_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    
    fetchData();
    
    // Listener for config updates
    const handleConfigUpdate = async () => {
      const cfg = await loadConfig();
      setConfig(cfg || {});
    };
    window.addEventListener('configUpdated', handleConfigUpdate);
    return () => window.removeEventListener('configUpdated', handleConfigUpdate);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    // Default premium passcode: palki123
    if (passcode === 'palki123' || passcode === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('palki_admin_authenticated', 'true');
      showToast('Authentication successful!', 'success');
    } else {
      showToast('Incorrect passcode. Please try again.', 'error');
    }
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('palki_admin_authenticated');
    if (onLogout) onLogout();
    showToast('Logged out successfully.', 'success');
  };

  // Enquiries handlers
  const handleStatusChange = (id, status) => {
    updateEnquiryStatus(id, status);
    setEnquiries(getEnquiries());
    showToast(`Enquiry status marked as: ${status}`, 'success');
  };

  const handleDeleteEnquiry = (id) => {
    if (window.confirm('Are you sure you want to delete this enquiry permanently?')) {
      deleteEnquiry(id);
      setEnquiries(getEnquiries());
      showToast('Enquiry deleted successfully.', 'warning');
    }
  };

  // Content edits handlers
  const handleConfigChange = (section, field, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSaveConfig = () => {
    saveConfigOverride(config);
    showToast('Website content configuration updated successfully!', 'success');
  };

  // Media managers
  const handleAddImage = (e) => {
    e.preventDefault();
    if (!newImage.url) {
      showToast('Image URL is required', 'error');
      return;
    }
    const updatedGallery = [...(config.gallery || []), newImage];
    const updatedConfig = { ...config, gallery: updatedGallery };
    setConfig(updatedConfig);
    saveConfigOverride(updatedConfig);
    setNewImage({ category: 'wedding', url: '', alt: '' });
    showToast('Image added to gallery.', 'success');
  };

  const handleDeleteImage = (index) => {
    const updatedGallery = config.gallery.filter((_, idx) => idx !== index);
    const updatedConfig = { ...config, gallery: updatedGallery };
    setConfig(updatedConfig);
    saveConfigOverride(updatedConfig);
    showToast('Image removed from gallery.', 'warning');
  };

  const handleAddVideo = (e) => {
    e.preventDefault();
    if (!newVideo.videoUrl || !newVideo.title) {
      showToast('Video Title and URL are required', 'error');
      return;
    }
    // Auto populate thumbnail if empty
    const thumb = newVideo.thumbnail || 'https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?auto=format&fit=crop&w=800&q=80';
    const updatedVideos = [...(config.videos || []), { ...newVideo, thumbnail: thumb, id: `vid_${Date.now()}` }];
    const updatedConfig = { ...config, videos: updatedVideos };
    setConfig(updatedConfig);
    saveConfigOverride(updatedConfig);
    setNewVideo({ title: '', thumbnail: '', videoUrl: '' });
    showToast('Video card added successfully.', 'success');
  };

  const handleDeleteVideo = (id) => {
    const updatedVideos = config.videos.filter(vid => vid.id !== id);
    const updatedConfig = { ...config, videos: updatedVideos };
    setConfig(updatedConfig);
    saveConfigOverride(updatedConfig);
    showToast('Video card removed.', 'warning');
  };

  const handleAddFAQ = (e) => {
    e.preventDefault();
    if (!newFAQ.question || !newFAQ.answer) {
      showToast('Question and Answer are required', 'error');
      return;
    }
    const updatedFAQs = [...(config.faqs || []), newFAQ];
    const updatedConfig = { ...config, faqs: updatedFAQs };
    setConfig(updatedConfig);
    saveConfigOverride(updatedConfig);
    setNewFAQ({ question: '', answer: '' });
    showToast('FAQ accordion item added.', 'success');
  };

  const handleDeleteFAQ = (index) => {
    const updatedFAQs = config.faqs.filter((_, idx) => idx !== index);
    const updatedConfig = { ...config, faqs: updatedFAQs };
    setConfig(updatedConfig);
    saveConfigOverride(updatedConfig);
    showToast('FAQ accordion item deleted.', 'warning');
  };

  const handleAddTestimonial = (e) => {
    e.preventDefault();
    if (!newTestimonial.name || !newTestimonial.text) {
      showToast('Author Name and Testimonial copy are required', 'error');
      return;
    }
    const updatedTestimonials = [...(config.testimonials || []), { ...newTestimonial, rating: parseInt(newTestimonial.rating) }];
    const updatedConfig = { ...config, testimonials: updatedTestimonials };
    setConfig(updatedConfig);
    saveConfigOverride(updatedConfig);
    setNewTestimonial({ name: '', event: '', rating: '5', text: '' });
    showToast('Testimonial review added.', 'success');
  };

  const handleDeleteTestimonial = (index) => {
    const updatedTestimonials = config.testimonials.filter((_, idx) => idx !== index);
    const updatedConfig = { ...config, testimonials: updatedTestimonials };
    setConfig(updatedConfig);
    saveConfigOverride(updatedConfig);
    showToast('Testimonial review deleted.', 'warning');
  };

  // Export to CSV Function
  const handleExportCSV = () => {
    if (enquiries.length === 0) {
      showToast('No enquiries available to export.', 'error');
      return;
    }
    
    // Headers
    const headers = ['Timestamp', 'Name', 'Phone', 'Email', 'Event Type', 'Event Date', 'Guests', 'Budget', 'Contact Time', 'Message', 'Status'];
    
    // Rows
    const rows = enquiries.map(enq => [
      enq.timestamp,
      `"${enq.name.replace(/"/g, '""')}"`,
      enq.phone,
      enq.email || '',
      enq.eventType,
      enq.eventDate,
      enq.guests,
      `"${(enq.budget || '').replace(/"/g, '""')}"`,
      enq.preferredContactTime || '',
      `"${(enq.message || '').replace(/"/g, '""')}"`,
      enq.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Palki_Banquet_Enquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Enquiries exported to CSV.', 'success');
  };

  // Backup & Restore
  const handleDownloadConfig = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "config.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('config.json download triggered. Copy it to your public folder.', 'success');
  };

  const handleUploadConfig = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.businessName && parsed.contact) {
          setConfig(parsed);
          saveConfigOverride(parsed);
          showToast('Configuration file uploaded and applied successfully!', 'success');
        } else {
          showToast('Invalid config file format. Missing core fields.', 'error');
        }
      } catch (err) {
        showToast('Failed to parse uploaded JSON file.', 'error');
      }
    };
  };

  const handleResetConfig = () => {
    if (window.confirm('Are you sure you want to reset all customizations? This will restore original website copy.')) {
      resetConfigToDefault();
      showToast('Config reset to factory defaults.', 'warning');
    }
  };

  // Filtered enquiries list
  const filteredEnquiries = enquiries.filter(enq => {
    const matchesSearch = 
      enq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enq.phone.includes(searchTerm) ||
      (enq.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || enq.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Render Passcode Screen if not logged in
  if (!isAuthenticated) {
    return (
      <div className="admin-login-overlay">
        <div className="login-card glass-panel">
          <h2 className="login-title">PALKI BANQUET</h2>
          <span className="login-badge">CONCIERGE PORTAL</span>
          <div className="gold-divider"><span className="diamond"></span></div>
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label className="form-label" htmlFor="passcode">Secret Passcode</label>
              <input
                type="password"
                id="passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="form-input"
                placeholder="Enter passcode (default: palki123)"
                style={{ textAlign: 'center', letterSpacing: '3px' }}
                autoFocus
              />
            </div>
            
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              Unlock Dashboard
            </button>
          </form>
        </div>

        <style>{`
          .admin-login-overlay {
            width: 100vw;
            height: 100vh;
            background-color: var(--color-maroon-deep);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
            background-image: linear-gradient(rgba(15, 3, 6, 0.7), rgba(15, 3, 6, 0.95)), url("https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80");
            background-size: cover;
            background-position: center;
          }

          .login-card {
            width: 100%;
            max-width: 420px;
            padding: 3.5rem 2.5rem;
            background: rgba(255, 255, 255, 0.92);
            text-align: center;
            border-color: var(--color-gold-luxury);
          }

          .login-title {
            font-size: 2.2rem;
            font-weight: 700;
            color: var(--color-maroon-deep);
            letter-spacing: 2px;
          }

          .login-badge {
            font-family: var(--font-body);
            font-size: 0.72rem;
            font-weight: 700;
            letter-spacing: 2px;
            color: var(--color-gold-luxury);
          }

          .login-form {
            margin-top: 1.8rem;
          }
        `}</style>
      </div>
    );
  }

  // Analytics states
  const totalCount = enquiries.length;
  const pendingCount = enquiries.filter(e => e.status === 'Pending').length;
  const contactedCount = enquiries.filter(e => e.status === 'Contacted').length;
  const bookedCount = enquiries.filter(e => e.status === 'Booked').length;

  return (
    <div className="admin-dashboard-container">
      {/* Sidebar / Left Navigation */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <h3>PALKI ADMIN</h3>
          <span>Control Console</span>
        </div>

        <nav className="sidebar-nav">
          <button className={`sidebar-link ${activeTab === 'enquiries' ? 'active' : ''}`} onClick={() => setActiveTab('enquiries')}>
            Enquiries Listing
          </button>
          <button className={`sidebar-link ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>
            Content & Contact Editor
          </button>
          <button className={`sidebar-link ${activeTab === 'gallery' ? 'active' : ''}`} onClick={() => setActiveTab('gallery')}>
            Gallery Media Manager
          </button>
          <button className={`sidebar-link ${activeTab === 'faqs' ? 'active' : ''}`} onClick={() => setActiveTab('faqs')}>
            FAQs & Testimonials
          </button>
          <button className={`sidebar-link ${activeTab === 'backup' ? 'active' : ''}`} onClick={() => setActiveTab('backup')}>
            Backup & Settings
          </button>
        </nav>

        <button className="btn-sidebar-signout" onClick={handleSignOut}>
          Sign Out Portal
        </button>
      </aside>

      {/* Main Workspace */}
      <main className="admin-workspace">
        {/* Top summary stats */}
        <header className="workspace-header">
          <div className="header-meta">
            <h2>Management Dashboard</h2>
            <p>Welcome back, Admin. Review callbacks and manage content.</p>
          </div>
          <button className="btn-outline-maroon btn-signout-top" onClick={handleSignOut}>Sign Out</button>
        </header>

        {/* Analytics Cards Row */}
        <section className="analytics-cards-row">
          <div className="stat-summary-card">
            <h4>Total Enquiries</h4>
            <span className="summary-val">{totalCount}</span>
          </div>
          <div className="stat-summary-card yellow">
            <h4>Pending Callbacks</h4>
            <span className="summary-val">{pendingCount}</span>
          </div>
          <div className="stat-summary-card blue">
            <h4>Contacted</h4>
            <span className="summary-val">{contactedCount}</span>
          </div>
          <div className="stat-summary-card green">
            <h4>Confirmed Booked</h4>
            <span className="summary-val">{bookedCount}</span>
          </div>
        </section>

        {/* TAB 1: Enquiries Manager */}
        {activeTab === 'enquiries' && (
          <div className="tab-pane glass-panel">
            <div className="pane-header">
              <h3>Enquiries Table</h3>
              <div className="pane-actions">
                <button className="btn-primary" onClick={handleExportCSV}>Export to CSV</button>
              </div>
            </div>

            {/* Filters Row */}
            <div className="table-filters-row">
              <input
                type="text"
                placeholder="Search by name, phone or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="filter-search-input"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select-input"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Contacted">Contacted</option>
                <option value="Follow Up">Follow Up</option>
                <option value="Booked">Booked</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            {/* Enquiries Table */}
            <div className="table-responsive">
              <table className="enquiries-table">
                <thead>
                  <tr>
                    <th>Submitted</th>
                    <th>Name</th>
                    <th>Contact Info</th>
                    <th>Event Details</th>
                    <th>Guests / Budget</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEnquiries.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlignment: 'center', padding: '3rem' }}>
                        No matching enquiries found.
                      </td>
                    </tr>
                  ) : (
                    filteredEnquiries.map((enq) => (
                      <tr key={enq.id}>
                        <td>{new Date(enq.timestamp).toLocaleString()}</td>
                        <td><strong>{enq.name}</strong></td>
                        <td>
                          {enq.phone}<br/>
                          <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{enq.email}</span>
                        </td>
                        <td>
                          <span className="tag-event-type">{enq.eventType}</span><br/>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{enq.eventDate}</span>
                        </td>
                        <td>
                          Guests: {enq.guests}<br/>
                          <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>{enq.budget}</span>
                        </td>
                        <td>
                          <div className="message-cell" title={enq.message}>
                            {enq.message || '-'}
                          </div>
                        </td>
                        <td>
                          <select
                            value={enq.status}
                            onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                            className={`status-selector-pill ${enq.status.toLowerCase().replace(' ', '-')}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Follow Up">Follow Up</option>
                            <option value="Booked">Booked</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </td>
                        <td>
                          <button 
                            className="btn-table-delete" 
                            onClick={() => handleDeleteEnquiry(enq.id)}
                            title="Delete"
                          >
                            &times;
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Content Editor */}
        {activeTab === 'content' && (
          <div className="tab-pane glass-panel">
            <h3>Content Editor</h3>
            <p style={{ marginBottom: '2rem' }}>Edit the key text copy, contact information, and local SEO settings. Make sure to save changes!</p>
            
            <div className="editor-grid">
              {/* Contact Info Section */}
              <div className="editor-card">
                <h4>Contact Details</h4>
                <div className="form-group">
                  <label className="form-label">Phone Call Number</label>
                  <input
                    type="text"
                    value={config.contact?.phone || ''}
                    onChange={(e) => handleConfigChange('contact', 'phone', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Formatted Phone (Text Display)</label>
                  <input
                    type="text"
                    value={config.contact?.phoneFormatted || ''}
                    onChange={(e) => handleConfigChange('contact', 'phoneFormatted', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">WhatsApp Number</label>
                  <input
                    type="text"
                    value={config.contact?.whatsapp || ''}
                    onChange={(e) => handleConfigChange('contact', 'whatsapp', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    value={config.contact?.email || ''}
                    onChange={(e) => handleConfigChange('contact', 'email', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Full Address</label>
                  <input
                    type="text"
                    value={config.contact?.address || ''}
                    onChange={(e) => handleConfigChange('contact', 'address', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Office Landmark</label>
                  <input
                    type="text"
                    value={config.contact?.landmark || ''}
                    onChange={(e) => handleConfigChange('contact', 'landmark', e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Hero & Hours */}
              <div className="editor-card">
                <h4>Hero Banner & Business Hours</h4>
                <div className="form-group">
                  <label className="form-label">Hero Title Headline</label>
                  <input
                    type="text"
                    value={config.hero?.heading || ''}
                    onChange={(e) => handleConfigChange('hero', 'heading', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Hero Subheading</label>
                  <textarea
                    value={config.hero?.subheading || ''}
                    onChange={(e) => handleConfigChange('hero', 'subheading', e.target.value)}
                    className="form-input"
                    rows="3"
                  ></textarea>
                </div>

                <h4 style={{ marginTop: '2rem' }}>Business Hours</h4>
                <div className="form-group">
                  <label className="form-label">Weekdays Hours</label>
                  <input
                    type="text"
                    value={config.businessHours?.weekdays || ''}
                    onChange={(e) => handleConfigChange('businessHours', 'weekdays', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Weekends Hours</label>
                  <input
                    type="text"
                    value={config.businessHours?.weekends || ''}
                    onChange={(e) => handleConfigChange('businessHours', 'weekends', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Additional Note</label>
                  <input
                    type="text"
                    value={config.businessHours?.note || ''}
                    onChange={(e) => handleConfigChange('businessHours', 'note', e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Local SEO Manager */}
              <div className="editor-card" style={{ gridColumn: 'span 2' }}>
                <h4>Local SEO & Integrations</h4>
                <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group">
                    <label className="form-label">Meta HTML Title</label>
                    <input
                      type="text"
                      value={config.seo?.metaTitle || ''}
                      onChange={(e) => handleConfigChange('seo', 'metaTitle', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Google Sheets API Web App Link</label>
                    <input
                      type="text"
                      value={config.googleSheets?.endpointUrl || ''}
                      placeholder="e.g. https://script.google.com/macros/s/..."
                      onChange={(e) => handleConfigChange('googleSheets', 'endpointUrl', e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Meta Description (Max 160 Characters)</label>
                  <textarea
                    value={config.seo?.metaDescription || ''}
                    onChange={(e) => handleConfigChange('seo', 'metaDescription', e.target.value)}
                    className="form-input"
                    rows="2"
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Meta Keywords (Comma separated)</label>
                  <input
                    type="text"
                    value={config.seo?.metaKeywords || ''}
                    onChange={(e) => handleConfigChange('seo', 'metaKeywords', e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            <button className="btn-primary" onClick={handleSaveConfig} style={{ marginTop: '2rem' }}>
              Save Content Configuration
            </button>
          </div>
        )}

        {/* TAB 3: Media Manager */}
        {activeTab === 'gallery' && (
          <div className="tab-pane glass-panel">
            <h3>Gallery Media Manager</h3>
            <p style={{ marginBottom: '2rem' }}>Add new luxury assets to the photo masonry layout or configure YouTube video showcases.</p>
            
            <div className="editor-grid">
              {/* Add Image Form */}
              <div className="editor-card">
                <h4>Add New Image to Gallery</h4>
                <form onSubmit={handleAddImage} className="premium-form">
                  <div className="form-group">
                    <label className="form-label">Category Filter Tag</label>
                    <select
                      value={newImage.category}
                      onChange={(e) => setNewImage(prev => ({ ...prev, category: e.target.value }))}
                      className="form-input"
                    >
                      <option value="wedding">Wedding</option>
                      <option value="reception">Reception</option>
                      <option value="engagement">Engagement</option>
                      <option value="birthday">Birthday</option>
                      <option value="decoration">Decoration</option>
                      <option value="stage">Stage</option>
                      <option value="dining">Dining</option>
                      <option value="rooftop">Rooftop</option>
                      <option value="guest rooms">Guest Rooms</option>
                      <option value="corporate events">Corporate Events</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Image Absolute URL</label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={newImage.url}
                      onChange={(e) => setNewImage(prev => ({ ...prev, url: e.target.value }))}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Alt text Description</label>
                    <input
                      type="text"
                      placeholder="e.g. Elegant stage backdrop decoration"
                      value={newImage.alt}
                      onChange={(e) => setNewImage(prev => ({ ...prev, alt: e.target.value }))}
                      className="form-input"
                    />
                  </div>

                  <button type="submit" className="btn-primary">Add Image</button>
                </form>
              </div>

              {/* Add Video Form */}
              <div className="editor-card">
                <h4>Add New Video Showcase</h4>
                <form onSubmit={handleAddVideo} className="premium-form">
                  <div className="form-group">
                    <label className="form-label">Video Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Royal Wedding Virtual Tour"
                      value={newVideo.title}
                      onChange={(e) => setNewVideo(prev => ({ ...prev, title: e.target.value }))}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Video Link (YouTube URL)</label>
                    <input
                      type="text"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={newVideo.videoUrl}
                      onChange={(e) => setNewVideo(prev => ({ ...prev, videoUrl: e.target.value }))}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Thumbnail Image URL (Optional)</label>
                    <input
                      type="text"
                      placeholder="Leave blank to use default stage thumb"
                      value={newVideo.thumbnail}
                      onChange={(e) => setNewVideo(prev => ({ ...prev, thumbnail: e.target.value }))}
                      className="form-input"
                    />
                  </div>

                  <button type="submit" className="btn-primary">Add Video</button>
                </form>
              </div>

              {/* Manage Gallery Images */}
              <div className="editor-card" style={{ gridColumn: 'span 2' }}>
                <h4>Manage Active Photo Gallery</h4>
                <div className="gallery-admin-list">
                  {config.gallery?.map((img, index) => (
                    <div key={index} className="gallery-admin-card">
                      <img src={img.url} alt={img.alt} className="admin-thumb-img" />
                      <div className="admin-thumb-meta">
                        <span className="meta-tag">{img.category}</span>
                        <button className="btn-thumb-delete" onClick={() => handleDeleteImage(index)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Manage Videos */}
              <div className="editor-card" style={{ gridColumn: 'span 2' }}>
                <h4>Manage Video Showcase</h4>
                <div className="gallery-admin-list">
                  {config.videos?.map((vid) => (
                    <div key={vid.id} className="gallery-admin-card" style={{ width: '220px' }}>
                      <img src={vid.thumbnail} alt={vid.title} className="admin-thumb-img" />
                      <div className="admin-thumb-meta" style={{ flexDirection: 'column', gap: '5px', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, height: '32px', overflow: 'hidden' }}>{vid.title}</span>
                        <button className="btn-thumb-delete" onClick={() => handleDeleteVideo(vid.id)}>Remove Video</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FAQs & Testimonials */}
        {activeTab === 'faqs' && (
          <div className="tab-pane glass-panel">
            <h3>FAQs & Testimonials Editor</h3>
            <p style={{ marginBottom: '2rem' }}>Add or delete items in the dynamic Accordion FAQ section and the Testimonial Swipeable Carousel.</p>
            
            <div className="editor-grid">
              {/* Add FAQ Form */}
              <div className="editor-card">
                <h4>Add FAQ Accordion Item</h4>
                <form onSubmit={handleAddFAQ} className="premium-form">
                  <div className="form-group">
                    <label className="form-label">Question</label>
                    <input
                      type="text"
                      placeholder="e.g. Is catering included?"
                      value={newFAQ.question}
                      onChange={(e) => setNewFAQ(prev => ({ ...prev, question: e.target.value }))}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Answer Description</label>
                    <textarea
                      placeholder="Describe answer details..."
                      value={newFAQ.answer}
                      onChange={(e) => setNewFAQ(prev => ({ ...prev, answer: e.target.value }))}
                      className="form-input"
                      rows="4"
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-primary">Add FAQ</button>
                </form>
              </div>

              {/* Add Testimonial Form */}
              <div className="editor-card">
                <h4>Add Guest Review Testimonial</h4>
                <form onSubmit={handleAddTestimonial} className="premium-form">
                  <div className="form-group">
                    <label className="form-label">Guest Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Priya Chakraborty"
                      value={newTestimonial.name}
                      onChange={(e) => setNewTestimonial(prev => ({ ...prev, name: e.target.value }))}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Event Category Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Reception Ceremony"
                      value={newTestimonial.event}
                      onChange={(e) => setNewTestimonial(prev => ({ ...prev, event: e.target.value }))}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Star Rating (1 - 5)</label>
                    <select
                      value={newTestimonial.rating}
                      onChange={(e) => setNewTestimonial(prev => ({ ...prev, rating: e.target.value }))}
                      className="form-input"
                    >
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Review Text Description</label>
                    <textarea
                      placeholder="Enter review copy..."
                      value={newTestimonial.text}
                      onChange={(e) => setNewTestimonial(prev => ({ ...prev, text: e.target.value }))}
                      className="form-input"
                      rows="3"
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-primary">Add Review</button>
                </form>
              </div>

              {/* Manage FAQs list */}
              <div className="editor-card">
                <h4>Manage FAQs ({config.faqs?.length})</h4>
                <div className="admin-manage-list">
                  {config.faqs?.map((faq, index) => (
                    <div key={index} className="manage-item">
                      <div className="manage-item-info">
                        <strong>Q: {faq.question}</strong>
                        <p>{faq.answer.substring(0, 80)}...</p>
                      </div>
                      <button className="btn-item-delete" onClick={() => handleDeleteFAQ(index)}>&times;</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Manage Testimonials list */}
              <div className="editor-card">
                <h4>Manage Testimonials ({config.testimonials?.length})</h4>
                <div className="admin-manage-list">
                  {config.testimonials?.map((t, index) => (
                    <div key={index} className="manage-item">
                      <div className="manage-item-info">
                        <strong>{t.name} ({t.event})</strong>
                        <p>"{t.text.substring(0, 80)}..."</p>
                      </div>
                      <button className="btn-item-delete" onClick={() => handleDeleteTestimonial(index)}>&times;</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Backup & Settings */}
        {activeTab === 'backup' && (
          <div className="tab-pane glass-panel">
            <h3>Configuration Backup & Factory Reset</h3>
            <p style={{ marginBottom: '2rem' }}>
              Because changes are saved to your browser cache (`localStorage`), to publish changes permanently for all web visitors, you must:
            </p>
            
            <ol className="backup-steps">
              <li>Click <strong>Download Current Config JSON</strong> below.</li>
              <li>Save the downloaded `config.json` inside your project's `/public/config.json` path (replacing the original).</li>
              <li>Re-deploy or upload the website files to your hosting server.</li>
            </ol>

            <div className="backup-controls-group">
              <div className="backup-card">
                <h4>Export Site State</h4>
                <p>Download the current configured layout copy, social widgets, SEO, and FAQ datasets as a single JSON file.</p>
                <button className="btn-primary" onClick={handleDownloadConfig}>
                  Download Current Config JSON
                </button>
              </div>

              <div className="backup-card">
                <h4>Import Override State</h4>
                <p>Upload an edited `config.json` to load its configuration into the browser storage overrides instantly.</p>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleUploadConfig}
                  className="file-upload-input"
                  id="config-uploader"
                  style={{ display: 'none' }}
                />
                <label htmlFor="config-uploader" className="btn-primary" style={{ display: 'inline-flex', cursor: 'pointer' }}>
                  Upload config.json File
                </label>
              </div>

              <div className="backup-card danger-zone">
                <h4>Factory Defaults Reset</h4>
                <p>Wipe all local overrides and restore the initial content directly from the server's hardcoded `/config.json` configuration file.</p>
                <button className="btn-outline-maroon" onClick={handleResetConfig} style={{ borderColor: '#d32f2f', color: '#d32f2f' }}>
                  Reset Settings to Default
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .admin-dashboard-container {
          display: flex;
          min-height: 100vh;
          background-color: #f3ece4;
        }

        /* Sidebar Styles */
        .admin-sidebar {
          width: 260px;
          background-color: var(--color-maroon-deep);
          color: var(--color-white);
          display: flex;
          flex-direction: column;
          padding: 2.5rem 1.5rem;
          border-right: 2px solid var(--color-gold-luxury);
          flex-shrink: 0;
        }

        .sidebar-brand {
          margin-bottom: 3rem;
        }

        .sidebar-brand h3 {
          color: var(--color-gold-light);
          font-size: 1.4rem;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .sidebar-brand span {
          font-family: var(--font-body);
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: rgba(255,255,255,0.6);
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1;
        }

        .sidebar-link {
          width: 100%;
          text-align: left;
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.7);
          padding: 0.9rem 1rem;
          font-family: var(--font-body);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .sidebar-link:hover,
        .sidebar-link.active {
          background-color: rgba(255, 255, 255, 0.05);
          color: var(--color-gold-light);
          padding-left: 1.5rem;
          border-left: 3px solid var(--color-gold-luxury);
        }

        .btn-sidebar-signout {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: rgba(255,255,255,0.6);
          padding: 0.8rem;
          font-family: var(--font-body);
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          cursor: pointer;
          transition: var(--transition-fast);
          margin-top: auto;
        }

        .btn-sidebar-signout:hover {
          background-color: #d32f2f;
          color: var(--color-white);
          border-color: #d32f2f;
        }

        /* Workspace Styles */
        .admin-workspace {
          flex: 1;
          padding: 3rem;
          overflow-y: auto;
          height: 100vh;
        }

        .workspace-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
          border-bottom: 1px solid rgba(84, 11, 29, 0.08);
          padding-bottom: 1.5rem;
        }

        .header-meta h2 {
          font-size: 2.2rem;
          font-weight: 500;
          color: var(--color-maroon-deep);
        }

        .btn-signout-top {
          display: none;
        }

        /* Analytics row */
        .analytics-cards-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .stat-summary-card {
          background-color: var(--color-white);
          border: 1px solid rgba(84,11,29,0.06);
          padding: 1.8rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.02);
          position: relative;
        }

        .stat-summary-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 4px;
          background-color: var(--color-maroon-deep);
        }

        .stat-summary-card.yellow::before { background-color: var(--color-gold-luxury); }
        .stat-summary-card.blue::before { background-color: #1976d2; }
        .stat-summary-card.green::before { background-color: #2e7d32; }

        .stat-summary-card h4 {
          font-family: var(--font-body);
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--color-charcoal-muted);
          letter-spacing: 0.5px;
          margin-bottom: 0.5rem;
        }

        .summary-val {
          font-size: 2.5rem;
          font-weight: 300;
          color: var(--color-charcoal-text);
          line-height: 1;
        }

        /* Tab panes */
        .tab-pane {
          padding: 3rem 2.5rem;
          background: var(--color-white);
          border: 1px solid rgba(84, 11, 29, 0.08);
          box-shadow: var(--shadow-premium);
        }

        .pane-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          border-bottom: 1px solid rgba(84, 11, 29, 0.08);
          padding-bottom: 1rem;
        }

        .pane-header h3 {
          font-size: 1.8rem;
          font-weight: 500;
        }

        /* Table Filters */
        .table-filters-row {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .filter-search-input {
          flex: 1;
          padding: 0.8rem 1rem;
          font-family: var(--font-body);
          font-size: 0.88rem;
          border: 1px solid rgba(84, 11, 29, 0.15);
          outline: none;
        }

        .filter-select-input {
          width: 220px;
          padding: 0.8rem 1rem;
          font-family: var(--font-body);
          font-size: 0.88rem;
          border: 1px solid rgba(84, 11, 29, 0.15);
          outline: none;
        }

        /* Enquiries Table */
        .table-responsive {
          overflow-x: auto;
          width: 100%;
        }

        .enquiries-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.85rem;
        }

        .enquiries-table th {
          background-color: var(--color-cream-bg);
          color: var(--color-maroon-deep);
          font-weight: 700;
          padding: 1rem;
          border-bottom: 2px solid rgba(84, 11, 29, 0.1);
        }

        .enquiries-table td {
          padding: 1.1rem 1rem;
          border-bottom: 1px solid rgba(84, 11, 29, 0.05);
          vertical-align: middle;
          color: var(--color-charcoal-text);
        }

        .tag-event-type {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--color-gold-luxury);
          background-color: rgba(197, 160, 89, 0.1);
          padding: 0.2rem 0.5rem;
          display: inline-block;
          border-radius: 2px;
          margin-bottom: 0.2rem;
        }

        .message-cell {
          max-width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .status-selector-pill {
          padding: 0.4rem 0.8rem;
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 700;
          border: 1px solid transparent;
          border-radius: 15px;
          outline: none;
          cursor: pointer;
          background-color: #EEE;
        }

        .status-selector-pill.pending { background-color: #FFF9C4; color: #F57F17; }
        .status-selector-pill.contacted { background-color: #E3F2FD; color: #0D47A1; }
        .status-selector-pill.follow-up { background-color: #F3E5F5; color: #4A148C; }
        .status-selector-pill.booked { background-color: #E8F5E9; color: #1B5E20; }
        .status-selector-pill.closed { background-color: #ECEFF1; color: #37474F; }

        .btn-table-delete {
          font-size: 1.5rem;
          color: #d32f2f;
          background: transparent;
          border: none;
          cursor: pointer;
          font-weight: bold;
          transition: var(--transition-fast);
        }

        .btn-table-delete:hover {
          transform: scale(1.2);
        }

        /* Editor pane grids */
        .editor-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.5rem;
        }

        .editor-card {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          border: 1px solid rgba(84, 11, 29, 0.05);
          padding: 2rem;
          background-color: rgba(254, 253, 251, 0.5);
        }

        .editor-card h4 {
          font-size: 1.2rem;
          color: var(--color-maroon-deep);
          border-bottom: 1px solid rgba(84, 11, 29, 0.08);
          padding-bottom: 0.5rem;
          margin-bottom: 0.5rem;
        }

        /* Gallery Admin Lists */
        .gallery-admin-list {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          max-height: 400px;
          overflow-y: auto;
          padding: 10px;
          border: 1px solid rgba(84, 11, 29, 0.08);
          background: var(--color-cream-bg);
        }

        .gallery-admin-card {
          width: 140px;
          background-color: var(--color-white);
          border: 1px solid rgba(0,0,0,0.05);
          box-shadow: 0 2px 6px rgba(0,0,0,0.03);
          padding: 6px;
        }

        .admin-thumb-img {
          width: 100%;
          height: 100px;
          object-fit: cover;
        }

        .admin-thumb-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 5px;
        }

        .meta-tag {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--color-gold-luxury);
          text-transform: uppercase;
        }

        .btn-thumb-delete {
          font-size: 0.7rem;
          color: #d32f2f;
          border: none;
          background: transparent;
          cursor: pointer;
          font-weight: 600;
        }

        .btn-thumb-delete:hover {
          text-decoration: underline;
        }

        /* FAQ Manage lists */
        .admin-manage-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 380px;
          overflow-y: auto;
          padding: 8px;
          background: var(--color-cream-bg);
          border: 1px solid rgba(84,11,29,0.05);
        }

        .manage-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.8rem 1rem;
          background-color: var(--color-white);
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }

        .manage-item-info {
          flex: 1;
          padding-right: 1.5rem;
        }

        .manage-item-info strong {
          font-family: var(--font-body);
          font-size: 0.85rem;
          color: var(--color-maroon-deep);
          display: block;
        }

        .manage-item-info p {
          font-size: 0.78rem;
          line-height: 1.4;
          margin-top: 2px;
        }

        .btn-item-delete {
          font-size: 1.5rem;
          color: #d32f2f;
          background: transparent;
          border: none;
          cursor: pointer;
        }

        /* Backup view */
        .backup-steps {
          margin-left: 1.5rem;
          margin-bottom: 2rem;
          font-size: 0.95rem;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .backup-controls-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .backup-card {
          padding: 2.2rem 1.8rem;
          background: var(--color-cream-bg);
          border: 1px solid rgba(84,11,29,0.05);
          display: flex;
          flex-direction: column;
          gap: 15px;
          align-items: flex-start;
        }

        .backup-card h4 {
          font-size: 1.15rem;
          color: var(--color-maroon-deep);
        }

        .backup-card p {
          font-size: 0.82rem;
          line-height: 1.5;
        }

        .danger-zone {
          grid-column: span 2;
          border-color: rgba(211, 47, 47, 0.2);
          background-color: rgba(211, 47, 47, 0.01);
        }

        /* Dashboard Responsive */
        @media (max-width: 1024px) {
          .admin-sidebar {
            width: 80px;
            padding: 2rem 0.5rem;
            align-items: center;
          }
          .sidebar-brand h3, .sidebar-brand span, .sidebar-link, .btn-sidebar-signout {
            font-size: 0;
            padding: 1rem 0;
            text-align: center;
          }
          .sidebar-link::before {
            content: '⚙';
            font-size: 1.5rem;
          }
          .sidebar-nav button:nth-child(1)::before { content: '📋'; }
          .sidebar-nav button:nth-child(2)::before { content: '📝'; }
          .sidebar-nav button:nth-child(3)::before { content: '🖼'; }
          .sidebar-nav button:nth-child(4)::before { content: '❓'; }
          .sidebar-nav button:nth-child(5)::before { content: '💾'; }
          .btn-sidebar-signout::before { content: '🚪'; font-size: 1.2rem; }
          .admin-workspace {
            padding: 2rem 1.5rem;
          }
          .analytics-cards-row {
            grid-template-columns: 1fr 1fr;
          }
          .editor-grid, .backup-controls-group {
            grid-template-columns: 1fr;
          }
          .editor-card[style] {
            grid-column: span 1 !important;
          }
          .danger-zone {
            grid-column: span 1;
          }
        }

        @media (max-width: 576px) {
          .admin-dashboard-container {
            flex-direction: column;
          }
          .admin-sidebar {
            width: 100%;
            height: auto;
            padding: 1rem;
            flex-direction: row;
            justify-content: space-between;
          }
          .sidebar-brand {
            margin-bottom: 0;
          }
          .sidebar-nav {
            display: none; // Hide sidebar nav list on small mobiles, fallback to tabs header inside workspace
          }
          .btn-sidebar-signout {
            display: none;
          }
          .btn-signout-top {
            display: block;
          }
          .analytics-cards-row {
            grid-template-columns: 1fr;
          }
          .tab-pane {
            padding: 1.5rem 1rem;
          }
          .table-filters-row {
            flex-direction: column;
            gap: 0.8rem;
          }
          .filter-select-input {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
