import { BootstrapDartboard as FindAddress } from '@ugrc/dart-board';
import Sherlock, { WebApiProvider } from '@ugrc/sherlock';
import { getAnalytics } from 'firebase/analytics';
import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { AnalyticsProvider, useFirebaseApp, useInitPerformance } from 'reactfire';
import { Button, Card, Collapse } from 'reactstrap';

import MapView from './components/esrijs/MapView';
import Printer from './components/esrijs/Print';
import Header from './components/Header/Header';
import { IdentifyContainer, IdentifyInformation } from './components/Identify/Identify';
import MapLens from './components/MapLens/MapLens';
import Sidebar from './components/Sidebar/Sidebar';
import config from './config';

import '@ugrc/sherlock/src/Sherlock.css';
import './App.css';

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

export default function App() {
  const app = useFirebaseApp();
  useInitPerformance(async () => {
    const { getPerformance } = await import('firebase/performance');
    return getPerformance(app);
  });
  const [zoomToGraphic, setZoomToGraphic] = useState({
    zoomToGraphic: {
      graphic: {},
      level: 0,
    },
  });
  const [showIdentify, setShowIdentify] = useState(false);
  const [mapClick, setMapClick] = useState(null);
  const [showPrint, setShowPrint] = useState(false);
  const [mapView, setMapView] = useState({});
  const [sideBarOpen, setSideBarOpen] = useState(window.innerWidth >= config.MIN_DESKTOP_WIDTH);

  const onSherlockMatch = (graphics) => {
    // summary:
    //      Zooms to the passed in graphic(s).
    // graphics: esri.Graphic[]
    //      The esri.Graphic(s) that you want to zoom to.
    // tags:
    //      private
    console.log('sherlock:zoom');

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
        console.log('findAddress::success');
        setZoomToGraphic({
          graphic: graphic,
          level: 18,
        });
      },
      error: console.error,
    },
  };

  const gnisSherlock = {
    provider: new WebApiProvider(apiKey, 'SGID10.LOCATION.PlaceNamesGNIS2019', 'NAME', {
      contextField: 'COUNTY',
    }),
    label: 'Find Point of Interest',
    placeHolder: 'place name ...',
    maxResultsToDisplay: 10,
    onSherlockMatch: onSherlockMatch,
  };

  const citySherlock = {
    provider: new WebApiProvider(apiKey, 'SGID10.BOUNDARIES.Municipalities', 'NAME'),
    label: 'Find City',
    placeHolder: 'city name ...',
    maxResultsToDisplay: 10,
    onSherlockMatch: onSherlockMatch,
  };

  const onClick = useCallback((event) => {
    setShowIdentify(true);
    setSideBarOpen(true);
    setMapClick(event.mapPoint);
  }, []);

  const mapOptions = {
    zoomToGraphic: zoomToGraphic,
    onClick: onClick,
    setView: setMapView,
  };

  const sidebarOptions = {
    sideBarOpen: sideBarOpen,
    toggleSidebar: () => setSideBarOpen(!sideBarOpen),
  };

  return (
    <AnalyticsProvider sdk={getAnalytics(app)}>
      <div className="app">
        <Header title="Atlas Utah" version={version} />
        {showIdentify ? (
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <IdentifyContainer show={setShowIdentify}>
              <IdentifyInformation apiKey={apiKey} location={mapClick} />
            </IdentifyContainer>
          </ErrorBoundary>
        ) : null}
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Sidebar>
            <div className="bg-light border text-center p-1">
              <small>
                Data and services provided by <a href="https://gis.utah.gov/">UGRC</a>.
              </small>
            </div>
            <p>Click a location on the map for more information</p>
            <h4>Find Address</h4>
            <div id="geocodeNode">
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <FindAddress {...findAddressOptions} />
              </ErrorBoundary>
            </div>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <div className="mt-3">
                <Sherlock {...gnisSherlock}></Sherlock>
              </div>
            </ErrorBoundary>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <div className="mt-3">
                <Sherlock {...citySherlock}></Sherlock>
              </div>
            </ErrorBoundary>
            <Card style={{ marginTop: '1em' }}>
              <Button block onClick={() => setShowPrint(!showPrint)}>
                Export Map
              </Button>
              <Collapse isOpen={showPrint}>{showPrint ? <Printer view={mapView}></Printer> : null}</Collapse>
            </Card>
            <div style={{ marginTop: '1em', border: '#aaa 1px dashed' }}>
              <small>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    This web application is a <a href="https://github.com/agrc/atlas">GitHub template</a> that you can
                    use to create your own website.
                  </li>
                  <li className="list-group-item">
                    Submit any application or data <a href="https://github.com/agrc/atlas/issues/new/choose">issues</a>{' '}
                    via GitHub issues.
                  </li>
                  <li className="list-group-item">
                    Reach out to us on <a href="https://twitter.com/MapUtah">Twitter</a> if you want to chat.
                  </li>
                </ul>
              </small>
            </div>
          </Sidebar>
        </ErrorBoundary>
        <MapLens {...sidebarOptions}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <MapView {...mapOptions} />
          </ErrorBoundary>
        </MapLens>
      </div>
    </AnalyticsProvider>
  );
}
