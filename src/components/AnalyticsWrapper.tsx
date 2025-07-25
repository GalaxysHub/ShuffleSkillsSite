import { usePageTracking } from '../hooks/useAnalytics';

interface AnalyticsWrapperProps {
  children: React.ReactNode;
}

const AnalyticsWrapper: React.FC<AnalyticsWrapperProps> = ({ children }) => {
  // This hook will automatically track page views on route changes
  usePageTracking();

  return <>{children}</>;
};

export default AnalyticsWrapper;