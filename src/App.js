import React, { useState, useCallback } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Collapse, Button, Card } from 'reactstrap';
import Graphic from '@arcgis/core/Graphic';
import QueryTask from '@arcgis/core/tasks/QueryTask';

import FindAddress from '@agrc/dart-board';
import { Sherlock, WebApiProvider } from '@agrc/sherlock';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MapLens from './components/MapLens';
import MapView from './components/esrijs/MapView';
import Printer from './components/esrijs/Print';
import { IdentifyInformation, IdentifyContainer } from './components/Identify';
import config from './config';

import './App.css';

const apiKey = process.env.REACT_APP_WEB_API;
const version = process.env.REACT_APP_VERSION;

const ErrorFallback = ({ error }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );
};

export default function App() {
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
    modules: { Graphic, QueryTask },
  };

  const citySherlock = {
    provider: new WebApiProvider(apiKey, 'SGID10.BOUNDARIES.Municipalities', 'NAME'),
    label: 'Find City',
    placeHolder: 'city name ...',
    maxResultsToDisplay: 10,
    onSherlockMatch: onSherlockMatch,
    modules: { Graphic, QueryTask },
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
          <small>
            Data and services provided by <a href="https://gis.utah.gov/">Utah AGRC</a>
          </small>
          <p>Click a location on the map for more information</p>
          <h4>Find Address</h4>
          <div id="geocodeNode">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <FindAddress {...findAddressOptions} />
            </ErrorBoundary>
          </div>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Sherlock {...gnisSherlock}></Sherlock>
          </ErrorBoundary>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Sherlock {...citySherlock}></Sherlock>
          </ErrorBoundary>
          <Card style={{ marginTop: '1em' }}>
            <Button block onClick={() => setShowPrint(!showPrint)}>
              Export Map
            </Button>
            <Collapse isOpen={showPrint}>{showPrint ? <Printer view={mapView}></Printer> : null}</Collapse>
          </Card>
        </Sidebar>
      </ErrorBoundary>
      <MapLens {...sidebarOptions}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <MapView {...mapOptions} />
        </ErrorBoundary>
      </MapLens>
    </div>
  );
}
