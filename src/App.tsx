import esriConfig from '@arcgis/core/config';
import Point from '@arcgis/core/geometry/Point';
import Graphic from '@arcgis/core/Graphic';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol.js';
import Viewpoint from '@arcgis/core/Viewpoint.js';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import {
  Drawer,
  ExternalLink,
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
  const { zoom, placeGraphic, mapView } = useMap();
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
      style: 'diamond' as const,
      color: config.MARKER_FILL_COLOR,
      size: 20,
      outline: {
        color: config.MARKER_OUTLINE_COLOR,
        width: 3,
      },
    },
    events: {
      success: (event: Graphic) => {
        logEvent('findAddress::success', { ...event.attributes });

        const graphic = new Graphic(event);
        const point = new Viewpoint({ scale: 1500, targetGeometry: event.geometry });

        zoom(point);
        placeGraphic(graphic);

        mapView!.openPopup({
          features: [graphic],
          fetchFeatures: true,
          location: graphic.geometry as Point,
        });
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
    (event: __esri.ViewImmediateClickEvent) => {
      mapView!.hitTest(event).then(({ results }) => {
        if (
          ((results?.length ?? 0) > 0 && (results[0] as __esri.GraphicHit).graphic.layer === null) ||
          results.length === 0
        ) {
          trayState.open();

          placeGraphic(
            new Graphic({
              geometry: event.mapPoint,
              symbol: new SimpleMarkerSymbol({
                style: 'diamond',
                color: config.MARKER_FILL_COLOR,
                size: 20,
                outline: {
                  color: config.MARKER_OUTLINE_COLOR,
                  width: 3,
                },
              }),
            }),
          );

          return setInitialIdentifyLocation(event.mapPoint);
        }
      });
    },
    [mapView, placeGraphic, trayState],
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
        <section className="relative flex min-h-0 flex-1 overflow-x-hidden md:mr-2">
          <Drawer main state={sideBarState} {...sideBarTriggerProps}>
            <div className="mx-2 mb-2 grid grid-cols-1 gap-2">
              <h2 className="text-xl font-bold">Map controls</h2>
              <div className="flex flex-col gap-4 rounded border border-zinc-200 p-3 dark:border-zinc-700">
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <Sherlock {...masqueradeSherlockOptions} />
                  <details className="group">
                    <summary className="flex cursor-default list-none items-center gap-1 rounded outline-0 outline-offset-2 transition-all focus:outline-2 focus:outline-primary-900 focus:dark:outline-secondary-600 [&::-webkit-details-marker]:hidden">
                      <InformationCircleIcon aria-hidden="true" className="size-5 grow-0" />
                      <span className="grow text-xs font-semibold">About this tool</span>
                      <div className="flex flex-1 justify-end">
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="flex size-6 grow-0 rotate-0 transform text-zinc-500 transition-all duration-300 group-open:-rotate-180 dark:text-zinc-400"
                        />
                      </div>
                    </summary>
                    <p className="pl-2 pt-2 text-xs">
                      Functionality provided by the Sherlock component from the{' '}
                      <ExternalLink href="https://www.npmjs.com/package/@ugrc/utah-design-system">
                        @ugrc/utah-design-system
                      </ExternalLink>
                      package.
                    </p>
                  </details>
                </ErrorBoundary>
              </div>
              <div className="flex flex-col gap-4 rounded border border-zinc-200 p-3 dark:border-zinc-700">
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <Geocode {...geocodeOptions} />
                  <details className="group">
                    <summary className="flex cursor-default list-none items-center gap-1 rounded outline-0 outline-offset-2 transition-all focus:outline-2 focus:outline-primary-900 focus:dark:outline-secondary-600 [&::-webkit-details-marker]:hidden">
                      <InformationCircleIcon aria-hidden="true" className="size-5 grow-0" />
                      <span className="grow text-xs font-semibold">About this tool</span>
                      <div className="flex flex-1 justify-end">
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="flex size-6 grow-0 rotate-0 transform text-zinc-500 transition-all duration-300 group-open:-rotate-180 dark:text-zinc-400"
                        />
                      </div>
                    </summary>
                    <p className="pl-2 pt-2 text-xs">
                      Functionality provided by the Geocode component from the{' '}
                      <ExternalLink href="https://www.npmjs.com/package/@ugrc/utah-design-system">
                        @ugrc/utah-design-system
                      </ExternalLink>{' '}
                      package.
                    </p>
                  </details>
                </ErrorBoundary>
              </div>
              <Tip title="Did you know?">
                The data and services for this application are provided by the Utah Geospatial Resource Center, UGRC.
                Visit our website, <ExternalLink href="https://gis.utah.gov/">gis.utah.gov</ExternalLink> to view more
                data and services.
              </Tip>
              <Tip>
                This web application is a{' '}
                <ExternalLink href="https://github.com/agrc/atlas">GitHub template</ExternalLink> that you can use to
                create your own website.
              </Tip>
            </div>
          </Drawer>
          <div className="relative flex flex-1 flex-col rounded border border-b-0 border-zinc-200 dark:border-0 dark:border-zinc-700">
            <div className="relative flex-1 overflow-hidden dark:rounded">
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <MapContainer onClick={onClick} />
              </ErrorBoundary>
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
