import { logEvent as firebaseLogEvent, getAnalytics } from 'firebase/analytics';
import PropTypes from 'prop-types';
import { createContext, ReactNode, useContext } from 'react';
import { useFirebaseApp } from './FirebaseAppProvider';

const AnalyticsSdkContext = createContext<((event: string, eventParams?: object) => void) | null>(null);

type AnalyticsProviderProps = {
  children: ReactNode;
};

export function AnalyticsProvider(props: AnalyticsProviderProps) {
  const app = useFirebaseApp();
  const sdk = getAnalytics(app);

  // is this causing unnecessary re-renders?
  const logEvent = (event: string, eventParams?: object) => {
    firebaseLogEvent(sdk, event, eventParams);
  };

  return <AnalyticsSdkContext.Provider value={logEvent} {...props} />;
}
AnalyticsProvider.propTypes = {
  sdk: PropTypes.object,
};

export function useAnalytics() {
  const value = useContext(AnalyticsSdkContext);

  if (value === null) {
    throw new Error('useAnalytics must be used within a AnalyticsProvider');
  }

  return value;
}
