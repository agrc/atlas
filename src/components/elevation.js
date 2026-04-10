// Copyright (C) 2026 State of Utah
// Licensed under Expat / MIT. This program is distributed on an “AS IS” BASIS, WITHOUT ANY WARRANTY OR CONDITIONS OF ANY KIND, either express or implied. See the Expat / MIT for more details.

import ky from 'ky';

export const ELEVATION_SERVICE_URL =
  'https://elevation.nationalmap.gov/arcgis/rest/services/3DEPElevation/ImageServer/identify';
export const FEET_PER_METER = 3.28084;

const toFiniteNumber = (value) => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const parsed = Number.parseFloat(value);

  return Number.isFinite(parsed) ? parsed : null;
};

export const normalizeElevationValue = (value) => {
  const meters = toFiniteNumber(value);

  if (meters === null) {
    return null;
  }

  return {
    meters,
    feet: Math.round(meters * FEET_PER_METER),
  };
};

export const createElevationQuery = (mapPoint, wkid = 3857) => {
  return {
    geometry: `${mapPoint.x},${mapPoint.y}`,
    geometryType: 'esriGeometryPoint',
    sr: wkid,
    returnGeometry: false,
    returnCatalogItems: false,
    f: 'pjson',
  };
};

export const fetchElevation = async ({ mapPoint, signal, wkid = 3857, httpClient = ky }) => {
  const response = await httpClient.get(ELEVATION_SERVICE_URL, {
    searchParams: createElevationQuery(mapPoint, wkid),
    signal,
    mode: 'cors',
  });
  const result = await response.json();

  return normalizeElevationValue(result?.value);
};
