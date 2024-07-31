import Graphic from '@arcgis/core/Graphic';
import Viewpoint from '@arcgis/core/Viewpoint';
import Geometry from '@arcgis/core/geometry/Geometry.js';
import { useGraphicManager } from '@ugrc/utilities/hooks';
import PropTypes from 'prop-types';
import { createContext, ReactNode, useState } from 'react';

export const MapContext = createContext(null);

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const [mapView, setMapView] = useState(null);
  const { setGraphic } = useGraphicManager(mapView);

  const zoom = (geometry: Geometry | Graphic | Geometry[] | Graphic[] | Viewpoint): void => {
    if (!mapView) {
      console.warn('attempting to zoom before the mapView is set');

      return;
    }

    mapView.goTo(geometry);
  };

  const placeGraphic = (graphic: Graphic | Graphic[] | undefined): void => {
    setGraphic(graphic);
  };

  return (
    <MapContext.Provider
      value={{
        mapView,
        setMapView,
        placeGraphic,
        zoom,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

MapProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
