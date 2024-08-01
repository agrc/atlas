import '@ugrc/layer-selector/src/LayerSelector.css';
import cityExtents from './data/cityExtents.json';

import Polygon from '@arcgis/core/geometry/Polygon';
import Graphic from '@arcgis/core/Graphic';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';
import EsriMap from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import LayerSelector from '@ugrc/layer-selector';
import { useEffect, useRef, useState } from 'react';
import { useMap } from './hooks';
import { randomize } from './utils';

const { item: randomExtent } = randomize<Graphic>(cityExtents);
const urls = {
  landownership:
    'https://gis.trustlands.utah.gov/hosting/rest/services/Hosted/Land_Ownership_WM_VectorTile/VectorTileServer',
};

export const MapContainer = ({ onIdentifyClick }: { onIdentifyClick: Function }) => {
  const mapNode = useRef(null);
  const mapComponent = useRef(null);
  const mapView = useRef(null);
  const [selectorOptions, setSelectorOptions] = useState(null);

  const { setMapView } = useMap();

  // setup the Map
  useEffect(() => {
    if (!mapNode.current) {
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

    mapView.current.when(() => {
      mapView.current.on('click', onIdentifyClick);
    });

    const selectorOptions = {
      view: mapView.current,
      quadWord: import.meta.env.VITE_DISCOVER,
      baseLayers: ['Hybrid', 'Lite', 'Terrain', 'Topo', 'Color IR'],
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

    // select a random index from baseLayers and convert the string to an object
    const { index: randomBaseMapIndex } = randomize(selectorOptions.baseLayers);

    selectorOptions.baseLayers[randomBaseMapIndex] = {
      token: selectorOptions.baseLayers[randomBaseMapIndex],
      selected: true,
    };

    setSelectorOptions(selectorOptions);

    return () => {
      mapView.current.destroy();
      mapComponent.current.destroy();
    };
  }, [setMapView]);

  return (
    <div ref={mapNode} className="size-full">
      {selectorOptions ? <LayerSelector {...selectorOptions}></LayerSelector> : null}
    </div>
  );
};
