import esriConfig from '@arcgis/core/config';
import initializeTheme from '@ugrc/esri-theme-toggle';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AnalyticsProvider, FirebaseAppProvider, MapProvider } from './components/contexts';
import './index.css';

esriConfig.assetsPath = './assets';
initializeTheme();

let firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
  measurementId: '',
};

if (import.meta.env.VITE_FIREBASE_CONFIG) {
  firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG);
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <AnalyticsProvider>
        <MapProvider>
          <App />
        </MapProvider>
      </AnalyticsProvider>
    </FirebaseAppProvider>
  </React.StrictMode>,
);
