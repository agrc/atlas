import PropTypes from 'prop-types';
import { createContext, useState } from 'react';
import { useFirebaseApp } from '../firebase/FirebaseAppProvider';

export const MapContext = createContext(null);

export default function MapProvider({ children }) {
  const [mapView, setMapView] = useState(null);
  const [selectedGraphicInfo, setSelectedGraphicInfo] = useState(null);
  const { logEvent } = useFirebaseApp();

  const zoom = (geometry) => {
    logEvent('zoom-to-feature');

    if (!mapView) {
      console.warn('attempting to zoom before the mapView is set');
    } else {
      if (geometry.type === 'esriGeometryPoint') {
        mapView.goTo({
          center: [geometry.longitude, geometry.latitude],
          zoom: 12,
        });
      } else {
        mapView.goTo(geometry);
      }
    }
  };

  return (
    <MapContext.Provider
      value={{
        mapView,
        setMapView,
        selectedGraphicInfo,
        setSelectedGraphicInfo,
        zoom,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

MapProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
