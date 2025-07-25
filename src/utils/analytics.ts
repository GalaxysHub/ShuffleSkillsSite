// Google Analytics 4 utilities
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// GA4 Measurement ID - replace with your actual GA4 measurement ID
export const GA_MEASUREMENT_ID = 'GA_MEASUREMENT_ID';

// Initialize Google Analytics
export const initGA = () => {
  // Analytics is loaded via script tag in index.html
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      // Enhanced privacy settings
      anonymize_ip: true,
      cookie_flags: 'SameSite=None;Secure',
    });
  }
};

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_location: url,
      page_title: title,
    });
  }
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track shuffle-specific events
export const trackShuffleEvent = {
  // Track when a move is completed
  completeMove: (moveName: string, difficulty: string) => {
    trackEvent('complete_move', 'shuffle_progress', `${moveName} (${difficulty})`);
  },
  
  // Track when a goal is set
  setGoal: (moveName: string, difficulty: string) => {
    trackEvent('set_goal', 'shuffle_goals', `${moveName} (${difficulty})`);
  },
  
  // Track when a move modal is opened
  viewMove: (moveName: string, difficulty: string) => {
    trackEvent('view_move', 'shuffle_engagement', `${moveName} (${difficulty})`);
  },
  
  // Track authentication events
  login: (method: string) => {
    trackEvent('login', 'authentication', method);
  },
  
  // Track move uploads
  uploadMove: (moveName: string, difficulty: string) => {
    trackEvent('upload_move', 'content_creation', `${moveName} (${difficulty})`);
  },
  
  // Track filter usage
  filterMoves: (filterType: string, filterValue: string) => {
    trackEvent('filter_moves', 'navigation', `${filterType}: ${filterValue}`);
  }
};