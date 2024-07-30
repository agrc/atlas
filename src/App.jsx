import {
  Drawer,
  Footer,
  Geocode,
  Header,
  Sherlock,
  SocialMedia,
  UgrcLogo,
  masqueradeProvider,
} from '@ugrc/utah-design-system';
import { logEvent } from 'firebase/analytics';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useOverlayTrigger } from 'react-aria';
import { ErrorBoundary } from 'react-error-boundary';
import { useOverlayTriggerState } from 'react-stately';
import { useAnalytics } from './components/firebase/AnalyticsProvider';
import { useFirebaseApp } from './components/firebase/FirebaseAppProvider';
import MapView from './components/MapView';
import config from './config';

import MapProvider from './components/contexts/MapProvider';
import { Tip } from './Tip';

const apiKey = import.meta.env.VITE_WEB_API;
const version = import.meta.env.PACKAGE_VERSION;

const ErrorFallback = ({ error }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );
};

ErrorFallback.propTypes = {
  error: PropTypes.object,
};

const links = [
  {
    key: 'UGRC Homepage',
    action: { url: 'https://gis.utah.gov' },
  },
  {
    key: 'GitHub Repository',
    action: { url: 'https://github.com/agrc/atlas' },
  },
  {
    key: `Version ${version} changelog`,
    action: { url: `https://github.com/agrc/atlas/releases/v${version}` },
  },
];
const url = 'https://masquerade.ugrc.utah.gov/arcgis/rest/services/UtahLocator/GeocodeServer';
const wkid = 26912;

export default function App() {
  const app = useFirebaseApp();
  const analytics = useAnalytics();
  useEffect(() => {
    async function initPerformance() {
      const { getPerformance } = await import('firebase/performance');

      return getPerformance(app);
    }
    initPerformance();
  }, [app]);
  const [zoomToGraphic, setZoomToGraphic] = useState({
    zoomToGraphic: {
      graphic: {},
      level: 0,
    },
  });
  const [showIdentify, setShowIdentify] = useState(false);
  const [mapClick, setMapClick] = useState(null);
  const [mapView, setMapView] = useState({});
  const sideBarState = useOverlayTriggerState({ defaultOpen: true });
  const sideBarTriggerProps = useOverlayTrigger(
    {
      type: 'dialog',
    },
    sideBarState,
  );

  const trayState = useOverlayTriggerState({ defaultOpen: true });
  const trayTriggerProps = useOverlayTrigger(
    {
      type: 'dialog',
    },
    trayState,
  );

  const onSherlockMatch = (graphics) => {
    // summary:
    //      Zooms to the passed in graphic(s).
    // graphics: esri.Graphic[]
    //      The esri.Graphic(s) that you want to zoom to.
    // tags:
    //      private
    logEvent(analytics, 'sherlock:zoom');

    // check for point feature
    setZoomToGraphic({
      graphic: graphics,
      preserve: false,
    });
  };

  const findAddressOptions = {
    apiKey,
    wkid: config.WEB_MERCATOR_WKID,
    pointSymbol: {
      type: 'simple-marker',
      style: 'diamond',
      color: config.MARKER_FILL_COLOR,
      size: '18px',
      outline: {
        color: config.MARKER_OUTLINE_COLOR,
        width: 1,
      },
    },
    events: {
      success: (graphic) => {
        logEvent(analytics, 'findAddress::success');
        setZoomToGraphic({
          graphic: graphic,
          level: 18,
        });
      },
      error: console.error,
    },
  };

  const masqueradeSherlock = {
    label: 'Find a place',
    provider: masqueradeProvider(url, wkid),
    maxResultsToDisplay: 10,
    onSherlockMatch: onSherlockMatch,
  };

  const onClick = useCallback((event) => {
    setShowIdentify(true);
    // setSideBarOpen(true);
    setMapClick(event.mapPoint);
  }, []);

  const mapOptions = {
    zoomToGraphic: zoomToGraphic,
    onClick: onClick,
    setView: setMapView,
  };

  return (
    <>
      <main className="flex flex-col h-screen md:gap-2">
        <Header links={links}>
          <div className="h-full grow flex items-center gap-3">
            <UgrcLogo />
            <h2 className="font-heading text-3xl sm:text-5xl font-black text-zinc-600 dark:text-zinc-100">
              Atlas Utah
            </h2>
          </div>
        </Header>
        <MapProvider>
          <section className="relative gap-2 flex min-h-0 flex-1 overflow-x-hidden md:mx-2">
            <Drawer main state={sideBarState} {...sideBarTriggerProps}>
              <div className="grid grid-cols-1 gap-2">
                <h2 className="text-xl font-bold">Map controls</h2>
                <div className="p-3 border border-zinc-200 dark:border-zinc-700 rounded">
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <Sherlock {...masqueradeSherlock}></Sherlock>
                  </ErrorBoundary>
                </div>
                <div className="p-3 border border-zinc-200 dark:border-zinc-700 rounded">
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <Geocode {...findAddressOptions} />
                  </ErrorBoundary>
                </div>
                <Tip title="Did you know?">
                  The data and services for this application are provided by the Utah Geospatial Resource Center, UGRC.
                  Visit our website, <a href="https://gis.utah.gov/">gis.utah.gov</a> to view more data and services.
                </Tip>
                <Tip>
                  This web application is a <a href="https://github.com/agrc/atlas">GitHub template</a> that you can use
                  to create your own website.
                </Tip>
              </div>
            </Drawer>
            <div className="flex flex-col flex-1 rounded">
              <div className="flex-1 dark:rounded overflow-hidden">
                <MapView setView={setMapView} />
              </div>
              <SocialMedia />
            </div>
            <Drawer type="tray" state={trayState} {...trayTriggerProps}>
              I am a tray
            </Drawer>
          </section>
        </MapProvider>
      </main>
      <Footer />
    </>
  );
}
