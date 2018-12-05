import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import './Identify.css';
import { Container, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

import Helpers from '../../Helpers';
import { loadModules } from 'esri-loader';

class IdentifyInformation extends Component {
  state = {
    county: 'loading...',
    municipality: 'loading...',
    landOwner: 'loading...',
    x: 0,
    y: 0,
    zip: '00000',
    address: 'loading...',
    lat: 0,
    lon: 0
  };

  controller = new AbortController();
  signal = this.controller.signal;

  static propTypes = {
    apiKey: PropTypes.string.isRequired,
    wkid: PropTypes.number
  };

  static defaultProps = {
    wkid: 3857
  };

  identify = this.identify.bind(this);

  featureClassNames = {
    counties: 'SGID10.BOUNDARIES.Counties',
    municipalities: 'SGID10.BOUNDARIES.Municipalities',
    landOwnership: 'SGID10.CADASTRE.LandOwnership',
    nationalGrid: 'SGID10.INDICES.NationalGrid',
    dem: 'SGID10.RASTER.USGS_DEM_10METER',
    gnis: 'SGID10.LOCATION.PlaceNamesGNIS2010',
    zip: 'SGID10.BOUNDARIES.ZipCodes'
  };

  fieldNames = {
    // counties & municipalities
    NAME: 'NAME',
    // state
    STATE_LGD: 'STATE_LGD',
    GRID1Mil: 'GRID1Mil',
    GRIS100K: 'GRID100K',
    FEET: 'feet',
    METERS: 'value',
    ZIP5: 'ZIP5'
  };

  urls = {
    search: 'https://api.mapserv.utah.gov/api/v1/search'
  }

  outside = 'Outside of Utah';

  requests = [
    [
      this.featureClassNames.counties,
      this.fieldNames.NAME,
      (data) => {
        if (!data) {
          this.setState({ county: this.outside });

          return;
        }
        this.setState({ county: data[this.fieldNames.NAME] });
      }
    ], [
      this.featureClassNames.municipalities,
      this.fieldNames.NAME,
      (data) => {
        if (!data) {
          this.setState({ municipality: 'Unincorporated' });

          return;
        }
        this.setState({ municipality: data[this.fieldNames.NAME] });
      }
    ], [
      this.featureClassNames.landOwnership,
      this.fieldNames.STATE_LGD,
      (data) => {
        if (!data) {
          this.setState({ landOwner: this.outside });

          return;
        }
        this.setState({ landOwner: data[this.fieldNames.STATE_LGD] });
      }
    ], [
      this.featureClassNames.nationalGrid,
      this.fieldNames.GRID1Mil + ',' + this.fieldNames.GRIS100K,
      (data) => {
        if (!data) {
          this.setState({ nationalGrid: this.outside });

          return;
        }

        const values = [
          data[this.fieldNames.GRID1Mil],
          data[this.fieldNames.GRIS100K], data.x, data.y
        ];
        this.setState({ nationalGrid: ('{0} {1} {2} {3}', values) });
      }
    ], [
      this.featureClassNames.dem,
      this.fieldNames.FEET + ',' + this.fieldNames.METERS,
      (data) => {
        if (!data) {
          this.setState({ elevFeet: this.outside });
          this.setState({ elevMeters: this.outside });

          return;
        }

        const feet = Math.round(data[this.fieldNames.FEET] * 100) / 100;

        this.setState({ elevFeet: feet });
        this.setState({ elevMeters: data[this.fieldNames.METERS] });
      }
    ], [
      this.featureClassNames.zip,
      this.fieldNames.ZIP5,
      (data) => {
        if (!data) {
          this.setState({ zip: this.outside });

          return;
        }

        this.setState({ zip: data[this.fieldNames.ZIP5] });
      }
    ]
  ];

  render() {
    return (
      <Container fluid className="identify">
        <Col>
          <h4>What's here?</h4>
          <hr />
        </Col>
        <Col>
          <strong>UTM 12 NAD83 Coordinates</strong>
          <p className="identify--muted">{this.state.x}, {this.state.y}</p>
        </Col>
        <Col>
          <strong>Approximate Street Address</strong>
          <p className="identify--muted">{this.state.address}</p>
        </Col>
        <Col>
          <strong>Zip Code</strong>
          <p className="identify--muted">{this.state.zip}</p>
        </Col>
        <Col>
          <strong>Land Administration Category</strong>
          <p className="identify--muted">{this.state.landOwner}</p>
        </Col>
        <Col>
          <strong>WGS84 Coordinates</strong>
          <p className="identify--muted">{this.state.lat}, {this.state.lon}</p>
        </Col>
        <Col>
          <strong>City</strong>
          <p className="identify--muted">{this.state.municipality}</p>
        </Col>
        <Col>
          <strong>County</strong>
          <p className="identify--muted">{this.state.county}</p>
        </Col>
        <Col>
          <strong>US National Grid</strong>
          <p className="identify--muted">{this.state.nationalGrid}</p>
        </Col>
        <Col>
          <strong>Elevation Meters</strong>
          <p className="identify--muted">{this.state.elevMeters}</p>
        </Col>
        <Col>
          <strong>Elevation Feet</strong>
          <p className="identify--muted">{this.state.elevFeet}</p>
        </Col>
        <Col>
          <a href={this.state.googleMapsLink} className="text-info position-static" target="_blank" rel="noopener noreferrer">Google Street View</a>
          <FontAwesomeIcon icon={faExternalLinkAlt} className="identify--muted" style={{ marginLeft: '.5em'}}></FontAwesomeIcon>
        </Col>
      </Container>
    );
  }

  async componentDidMount() {
    await this.identify();
  }

  componentDidUpdate(prevProps) {
    const currentLocation = (((this.props || false).location || false).x || false);
    const previousLocation = (((prevProps || false).location || false).x || false);

    if (currentLocation !== previousLocation && currentLocation !== false) {
      this.identify();
    }
  }

  componentWillUnmount() {
    this.controller.abort();
  }

  async fetch(requestMetadata, mapPoint) {
    requestMetadata.forEach(async item => {

      const url = `${this.urls.search}/${item[0]}/${item[1]}?`;
      const query = Helpers.toQueryString({
        geometry: `point: ${JSON.stringify(mapPoint.toJSON())}`,
        attributeStyle: 'identical',
        apiKey: this.props.apiKey,
        spatialReference: this.props.wkid
      });

      const response = await fetch(url + query, { signal: this.signal });
      let result = await response.json();
      result = result.result;

      let data;
      // const decimalLength = -5;
      if (result.length > 0) {
        data = result[0].attributes || {};
      }

      item[2](data);
    });

    this.reverseGeocode(mapPoint);
  }

  async identify() {
    console.log('identifying');

    this.setState({
      x: 0,
      y: 0,
      address: 'loading...',
      zip: 'loading...',
      landOwner: 'loading...',
      lat: 0,
      lon: 0,
      municipality: 'loading...',
      county: 'loading...',
      nationalGrid: 'loading...'
    });

    this.fetch(this.requests, this.props.location);
    const ll = await this.projectPoint(this.props.location, 4326);
    const utm = await this.projectPoint(this.props.location, 26912);

    const decimalPlaces = 100000;
    const lat = Math.round(ll.x * decimalPlaces) / decimalPlaces;
    const lon = Math.round(ll.y * decimalPlaces) / decimalPlaces;

    const x = Math.round(utm.x * 100) / 100;
    const y = Math.round(utm.y * 100) / 100;

    this.setState({
      lat,
      lon,
      x,
      y,
      googleMapsLink: `https://www.google.com/maps?q&layer=c&cbll=${lon},${lat}`
    });
  }

  async reverseGeocode(point) {
    const distanceInMeters = 50;
    const url = `https://api.mapserv.utah.gov/api/v1/geocode/reverse/${point.x}/${point.y}/?`;
    const query = Helpers.toQueryString({
      apiKey: this.props.apiKey,
      distance: distanceInMeters,
      spatialReference: 3857
    });

    const response = await fetch(url + query, { signal: this.signal });
    let result = await response.json();
    let address = 'No house address found.';

    if (response.status === 200 && result.status === 200 && result.result.address) {
      address = result.result.address.street;
    }

    this.setState({
      address
    });
  }

  async projectPoint(mapPoint, srid) {
    const [projection] = await loadModules(['esri/geometry/projection']);
    // lat/long coords
    console.log("loaded: ", projection.isLoaded());
    console.log("supported: ", projection.isSupported())

    await projection.load();

    console.log(projection.isLoaded())

    return projection.project(mapPoint, { wkid: srid });
  }
}

class IdentifyContainer extends PureComponent {
  close = this.close.bind(this);

  close() {
    this.props.show(false);
  }

  render() {
    return (
      <div className="identify__container side-bar side-bar--with-border side-bar--open">
        <button type="button" className="identify__close" aria-label="Close" onClick={this.close}>
          <span aria-hidden="true">&times;</span>
        </button>
        {this.props.children}
      </div>
    );
  }
}

export { IdentifyContainer, IdentifyInformation }
