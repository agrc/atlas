import Polygon from '@arcgis/core/geometry/Polygon';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';
import EsriMap from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import LayerSelector from '@ugrc/layer-selector';
import { useEffect, useRef, useState } from 'react';
import cityExtents from './data/cityExtents';
import { useMap } from './hooks';
import { randomize } from './utils';

import '@ugrc/layer-selector/src/LayerSelector.css';

const { item: randomExtent } = randomize<__esri.GraphicProperties>(cityExtents);
const urls = {
  landownership:
    'https://gis.trustlands.utah.gov/hosting/rest/services/Hosted/Land_Ownership_WM_VectorTile/VectorTileServer',
  liteVector:
    'https://www.arcgis.com/sharing/rest/content/items/77202507796a4d5796b7d8e6871e352e/resources/styles/root.json',
};

type LayerFactory = {
  Factory: new () => __esri.Layer;
  url: string;
  id: string;
  opacity: number;
};
type SelectorOptions = {
  view: MapView;
  quadWord: string;
  baseLayers: Array<string | { token: string; selected: boolean } | LayerFactory>;
  overlays?: Array<string | LayerFactory>;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
};

export const MapContainer = ({ onClick }: { onClick?: __esri.ViewImmediateClickEventHandler }) => {
  const mapNode = useRef<HTMLDivElement | null>(null);
  const mapComponent = useRef<EsriMap | null>(null);
  const mapView = useRef<MapView>();
  const clickHandler = useRef<IHandle>();
  const [selectorOptions, setSelectorOptions] = useState<SelectorOptions | null>(null);
  const { setMapView } = useMap();

  // setup the Map
  useEffect(() => {
    if (!mapNode.current || !setMapView) {
      return;
    }

    mapComponent.current = new EsriMap();

    mapView.current = new MapView({
      container: mapNode.current,
      map: mapComponent.current,
      extent: new Polygon(randomExtent.geometry).extent,
      ui: {
        components: ['zoom'],
      },
    });

    setMapView(mapView.current);

    const selectorOptions: SelectorOptions = {
      view: mapView.current,
      quadWord: import.meta.env.VITE_DISCOVER,
      baseLayers: [
        'Hybrid',
        {
          Factory: VectorTileLayer,
          url: urls.liteVector,
          id: 'Lite',
          opacity: 1,
        },
        'Terrain',
        'Topo',
        'Color IR',
      ],
      overlays: [
        'Address Points',
        {
          Factory: VectorTileLayer,
          url: urls.landownership,
          id: 'Land Ownership',
          opacity: 0.3,
        },
      ],
      position: 'top-right',
    };

    const { index: randomBaseMapIndex } = randomize(selectorOptions.baseLayers);

    selectorOptions.baseLayers[randomBaseMapIndex] = {
      token: selectorOptions.baseLayers[randomBaseMapIndex] as string,
      selected: true,
    };

    setSelectorOptions(selectorOptions);

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
      {selectorOptions?.view && <LayerSelector {...selectorOptions}></LayerSelector>}
    </div>
  );
};
