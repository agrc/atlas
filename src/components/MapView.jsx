import Polygon from '@arcgis/core/geometry/Polygon';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';
import MapView from '@arcgis/core/views/MapView';
import WebMap from '@arcgis/core/WebMap';
import LayerSelector from '@ugrc/layer-selector';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import useMap from './hooks/useMap';

import '@ugrc/layer-selector/src/LayerSelector.css';
import cityExtents from './data/cityExtents.json';

const randomExtent = cityExtents[Math.round(Math.random() * (cityExtents.length - 1))];
const urls = {
  landownership:
    'https://gis.trustlands.utah.gov/hosting/rest/services/Hosted/Land_Ownership_WM_VectorTile/VectorTileServer',
};

const MapComponent = ({ zoomToGraphic, onClick }) => {
  const mapNode = useRef(null);
  const mapComponent = useRef(null);
  const mapView = useRef(null);

  const [selectorOptions, setSelectorOptions] = useState(null);

  const { setMapView, selectedGraphicInfo, setSelectedGraphicInfo } = useMap();

  useEffect(() => {
    if (!mapNode.current) {
      return;
    }

    // mapComponent.current = new EsriMap();

    mapComponent.current = new WebMap({
      portalItem: {
        id: '80c26c2104694bbab7408a4db4ed3382',
      },
    });

    mapView.current = new MapView({
      container: mapNode.current,
      map: mapComponent.current,
      extent: new Polygon(randomExtent.geometry).extent,
      ui: {
        components: ['zoom'],
      },
    });

    setMapView(mapView);

    mapView.current.when(() => {
      mapView.current.on('click', onClick);
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
    const randomBaseMapIndex = Math.floor(Math.random() * selectorOptions.baseLayers.length);
    selectorOptions.baseLayers[randomBaseMapIndex] = {
      token: selectorOptions.baseLayers[randomBaseMapIndex],
      selected: true,
    };

    setSelectorOptions(selectorOptions);

    return () => {
      mapView.current.destroy();
      mapComponent.current.destroy();
    };
  }, [setMapView, onClick]);

  return (
    <div ref={mapNode} className="size-full">
      {selectorOptions ? <LayerSelector {...selectorOptions}></LayerSelector> : null}
    </div>
  );
};

MapComponent.propTypes = {
  setView: PropTypes.func.isRequired,
  zoomToGraphic: PropTypes.object,
  onClick: PropTypes.func,
};

export default MapComponent;
