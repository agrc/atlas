import Polygon from '@arcgis/core/geometry/Polygon';
import EsriMap from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import '@arcgis/map-components/components/arcgis-locate';
import { LayerSelector, type LayerSelectorProps } from '@ugrc/utah-design-system';
import { useEffect, useRef, useState } from 'react';
import cityExtents from './data/cityExtents';
import { useMap } from './hooks';
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

    mapView.current = new MapView({
      container: mapNode.current,
      map: mapComponent.current,
      extent: new Polygon(randomExtent.geometry!).extent!,
      ui: {
        components: ['zoom'],
      },
    });

    setMapView(mapView.current);

    const selectorOptions: LayerSelectorProps = {
      options: {
        view: mapView.current,
        quadWord: import.meta.env.VITE_DISCOVER,
        basemaps: ['Lite', 'Hybrid', 'Terrain', 'Topo', 'Color IR'],
        operationalLayers: ['Address Points', 'Land Ownership'],
      },
    };

    const { index: randomBaseMapIndex } = randomize(selectorOptions.options.basemaps!);

    const removed = selectorOptions.options.basemaps!.splice(randomBaseMapIndex, 1);
    selectorOptions.options.basemaps!.unshift(removed[0]!);

    setSelectorOptions(selectorOptions);

    mapView.current.when(() => {
      mapView.current!.ui.add(locateRef.current!, 'top-right');
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
