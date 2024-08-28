import { isLoaded, load, project } from '@arcgis/core/geometry/projection';
import { ExternalLink, Label } from '@ugrc/utah-design-system';
import { toQueryString } from '@ugrc/utilities';
import ky from 'ky';
import startCase from 'lodash.startcase';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Text } from 'react-aria-components';

const featureClassNames = {
  counties: 'boundaries.county_boundaries',
  municipalities: 'boundaries.municipal_boundaries',
  landOwnership: 'cadastre.land_ownership',
  nationalGrid: 'indices.national_grid',
  dem: 'raster.usgs_dem_10meter',
  gnis: 'location.gnis_place_names',
  zip: 'boundaries.zip_code_areas',
  imageryDate: 'indices.hexagon_service_dates',
};

const fieldNames = {
  // counties & municipalities
  NAME: 'name',
  // state
  STATE_LGD: 'state_lgd',
  USNG: 'usng',
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

export const IdentifyInformation = ({ apiKey, wkid = 3857, location }) => {
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
        fieldNames.USNG,
        (data) => {
          if (!data) {
            setGrid(outside);

            return;
          }

          const values = [data[fieldNames.USNG]];
          setGrid(('{0}', values));
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
    [],
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
    [wkid, apiKey],
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
        }),
      );

      await reverseGeocode(mapPoint);

      controller.current = null;
    },
    [apiKey, wkid, reverseGeocode],
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

  if (!location) {
    return (
      <p>
        First, explore the map to find your desired location. Then, click on it to reveal additional details about the
        area.
      </p>
    );
  }

  return (
    <div className="mx-auto grid grid-cols-2 gap-10 lg:grid-cols-5 lg:gap-4">
      <div
        className="flex flex-col gap-1 rounded border border-zinc-200 px-3 py-2 dark:border-zinc-800"
        role="presentation"
      >
        <Label>Approximate Street Address</Label>
        <Text className="block pl-1 text-sm">
          <Text className="block pl-1 text-sm">{address}</Text>
          <ExternalLink href={spatial.googleMapsLink} className="pl-1">
            Google Street View
          </ExternalLink>
        </Text>
        <Text className="block grow content-end text-xs">
          Provided by{' '}
          <ExternalLink href="https://gis.utah.gov/products/sgid/transportation/road-centerlines/">roads</ExternalLink>
        </Text>
      </div>
      <div
        className="flex flex-col gap-1 rounded border border-zinc-200 px-3 py-2 dark:border-zinc-800"
        role="presentation"
      >
        <Label>City</Label>
        <Text className="block pl-1 text-sm">{city}</Text>
        <Text className="block grow content-end text-xs">
          Provided by{' '}
          <ExternalLink href="https://gis.utah.gov/products/sgid/boundaries/municipal/">
            municipal boundaries
          </ExternalLink>
        </Text>
      </div>
      <div
        className="flex flex-col gap-1 rounded border border-zinc-200 px-3 py-2 dark:border-zinc-800"
        role="presentation"
      >
        <Label>Zip code</Label>
        <Text className="block pl-1 text-sm">{zip}</Text>
        <Text className="block grow content-end text-xs">
          Provided by{' '}
          <ExternalLink href="https://gis.utah.gov/products/sgid/boundaries/zip-codes/">zip code areas</ExternalLink>
        </Text>
      </div>
      <div
        className="flex flex-col gap-1 rounded border border-zinc-200 px-3 py-2 dark:border-zinc-800"
        role="presentation"
      >
        <Label>County</Label>
        <Text className="block pl-1 text-sm">{startCase(county.toLowerCase())}</Text>
        <Text className="block grow content-end text-xs">
          Provided by{' '}
          <ExternalLink href="https://gis.utah.gov/products/sgid/boundaries/county/">county boundaries</ExternalLink>
        </Text>
      </div>
      <div
        className="flex flex-col gap-1 rounded border border-zinc-200 px-3 py-2 dark:border-zinc-800"
        role="presentation"
      >
        <Label>UTM 12 NAD83 coordinates</Label>
        <Text className="block pl-1 text-sm">
          {spatial.x}, {spatial.y} m
        </Text>
      </div>
      <div
        className="flex flex-col gap-1 rounded border border-zinc-200 px-3 py-2 dark:border-zinc-800"
        role="presentation"
      >
        <Label>WGS84 coordinates</Label>
        <Text className="block pl-1 text-sm">
          {spatial.lat}, {spatial.lon}
        </Text>
      </div>
      <div
        className="flex flex-col gap-1 rounded border border-zinc-200 px-3 py-2 dark:border-zinc-800"
        role="presentation"
      >
        <Label>Elevation</Label>
        <Text className="block pl-1 text-sm">{elevation.meters} m</Text>
        <Text className="block pl-1 text-sm">{elevation.feet} ft</Text>
        <Text className="block grow content-end text-xs">
          Provided by <ExternalLink href="https://elevation.nationalmap.gov/">The National Map</ExternalLink>
        </Text>
      </div>
      <div
        className="flex flex-col gap-1 rounded border border-zinc-200 px-3 py-2 dark:border-zinc-800"
        role="presentation"
      >
        <Label>Land administration category</Label>
        <Text className="block pl-1 text-sm">{ownership}</Text>
        <Text className="block grow content-end text-xs">
          Provided by{' '}
          <ExternalLink href="https://gis.utah.gov/products/sgid/cadastre/land-ownership/">land ownership</ExternalLink>
        </Text>
      </div>
      <div
        className="flex flex-col gap-1 rounded border border-zinc-200 px-3 py-2 dark:border-zinc-800"
        role="presentation"
      >
        <Label>US National Grid</Label>
        <Text className="block pl-1 text-sm">{grid}</Text>
        <Text className="block grow content-end text-xs">
          Provided by the{' '}
          <ExternalLink href="https://gis.utah.gov/products/sgid/indices/national-grid-index/">
            national grid
          </ExternalLink>
        </Text>
      </div>
      <div
        className="flex flex-col gap-1 rounded border border-zinc-200 px-3 py-2 dark:border-zinc-800"
        role="presentation"
      >
        <Label>Imagery flight metadata</Label>
        <Text className="block pl-1 text-sm">
          {flightDate.date && `${flightDate.resolution} resolution flown on ${flightDate.date}`}
        </Text>
      </div>
    </div>
  );
};

IdentifyInformation.propTypes = {
  location: PropTypes.object,
  apiKey: PropTypes.string.isRequired,
  wkid: PropTypes.number,
};
