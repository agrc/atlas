import React, { useRef, useEffect, useState } from 'react';
import MapView from '@arcgis/core/views/MapView';
import EsriMap from '@arcgis/core/Map';
import Basemap from '@arcgis/core/Basemap';
import Polygon from '@arcgis/core/geometry/Polygon';
import LOD from '@arcgis/core/layers/support/LOD';
import TileInfo from '@arcgis/core/layers/support/TileInfo';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import WebTileLayer from '@arcgis/core/layers/WebTileLayer';
import { once } from '@arcgis/core/core/watchUtils';
import LayerSelector from '@agrc/layer-selector';
import cityExtents from './data/cityExtents.json';
import addMapPropsToGlobal from './addMapPropsToGlobal';

const randomExtent = cityExtents[Math.round(Math.random() * (cityExtents.length - 1))];
const urls = {
  landownership:
    'https://gis.trustlands.utah.gov/server/' +
    '/rest/services/Ownership/UT_SITLA_Ownership_LandOwnership_WM/FeatureServer/0',
};

const ReactMapView = ({ setView, zoomToGraphic, onClick }) => {
  const mapDiv = useRef(null);
  const displayedZoomGraphic = useRef(null);
  const [selectorOptions, setSelectorOptions] = useState(null);
  const [view, localSetView] = useState(null);

  useEffect(() => {
    if (!mapDiv.current) {
      return;
    }

    const extent = new Polygon(randomExtent.geometry).extent;

    const map = new EsriMap();
    const mapView = new MapView({
      container: mapDiv.current,
      map,
      extent,
      ui: {
        components: ['zoom'],
      },
    });

    if (window.Cypress) {
      addMapPropsToGlobal(mapView);
    }

    mapView.on('click', onClick);

    setView(mapView);

    setSelectorOptions({
      view: mapView,
      quadWord: process.env.REACT_APP_DISCOVER,
      baseLayers: ['Hybrid', 'Lite', 'Terrain', 'Topo', 'Color IR'],
      overlays: [
        'Address Points',
        {
          Factory: FeatureLayer,
          url: urls.landownership,
          id: 'Land Ownership',
          opacity: 0.3,
        },
      ],
      modules: { LOD, TileInfo, Basemap, WebTileLayer, FeatureLayer },
      position: 'top-right',
    });

    localSetView(mapView);
  }, [setView, onClick]);

  useEffect(() => {
    if (!zoomToGraphic?.graphic) {
      return;
    }

    if (!Array.isArray(zoomToGraphic.graphic)) {
      zoomToGraphic.graphic = [zoomToGraphic.graphic];
    }

    let zoom;
    if (!zoomToGraphic.zoom) {
      if (zoomToGraphic.graphic.every((graphic) => graphic.geometry.type === 'point')) {
        zoom = {
          target: zoomToGraphic.graphic,
          zoom: view.map.basemap.baseLayers.items[0].tileInfo.lods.length - 5,
        };
      } else {
        zoom = {
          target: zoomToGraphic.graphic,
        };
      }
    }

    if (displayedZoomGraphic.current) {
      view.graphics.removeMany(displayedZoomGraphic.current);
    }

    displayedZoomGraphic.current = zoom.target;

    view.graphics.addMany(zoom.target);

    view.goTo(zoom).then(() => {
      if (!zoom.preserve) {
        once(view, 'extent', () => {
          view.graphics.removeAll();
        });
      }
    });
  }, [zoomToGraphic, view]);

  return (
    <div ref={mapDiv} style={{ height: '100%', width: '100%' }}>
      {selectorOptions ? <LayerSelector {...selectorOptions}></LayerSelector> : null}
    </div>
  );
};

export default ReactMapView;
