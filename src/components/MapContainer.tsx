import Point from '@arcgis/core/geometry/Point.js';
import Polygon from '@arcgis/core/geometry/Polygon.js';
import type { GraphicProperties } from '@arcgis/core/Graphic.js';
import MapViewConstraints from '@arcgis/core/views/2d/MapViewConstraints.js';
import type { ClickEvent } from '@arcgis/core/views/input/types.js';
import type { EventHandler } from '@arcgis/lumina';
import type { TargetedEvent } from '@arcgis/map-components';
import '@arcgis/map-components/components/arcgis-home';
import '@arcgis/map-components/components/arcgis-locate';
import '@arcgis/map-components/components/arcgis-map';
import '@arcgis/map-components/components/arcgis-zoom';
import type { LayerSelectorProps } from '@ugrc/utah-design-system/components/LayerSelector';
import { LayerSelector } from '@ugrc/utah-design-system/components/LayerSelector';
import { getUrlParameter, setUrlParameter } from '@ugrc/utilities';
import { debounce } from 'es-toolkit/function';
import { useMemo, useState } from 'react';
import cityExtents from './data/cityExtents';
import { useMap } from './hooks';
import { randomize } from './utils';

const { item: randomExtent } = randomize<GraphicProperties>(cityExtents);

const DEBOUNCE_TIME_MS = 200;
const BASEMAPS = ['Lite', 'Hybrid', 'Terrain', 'Topo', 'Color IR', 'High Contrast'] as const;

type AtlasBasemap = (typeof BASEMAPS)[number];

function isAtlasBasemap(value?: string | null): value is AtlasBasemap {
  return BASEMAPS.includes(value as AtlasBasemap);
}

export const MapContainer = ({ onClick }: { onClick?: (event: ClickEvent) => void }) => {
  const [selectorOptions, setSelectorOptions] = useState<LayerSelectorProps | null>(null);
  const { setMapView } = useMap();

  const initialView = useMemo(() => {
    const xyUrlParam = getUrlParameter<number[]>('center', 'number[]');
    if (xyUrlParam && xyUrlParam.length === 2) {
      const scaleUrlParam = getUrlParameter<number>('scale', 'number', 10000);
      return {
        center: new Point({
          x: xyUrlParam[0],
          y: xyUrlParam[1],
          spatialReference: { wkid: 3857 },
        }),
        scale: scaleUrlParam ?? 10000,
        extent: null,
      };
    }

    return {
      center: null,
      scale: null,
      extent: new Polygon(randomExtent.geometry!).extent!,
    };
  }, []);

  const handleViewReady: EventHandler<TargetedEvent<HTMLArcgisMapElement, void>> = (event) => {
    const map = event.target;

    if (map.view?.type === '2d') {
      setMapView(map.view);
    }

    const selectorOptions: LayerSelectorProps = {
      quadWord: import.meta.env.VITE_DISCOVER,
      basemaps: [...BASEMAPS],
      operationalLayers: ['Address Points', 'Land Ownership'],
      onBasemapChange: (label: string) => {
        setUrlParameter<string>('basemap', label);
      },
    };

    let basemapIndex: number;
    const basemapUrlParam = getUrlParameter<string>('basemap', 'string');
    if (isAtlasBasemap(basemapUrlParam)) {
      basemapIndex = selectorOptions.basemaps!.indexOf(basemapUrlParam);
    } else {
      basemapIndex = randomize(selectorOptions.basemaps!).index;
      setUrlParameter<string>('basemap', selectorOptions.basemaps![basemapIndex]! as string);
    }

    const removed = selectorOptions.basemaps!.splice(basemapIndex, 1);
    selectorOptions.basemaps!.unshift(removed[0]!);

    setSelectorOptions(selectorOptions);
  };

  return (
    <arcgis-map
      basemap="streets"
      center={initialView.center ?? undefined}
      scale={initialView.scale ?? undefined}
      extent={initialView.extent ?? undefined}
      className="size-full"
      constraints={new MapViewConstraints({ snapToZoom: false })}
      onarcgisViewReadyChange={handleViewReady}
      onarcgisViewChange={debounce<EventHandler<TargetedEvent<HTMLArcgisMapElement, void>>>((event) => {
        const map = event.target;

        setUrlParameter<number>('scale', Math.round(map.scale));

        if (map.center) {
          const x = Math.round(map.center.x);
          const y = Math.round(map.center.y);
          setUrlParameter<number[]>('center', [x, y]);
        }
      }, DEBOUNCE_TIME_MS)}
      onarcgisViewClick={
        onClick
          ? (event: TargetedEvent<HTMLArcgisMapElement, ClickEvent>) => {
              onClick(event.detail);
            }
          : undefined
      }
    >
      <arcgis-zoom slot="top-left"></arcgis-zoom>
      <arcgis-locate slot="top-left"></arcgis-locate>
      <arcgis-home slot="top-left"></arcgis-home>
      {selectorOptions && <LayerSelector {...selectorOptions}></LayerSelector>}
    </arcgis-map>
  );
};
