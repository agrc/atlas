import Polygon from '@arcgis/core/geometry/Polygon';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';
import EsriMap from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import { LayerSelector, type LayerSelectorProps } from '@ugrc/utah-design-system';
import { useEffect, useRef, useState } from 'react';
import cityExtents from './data/cityExtents';
import { useMap } from './hooks';
import { randomize } from './utils';

const { item: randomExtent } = randomize<__esri.GraphicProperties>(cityExtents);
const urls = {
  landownership:
    'https://gis.trustlands.utah.gov/hosting/rest/services/Hosted/Land_Ownership_WM_VectorTile/VectorTileServer',
  liteVector:
    'https://www.arcgis.com/sharing/rest/content/items/77202507796a4d5796b7d8e6871e352e/resources/styles/root.json',
};

export const MapContainer = ({ onClick }: { onClick?: __esri.ViewImmediateClickEventHandler }) => {
  const mapNode = useRef<HTMLDivElement | null>(null);
  const mapComponent = useRef<EsriMap | null>(null);
  const mapView = useRef<MapView>();
  const clickHandler = useRef<IHandle>();
  const [selectorOptions, setSelectorOptions] = useState<LayerSelectorProps | null>(null);
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
        baseLayers: [
          'Hybrid',
          {
            label: 'Lite',
            function: () =>
              new VectorTileLayer({
                url: urls.liteVector,
              }),
          },
          'Terrain',
          'Topo',
          'Color IR',
        ],
        referenceLayers: ['Address Points', 'Land Ownership'],
      },
    };

    const { index: randomBaseMapIndex } = randomize(selectorOptions.options.baseLayers);

    const removed = selectorOptions.options.baseLayers.splice(randomBaseMapIndex, 1);
    selectorOptions.options.baseLayers.unshift(removed[0]!);

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
      {selectorOptions && <LayerSelector {...selectorOptions}></LayerSelector>}
    </div>
  );
};
