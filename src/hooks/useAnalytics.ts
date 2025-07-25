import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../utils/analytics';

// Hook to automatically track page views
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route changes
    const url = window.location.origin + location.pathname + location.search;
    const title = document.title;
    
    trackPageView(url, title);
  }, [location]);
};

export default usePageTracking;