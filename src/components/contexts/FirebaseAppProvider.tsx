import { FirebaseApp, FirebaseOptions, initializeApp, registerVersion } from 'firebase/app';
import { createContext, ReactNode, useContext, useMemo, version } from 'react';

const DEFAULT_APP_NAME = '[DEFAULT]';
const FirebaseAppContext = createContext<FirebaseApp | null>(null);

const appVersion = import.meta.env.PACKAGE_VERSION;

type FirebaseProviderProps = {
  firebaseConfig: FirebaseOptions;
  children: ReactNode;
};

export function FirebaseAppProvider(props: FirebaseProviderProps) {
  const { firebaseConfig } = props;
  const firebaseApp = useMemo(() => {
    registerVersion('react', version || 'unknown');
    registerVersion('app', appVersion || 'unknown');

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
