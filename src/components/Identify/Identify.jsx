import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { isLoaded, load, project } from '@arcgis/core/geometry/projection';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Container } from 'reactstrap';

import { toQueryString } from '@ugrc/utilities';

import ky from 'ky';
import './Identify.css';

const featureClassNames = {
  counties: 'boundaries.county_boundaries',
  municipalities: 'boundaries.municipal_boundaries',
  landOwnership: 'cadastre.land_ownership',
  nationalGrid: 'indices.national_grid',
  dem: 'SGID10.RASTER.USGS_DEM_10METER',
  gnis: 'location.gnis_place_names',
  zip: 'boundaries.zip_code_areas',
  imageryDate: 'indices.hexagon_service_dates',
};

const fieldNames = {
  // counties & municipalities
  NAME: 'name',
  // state
  STATE_LGD: 'state_lgd',
  GRID1Mil: 'grid1mil',
  GRIS100K: 'grid100k',
  FEET: 'feet',
  METERS: 'value',
  ZIP5: 'zip5',
};

const urls = {
  search: 'https://api.mapserv.utah.gov/api/v1/search',
  reverse: 'https://api.mapserv.utah.gov/api/v1/geocode/reverse',
  google: 'https://www.google.com/maps?q&layer=c&',
};

const intl = new Intl.DateTimeFormat('en-US', { dateStyle: 'short' });
const outside = 'Outside of Utah';
const loading = 'loading...';

const projectPoint = async (mapPoint, srid) => {
  // lat/long coords
  if (!isLoaded()) {
    await load();
  }

  return project(mapPoint, { wkid: srid });
};

const IdentifyInformation = ({ apiKey, wkid = 3857, location }) => {
  const [spatial, setSpatial] = useState({
    x: 0,
    y: 0,
    lat: 0,
    lon: 0,
    googleMapsLink: '',
  });
  const [address, setAddress] = useState(loading);
  const [ownership, setOwnership] = useState(loading);
  const [county, setCounty] = useState(loading);
  const [grid, setGrid] = useState(loading);
  const [zip, setZip] = useState(loading);
  const [city, setCity] = useState(loading);
  const [elevation, setElevation] = useState(loading);
  const [flightDate, setFlightDate] = useState(loading);
  const signal = useRef();
  const controller = useRef();

  const requests = useMemo(
    () => [
      [
        featureClassNames.counties,
        fieldNames.NAME,
        (data) => {
          if (!data) {
            setCounty(outside);

            return;
          }
          setCounty(data[fieldNames.NAME]);
        },
      ],
      [
        featureClassNames.municipalities,
        fieldNames.NAME,
        (data) => {
          if (!data) {
            setCity('Unincorporated');

            return;
          }
          setCity(data[fieldNames.NAME]);
        },
      ],
      [
        featureClassNames.landOwnership,
        fieldNames.STATE_LGD,
        (data) => {
          if (!data) {
            setOwnership(outside);

            return;
          }
          setOwnership(data[fieldNames.STATE_LGD]);
        },
      ],
      [
        featureClassNames.nationalGrid,
        fieldNames.GRID1Mil + ',' + fieldNames.GRIS100K,
        (data) => {
          if (!data) {
            setGrid(outside);

            return;
          }

          const values = [data[fieldNames.GRID1Mil], data[fieldNames.GRIS100K], data.x, data.y];
          setGrid(('{0} {1} {2} {3}', values));
        },
      ],
      [
        featureClassNames.dem,
        fieldNames.FEET + ',' + fieldNames.METERS,
        (data) => {
          if (!data) {
            setElevation({ feet: outside, meters: outside });

            return;
          }

          const feet = Math.round(data[fieldNames.FEET]);

          setElevation({ feet: feet, meters: data[fieldNames.METERS] });
        },
      ],
      [
        featureClassNames.zip,
        fieldNames.ZIP5,
        (data) => {
          if (!data) {
            setZip(outside);

            return;
          }

          setZip(data[fieldNames.ZIP5]);
        },
      ],
      [
        featureClassNames.imageryDate,
        'date,resolution',
        (data) => {
          if (!data) {
            setFlightDate({ date: 'unknown', resolution: 'A mystery' });

            return;
          }

          if ((data?.date?.length ?? 0) > 0) {
            data.date = intl.format(new Date(data['date']));

            setFlightDate(data);
          } else if ((data?.length ?? 0) > 0) {
            const dates = data.map((result) => {
              return { date: new Date(result.attributes['date']), resolution: result.attributes['resolution'] };
            });
            const sorted = dates.sort((a, b) => {
              return a.date - b.date;
            });

            const newest = sorted[sorted.length - 1];
            newest.date = intl.format(newest.date);
            setFlightDate(newest);
          }
        },
      ],
    ],
    []
  );

  const reverseGeocode = useCallback(
    async (point) => {
      const distanceInMeters = 50;
      const url = `${urls.reverse}/${point.x}/${point.y}/?`;
      const query = toQueryString({
        apiKey: apiKey,
        distance: distanceInMeters,
        spatialReference: wkid,
      });

      try {
        const response = await fetch(url + query, { signal: signal.current });
        let result = await response.json();
        let address = 'No house address found.';

        if (response.status === 200 && result.status === 200 && result.result.address) {
          address = result.result.address.street;
        }

        setAddress(address);
      } catch (ex) {
        console.warn(ex);
      }
    },
    [wkid, apiKey]
  );

  const get = useCallback(
    async (requestMetadata, mapPoint) => {
      await Promise.all(
        requestMetadata.map(async (item) => {
          const url = `${urls.search}/${item[0]}/${item[1]}?`;
          const query = toQueryString({
            geometry: `point: ${JSON.stringify(mapPoint.toJSON())}`,
            attributeStyle: 'lower',
            apiKey: apiKey,
            spatialReference: wkid,
          });

          try {
            const response = await ky.get(url + query, { signal: signal.current, mode: 'cors' });
            let result = await response.json();
            result = result.result;

            let data;

            if (result.length === 1) {
              data = result[0].attributes || {};
            }

            if (result.length > 1) {
              console.warn('more than one result found', url);
              data = result;
            }

            item[2](data);
          } catch (error) {
            console.warn(error);
          }
        })
      );

      await reverseGeocode(mapPoint);

      controller.current = null;
    },
    [apiKey, wkid, reverseGeocode]
  );

  useEffect(() => {
    const identify = async () => {
      setSpatial({
        x: 0,
        y: 0,
        lat: 0,
        lon: 0,
      });
      setAddress(loading);
      setZip(loading);
      setOwnership(loading);
      setCity(loading);
      setCounty(loading);
      setGrid(loading);

      get(requests, location);
      const ll = await projectPoint(location, 4326);
      const utm = await projectPoint(location, 26912);

      const decimalPlaces = 100000;
      const lat = Math.round(ll.x * decimalPlaces) / decimalPlaces;
      const lon = Math.round(ll.y * decimalPlaces) / decimalPlaces;

      const x = Math.round(utm.x * 100) / 100;
      const y = Math.round(utm.y * 100) / 100;

      setSpatial({
        x,
        y,
        lat,
        lon,
        googleMapsLink: `${urls.google}cbll=${lon},${lat}`,
      });
    };

    controller.current?.abort();
    controller.current = new AbortController();
    signal.current = controller.current.signal;

    if (location) {
      identify();
    }

    return () => controller.current?.abort();
  }, [location, get, requests]);

  return (
    <Container fluid className="identify">
      <Col>
        <h4>What&apos;s here?</h4>
        <hr />
      </Col>
      <Col>
        <strong>Approximate Street Address</strong>
        <p className="identify--muted">
          <span className="d-block">{address}</span>
          <a href={spatial.googleMapsLink} className="text-info" target="_blank" rel="noopener noreferrer">
            Google Street View
          </a>
          <FontAwesomeIcon
            icon={faExternalLinkAlt}
            className="identify--muted"
            style={{ marginLeft: '.5em' }}
          ></FontAwesomeIcon>
        </p>
      </Col>
      <Col>
        <strong>City</strong>
        <p className="identify--muted">{city}</p>
      </Col>
      <Col>
        <strong>Zip Code</strong>
        <p className="identify--muted">{zip}</p>
      </Col>
      <Col>
        <strong>County</strong>
        <p className="identify--muted">{county}</p>
      </Col>
      <Col>
        <strong>UTM 12 NAD83 Coordinates</strong>
        <p className="identify--muted">
          {spatial.x}, {spatial.y} meters
        </p>
      </Col>
      <Col>
        <strong>WGS84 Coordinates</strong>
        <p className="identify--muted">
          {spatial.lat}, {spatial.lon}
        </p>
      </Col>
      <Col>
        <strong>Elevation Meters</strong>
        <p className="identify--muted">{elevation.meters}</p>
      </Col>
      <Col>
        <strong>Elevation Feet</strong>
        <p className="identify--muted">{elevation.feet}</p>
      </Col>
      <Col>
        <strong>Land Administration Category</strong>
        <p className="identify--muted">{ownership}</p>
      </Col>
      <Col>
        <strong>US National Grid</strong>
        <p className="identify--muted">{grid}</p>
      </Col>
      <Col>
        <strong>Imagery Flight Data</strong>
        <p className="identify--muted">{flightDate.date && `${flightDate.resolution} on ${flightDate.date}`}</p>
      </Col>
    </Container>
  );
};

IdentifyInformation.propTypes = {
  location: PropTypes.object,
};

const IdentifyContainer = function ({ show, children }) {
  return (
    <div className="identify__container side-bar side-bar--with-border side-bar--open">
      <button type="button" className="identify__close" aria-label="Close" onClick={() => show(false)}>
        <span aria-hidden="true">&times;</span>
      </button>
      {children}
    </div>
  );
};

IdentifyContainer.propTypes = {
  show: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export { IdentifyContainer, IdentifyInformation };

IdentifyInformation.propTypes = {
  apiKey: PropTypes.string.isRequired,
  wkid: PropTypes.number,
};
