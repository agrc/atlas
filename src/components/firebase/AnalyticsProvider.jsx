import { getAnalytics } from 'firebase/analytics';
import PropTypes from 'prop-types';
import { createContext, useContext } from 'react';
import { useFirebaseApp } from './FirebaseAppProvider.jsx';

const AnalyticsSdkContext = createContext(undefined);

export function AnalyticsProvider(props) {
  const app = useFirebaseApp();

  let { sdk } = props;

  if (!sdk) {
    sdk = getAnalytics(app);
  }

  return <AnalyticsSdkContext.Provider value={sdk} {...props} />;
}
AnalyticsProvider.propTypes = {
  sdk: PropTypes.object,
};

export function useAnalytics() {
  return useContext(AnalyticsSdkContext);
}
