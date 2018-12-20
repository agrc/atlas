import React, { Component } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MapLens from './components/MapLens';
import FindAddress from './components/dart-board/FindAddress';
import MouseTrap from './components/MouseTrap/MouseTrap';
import { Sherlock, WebApiProvider } from './components/Sherlock/Sherlock';
import MapView from './components/esrijs/MapView';
import Printer from './components/esrijs/Print';
import { IdentifyInformation, IdentifyContainer } from './components/Identify';
import { Collapse, Button, Card } from 'reactstrap';
import config from './config';
import './App.css';

export default class App extends Component {
  state = {
    zoomToPoint: {
      zoomToGraphic: {
        graphic: {},
        level: 0
      }
    },
    mapClick: {},
    mousePoint: {},
    sideBarOpen: window.innerWidth >= config.MIN_DESKTOP_WIDTH,
    showIdentify: false,
    showPrint: false
  };

  onFindAddress = this.onFindAddress.bind(this);
  onMapClick = this.onMapClick.bind(this);
  onMouseMove = this.onMouseMove.bind(this);
  showIdentify = this.showIdentify.bind(this);
  onSherlockMatch = this.onSherlockMatch.bind(this);
  togglePrint = this.togglePrint.bind(this);
  toggleSidebar = this.toggleSidebar.bind(this);
  setView = this.setView.bind(this);

  quadWord = process.env.REACT_APP_DISCOVER;
  apiKey = process.env.REACT_APP_WEB_API;
  version = process.env.REACT_APP_VERSION;

  gnisSherlock = {
    provider: new WebApiProvider(this.apiKey, 'SGID10.LOCATION.PlaceNamesGNIS2010', 'NAME', {
      contextField: 'COUNTY'
    }),
    label: 'Find Point of Interest',
    placeHolder: 'place name ...',
    maxResultsToDisplay: 10,
    onSherlockMatch: this.onSherlockMatch
  };

  citySherlock = {
    provider: new WebApiProvider(this.apiKey, 'SGID10.BOUNDARIES.Municipalities', 'NAME'),
    label: 'Find City',
    placeHolder: 'city name ...',
    maxResultsToDisplay: 10,
    onSherlockMatch: this.onSherlockMatch
  };

  render() {
    const findAddressOptions = {
      apiKey: this.apiKey,
      wkid: config.WEB_MERCATOR_WKID,
      symbol: {
        type: 'simple-marker',
        style: 'diamond',
        color: config.MARKER_FILL_COLOR,
        size: '18px',
        outline: {
          color: config.MARKER_OUTLINE_COLOR,
          width: 1
        }
      }
    };

    const mapOptions = {
      discoverKey: this.quadWord,
      zoomToGraphic: this.state.zoomToGraphic,
      onClick: this.onMapClick,
      onMouseMove: this.onMouseMove,
      setView: this.setView
    }

    const sidebarOptions = {
      sideBarOpen: this.state.sideBarOpen,
      toggleSidebar: this.toggleSidebar
    }

    return (
      <div className="app">
        <Header title="Atlas Utah" version={this.version} />
        {this.state.showIdentify ?
        <IdentifyContainer show={this.showIdentify}>
          <IdentifyInformation apiKey={findAddressOptions.apiKey} location={this.state.mapClick} />
        </IdentifyContainer>
        : null}
        <Sidebar>
          <small>Data and services provided by <a href="https://gis.utah.gov/">Utah AGRC</a></small>
          <p>Click a location on the map for more information</p>

          <h4>Find Address</h4>
          <div id="geocodeNode">
            <FindAddress
              pointSymbol={findAddressOptions.symbol}
              apiKey={findAddressOptions.apiKey}
              onFindAddress={this.onFindAddress}
              onFindAddressError={this.onFindAddressError} />
          </div>

          <Sherlock {...this.gnisSherlock}></Sherlock>

          <Sherlock {...this.citySherlock}></Sherlock>

          <Card>
            <Button block onClick={this.togglePrint}>Export Map</Button>
            <Collapse isOpen={this.state.showPrint}>
              {this.state.showPrint ?
                <Printer view={this.state.mapView}></Printer>
                : null}
            </Collapse>
          </Card>
          {this.state.mousePoint.x ?
            <MouseTrap point={this.state.mousePoint}></MouseTrap>
            : null}
        </Sidebar>
        <MapLens {...sidebarOptions}>
          <MapView {...mapOptions} />
        </MapLens>
      </div>
    );
  }

  onFindAddress(graphic) {
    this.setState({
      zoomToGraphic: {
        graphic: graphic,
        level: 18
      }
    });
  };

  onFindAddressError(e) {
    console.error(e);
  };

  onMapClick(event) {
    this.setState({
      showIdentify: true,
      sideBarOpen: true,
      mapClick: event.mapPoint
    });
  }

  onMouseMove(point) {
    this.setState({ mousePoint: point });
  }

  showIdentify(value) {
    this.setState({ showIdentify: value });
  }

  onSherlockMatch(graphics) {
    // summary:
    //      Zooms to the passed in graphic(s).
    // graphics: esri.Graphic[]
    //      The esri.Graphic(s) that you want to zoom to.
    // tags:
    //      private
    console.log('sherlock:zoom', arguments);

    // check for point feature
    this.setState({
      zoomToGraphic: {
        graphic: graphics,
        preserve: false
      }
    });
  }

  togglePrint() {
    this.setState({ showPrint: !this.state.showPrint });
  }

  toggleSidebar() {
    this.setState(state => {
      return { sideBarOpen: !state.sideBarOpen };
    });
  }

  setView(value) {
    this.setState({
      mapView: value
    });
  }
}
