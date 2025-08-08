import { watch } from '@arcgis/core/core/reactiveUtils';
import Polygon from '@arcgis/core/geometry/Polygon';
import EsriMap from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import '@arcgis/map-components/components/arcgis-locate';
import { LayerSelector, type LayerSelectorProps } from '@ugrc/utah-design-system';
import type { BasemapToken } from '@ugrc/utah-design-system/src/components/LayerSelector.types';
import { debounce } from 'es-toolkit/function';
import { useEffect, useRef, useState } from 'react';
import cityExtents from './data/cityExtents';
import { useMap } from './hooks';
import { getUrlParameter, setUrlParameter } from './utilities/UrlParameters';
import { randomize } from './utils';

const { item: randomExtent } = randomize<__esri.GraphicProperties>(cityExtents);

export const MapContainer = ({ onClick }: { onClick?: __esri.ViewImmediateClickEventHandler }) => {
  const mapNode = useRef<HTMLDivElement | null>(null);
  const mapComponent = useRef<EsriMap | null>(null);
  const mapView = useRef<MapView>(null);
  const clickHandler = useRef<IHandle>(null);
  const [selectorOptions, setSelectorOptions] = useState<LayerSelectorProps | null>(null);
  const { setMapView } = useMap();
  const locateRef = useRef<HTMLArcgisLocateElement | null>(null);

  // setup the Map
  useEffect(() => {
    if (!mapNode.current || !setMapView) {
      return;
    }

    mapComponent.current = new EsriMap();

    const viewOptions: __esri.MapViewProperties = {
      container: mapNode.current,
      map: mapComponent.current,
      ui: {
        components: ['zoom'],
      },
    };

    const xyUrlParam = getUrlParameter<number[]>('center', 'number[]');
    if (xyUrlParam) {
      viewOptions.center = {
        x: xyUrlParam[0],
        y: xyUrlParam[1],
        spatialReference: { wkid: 3857 },
      };
    }
    if (xyUrlParam && xyUrlParam.length === 2) {
      const scaleUrlParam = getUrlParameter<number>('scale', 'number', 10000);
      if (scaleUrlParam) {
        viewOptions.scale = scaleUrlParam;
      }
    } else {
      viewOptions.extent = new Polygon(randomExtent.geometry!).extent!;
    }

    mapView.current = new MapView(viewOptions);

    setMapView(mapView.current);

    const selectorOptions: LayerSelectorProps = {
      options: {
        view: mapView.current,
        quadWord: import.meta.env.VITE_DISCOVER,
        basemaps: ['Lite', 'Hybrid', 'Terrain', 'Topo', 'Color IR'],
        operationalLayers: ['Address Points', 'Land Ownership'],
        onBasemapChange: (label) => {
          setUrlParameter<string>('basemap', label);
        },
      },
    };

    let { index: basemapIndex } = randomize(selectorOptions.options.basemaps!);
    const basemapUrlParam = getUrlParameter<string>('basemap', 'string') as BasemapToken;
    if (basemapUrlParam) {
      basemapIndex = selectorOptions.options.basemaps!.indexOf(basemapUrlParam);
    } else {
      setUrlParameter<string>('basemap', selectorOptions.options.basemaps![basemapIndex]! as string);
    }

    const removed = selectorOptions.options.basemaps!.splice(basemapIndex, 1);
    selectorOptions.options.basemaps!.unshift(removed[0]!);

    setSelectorOptions(selectorOptions);

    mapView.current.when(() => {
      mapView.current!.ui.add(locateRef.current!, 'top-right');

      const debounceTime = 200;
      watch(
        () => mapView.current?.scale,
        debounce((scale) => {
          console.log('scale', scale);
          setUrlParameter<number>('scale', Math.round(scale));
        }, debounceTime),
      );

      watch(
        () => mapView.current?.center,
        debounce((center) => {
          if (center) {
            const x = Math.round(center.x);
            const y = Math.round(center.y);
            console.log('center', [x, y]);
            setUrlParameter<number[]>('center', [x, y]);
          }
        }, debounceTime),
      );
    });

    return () => {
      mapView.current?.destroy();
      mapComponent.current?.destroy();
    };
  }, [setMapView]);

  // add click event handlers
  useEffect(() => {
    if (onClick) {
      clickHandler.current = mapView.current!.on('immediate-click', onClick);
    }

    return () => {
      clickHandler.current?.remove();
    };
  }, [onClick, mapView]);

  return (
    <div ref={mapNode} className="size-full">
      {/* @ts-expect-error the view prop is defined. It is intended to be an undocumented property available for you to use temporarily while you migrate to components */}
      <arcgis-locate ref={locateRef} position="top-right" view={mapView.current}></arcgis-locate>
      {selectorOptions && <LayerSelector {...selectorOptions}></LayerSelector>}
    </div>
  );
};
