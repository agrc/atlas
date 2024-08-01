import esriConfig from '@arcgis/core/config';
import Point from '@arcgis/core/geometry/Point';
import Graphic from '@arcgis/core/Graphic';
import Viewpoint from '@arcgis/core/Viewpoint.js';
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
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useOverlayTrigger } from 'react-aria';
import { ErrorBoundary } from 'react-error-boundary';
import { useOverlayTriggerState } from 'react-stately';
import { MapContainer, Tip } from './components';
import { useAnalytics, useFirebaseApp } from './components/contexts';
import { useMap } from './components/hooks';
import { IdentifyInformation } from './components/Identify';
import config from './config';

const apiKey = import.meta.env.VITE_WEB_API;
const version = import.meta.env.PACKAGE_VERSION;

const ErrorFallback = ({ error }: { error: Error }) => {
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

esriConfig.assetsPath = './assets';
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
  const logEvent = useAnalytics();
  const { zoom, placeGraphic } = useMap();
  const [initialIdentifyLocation, setInitialIdentifyLocation] = useState<Point | null>(null);
  const sideBarState = useOverlayTriggerState({ defaultOpen: window.innerWidth >= config.MIN_DESKTOP_WIDTH });
  const sideBarTriggerProps = useOverlayTrigger(
    {
      type: 'dialog',
    },
    sideBarState,
  );

  const trayState = useOverlayTriggerState({ defaultOpen: false });
  const trayTriggerProps = useOverlayTrigger(
    {
      type: 'dialog',
    },
    trayState,
  );

  // initialize firebase performance metrics
  useEffect(() => {
    async function initPerformance() {
      const { getPerformance } = await import('firebase/performance');

      return getPerformance(app);
    }
    initPerformance();
  }, [app]);

  const onSherlockMatch = (graphics: Graphic[]) => {
    // summary:
    //      Zooms to the passed in graphic(s).
    // graphics: esri.Graphic[]
    //      The esri.Graphic(s) that you want to zoom to.
    // tags:
    //      private
    logEvent('sherlock:zoom');

    zoom(new Viewpoint({ scale: 10000, targetGeometry: graphics[0].geometry }));
    placeGraphic(graphics);
  };

  const geocodeOptions = {
    apiKey,
    wkid: config.WEB_MERCATOR_WKID,
    pointSymbol: {
      type: 'simple-marker',
      style: 'diamond',
      color: config.MARKER_FILL_COLOR,
      size: 20,
      outline: {
        color: config.MARKER_OUTLINE_COLOR,
        width: 3,
      },
    },
    events: {
      success: (graphic: Graphic) => {
        logEvent('findAddress::success', { ...graphic.attributes });
        placeGraphic(new Graphic(graphic));
        const point = new Viewpoint({ scale: 1500, targetGeometry: graphic.geometry });
        zoom(point);
      },
      error: () => {
        logEvent('findAddress::not found');
        placeGraphic(null);
      },
    },
  };

  const masqueradeSherlockOptions = {
    label: 'Find a place',
    provider: masqueradeProvider(url, wkid),
    maxResultsToDisplay: 10,
    onSherlockMatch: onSherlockMatch,
  };

  const onClick = useCallback(
    (event: __esri.ViewClickEvent) => {
      setInitialIdentifyLocation(event.mapPoint);
      trayState.open();
    },
    [trayState],
  );

  return (
    <>
      <main className="flex h-screen flex-col md:gap-2">
        <Header links={links}>
          <div className="flex h-full grow items-center gap-3">
            <UgrcLogo />
            <h2 className="font-heading text-3xl font-black text-zinc-600 sm:text-5xl dark:text-zinc-100">
              Atlas Utah
            </h2>
          </div>
        </Header>
        <section className="relative flex min-h-0 flex-1 gap-2 overflow-x-hidden md:mr-2">
          <Drawer main state={sideBarState} {...sideBarTriggerProps}>
            <div className="mx-2 mb-2 grid grid-cols-1 gap-2">
              <h2 className="text-xl font-bold">Map controls</h2>
              <div className="rounded border border-zinc-200 p-3 dark:border-zinc-700">
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <Sherlock {...masqueradeSherlockOptions}></Sherlock>
                </ErrorBoundary>
              </div>
              <div className="rounded border border-zinc-200 p-3 dark:border-zinc-700">
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <Geocode {...geocodeOptions} />
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
          <div className="relative flex flex-1 flex-col rounded">
            <div className="relative flex-1 overflow-hidden dark:rounded">
              <MapContainer onIdentifyClick={onClick} />
              <Drawer
                type="tray"
                className="shadow-inner dark:shadow-white/20"
                allowFullScreen
                state={trayState}
                {...trayTriggerProps}
              >
                <section className="grid gap-2 px-7 pt-2">
                  <h2 className="text-center">What&#39;s here?</h2>
                  <IdentifyInformation apiKey={apiKey} location={initialIdentifyLocation} />
                </section>
              </Drawer>
            </div>
            <SocialMedia />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}