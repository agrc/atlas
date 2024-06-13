import { initializeApp, registerVersion } from 'firebase/app';
import PropTypes from 'prop-types';
import { createContext, useContext, useMemo, version } from 'react';

const DEFAULT_APP_NAME = '[DEFAULT]';
const FirebaseAppContext = createContext(undefined);

export function FirebaseAppProvider(props) {
  const { firebaseConfig } = props;
  const firebaseApp = useMemo(() => {
    registerVersion('react', version || 'unknown');
    // TODO! add app package.json version
    // registerVersion('app', appVersion || 'unknown');

    return initializeApp(firebaseConfig, DEFAULT_APP_NAME);
  }, [firebaseConfig]);

  return <FirebaseAppContext.Provider value={firebaseApp} {...props} />;
}

export function useFirebaseApp() {
  const firebaseApp = useContext(FirebaseAppContext);
  if (!firebaseApp) {
    throw new Error('Cannot call useFirebaseApp unless your component is within a FirebaseAppProvider');
  }

  return firebaseApp;
}

FirebaseAppProvider.propTypes = {
  firebaseConfig: PropTypes.object.isRequired,
  firebaseApp: PropTypes.object,
  appName: PropTypes.string,
  children: PropTypes.node,
};
