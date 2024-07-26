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
import MapView from './components/MapView';
import { useAnalytics } from './components/firebase/AnalyticsProvider';
import { useFirebaseApp } from './components/firebase/FirebaseAppProvider';
import config from './config';

import MapProvider from './components/contexts/MapProvider';

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
  const overlayTriggerProps = useOverlayTrigger(
    {
      type: 'dialog',
    },
    sideBarState,
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

  const sidebarOptions = {
    // sideBarOpen: sideBarOpen,
    // toggleSidebar: () => setSideBarOpen(!sideBarOpen),
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
            <Drawer main state={sideBarState} {...overlayTriggerProps}>
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
                <div className="border border-zinc-200 dark:border-zinc-700 rounded">
                  <p className="flex items-center gap-3 pb-2 pl-4 pt-4 text-3xl font-semibold text-primary-900 dark:text-accent-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                      ></path>
                    </svg>
                    <span>Did you know?</span>
                  </p>
                  <div className="m-0 px-4 pb-4">
                    Data and services are provided by <a href="https://gis.utah.gov/">UGRC</a>.
                  </div>
                </div>
                <div className="border border-zinc-200 dark:border-zinc-700 rounded">
                  <p className="flex items-center gap-3 pb-2 pl-4 pt-4 text-3xl font-semibold text-primary-900 dark:text-accent-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                      ></path>
                    </svg>
                    <span>Tip</span>
                  </p>
                  <div className="m-0 px-4 pb-4">
                    This web application is a <a href="https://github.com/agrc/atlas">GitHub template</a> that you can
                    use to create your own website.
                  </div>
                </div>
              </div>
            </Drawer>
            <div className="flex flex-col flex-1 rounded">
              <div className="flex-1 dark:rounded overflow-hidden">
                <MapView setView={setMapView} />
              </div>
              <SocialMedia />
            </div>
          </section>
        </MapProvider>
      </main>
      <Footer />
    </>
  );
}
