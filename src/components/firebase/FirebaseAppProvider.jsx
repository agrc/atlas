import { getApps, initializeApp, registerVersion } from 'firebase/app';
import PropTypes from 'prop-types';
import { createContext, useContext, useMemo, version } from 'react';

const DEFAULT_APP_NAME = '[DEFAULT]';
const FirebaseAppContext = createContext(undefined);

const shallowEq = (a, b) => a === b || [...Object.keys(a), ...Object.keys(b)].every((key) => a[key] === b[key]);

export function FirebaseAppProvider(props) {
  const { firebaseConfig, appName } = props;

  const firebaseApp = useMemo(() => {
    if (props.firebaseApp) {
      return props.firebaseApp;
    }

    const existingApp = getApps().find((app) => app.name === (appName || DEFAULT_APP_NAME));
    if (existingApp) {
      if (firebaseConfig && shallowEq(existingApp.options, firebaseConfig)) {
        return existingApp;
      } else {
        throw new Error(
          `Does not match the options already provided to the ${appName || 'default'} firebase app instance, give this new instance a different appName.`,
        );
      }
    } else {
      if (!firebaseConfig) {
        throw new Error('No firebaseConfig provided');
      }

      registerVersion('react', version || 'unknown');
      // TODO! add app package.json version
      // registerVersion('app', appVersion || 'unknown');

      return initializeApp(firebaseConfig, appName);
    }
  }, [props.firebaseApp, appName, firebaseConfig]);

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
