import Polygon from '@arcgis/core/geometry/Polygon';
import type { EventHandler } from '@arcgis/lumina';
import type { TargetedEvent } from '@arcgis/map-components';
import '@arcgis/map-components/components/arcgis-locate';
import '@arcgis/map-components/components/arcgis-map';
import '@arcgis/map-components/components/arcgis-zoom';
import { LayerSelector, type LayerSelectorProps } from '@ugrc/utah-design-system';
import type { BasemapToken } from '@ugrc/utah-design-system/src/components/LayerSelector.types';
import { getUrlParameter, setUrlParameter } from '@ugrc/utilities';
import { debounce } from 'es-toolkit/function';
import { useMemo, useState } from 'react';
import cityExtents from './data/cityExtents';
import { useMap } from './hooks';
import { randomize } from './utils';

const { item: randomExtent } = randomize<__esri.GraphicProperties>(cityExtents);

const DEBOUNCE_TIME_MS = 200;

export const MapContainer = ({ onClick }: { onClick?: __esri.ViewClickEventHandler }) => {
  const [selectorOptions, setSelectorOptions] = useState<LayerSelectorProps | null>(null);
  const { setMapView } = useMap();

  const initialView = useMemo(() => {
    const xyUrlParam = getUrlParameter<number[]>('center', 'number[]');
    if (xyUrlParam && xyUrlParam.length === 2) {
      const scaleUrlParam = getUrlParameter<number>('scale', 'number', 10000);
      return {
        center: {
          x: xyUrlParam[0],
          y: xyUrlParam[1],
          spatialReference: { wkid: 3857 },
        } as __esri.Point,
        scale: scaleUrlParam ?? 10000,
        extent: null as __esri.Extent | null,
      };
    }

    return {
      center: null as __esri.Point | null,
      scale: null as number | null,
      extent: new Polygon(randomExtent.geometry!).extent!,
    };
  }, []);

  const handleViewReady: EventHandler<TargetedEvent<HTMLArcgisMapElement, void>> = (event) => {
    const map = event.target;

    setMapView(map.view);

    const selectorOptions: LayerSelectorProps = {
      quadWord: import.meta.env.VITE_DISCOVER,
      basemaps: ['Lite', 'Hybrid', 'Terrain', 'Topo', 'Color IR'],
      operationalLayers: ['Address Points', 'Land Ownership'],
      onBasemapChange: (label: string) => {
        setUrlParameter<string>('basemap', label);
      },
    };

    let basemapIndex: number;
    const basemapUrlParam = getUrlParameter<string>('basemap', 'string') as BasemapToken;
    if (basemapUrlParam && selectorOptions.basemaps!.includes(basemapUrlParam)) {
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
      constraints={
        {
          snapToZoom: false,
        } as __esri.View2DConstraints
      }
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
          ? (event: CustomEvent<__esri.ViewClickEvent>) => {
              onClick(event.detail);
            }
          : undefined
      }
    >
      <arcgis-zoom slot="top-left"></arcgis-zoom>
      <arcgis-locate slot="top-right"></arcgis-locate>
      {selectorOptions && <LayerSelector {...selectorOptions}></LayerSelector>}
    </arcgis-map>
  );
};
