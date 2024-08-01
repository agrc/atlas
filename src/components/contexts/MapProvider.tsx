import Graphic from '@arcgis/core/Graphic';
import MapView from '@arcgis/core/views/MapView';
import { useGraphicManager } from '@ugrc/utilities/hooks';
import PropTypes from 'prop-types';
import { createContext, ReactNode, useState } from 'react';

export const MapContext = createContext<{
  mapView: MapView | null;
  setMapView: (mapView: MapView) => void;
  placeGraphic: (graphic: Graphic | Graphic[] | null) => void;
  zoom: (geometry: __esri.GoToTarget2D) => void;
} | null>(null);

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const [mapView, setMapView] = useState<MapView | null>(null);
  const { setGraphic } = useGraphicManager(mapView);

  const zoom = (geometry: __esri.GoToTarget2D): void => {
    if (!mapView) {
      console.warn('attempting to zoom before the mapView is set');

      return;
    }

    mapView.goTo(geometry);
  };

  const placeGraphic = (graphic: Graphic | Graphic[] | null): void => {
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
