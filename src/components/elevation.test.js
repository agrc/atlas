// Copyright (C) 2026 State of Utah
// Licensed under Expat / MIT. This program is distributed on an “AS IS” BASIS, WITHOUT ANY WARRANTY OR CONDITIONS OF ANY KIND, either express or implied. See the Expat / MIT for more details.

import { describe, expect, it, vi } from 'vitest';
import { createElevationQuery, ELEVATION_SERVICE_URL, fetchElevation, normalizeElevationValue } from './elevation';

describe('normalizeElevationValue', () => {
  it('returns meters and rounded feet for numeric strings', () => {
    expect(normalizeElevationValue('1292.3')).toEqual({ meters: 1292.3, feet: 4240 });
  });

  it('returns null for NoData responses', () => {
    expect(normalizeElevationValue('NoData')).toBeNull();
  });
});

describe('createElevationQuery', () => {
  it('builds the identify query using map point coordinates', () => {
    expect(createElevationQuery({ x: -12455387.84, y: 4975536.36 })).toEqual({
      geometry: '-12455387.84,4975536.36',
      geometryType: 'esriGeometryPoint',
      sr: 3857,
      returnGeometry: false,
      returnCatalogItems: false,
      f: 'pjson',
    });
  });
});

describe('fetchElevation', () => {
  it('normalizes a successful identify response', async () => {
    const json = vi.fn().mockResolvedValue({ value: '1292.3' });
    const httpClient = {
      get: vi.fn().mockResolvedValue({ json }),
    };

    await expect(
      fetchElevation({
        mapPoint: { x: -12455387.84, y: 4975536.36 },
        httpClient,
      }),
    ).resolves.toEqual({ meters: 1292.3, feet: 4240 });

    expect(httpClient.get).toHaveBeenCalledWith(
      ELEVATION_SERVICE_URL,
      expect.objectContaining({
        mode: 'cors',
        searchParams: expect.objectContaining({
          geometry: '-12455387.84,4975536.36',
          sr: 3857,
        }),
      }),
    );
  });

  it('returns null for NoData responses', async () => {
    const httpClient = {
      get: vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue({ value: 'NoData' }),
      }),
    };

    await expect(fetchElevation({ mapPoint: { x: 0, y: 0 }, httpClient })).resolves.toBeNull();
  });

  it('propagates request failures for caller-specific handling', async () => {
    const httpClient = {
      get: vi.fn().mockRejectedValue(new DOMException('The operation was aborted.', 'AbortError')),
    };

    await expect(fetchElevation({ mapPoint: { x: 0, y: 0 }, httpClient })).rejects.toMatchObject({
      name: 'AbortError',
    });
  });
});
