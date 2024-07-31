import { logEvent as firebaseLogEvent, getAnalytics } from 'firebase/analytics';
import PropTypes from 'prop-types';
import { createContext, ReactNode, useContext } from 'react';
import { useFirebaseApp } from './FirebaseAppProvider';

const AnalyticsSdkContext = createContext();

type AnalyticsProviderProps = {
  children: ReactNode;
};

export function AnalyticsProvider(props: AnalyticsProviderProps) {
  const app = useFirebaseApp();
  const sdk = getAnalytics(app);

  const logEvent = (event: string, eventParams: object) => {
    firebaseLogEvent(sdk, event, eventParams);
  };

  return <AnalyticsSdkContext.Provider value={logEvent} {...props} />;
}
AnalyticsProvider.propTypes = {
  sdk: PropTypes.object,
};

export function useAnalytics() {
  return useContext(AnalyticsSdkContext);
}
