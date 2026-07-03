// Utility to manage configuration and local enquiries

const CONFIG_LS_KEY = 'palki_banquet_config';
const ENQUIRIES_LS_KEY = 'palki_banquet_enquiries';

// Initial default configuration fallback in case fetch is delayed
let cachedConfig = null;

export async function loadConfig() {
  if (cachedConfig) return cachedConfig;
  
  try {
    const response = await fetch('/config.json');
    if (!response.ok) throw new Error('Failed to load default config.json');
    const defaultConfig = await response.json();
    
    // Check if there are local overrides
    const localOverride = localStorage.getItem(CONFIG_LS_KEY);
    if (localOverride) {
      const parsedOverride = JSON.parse(localOverride);
      // Merge overrides on top of defaultConfig
      cachedConfig = { ...defaultConfig, ...parsedOverride };
    } else {
      cachedConfig = defaultConfig;
    }
  } catch (error) {
    console.error('Error fetching config:', error);
    // Fallback if network fails
    const localOverride = localStorage.getItem(CONFIG_LS_KEY);
    if (localOverride) {
      cachedConfig = JSON.parse(localOverride);
    }
  }
  return cachedConfig;
}

export function saveConfigOverride(updatedConfig) {
  cachedConfig = updatedConfig;
  localStorage.setItem(CONFIG_LS_KEY, JSON.stringify(updatedConfig));
  
  // Dispatch custom event to notify components
  window.dispatchEvent(new Event('configUpdated'));
}

export function resetConfigToDefault() {
  localStorage.removeItem(CONFIG_LS_KEY);
  cachedConfig = null;
  window.dispatchEvent(new Event('configUpdated'));
}

// Enquiries Management

export function getEnquiries() {
  const localEnquiries = localStorage.getItem(ENQUIRIES_LS_KEY);
  if (!localEnquiries) {
    // Inject some mock enquiries for demo purposes if empty
    const mockEnquiries = [
      {
        id: 'enq_1',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
        name: 'Sayan Mukhopadhyay',
        phone: '9830098300',
        email: 'sayan@gmail.com',
        eventType: 'wedding',
        eventDate: '2026-11-25',
        guests: '500',
        budget: 'Rs. 2,00,000 - Rs. 3,50,000',
        preferredContactTime: 'Evening',
        message: 'Looking for rooftop decoration options for wedding evening.',
        status: 'Contacted'
      },
      {
        id: 'enq_2',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
        name: 'Riya Dutta',
        phone: '9433012345',
        email: 'riya.dutta@yahoo.com',
        eventType: 'birthday',
        eventDate: '2026-08-14',
        guests: '150',
        budget: 'Below Rs. 1,00,000',
        preferredContactTime: 'Afternoon',
        message: 'Need standard dining hall and parking details.',
        status: 'Pending'
      }
    ];
    localStorage.setItem(ENQUIRIES_LS_KEY, JSON.stringify(mockEnquiries));
    return mockEnquiries;
  }
  return JSON.parse(localEnquiries);
}

export function saveEnquiry(enquiry) {
  const enquiries = getEnquiries();
  const newEnquiry = {
    id: `enq_${Date.now()}`,
    timestamp: new Date().toISOString(),
    status: 'Pending',
    ...enquiry
  };
  enquiries.unshift(newEnquiry); // Put newest on top
  localStorage.setItem(ENQUIRIES_LS_KEY, JSON.stringify(enquiries));
  return newEnquiry;
}

export function updateEnquiryStatus(id, newStatus) {
  const enquiries = getEnquiries();
  const updated = enquiries.map(enq => {
    if (enq.id === id) {
      return { ...enq, status: newStatus };
    }
    return enq;
  });
  localStorage.setItem(ENQUIRIES_LS_KEY, JSON.stringify(updated));
}

export function deleteEnquiry(id) {
  const enquiries = getEnquiries();
  const updated = enquiries.filter(enq => enq.id !== id);
  localStorage.setItem(ENQUIRIES_LS_KEY, JSON.stringify(updated));
}
